import DuetSQL
import Vapor
import XCore
import XSlack

enum DownloadRoute: RouteHandler {
  @Sendable static func handler(_ request: Request) async throws -> Response {
    struct RefererQuery: Content { let referer: String? }
    let query = try? request.query.decode(RefererQuery.self)
    var path = request.url.path
    path.removeFirst()
    do {
      return try await logAndRedirect(
        file: try await DownloadableFile(logPath: path),
        userAgent: request.headers.first(name: .userAgent) ?? "",
        ipAddress: request.ipAddress,
        referrer: query?.referer ?? request.headers.first(name: .referer)
      )
    } catch {
      if ["/.git", "/.env", "%0A"].contains(where: path.contains) == false {
        var errorMsg = "Failed to resolve Downloadable file from path: \(path), error: \(error)"
        if let parseErr = error as? DownloadableFile.ParseLogPathError {
          let errorDesc = parseErr.errorDescription ?? String(describing: parseErr)
          errorMsg = "Failed to resolve DownloadableFile: \(errorDesc)"
        }
        Task { [errorMsg] in await slackError(errorMsg) }
      }
      return Response(status: .notFound, body: .init(string: "<h1>Not Found</h1>"))
    }
  }

  static func logAndRedirect(
    file: DownloadableFile,
    userAgent: String,
    ipAddress: String? = nil,
    referrer: String? = nil
  ) async throws -> Response {
    let response = Response()
    response.status = Redirect.temporary.status
    response.headers.replaceOrAdd(name: .location, value: file.sourceUrl.absoluteString)

    let isAppUserAgent = userAgent.contains("FriendsLibrary")
    var source: Download.DownloadSource = isAppUserAgent ? .app : .website

    switch (userAgent |> isPodcast, file.format) {
    case (true, _), (_, .audio(.podcast)):
      source = .podcast
      response.status = Redirect.permanent.status
    default:
      break
    }

    // do all db/api/logging work in background task to return response faster
    let bgWork = Task { [source] in
      guard let device = Current.userAgentParser.parse(userAgent) else {
        await slackError("Failed to parse user agent `\(userAgent)` into device data")
        return
      }

      if !isAppUserAgent, device.isBot == true {
        await slackDebug("Bot download: `\(userAgent)`")
        return
      }

      guard let downloadFormat = file.format.downloadFormat else {
        await slackError("Unexpected download format: \(file.format)")
        return
      }

      // prevent duplicate podcast downloads
      if downloadFormat == .podcast, let ipAddress = ipAddress {
        let dupe = try? await Current.db.query(Download.self)
          .where(.ip == .string(ipAddress))
          .where(.format == .enum(Download.Format.podcast))
          .where(.editionId == file.editionId)
          .first()

        if dupe != nil {
          await slackDebug(
            "Duplicate podcast download, edition: `\(file.editionId.lowercased)`, ip: `\(ipAddress)`"
          )
          return
        }
      }

      var download = Download(
        editionId: file.editionId,
        format: downloadFormat,
        source: source,
        isMobile: device.isMobile,
        audioQuality: file.format.audioQuality,
        audioPartNumber: file.format.audioPartNumber,
        userAgent: userAgent.isEmpty ? nil : userAgent,
        os: device.os,
        browser: device.browser,
        platform: device.platform,
        referrer: referrer,
        ip: ipAddress
      )

      var location: IpApi.Response?
      if let ip = ipAddress, ip != "127.0.0.1" {
        do {
          location = try await Current.ipApiClient.getIpData(ip)
          download.city = location?.city
          download.region = location?.region
          download.postalCode = location?.postal
          download.latitude = location?.latitude.map { String($0) }
          download.longitude = location?.longitude.map { String($0) }
        } catch {
          await slackError("Error fetching download location data: \(error)")
        }
      }

      do {
        try await Current.db.create(download)
        await slackDownload(file: file, location: location, device: device, referrer: referrer)
      } catch {
        await slackError("Error creating download: \(error)")
      }
    }

    if Env.mode == .test {
      await bgWork.value
    }

    return response
  }
}

// private helpers

private actor LastLocation {
  var value: IpApi.Response?

  func update(_ newValue: IpApi.Response?) {
    value = newValue
  }
}

private let lastLocation = LastLocation()

private func slackDownload(
  file: DownloadableFile,
  location: IpApi.Response?,
  device: UserAgentDeviceData,
  referrer: String?
) async {
  guard let edition = try? await Edition.Joined.find(file.editionId) else {
    await slackError("Failed to fetch edition for download: \(file.editionId)")
    return
  }
  let document = edition.document
  let friend = document.friend
  let lastLoc = await lastLocation.value
  let duplicatesLastLocation = location != nil && location == lastLoc
  await lastLocation.update(location)

  var refererLink = ""
  if let referrer = referrer, let refererUrl = URL(string: referrer) {
    let urlString = refererUrl.absoluteString
    let path = urlString.replacingOccurrences(
      of: #"https:\/\/([^/]+)\/"#,
      with: "",
      options: .regularExpression
    )
    refererLink = "\nDownloaded from: \(Slack.Message.link(to: urlString, withText: path))"
  }

  var duplicateLocation = ""
  if duplicatesLastLocation, lastLoc?.compactSummary.isEmpty == false {
    duplicateLocation = "\nLocation: _(same as prev)_ \(lastLoc?.compactSummary ?? "")"
  }

  var blocks: [Slack.Message.Content.Block] = [
    .header(text: document.trimmedUtf8ShortTitle),
    .section(
      text: """
      by *\(friend.name)*
      Edition: _\(file.edition.type)_
      Format: `\(file.format.description)`
      Device: _\(device.slackSummary)_\(refererLink)\(duplicateLocation)
      """,
      accessory: .image(
        url: edition.images.square.w450.url,
        altText: "Image of \(document.title)"
      )
    ),
  ]

  if let location, !location.slashedSummary.isEmpty, !duplicatesLastLocation {
    var accessory: Slack.Message.Content.Block?
    if let countryCode = countryCodes[location.countryName ?? ""] {
      accessory = .image(
        url: URL(string: "https://flagcdn.com/w640/\(countryCode).png")!,
        altText: "Flag of \(location.countryName ?? countryCode)"
      )
    }

    var mapLink = ""
    if let googleMapUrl = location.googleMapUrl {
      mapLink = "\n" + Slack.Message.link(to: googleMapUrl, withText: "Google Map")
    }

    blocks.append(.section(
      text: """
      *Approximate Location:*
      City: _\(location.city ?? "`none`")_
      Country: _\(location.countryName ?? "`none`")_
      Zip: _\(location.postal ?? "`none`")_
      Region: _\(location.region ?? "`none`")_\(mapLink)
      """,
      accessory: accessory
    ))

    if let mapImageUrl = location.mapImageUrl {
      blocks.append(.image(url: mapImageUrl, altText: "Map of \(location.compactSummary)"))
    }
  }

  blocks.append(.divider)

  let slack = FlpSlack.Message(
    blocks: blocks,
    fallbackText: "New download: \(file.logPath)",
    channel: file.format.slackChannel
  )

  await Current.slackClient.send(slack)

  if let location = location,
     location.slashedSummary.isEmpty,
     location.ip?.starts(with: "192.168") != true {
    await slackInfo("Unusual missing location data:\n```\(String(describing: location))\n```")
  }
}

private extension IpApi.Response {
  var slashedSummary: String {
    [city, region, postal, countryName].compactMap { $0 }.joined(separator: " / ")
  }

  var compactSummary: String {
    [city, region, countryName].compactMap { $0 }.joined(separator: ", ")
  }

  var googleMapUrl: String? {
    guard let latitude = latitude, let longitude = longitude else {
      return nil
    }
    return "https://www.google.com/maps/@\(latitude),\(longitude),14z"
  }

  var mapImageUrl: URL? {
    guard let lat = latitude, let long = longitude else { return nil }
    let TOKEN = Env.MAPBOX_API_KEY
    let zoom = countryName == "United States" ? 8 : 6
    let urlString =
      "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/\(long),\(lat),\(zoom),0/600x400@2x?access_token=\(TOKEN)&logo=false"
    return URL(string: urlString)
  }
}

private extension UserAgentDeviceData {
  var slackSummary: String {
    [platform, os, browser, isMobile ? "mobile" : "non-mobile"]
      .compactMap { $0 }
      .filter { $0 != "unknown" }
      .joined(separator: " / ")
  }
}

func isPodcast(userAgent: String) -> Bool {
  userAgent
    .lowercased()
    .match("(podcast|stitcher|tunein|audible|spotify|pocketcasts|overcast|castro|castbox)")
}

// TODO: i think ipapi gives this as country_code
private let countryCodes: [String: String] = [
  "Andorra": "ad",
  "United Arab Emirates": "ae",
  "Afghanistan": "af",
  "Antigua and Barbuda": "ag",
  "Anguilla": "ai",
  "Albania": "al",
  "Armenia": "am",
  "Angola": "ao",
  "Antarctica": "aq",
  "Argentina": "ar",
  "American Samoa": "as",
  "Austria": "at",
  "Australia": "au",
  "Aruba": "aw",
  "Åland Islands": "ax",
  "Azerbaijan": "az",
  "Bosnia and Herzegovina": "ba",
  "Barbados": "bb",
  "Bangladesh": "bd",
  "Belgium": "be",
  "Burkina Faso": "bf",
  "Bulgaria": "bg",
  "Bahrain": "bh",
  "Burundi": "bi",
  "Benin": "bj",
  "Saint Barthélemy": "bl",
  "Bermuda": "bm",
  "Brunei": "bn",
  "Bolivia": "bo",
  "Caribbean Netherlands": "bq",
  "Brazil": "br",
  "Bahamas": "bs",
  "Bhutan": "bt",
  "Bouvet Island": "bv",
  "Botswana": "bw",
  "Belarus": "by",
  "Belize": "bz",
  "Canada": "ca",
  "Cocos (Keeling) Islands": "cc",
  "DR Congo": "cd",
  "Central African Republic": "cf",
  "Republic of the Congo": "cg",
  "Switzerland": "ch",
  "Côte d'Ivoire (Ivory Coast)": "ci",
  "Cook Islands": "ck",
  "Chile": "cl",
  "Cameroon": "cm",
  "China": "cn",
  "Colombia": "co",
  "Costa Rica": "cr",
  "Cuba": "cu",
  "Cape Verde": "cv",
  "Curaçao": "cw",
  "Christmas Island": "cx",
  "Cyprus": "cy",
  "Czechia": "cz",
  "Germany": "de",
  "Djibouti": "dj",
  "Denmark": "dk",
  "Dominica": "dm",
  "Dominican Republic": "do",
  "Algeria": "dz",
  "Ecuador": "ec",
  "Estonia": "ee",
  "Egypt": "eg",
  "Western Sahara": "eh",
  "Eritrea": "er",
  "Spain": "es",
  "Ethiopia": "et",
  "European Union": "eu",
  "Finland": "fi",
  "Fiji": "fj",
  "Falkland Islands": "fk",
  "Micronesia": "fm",
  "Faroe Islands": "fo",
  "France": "fr",
  "Gabon": "ga",
  "United Kingdom": "gb",
  "England": "gb-eng",
  "Northern Ireland": "gb-nir",
  "Scotland": "gb-sct",
  "Wales": "gb-wls",
  "Grenada": "gd",
  "Georgia": "ge",
  "French Guiana": "gf",
  "Guernsey": "gg",
  "Ghana": "gh",
  "Gibraltar": "gi",
  "Greenland": "gl",
  "Gambia": "gm",
  "Guinea": "gn",
  "Guadeloupe": "gp",
  "Equatorial Guinea": "gq",
  "Greece": "gr",
  "South Georgia": "gs",
  "Guatemala": "gt",
  "Guam": "gu",
  "Guinea-Bissau": "gw",
  "Guyana": "gy",
  "Hong Kong": "hk",
  "Heard Island and McDonald Islands": "hm",
  "Honduras": "hn",
  "Croatia": "hr",
  "Haiti": "ht",
  "Hungary": "hu",
  "Indonesia": "id",
  "Ireland": "ie",
  "Israel": "il",
  "Isle of Man": "im",
  "India": "in",
  "British Indian Ocean Territory": "io",
  "Iraq": "iq",
  "Iran": "ir",
  "Iceland": "is",
  "Italy": "it",
  "Jersey": "je",
  "Jamaica": "jm",
  "Jordan": "jo",
  "Japan": "jp",
  "Kenya": "ke",
  "Kyrgyzstan": "kg",
  "Cambodia": "kh",
  "Kiribati": "ki",
  "Comoros": "km",
  "Saint Kitts and Nevis": "kn",
  "North Korea": "kp",
  "South Korea": "kr",
  "Kuwait": "kw",
  "Cayman Islands": "ky",
  "Kazakhstan": "kz",
  "Laos": "la",
  "Lebanon": "lb",
  "Saint Lucia": "lc",
  "Liechtenstein": "li",
  "Sri Lanka": "lk",
  "Liberia": "lr",
  "Lesotho": "ls",
  "Lithuania": "lt",
  "Luxembourg": "lu",
  "Latvia": "lv",
  "Libya": "ly",
  "Morocco": "ma",
  "Monaco": "mc",
  "Moldova": "md",
  "Montenegro": "me",
  "Saint Martin": "mf",
  "Madagascar": "mg",
  "Marshall Islands": "mh",
  "North Macedonia": "mk",
  "Mali": "ml",
  "Myanmar": "mm",
  "Mongolia": "mn",
  "Macau": "mo",
  "Northern Mariana Islands": "mp",
  "Martinique": "mq",
  "Mauritania": "mr",
  "Montserrat": "ms",
  "Malta": "mt",
  "Mauritius": "mu",
  "Maldives": "mv",
  "Malawi": "mw",
  "Mexico": "mx",
  "Malaysia": "my",
  "Mozambique": "mz",
  "Namibia": "na",
  "New Caledonia": "nc",
  "Niger": "ne",
  "Norfolk Island": "nf",
  "Nigeria": "ng",
  "Nicaragua": "ni",
  "Netherlands": "nl",
  "Norway": "no",
  "Nepal": "np",
  "Nauru": "nr",
  "Niue": "nu",
  "New Zealand": "nz",
  "Oman": "om",
  "Panama": "pa",
  "Peru": "pe",
  "French Polynesia": "pf",
  "Papua New Guinea": "pg",
  "Philippines": "ph",
  "Pakistan": "pk",
  "Poland": "pl",
  "Saint Pierre and Miquelon": "pm",
  "Pitcairn Islands": "pn",
  "Puerto Rico": "pr",
  "Palestine": "ps",
  "Portugal": "pt",
  "Palau": "pw",
  "Paraguay": "py",
  "Qatar": "qa",
  "Réunion": "re",
  "Romania": "ro",
  "Serbia": "rs",
  "Russia": "ru",
  "Rwanda": "rw",
  "Saudi Arabia": "sa",
  "Solomon Islands": "sb",
  "Seychelles": "sc",
  "Sudan": "sd",
  "Sweden": "se",
  "Singapore": "sg",
  "Saint Helena, Ascension and Tristan da Cunha": "sh",
  "Slovenia": "si",
  "Svalbard and Jan Mayen": "sj",
  "Slovakia": "sk",
  "Sierra Leone": "sl",
  "San Marino": "sm",
  "Senegal": "sn",
  "Somalia": "so",
  "Suriname": "sr",
  "South Sudan": "ss",
  "São Tomé and Príncipe": "st",
  "El Salvador": "sv",
  "Sint Maarten": "sx",
  "Syria": "sy",
  "Eswatini (Swaziland)": "sz",
  "Turks and Caicos Islands": "tc",
  "Chad": "td",
  "French Southern and Antarctic Lands": "tf",
  "Togo": "tg",
  "Thailand": "th",
  "Tajikistan": "tj",
  "Tokelau": "tk",
  "Timor-Leste": "tl",
  "Turkmenistan": "tm",
  "Tunisia": "tn",
  "Tonga": "to",
  "Turkey": "tr",
  "Trinidad and Tobago": "tt",
  "Tuvalu": "tv",
  "Taiwan": "tw",
  "Tanzania": "tz",
  "Ukraine": "ua",
  "Uganda": "ug",
  "United States Minor Outlying Islands": "um",
  "United Nations": "un",
  "United States": "us",
  "Uruguay": "uy",
  "Uzbekistan": "uz",
  "Vatican City (Holy See)": "va",
  "Saint Vincent and the Grenadines": "vc",
  "Venezuela": "ve",
  "British Virgin Islands": "vg",
  "United States Virgin Islands": "vi",
  "Vietnam": "vn",
  "Vanuatu": "vu",
  "Wallis and Futuna": "wf",
  "Samoa": "ws",
  "Kosovo": "xk",
  "Yemen": "ye",
  "Mayotte": "yt",
  "South Africa": "za",
  "Zambia": "zm",
  "Zimbabwe": "zw",
]

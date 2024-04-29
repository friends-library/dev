import DuetSQL
import Fluent

extension Download {
  enum M1 {
    static let tableName = "downloads"
    static let documentId = FieldKey("document_id")
    static let editionType = FieldKey("edition_type")
    static let format = FieldKey("format")
    static let source = FieldKey("source")
    static let isMobile = FieldKey("is_mobile")
    static let audioQuality = FieldKey("audio_quality")
    static let audioPartNumber = FieldKey("audio_part_number")
    static let userAgent = FieldKey("user_agent")
    static let os = FieldKey("os")
    static let browser = FieldKey("browser")
    static let platform = FieldKey("platform")
    static let referrer = FieldKey("referrer")
    static let ip = FieldKey("ip")
    static let city = FieldKey("city")
    static let region = FieldKey("region")
    static let postalCode = FieldKey("postal_code")
    static let country = FieldKey("country")
    static let latitude = FieldKey("latitude")
    static let longitude = FieldKey("longitude")

    enum EditionTypeEnum {
      static let name = "edition_type"
      static let caseUpdated = "updated"
      static let caseModernized = "modernized"
      static let caseOriginal = "original"
    }

    enum AudioQualityEnum {
      static let name = "audio_quality"
      static let caseLq = "lq"
      static let caseHq = "hq"
    }

    enum FormatEnum {
      static let name = "download_format"
      static let caseEpub = "epub"
      static let caseMobi = "mobi"
      static let caseWebPdf = "webPdf"
      static let caseMp3Zip = "mp3Zip"
      static let caseM4b = "m4b"
      static let caseMp3 = "mp3"
      static let caseSpeech = "speech"
      static let casePodcast = "podcast"
      static let caseAppEbook = "appEbook"
    }

    enum SourceEnum {
      static let name = "download_source"
      static let caseWebsite = "website"
      static let casePodcast = "podcast"
      static let caseApp = "app"
    }
  }
}

extension Download.AudioQuality: PostgresEnum {
  var typeName: String { Download.M1.AudioQualityEnum.name }
}

extension Download.Format: PostgresEnum {
  var typeName: String { Download.M1.FormatEnum.name }
}

extension Download.DownloadSource: PostgresEnum {
  var typeName: String { Download.M1.SourceEnum.name }
}

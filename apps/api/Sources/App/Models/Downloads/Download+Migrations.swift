import DuetSQL
import Fluent

extension Download {
  enum M1 {
    static let tableName = "downloads"
    nonisolated(unsafe) static let documentId = FieldKey("document_id")
    nonisolated(unsafe) static let editionType = FieldKey("edition_type")
    nonisolated(unsafe) static let format = FieldKey("format")
    nonisolated(unsafe) static let source = FieldKey("source")
    nonisolated(unsafe) static let isMobile = FieldKey("is_mobile")
    nonisolated(unsafe) static let audioQuality = FieldKey("audio_quality")
    nonisolated(unsafe) static let audioPartNumber = FieldKey("audio_part_number")
    nonisolated(unsafe) static let userAgent = FieldKey("user_agent")
    nonisolated(unsafe) static let os = FieldKey("os")
    nonisolated(unsafe) static let browser = FieldKey("browser")
    nonisolated(unsafe) static let platform = FieldKey("platform")
    nonisolated(unsafe) static let referrer = FieldKey("referrer")
    nonisolated(unsafe) static let ip = FieldKey("ip")
    nonisolated(unsafe) static let city = FieldKey("city")
    nonisolated(unsafe) static let region = FieldKey("region")
    nonisolated(unsafe) static let postalCode = FieldKey("postal_code")
    nonisolated(unsafe) static let country = FieldKey("country")
    nonisolated(unsafe) static let latitude = FieldKey("latitude")
    nonisolated(unsafe) static let longitude = FieldKey("longitude")

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

import DuetSQL
import Foundation
import NIO
import Tagged
import Vapor

extension Model {
  static var isPreloaded: Bool {
    switch tableName {
    case Friend.tableName,
         FriendQuote.tableName,
         FriendResidence.tableName,
         FriendResidenceDuration.tableName,
         Document.tableName,
         DocumentTag.tableName,
         RelatedDocument.tableName,
         Edition.tableName,
         EditionImpression.tableName,
         EditionChapter.tableName,
         Audio.tableName,
         AudioPart.tableName,
         Isbn.tableName:
      true
    default:
      false
    }
  }
}

enum ModelError: Error {
  case invalidEntity
}

protocol ApiModel: Model, Equatable {
  func isValid() async -> Bool
}

extension ApiModel {
  func isValid() async -> Bool {
    true
  }
}

protocol DirectoryPathable {
  var directoryPath: String { get }
}

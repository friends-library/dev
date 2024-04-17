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
      return true
    default:
      return false
    }
  }
}

enum ModelError: Error {
  case invalidEntity
}

protocol ApiModel: Model, Equatable {
  var isValid: Bool { get }
}

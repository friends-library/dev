import Foundation
import XHttp

#if canImport(FoundationNetworking)
  import FoundationNetworking
#endif

@Sendable func _deleteSuppression(
  _ emailAddress: String,
  _ streamId: String,
  _ apiKey: String
) async -> Result<Void, Client.Error> {
  do {
    let (data, urlResponse) = try await HTTP.postJson(
      DeleteSuppressionsInput(
        Suppressions: [SuppressionInput(EmailAddress: emailAddress)]
      ),
      to: "https://api.postmarkapp.com/message-streams/\(streamId)/suppressions/delete",
      headers: [
        "Accept": "application/json",
        "X-Postmark-Server-Token": apiKey,
      ]
    )
    if urlResponse.statusCode != 200 {
      return .failure(.init(
        statusCode: urlResponse.statusCode,
        errorCode: -1,
        message: "Unexpected response code `\(urlResponse.statusCode)` from Postmark API"
      ))
    }
    do {
      let decoded = try JSONDecoder().decode(DeleteSuppressionsOutput.self, from: data)
      guard decoded.Suppressions.count == 1 else {
        return .failure(.init(
          statusCode: -2,
          errorCode: -2,
          message: "Expected exactly one suppression in response, got \(decoded.Suppressions.count)"
        ))
      }
      let suppression = decoded.Suppressions[0]
      if suppression.Status == .deleted {
        return .success(())
      } else {
        return .failure(.init(
          statusCode: -3,
          errorCode: -3,
          message: "Failed to delete suppression for \(suppression.EmailAddress): \(suppression.Message ?? "No message provided")"
        ))
      }
    } catch {
      let body = String(decoding: data, as: UTF8.self)
      return .failure(.init(
        statusCode: urlResponse.statusCode,
        errorCode: -4,
        message: "Error decoding Postmark response: \(error), body: \(body)"
      ))
    }
  } catch {
    return .failure(.init(
      statusCode: -5,
      errorCode: -5,
      message: "Unexpected error deleting Postmark suppression: \(error)"
    ))
  }
}

private struct DeleteSuppressionsInput: Encodable {
  var Suppressions: [SuppressionInput]
}

private struct SuppressionInput: Encodable {
  var EmailAddress: String
}

private struct DeleteSuppressionsOutput: Decodable {
  var Suppressions: [SuppressionOutput]
}

private struct SuppressionOutput: Decodable {
  enum Status: String, Decodable {
    case deleted = "Deleted"
    case failed = "Failed"
  }

  var EmailAddress: String
  var Status: Status
  var Message: String?
}

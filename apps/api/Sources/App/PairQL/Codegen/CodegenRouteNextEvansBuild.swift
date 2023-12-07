import PairQL

extension CodegenRoute.EvansBuild: CodegenRouteHandler {
  static var sharedTypes: [(String, Any.Type)] {
    [("DocumentTag", DocumentTag.TagType.self)]
  }

  static var pairqlPairs: [any Pair.Type] {
    [
      AllDocumentPages.self,
      AllFriendPages.self,
      AudiobooksPage.self,
      DocumentPage.self,
      ExplorePageBooks.self,
      FriendPage.self,
      FriendsPage.self,
      GettingStartedBooks.self,
      HomepageFeaturedBooks.self,
      NewsFeedItems.self,
      PublishedDocumentSlugs.self,
      PublishedFriendSlugs.self,
      TotalPublished.self,
    ]
  }
}

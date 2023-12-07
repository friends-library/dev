// auto-generated, do not edit
import type { Env } from '../types';
import type Result from '../Result';
import type * as P from './pairs';
import Client from '../Client';

export default class EvansBuildClient extends Client {
  public constructor(env: Env, getToken: () => string | undefined) {
    super(env, `evans-build`, getToken);
  }

  public static node(
    process: { argv: string[]; env: Record<string, string | undefined> },
    pattern?: string | undefined,
  ): EvansBuildClient {
    return Client.inferNode(EvansBuildClient, process, pattern);
  }

  public static web(href: string, getToken: () => string | undefined): EvansBuildClient {
    return Client.inferWeb(EvansBuildClient, href, getToken);
  }

  public allDocumentPagesResult(
    input: P.AllDocumentPages.Input,
  ): Promise<Result<P.AllDocumentPages.Output>> {
    return this.query<P.AllDocumentPages.Output>(input, `AllDocumentPages`);
  }

  public allFriendPagesResult(
    input: P.AllFriendPages.Input,
  ): Promise<Result<P.AllFriendPages.Output>> {
    return this.query<P.AllFriendPages.Output>(input, `AllFriendPages`);
  }

  public async allDocumentPages(
    input: P.AllDocumentPages.Input,
  ): Promise<P.AllDocumentPages.Output> {
    const result = await this.query<P.AllDocumentPages.Output>(input, `AllDocumentPages`);
    return result.unwrap();
  }

  public async allFriendPages(
    input: P.AllFriendPages.Input,
  ): Promise<P.AllFriendPages.Output> {
    const result = await this.query<P.AllFriendPages.Output>(input, `AllFriendPages`);
    return result.unwrap();
  }

  public async audiobooksPage(
    input: P.AudiobooksPage.Input,
  ): Promise<P.AudiobooksPage.Output> {
    const result = await this.query<P.AudiobooksPage.Output>(input, `AudiobooksPage`);
    return result.unwrap();
  }

  public async documentPage(input: P.DocumentPage.Input): Promise<P.DocumentPage.Output> {
    const result = await this.query<P.DocumentPage.Output>(input, `DocumentPage`);
    return result.unwrap();
  }

  public async explorePageBooks(
    input: P.ExplorePageBooks.Input,
  ): Promise<P.ExplorePageBooks.Output> {
    const result = await this.query<P.ExplorePageBooks.Output>(input, `ExplorePageBooks`);
    return result.unwrap();
  }

  public async friendPage(input: P.FriendPage.Input): Promise<P.FriendPage.Output> {
    const result = await this.query<P.FriendPage.Output>(input, `FriendPage`);
    return result.unwrap();
  }

  public async friendsPage(input: P.FriendsPage.Input): Promise<P.FriendsPage.Output> {
    const result = await this.query<P.FriendsPage.Output>(input, `FriendsPage`);
    return result.unwrap();
  }

  public async gettingStartedBooks(
    input: P.GettingStartedBooks.Input,
  ): Promise<P.GettingStartedBooks.Output> {
    const result = await this.query<P.GettingStartedBooks.Output>(
      input,
      `GettingStartedBooks`,
    );
    return result.unwrap();
  }

  public async homepageFeaturedBooks(
    input: P.HomepageFeaturedBooks.Input,
  ): Promise<P.HomepageFeaturedBooks.Output> {
    const result = await this.query<P.HomepageFeaturedBooks.Output>(
      input,
      `HomepageFeaturedBooks`,
    );
    return result.unwrap();
  }

  public async newsFeedItems(
    input: P.NewsFeedItems.Input,
  ): Promise<P.NewsFeedItems.Output> {
    const result = await this.query<P.NewsFeedItems.Output>(input, `NewsFeedItems`);
    return result.unwrap();
  }

  public async publishedDocumentSlugs(
    input: P.PublishedDocumentSlugs.Input,
  ): Promise<P.PublishedDocumentSlugs.Output> {
    const result = await this.query<P.PublishedDocumentSlugs.Output>(
      input,
      `PublishedDocumentSlugs`,
    );
    return result.unwrap();
  }

  public async publishedFriendSlugs(
    input: P.PublishedFriendSlugs.Input,
  ): Promise<P.PublishedFriendSlugs.Output> {
    const result = await this.query<P.PublishedFriendSlugs.Output>(
      input,
      `PublishedFriendSlugs`,
    );
    return result.unwrap();
  }

  public async totalPublished(
    input: P.TotalPublished.Input,
  ): Promise<P.TotalPublished.Output> {
    const result = await this.query<P.TotalPublished.Output>(input, `TotalPublished`);
    return result.unwrap();
  }

  public audiobooksPageResult(
    input: P.AudiobooksPage.Input,
  ): Promise<Result<P.AudiobooksPage.Output>> {
    return this.query<P.AudiobooksPage.Output>(input, `AudiobooksPage`);
  }

  public documentPageResult(
    input: P.DocumentPage.Input,
  ): Promise<Result<P.DocumentPage.Output>> {
    return this.query<P.DocumentPage.Output>(input, `DocumentPage`);
  }

  public explorePageBooksResult(
    input: P.ExplorePageBooks.Input,
  ): Promise<Result<P.ExplorePageBooks.Output>> {
    return this.query<P.ExplorePageBooks.Output>(input, `ExplorePageBooks`);
  }

  public friendPageResult(
    input: P.FriendPage.Input,
  ): Promise<Result<P.FriendPage.Output>> {
    return this.query<P.FriendPage.Output>(input, `FriendPage`);
  }

  public friendsPageResult(
    input: P.FriendsPage.Input,
  ): Promise<Result<P.FriendsPage.Output>> {
    return this.query<P.FriendsPage.Output>(input, `FriendsPage`);
  }

  public gettingStartedBooksResult(
    input: P.GettingStartedBooks.Input,
  ): Promise<Result<P.GettingStartedBooks.Output>> {
    return this.query<P.GettingStartedBooks.Output>(input, `GettingStartedBooks`);
  }

  public homepageFeaturedBooksResult(
    input: P.HomepageFeaturedBooks.Input,
  ): Promise<Result<P.HomepageFeaturedBooks.Output>> {
    return this.query<P.HomepageFeaturedBooks.Output>(input, `HomepageFeaturedBooks`);
  }

  public newsFeedItemsResult(
    input: P.NewsFeedItems.Input,
  ): Promise<Result<P.NewsFeedItems.Output>> {
    return this.query<P.NewsFeedItems.Output>(input, `NewsFeedItems`);
  }

  public publishedDocumentSlugsResult(
    input: P.PublishedDocumentSlugs.Input,
  ): Promise<Result<P.PublishedDocumentSlugs.Output>> {
    return this.query<P.PublishedDocumentSlugs.Output>(input, `PublishedDocumentSlugs`);
  }

  public publishedFriendSlugsResult(
    input: P.PublishedFriendSlugs.Input,
  ): Promise<Result<P.PublishedFriendSlugs.Output>> {
    return this.query<P.PublishedFriendSlugs.Output>(input, `PublishedFriendSlugs`);
  }

  public totalPublishedResult(
    input: P.TotalPublished.Input,
  ): Promise<Result<P.TotalPublished.Output>> {
    return this.query<P.TotalPublished.Output>(input, `TotalPublished`);
  }
}

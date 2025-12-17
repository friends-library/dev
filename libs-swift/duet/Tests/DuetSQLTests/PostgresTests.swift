import DuetSQL
import Testing

@Suite struct PostgresTests {
  @Test func `string apostrophes escaped`() {
    let string = Postgres.Data.string("don't")
    #expect(string.param == "'don''t'")
  }
}

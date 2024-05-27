import DuetSQL
import NonEmpty
import TaggedMoney

struct EditionImpression: Codable, Sendable {
  var id: Id
  var editionId: Edition.Id
  var adocLength: Int
  var paperbackSizeVariant: PrintSizeVariant
  var paperbackVolumes: NonEmpty<[Int]>
  var publishedRevision: GitCommitSha
  var productionToolchainRevision: GitCommitSha
  var createdAt = Current.date()

  var paperbackSize: PrintSize {
    paperbackSizeVariant.printSize
  }

  var paperbackPrice: Cents<Int> {
    Lulu.paperbackPrice(size: paperbackSizeVariant.printSize, volumes: paperbackVolumes)
  }

  init(
    id: Id = .init(),
    editionId: Edition.Id,
    adocLength: Int,
    paperbackSizeVariant: PrintSizeVariant,
    paperbackVolumes: NonEmpty<[Int]>,
    publishedRevision: GitCommitSha,
    productionToolchainRevision: GitCommitSha
  ) {
    self.id = id
    self.editionId = editionId
    self.adocLength = adocLength
    self.paperbackSizeVariant = paperbackSizeVariant
    self.paperbackVolumes = paperbackVolumes
    self.publishedRevision = publishedRevision
    self.productionToolchainRevision = productionToolchainRevision
  }
}

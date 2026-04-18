import NonEmpty
import TaggedMoney

enum Lulu {
  enum Api {}
}

extension Lulu {
  static func paperbackPrice(size: PrintSize, volumes: NonEmpty<[Int]>) -> Cents<Int> {
    volumes.reduce(Cents<Int>(rawValue: 0)) { acc, pagesInVolume in
      let isSaddleStitch = size == .s && pagesInVolume < 32
      let basePrice: Cents<Int> = isSaddleStitch ? 376 : 197
      let pagesPrice = (Double(pagesInVolume) * PRICE_PER_PAGE).rounded(.toNearestOrAwayFromZero)
      return acc + basePrice + .init(rawValue: Int(pagesPrice))
    }
  }

  static func podPackageId(size: PrintSize, pages: Int) -> String {
    let sizePrefix = switch size {
    case .s:
      "0425X0687"
    case .m:
      "0550X0850"
    case .xl:
      "0600X0900"
    }
    return [
      sizePrefix,
      "BW", // interior color
      "STD", // standard quality
      pages < 32 ? "SS" : "PB", // saddle-stitch || perfect bound
      "060UW444", // 60# uncoated white paper, bulk = 444 pages/inch
      "GXX", // glossy cover, no linen, no foil
    ].joined(separator: ".")
  }
}

// Verified against Lulu API on 2026-04-18, includes 4% print-cost increase effective 2026-05-04.
// Bases set 1¢ below Lulu's so our total always lands 1-2¢ under their charge (we don't profit).
private let PRICE_PER_PAGE: Double = 2.496

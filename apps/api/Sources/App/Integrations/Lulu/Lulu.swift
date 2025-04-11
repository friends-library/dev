import NonEmpty
import TaggedMoney

enum Lulu {
  enum Api {}
}

extension Lulu {
  static func paperbackPrice(size: PrintSize, volumes: NonEmpty<[Int]>) -> Cents<Int> {
    volumes.reduce(Cents<Int>(rawValue: 0)) { acc, pagesInVolume in
      let isSaddleStitch = size == .s && pagesInVolume < 32
      let basePrice: Cents<Int> = isSaddleStitch ? 200 : 125
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
      "G", // glossy cover ("M": matte)
      "X", // no linen,
      "X", // no foil
    ].joined(separator: "")
  }
}

// docs say 2.0, but we are grandfathered in @ 1.4, verified on 1/20/2022
private let PRICE_PER_PAGE: Double = 1.4

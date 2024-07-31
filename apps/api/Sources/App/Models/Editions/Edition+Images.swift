import Foundation
import Vapor

extension Edition {
  struct Images: Codable {
    struct Image: Codable {
      let width: Int
      let height: Int
      let url: URL
      let path: String
      let filename: String
    }

    struct Square: Codable {
      let w45: Image
      let w90: Image
      let w180: Image
      let w270: Image
      let w300: Image
      let w450: Image
      let w600: Image
      let w750: Image
      let w900: Image
      let w1150: Image
      let w1400: Image

      var all: [Image] {
        [
          self.w45,
          self.w90,
          self.w180,
          self.w270,
          self.w300,
          self.w450,
          self.w600,
          self.w750,
          self.w900,
          self.w1150,
          self.w1400,
        ]
      }
    }

    struct ThreeD: Codable {
      let w55: Image
      let w110: Image
      let w250: Image
      let w400: Image
      let w550: Image
      let w700: Image
      let w850: Image
      let w1000: Image
      let w1120: Image

      var all: [Image] {
        [
          self.w55,
          self.w110,
          self.w250,
          self.w400,
          self.w550,
          self.w700,
          self.w850,
          self.w1000,
          self.w1120,
        ]
      }
    }

    let square: Square
    let threeD: ThreeD
  }
}

extension Edition.Joined {
  var images: Edition.Images {
    let path = "\(directoryPath)/images"
    return Edition.Images(
      square: .init(
        w45: squareImage(45, path),
        w90: squareImage(90, path),
        w180: squareImage(180, path),
        w270: squareImage(270, path),
        w300: squareImage(300, path),
        w450: squareImage(450, path),
        w600: squareImage(600, path),
        w750: squareImage(750, path),
        w900: squareImage(900, path),
        w1150: squareImage(1150, path),
        w1400: squareImage(1400, path)
      ),
      threeD: .init(
        w55: threeDImage(55, path),
        w110: threeDImage(110, path),
        w250: threeDImage(250, path),
        w400: threeDImage(400, path),
        w550: threeDImage(550, path),
        w700: threeDImage(700, path),
        w850: threeDImage(850, path),
        w1000: threeDImage(1000, path),
        // keep largest size in sync with cli/src/cmd/publish/cover-server.ts
        w1120: threeDImage(1120, path)
      )
    )
  }
}

// helpers

private let threeDImageAspectRatio: Double = 1120.0 / 1640.0

private func squareImage(_ size: Int, _ path: String) -> Edition.Images.Image {
  let filename = "cover--\(size)x\(size).png"
  return .init(
    width: size,
    height: size,
    url: URL(string: "\(Env.CLOUD_STORAGE_BUCKET_URL)/\(path)/\(filename)")!,
    path: "\(path)/\(filename)",
    filename: filename
  )
}

private func threeDImage(_ width: Int, _ path: String) -> Edition.Images.Image {
  let filename = "cover-3d--w\(width).png"
  return .init(
    width: width,
    height: Int((Double(width) / threeDImageAspectRatio).rounded(.down)),
    url: URL(string: "\(Env.CLOUD_STORAGE_BUCKET_URL)/\(path)/\(filename)")!,
    path: "\(path)/\(filename)",
    filename: filename
  )
}

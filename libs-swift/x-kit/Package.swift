// swift-tools-version:5.7
import PackageDescription

let package = Package(
  name: "XKit",
  platforms: [.macOS(.v10_15)],
  products: [
    .library(name: "XCore", targets: ["XCore"]),
    .library(name: "XBase64", targets: ["XBase64"]),
  ],
  dependencies: [],
  targets: [
    .target(
      name: "XCore",
      swiftSettings: [.unsafeFlags([
        "-Xfrontend", "-warn-concurrency",
        "-Xfrontend", "-enable-actor-data-race-checks",
        "-Xfrontend", "-warnings-as-errors",
      ])]
    ),
    .target(
      name: "XBase64",
      swiftSettings: [.unsafeFlags([
        "-Xfrontend", "-warn-concurrency",
        "-Xfrontend", "-enable-actor-data-race-checks",
        "-Xfrontend", "-warnings-as-errors",
      ])]
    ),
    .testTarget(name: "XCoreTests", dependencies: ["XCore"]),
  ]
)

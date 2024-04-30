// swift-tools-version:5.7

import PackageDescription

let package = Package(
  name: "XStripe",
  platforms: [.macOS(.v10_15)],
  products: [
    .library(name: "XStripe", targets: ["XStripe"]),
  ],
  dependencies: [.package(path: "../x-http")],
  targets: [
    .target(
      name: "XStripe",
      dependencies: [.product(name: "XHttp", package: "x-http")],
      swiftSettings: [.unsafeFlags([
        "-Xfrontend", "-warn-concurrency",
        "-Xfrontend", "-enable-actor-data-race-checks",
        "-Xfrontend", "-warnings-as-errors",
      ])]
    ),
  ]
)

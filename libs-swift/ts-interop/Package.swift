// swift-tools-version: 6.0

import PackageDescription

let package = Package(
  name: "TypeScriptInterop",
  products: [
    .library(name: "TypeScriptInterop", targets: ["TypeScriptInterop"]),
  ],
  dependencies: [
    .package(url: "https://github.com/wickwirew/Runtime.git", from: "2.2.7"),
  ],
  targets: [
    .executableTarget(
      name: "TypeScriptInteropCLI",
      dependencies: [],
    ),
    .target(
      name: "TypeScriptInterop",
      dependencies: [
        .product(name: "Runtime", package: "Runtime"),
      ],
      swiftSettings: [
        .unsafeFlags([
          "-Xfrontend", "-warn-concurrency",
          "-Xfrontend", "-enable-actor-data-race-checks",
          "-Xfrontend", "-warnings-as-errors",
        ]),
      ],
    ),
    .testTarget(
      name: "TypeScriptInteropTests",
      dependencies: [
        "TypeScriptInteropCLI",
        "TypeScriptInterop",
      ],
    ),
  ],
)

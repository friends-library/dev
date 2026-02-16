import Queues
import Vapor
import XCore

struct CrashReporterJob: AsyncScheduledJob {
  func run(context: QueueContext) async throws {
    if Env.mode == .prod {
      await self.exec()
    }
  }

  func exec() async {
    let proc = Process()
    let pipe = Pipe()
    proc.standardOutput = pipe
    proc.executableURL = URL(fileURLWithPath: "/usr/bin/pm2")
    proc.arguments = ["jlist"]

    do {
      try proc.run()
    } catch {
      await slackError("Error running crash report job: \(error)")
      return
    }

    let data = pipe.fileHandleForReading.readDataToEndOfFile()

    guard let processes = JSON.decode([Pm2Process].self, from: data) else {
      await slackError("Error decoding `pm2 jlist`: invalid data")
      return
    }

    guard let prod = processes.filter({ $0.name == "production" }).first else {
      await slackError("Could not find production process in pm2 list")
      return
    }

    let num_crashes = prod.pm2_env.restart_time
    if num_crashes == 0 {
      Current.logger.info("No crashes in production API detected")
      return
    }

    await slackError("\(num_crashes) crashes detected in production API")

    await get(dependency: \.postmarkClient).send(.init(
      to: Env.JARED_CONTACT_FORM_EMAIL,
      from: "info@friendslibrary.com",
      subject: "[FLP Api] Crash report",
      textBody: "API crashed \(num_crashes) times",
    ))
  }
}

private struct Pm2Process: Decodable {
  let name: String
  let pm2_env: Env

  struct Env: Decodable {
    let restart_time: Int
  }
}

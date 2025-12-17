import Testing

@testable import App

@Suite struct AudioPartValidityTests {
  init() {
    Current.logger = .null
  }

  @Test func `empty title invalid`() async {
    var part = AudioPart.valid
    part.title = ""
    #expect(await part.isValid() == false)
  }

  @Test func `too small duration invalid`() async {
    var part = AudioPart.valid
    part.duration = 120
    #expect(await part.isValid() == false)
  }

  @Test func `too small duration valid if not published`() async {
    var part = AudioPart.valid
    part.mp3SizeLq = 0
    part.mp3SizeHq = 0
    part.duration = 120
    #expect(await part.isValid() == true)
  }

  @Test func `negative values for mp3 size invalid`() async {
    var part = AudioPart.valid
    part.mp3SizeHq = -1
    #expect(await part.isValid() == false)
    part = AudioPart.valid
    part.mp3SizeLq = -1
    #expect(await part.isValid() == false)
  }

  @Test func `same size for mp3 hq lq invalid`() async {
    var part = AudioPart.valid
    part.mp3SizeHq = 888_888
    part.mp3SizeLq = 888_888
    #expect(await part.isValid() == false)
  }

  @Test func `lq mp3 larger than hq invalid`() async {
    var part = AudioPart.valid
    part.mp3SizeHq = 888_888
    part.mp3SizeLq = 999_999
    #expect(await part.isValid() == false)
  }

  @Test func `order less than 1 invalid`() async {
    var part = AudioPart.valid
    part.order = 0
    #expect(await part.isValid() == false)
  }

  @Test func `negative chapter value invalid`() async {
    var part = AudioPart.valid
    part.chapters = .init(-5)
    #expect(await part.isValid() == false)
  }

  @Test func `non-sequenced chapters invalid`() async {
    var part = AudioPart.valid
    part.chapters = .init(3, 5)
    #expect(await part.isValid() == false)
  }

  @Test func `zero draft state items valid`() async {
    var part = AudioPart.valid
    part.mp3SizeHq = 0
    part.mp3SizeLq = 0
    #expect(await part.isValid() == true)
  }

  @Test func `temp note to listener allowed with smaller size`() async {
    var part = AudioPart.valid
    part.title = "Nota para el oyente"
    part.mp3SizeLq = 300_000
    part.mp3SizeHq = 400_000
    part.duration = 25
    #expect(await part.isValid() == true)
  }
}

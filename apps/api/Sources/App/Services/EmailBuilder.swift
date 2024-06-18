enum EmailBuilder {
  static func fromAddress(lang: Lang) -> String {
    lang == .en
      ? "Friends Library <info@friendslibrary.com>"
      : "Biblioteca de los Amigos <info@bibliotecadelosamigos.org>"
  }
}

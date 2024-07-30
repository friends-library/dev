import { describe, test, expect } from 'vitest';
import type { Lang } from '@friends-library/types';
import { friendPageMetaDesc, bookPageMetaDesc } from '../seo';

describe(`bookPageMetaDesc()`, () => {
  const cases: Array<[string, string, string, boolean, Lang, boolean, string]> = [
    [
      `Compilations`,
      `About TITIP`,
      `TITIP`,
      true,
      `en`,
      true,
      `Free complete ebook and audiobook of “TITIP”—a compilation written by early members of the Religious Society of Friends (Quakers). Download and read or listen for free, or order a low-cost paperback. About TITIP`,
    ],
    [
      `Compilaciones`,
      `About TITIP`,
      `TITIP`,
      true,
      `es`,
      true,
      `Obtén de forma gratuita el libro electrónico completo y el audiolibro de “TITIP”—una compilación escrita por los primeros miembros de la Sociedad de Amigos (Cuáqueros). Descargar y leer o escuchar de forma gratuita, o pedir un libro impreso por un precio muy económico. About TITIP`,
    ],
    [
      `George Fox`,
      `About George`,
      `Journal`,
      true,
      `en`,
      false,
      `Free complete ebook and audiobook of “Journal” by George Fox, an early member of the Religious Society of Friends (Quakers). Download and read or listen for free, or order a low-cost paperback. About George`,
    ],
    [
      `George Fox`,
      `About George`,
      `Journal`,
      false,
      `en`,
      false,
      `Free complete ebook of “Journal” by George Fox, an early member of the Religious Society of Friends (Quakers). Download and read for free, or order a low-cost paperback. About George`,
    ],
    [
      `George Fox`,
      `About George`,
      `Journal`,
      true,
      `es`,
      false,
      `Obtén de forma gratuita el libro electrónico completo y el audiolibro de “Journal” escrito por George Fox, un antiguo miembro de la Sociedad de Amigos (Cuáqueros). Descargar y leer o escuchar de forma gratuita, o pedir un libro impreso por un precio muy económico. About George`,
    ],
    [
      `George Fox`,
      `About George`,
      `Journal`,
      false,
      `es`,
      false,
      `Obtén de forma gratuita el libro electrónico completo de “Journal” escrito por George Fox, un antiguo miembro de la Sociedad de Amigos (Cuáqueros). Descargar y leer gratis, o pedir un libro impreso por un precio muy económico. About George`,
    ],
  ];
  test.each(cases)(
    `should produce correct meta description`,
    (author, desc, title, hasAudio, lang, isComp, expected) => {
      expect(bookPageMetaDesc(author, desc, title, hasAudio, isComp, lang)).toBe(
        expected,
      );
    },
  );
});

describe(`friendPageMetaDesc()`, () => {
  const cases: [string, string, string[], number, boolean, Lang, string][] = [
    [
      `George Fox`,
      `About George.`,
      [`Journal`],
      1,
      false,
      `en`,
      `Free ebook and audiobook by early Quaker writer George Fox: “Journal.” Download and read or listen for free, or order a low-cost paperback. About George.`,
    ],
    [
      `George Fox`,
      `About George.`,
      [`Journal`],
      0,
      false,
      `en`,
      `Free ebook by early Quaker writer George Fox: “Journal.” Download and read for free, or order a low-cost paperback. About George.`,
    ],
    [
      `George Fox`,
      `About George.`,
      [`Journal`, `Epistles`, `Excerpts`],
      0,
      false,
      `en`,
      `Free ebooks by early Quaker writer George Fox: “Journal,” “Epistles,” and “Excerpts.” Download and read for free, or order a low-cost paperback. About George.`,
    ],
    [
      `George Fox`,
      `About George.`,
      [`Journal`, `Epistles`],
      2,
      false,
      `en`,
      `Free ebooks and audiobooks by early Quaker writer George Fox: “Journal” and “Epistles.” Download and read or listen for free, or order a low-cost paperback. About George.`,
    ],
    [
      `George Fox`,
      `About George.`,
      [`Journal`, `Epistles`],
      1,
      false,
      `en`,
      `Free ebooks and audiobook by early Quaker writer George Fox: “Journal” and “Epistles.” Download and read or listen for free, or order a low-cost paperback. About George.`,
    ],
    [
      `Compilations`,
      `About George.`,
      [`Journal`, `Epistles`],
      1,
      true,
      `en`,
      `Free ebooks and audiobook of “Journal” and “Epistles”—compilations written by early members of the Religious Society of Friends (Quakers). Download and read or listen for free, or order a low-cost paperback. About George.`,
    ],
    [
      `Compilations`,
      `About TITIP.`,
      [`TITIP`],
      1,
      true,
      `en`,
      `Free ebook and audiobook of “TITIP”—a compilation written by early members of the Religious Society of Friends (Quakers). Download and read or listen for free, or order a low-cost paperback. About TITIP.`,
    ],
    [
      `Compilations`,
      `About TITIP.`,
      [`TITIP`, `PP v1`],
      1,
      true,
      `en`,
      `Free ebooks and audiobook of “TITIP” and “PP v1”—compilations written by early members of the Religious Society of Friends (Quakers). Download and read or listen for free, or order a low-cost paperback. About TITIP.`,
    ],
    [
      `George Fox`,
      `Hola George.`,
      [`Journal`, `Epistles`],
      1,
      false,
      `es`,
      `Libros electrónicos y audiolibro gratuitos, escritos por George Fox, uno de los antiguos Cuáqueros: “Journal” y “Epistles.” Descargar y leer o escuchar de forma gratuita, o pedir un libro impreso por un precio muy económico. Hola George.`,
    ],
    [
      `Compilaciones`,
      `Hola Compilaciones.`,
      [`La Verdad en lo Íntimo`, `El Pietoto Promotedo`],
      1,
      true,
      `es`,
      `Libros electrónicos y audiolibro gratuitos de “La Verdad en lo Íntimo” y “El Pietoto Promotedo”—compilaciones escritas por los primeros miembros de la Sociedad de Amigos (Cuáqueros). Descargar y leer o escuchar de forma gratuita, o pedir un libro impreso por un precio muy económico. Hola Compilaciones.`,
    ],
    [
      `Compilaciones`,
      `Hola Compilaciones.`,
      [`La Verdad en lo Íntimo`],
      1,
      true,
      `es`,
      `Libro electrónico y audiolibro gratuitos de “La Verdad en lo Íntimo”—una compilación escrita por los primeros miembros de la Sociedad de Amigos (Cuáqueros). Descargar y leer o escuchar de forma gratuita, o pedir un libro impreso por un precio muy económico. Hola Compilaciones.`,
    ],
    [
      `Compilaciones`,
      `Hola Compilaciones.`,
      [`La Verdad en lo Íntimo`],
      0, // no audiobooks
      true,
      `es`,
      `Libro electrónico gratuitos de “La Verdad en lo Íntimo”—una compilación escrita por los primeros miembros de la Sociedad de Amigos (Cuáqueros). Descargar y leer gratis, o pedir un libro impreso por un precio muy económico. Hola Compilaciones.`,
    ],
  ];

  test.each(cases)(
    `should produce correct meta description`,
    (author, desc, titles, numAudio, isComp, lang, expected) => {
      expect(friendPageMetaDesc(author, desc, titles, numAudio, isComp, lang)).toBe(
        expected,
      );
    },
  );
});

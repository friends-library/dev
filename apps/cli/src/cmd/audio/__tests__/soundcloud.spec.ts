import { trackAttrs } from '../soundcloud';
import * as fixtures from './audio-fixtures';

describe(`trackAttrs()`, () => {
  it(`should create correct attrs for english track`, () => {
    const attrs = trackAttrs(fixtures.turfordEn, 0, `HQ`);
    expect(attrs.label_name).toBe(`Friends Library Publishing`);
    expect(attrs.title).toBe(`Walk in the Spirit — pt. 1`);
    expect(attrs.description).toBe(fixtures.turfordEn.edition.document.description);
    expect(attrs.tags).toMatchObject([
      `doctrinal`,
      `treatise`,
      `quakers`,
      `early-quakers`,
      `christianity`,
      `friends-library`,
      `HQ`,
    ]);
    expect(trackAttrs(fixtures.turfordEn, 1, `HQ`).title).toBe(
      `Walk in the Spirit — pt. 2`,
    );
    expect(trackAttrs(fixtures.turfordEn, 2, `HQ`).title).toBe(
      `The Grace that Brings Salvation`,
    );
  });

  it(`should create correct attrs for spanish track`, () => {
    const attrs = trackAttrs(fixtures.webbEs, 0, `HQ`);
    expect(attrs.label_name).toBe(`Biblioteca de los Amigos`);
    expect(attrs.tags).toMatchObject([
      `cartas`,
      `diario`,
      `cuáqueros`,
      `primeros-cuáqueros`,
      `cristiandad`,
      `biblioteca-de-los-amigos`,
      `HQ`,
    ]);
  });
});

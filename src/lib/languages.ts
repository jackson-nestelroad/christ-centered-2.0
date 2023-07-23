import { Versions } from 'daily-bread';
import { Language, LanguageNames } from 'daily-bread/build/src/bible';

type NameValue<N, V> = { name: N; value: V };

export const SupportedLanguages: NameValue<string, Language>[] = Object.values(Language).map(code => ({
  name: LanguageNames[code],
  value: code,
}));

export const SupportedVersions = Object.entries(Versions).reduce((obj, [language, versions]) => {
  obj[language as Language] = [...versions.values()].map(({ abbreviation, name }) => ({
    name,
    value: abbreviation,
  }));
  return obj;
}, {} as { [language in Language]: NameValue<string, string>[] });

export const DefaultVersions: { [language in Language]: string } = {
  [Language.English]: 'NIV',
  [Language.Spanish]: 'RVC',
  [Language.Chinese]: 'CUVS',
  [Language.Korean]: 'KLB',
  [Language.Japanese]: 'JLB',
  [Language.Portuguese]: 'NVT',
  [Language.French]: 'LSG',
  [Language.German]: 'LUTH1545',
  [Language.Italian]: 'CEI',
  [Language.Hindi]: 'ERV-HI',
};

export function isSupportedLanguage(language: string): language is Language {
  return SupportedLanguages.findIndex(({ value }) => value === language) !== -1;
}

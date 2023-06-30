import { DailyBread } from 'daily-bread';

import { BibleVerse, VerseConfig } from '../types/bible-verse';

function createDailyBread(config: VerseConfig): DailyBread {
  const bible = new DailyBread();
  const { version } = config;
  bible.setVersion(version);
  return bible;
}

function createVerseURL(reference: string, version: string): string {
  return `https://biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=${version}`;
}

export async function fetchVerseForSearch(config: VerseConfig, search?: string): Promise<BibleVerse> {
  console.log('Fetching verse');

  const bible = createDailyBread(config);
  const result = await (search ? bible.getOne(search) : bible.votd());

  return {
    ...result,
    version: config.version,
    url: createVerseURL(result.reference, config.version),
  };
}

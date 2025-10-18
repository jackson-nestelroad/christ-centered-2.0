import { DailyBread } from 'daily-bread';

import { DailyBreadConfig } from '../store/slices/verse';
import { BibleVerse, VerseConfig } from '../types/bible-verse';

function createDailyBread(config: VerseConfig, dailyBreadConfig: DailyBreadConfig): DailyBread {
  const bible = new DailyBread();
  const { version } = config;
  bible.setVersion(version);
  bible.setBibleGatewayOptions({
    useHomepageToReadVerseOfTheDay: dailyBreadConfig.useHomepageForVerseOfTheDay,
  });
  return bible;
}

function createVerseURL(reference: string, version: string): string {
  return `https://biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=${version}`;
}

export async function fetchVerseForSearch(
  config: VerseConfig,
  dailyBreadConfig: DailyBreadConfig,
  search?: string,
): Promise<BibleVerse> {
  console.log('Fetching verse');

  const bible = createDailyBread(config, dailyBreadConfig);
  const result = await (search ? bible.getOne(search) : bible.votd());

  if (!result.reference || !result.text) {
    throw new Error('Failed to read verse');
  }

  return {
    ...result,
    version: config.version,
    url: createVerseURL(result.reference, config.version),
  };
}

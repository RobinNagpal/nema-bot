import { Metadata } from '@/loaders/discordLoader';
import axios from 'axios';
import { load } from 'cheerio';
import { Document } from 'langchain/document';

function getCheerioSelector(url: string): string {
  if (url.startsWith('https://www.theblock.co')) {
    return '#__layout > div > div:nth-child(5) > div > section.article > div > article';
  }
  if (url.startsWith('https://blockworks.co')) {
    return '#__next > div > main > section.flex.flex-row.flex-wrap.lg\\:flex-nowrap > div.basis-1\\/1.lg\\:basis-4\\/6.h-full.p-5.md\\:p-8.lg\\:p-10.border-r-0.lg\\:border-r.border-b.lg\\:border-b-0 > article > div.flex.flex-col.flex-wrap.xl\\:flex-row.xl\\:flex-nowrap.gap-6.mt-2.md\\:mt-4.xl\\:mt-6.w-full > div.p-2.basis-4\\/4.xl\\:basis-3\\/4 > section.w-full';
  }
  if (url.startsWith('https://www.coinbureau.com')) {
    return '';
  }
  if (url.startsWith('https://coingape.com')) {
    return '';
  }
  if (url.startsWith('https://thedefiant.io')) {
    return '';
  }
  if (url.startsWith('https://www.coindesk.com')) {
    return '';
  }
  throw new Error('No xpath found for url: ' + url);
}

export const getNewsContentsUsingCheerio = async (url: string) => {
  const { data } = await axios.get(url);
  const xpath: string = getCheerioSelector(url);
  const $ = await load(data);
  return $(xpath).text().trim();
};

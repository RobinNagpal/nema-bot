import axios from 'axios';
import { load } from 'cheerio';

function getCheerioSelector(url: string): string {
  if (url.startsWith('https://www.theblock.co')) {
    return '#__layout > div > div:nth-child(5) > div > section.article > div > article';
  }
  if (url.startsWith('https://blockworks.co')) {
    return '';
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

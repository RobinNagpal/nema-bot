import puppeteer from 'puppeteer';

function getXpathSelector(url: string): string {
  if (url.startsWith('https://www.theblock.co')) {
    return '/html/body/div[1]/div/div/div[5]/div/section[1]/div[2]/article';
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
export const getNewsContentsUsingPuppeteer = async (url: string) => {
  const xpath: string = getXpathSelector(url);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  // Get element handle
  const elementHandleArray = await page.$x(xpath);

  // Ensure there are elements
  if (elementHandleArray.length > 0) {
    const elementHandle = elementHandleArray[0];

    // Get text content
    const content = await page.evaluate((el) => el.textContent, elementHandle);
    console.log(content);
    return content;
  } else {
    console.log('Element not found');
  }

  await browser.close();
};

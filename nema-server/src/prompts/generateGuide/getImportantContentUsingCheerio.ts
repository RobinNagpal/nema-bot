import axios from 'axios';
import { load } from 'cheerio';

/**
 * In general, the method to find the most important text on a webpage involves a combination of techniques. Here are a few broad steps that you can take:
 *
 * Web Scraping: Firstly, you'll need to extract the HTML content from the webpage. You can use libraries like Beautiful Soup in Python to do this.
 *
 * Remove Unwanted Tags: Once you have the HTML content, you should remove the content in tags that usually do not contain the main text. For example, you can remove content in <script>, <style>, <footer>, <header>, <nav>, <aside>, etc. tags. Again, Beautiful Soup can be used to do this.
 *
 * Parsing the Body: The main content of a webpage is usually found in the <body> tag. You can extract the text inside the <body> tag after you have removed the unwanted tags.
 *
 * Heuristics for Important Content: Further, to distinguish between the main content and sidebars or ads, you can consider the following heuristics:
 *
 * Length of Text Blocks: Usually, the main content is found in long paragraphs while sidebars and ads have smaller blocks of text.
 *
 * Positioning of Text: Often, the main content is centrally aligned, while ads and navigation elements are on the sides.
 *
 * Tag Type: Certain tags like <article>, <main>, and <p> often contain the primary content of the webpage.
 *
 * Natural Language Processing (NLP): After extracting the candidate text blocks, you can apply NLP techniques to further refine the important content. For instance, you can use Named Entity Recognition (NER) to find the entities in the text, or use text summarization algorithms to extract key points.
 *
 * Machine Learning: Machine learning algorithms can also be used to identify important text on a webpage. You'd have to train a model on a labeled dataset where the labels identify whether a piece of text is important or not. The model then learns to identify important text on unseen webpages.
 *
 * Please note that this process might not work perfectly on all webpages due to the diversity of ways in which webpages can be designed. It may need to be customized and refined depending on the specific webpages you are dealing with. Also, ensure you're in compliance with the website's policy on web scraping and respect user data privacy.
 */

const MIN_PARAGRAPH_LENGTH = 50; // minimum paragraph length
const AD_KEYWORDS = ['advertisement', 'promo', 'sponsor']; // list of keywords indicative of ads

export async function getImportantContentUsingCheerio(url: string) {
  const response = await axios.get(url);
  const $ = load(response.data);
  $('script, style, footer, header, nav, aside').remove();
  const bodyText = $('body').text();

  let paragraphs = bodyText
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  paragraphs = paragraphs.filter((p) => p.length > MIN_PARAGRAPH_LENGTH);
  paragraphs = paragraphs.filter((p) => !AD_KEYWORDS.some((keyword) => p.toLowerCase().includes(keyword)));

  return paragraphs.join('\n');
}

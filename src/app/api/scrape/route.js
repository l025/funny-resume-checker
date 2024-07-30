import axios from 'axios';
import cheerio from 'cheerio';

export async function POST(req) {
  const { url } = {url: 'https://www.linkedin.com/in/me8dib/' }; //await req.json();

  if (!url) {
    return new Response(JSON.stringify({ error: 'Missing URL parameter' }), {
      status: 400,
    });
  }

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 
      },
    });

    return new Response(JSON.stringify(data));
    const $ = cheerio.load(data);

    const name = $('h1').text().trim();
    const headline = $('.text-body-medium').first().text().trim();
    const location = $('.text-body-small.inline.t-black--light.break-words').text().trim();
    const summary = $('.pv-about__summary-text .pv-about__summary-text--hidden').text().trim();

    const experience = [];
    $('.experience-section .pv-entity__position-group-pager').each((i, el) => {
      const jobTitle = $(el).find('.t-16.t-black.t-bold').text().trim();
      const companyName = $(el).find('.pv-entity__secondary-title').text().trim();
      const dateRange = $(el).find('.pv-entity__date-range span:nth-child(2)').text().trim();
      const location = $(el).find('.pv-entity__location span:nth-child(2)').text().trim();
      experience.push({ jobTitle, companyName, dateRange, location });
    });

    return new Response(JSON.stringify({ name, headline, location, summary, experience }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
}
import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/ebullion', async (req, res) => {
  let browser;
  try {
    // Launch Puppeteer with the correct executable path for Render environment
    browser = await puppeteer.launch({
       args: ['--no-sandbox', '--disable-setuid-sandbox'],
       headless: true
    });

    const page = await browser.newPage();
    await page.goto('https://www.ebullion.in', { waitUntil: 'networkidle2' });

    // Wait for the live-price element to appear
    await page.waitForSelector('.live-price.text-center', { timeout: 10000 });

    // Extract the live gold price
    const price = await page.$eval('.live-price.text-center', el =>
      el.textContent.trim()
    );

    res.json({ price });
  } catch (err) {
    console.error('Scrape error:', err);
    res.status(500).json({ error: err.toString() });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`eBullion scraper running on port ${PORT}`);
});

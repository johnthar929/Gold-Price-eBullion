import express from 'express';

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/ebullion', async (req, res) => {
  try {
    // fetch the live page HTML
    const response = await fetch('https://www.ebullion.in');
    const html = await response.text();

    // extract the price from <div class="live-price text-center">₹9,889.36/g</div>
    const m = html.match(
      /<div\s+class="live-price text-center">([^<]+)<\/div>/
    );

    if (!m) {
      throw new Error('Price not found in eBullion HTML');
    }

    const price = m[1].trim();
    res.json({ price });
  } catch (err) {
    console.error('Scrape error:', err);
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(PORT, () =>
  console.log(`eBullion scraper running on port ${PORT}`)
);

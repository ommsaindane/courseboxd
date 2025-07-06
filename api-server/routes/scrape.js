// api-server/routes/scrape.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();
const puppeteer = require('puppeteer');


router.get('/udemy', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query parameter "q"' });

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const searchUrl = `https://www.udemy.com/courses/search/?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    await page.waitForSelector('[data-purpose="search-course-card-title"]');

    const courses = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-purpose="search-course-card"]');
      const results = [];

      items.forEach(item => {
        const title = item.querySelector('[data-purpose="search-course-card-title"]')?.innerText;
        const url = 'https://www.udemy.com' + item.querySelector('a.udlite-custom-focus-visible')?.getAttribute('href');
        const rating = item.querySelector('.star-rating--rating-number--3lVe8')?.innerText;
        const price = item.querySelector('.price-text--price-part--Tu6MH span')?.innerText;

        if (title && url) {
          results.push({ title, url, rating, price });
        }
      });

      return results;
    });

    await browser.close();
    res.json({ results: courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to scrape Udemy with Puppeteer' });
  }
});

module.exports = router;


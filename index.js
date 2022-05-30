const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const { close, goto, click, waitForTimeout } = require("./API/Puppeteer");
const { isElementVisibleAndNotDisabled } = require("./API/util");
const {
  getInitialJson,
  googlePlacesXhrResponseCleaner,
  googlePlacesResponseBusinessExtracter,
} = require("./API/Google/Places");

// CONSTS
const { NEXT_PAGE_SELECTOR, URLS } = require("./consts");

// Scraper variables
var _data = [];
var pagesScraped = 1;
var scraperState = '';



// Express
const express = require('express')
const app = express()
const port = parseInt(process.env.PORT) || 8080;



app.get('/status', (req, res) => {
    const bizNames = _data.map((item) => {
        return item.name
      });
    res.json(bizNames || {})
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })





// MAPS SCRAPER





function logBusinessNames(pageData) {
  pageData.map((item) => {
    console.log(item.name);
  });
}

(async () => {
  scraperState = "Starting";

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "google-chrome",
    args: [
      "--disable-gpu",
      "--no-sandbox",
      // "--proxy-server=isp2.hydraproxy.com:9989:barr27454yhhy66098:3abTmON7ayKO63Qc",
    ],
  });

  scraperState = "Browser launched";

  const [page] = await browser.pages();

  scraperState = "Page created";
  let pageNumber = 1;
  for (let i = 0; i < URLS.length; i++) {
    scraperState = `Scraping page ${pageNumber}`;

    await goto(page, URLS[i]);

    scraperState = `Scraping url ${URLS[i]}`;

    // Get initial JSON from the window
    if (i === 0) {
      scraperState = `Scraping first page result`;
      const data = await getInitialJson(page);
      //logBusinessNames(data);
      _data = [..._data, ...data];
      await page.waitForTimeout(5000);
    }

    // Listen to all responses
    page.on("response", async (res) => {
      // Catch the Google XHR response with our needed JSON
      if (res.url().indexOf("search?") > -1) {
        scraperState = `Caught search response!`;

        const raw = await res.text();
        const json = googlePlacesXhrResponseCleaner(raw);
        const results = googlePlacesResponseBusinessExtracter(json);

        if (results) scraperState = `Successfully scraped.`;
        //logBusinessNames(results);
        _data = [..._data, ...results];
        await page.waitForTimeout(5000);
      }
    });

    // Is there more pages?
    let nextPageButton = await isElementVisibleAndNotDisabled(
      page,
      NEXT_PAGE_SELECTOR
    );

    while (nextPageButton) {
      scraperState = `There's more pages and were scraping them`;
      await waitForTimeout(page, 5000);
      await click(page, NEXT_PAGE_SELECTOR);
      nextPageButton = await isElementVisibleAndNotDisabled(
        page,
        NEXT_PAGE_SELECTOR
      );
      pageNumber++;
      pagesScraped++;

      console.log(`Scraped page ${pageNumber} in url ${URLS[i]}`);
      console.log(`Total pages scraped ${pagesScraped}`);
      console.log(`Total rows collected ${_data.length}`);
    }

    console.log(`Scraped page ${pageNumber} in url ${URLS[i]}`);
    console.log(`Total pages scraped ${pagesScraped}`);
    console.log(`Total rows collected ${_data.length}`);
  }

  await close(browser);
})();

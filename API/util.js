fs = require("fs");
const puppeteer = require("puppeteer");
const { newPage, launch, waitForSelector } = require("./Puppeteer");

const isElementVisibleAndNotDisabled = async (page, selector) => {
  let visible = true;
  try {
    const elementExists = await waitForSelector(page, selector);
    const elmentDisabled = (await page.$(`${selector}[disabled]`)) !== null;
    if (!elementExists || elmentDisabled) throw new Error();
  } catch (error) {
    visible = false;
  }
  return visible;
};

const createStatusLogTemplate = async (type, opts) => {
  let log;
  switch (type) {
    case "url":
      log = `===============================
=== Scraping page ${opts.i + 1} / ${opts.length} ===
===============================
URL: ${opts.url} \n \n`;
      break;
    case "page":
      log = `-> Scraped page ${opts.pageNum + 1} \n`;
      break;
  }

  createStatusLog(log);
};

const saveAsCsv = async (dataToSave) => {
  try {
    const csv = new ObjectsToCsv(dataToSave);
    await csv.toDisk("./data/test.csv", { append: true });
  } catch (error) {
    console.log(error);
  }
};

const merge = async (a, b) => Object.assign(a, b);

module.exports = {
  isElementVisibleAndNotDisabled,
  createStatusLogTemplate,
  merge,
};

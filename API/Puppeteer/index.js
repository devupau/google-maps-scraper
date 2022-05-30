fs = require("fs");
const puppeteer = require("puppeteer");

const waitForSelector = async (page, selector) => {
  let waitFor;
  try {
    waitFor = await page.waitForSelector(selector, {
      visible: true,
      timeout: 5000,
    });
  } catch (error) {
    //logger.error(`Waiting for element ${selector}`);
    //logger.debug(error);
  }
  return waitFor;
};

const type = async (page, selector, text, options = { delay: 200 }) => {
  try {
    await page.type(selector, text, options);
  } catch (error) {

  }
};

const keyboardType = async (page, text, options = { delay: 200 }) => {
  try {
    await page.keyboard.type(text, options);
  } catch (error) {

  }
};

const waitForNavigation = async (page) => {
  try {
    await page.waitForNavigation();
  } catch (error) {

  }
};

const keyboardPress = async (page, keyToPress) => {
  try {
    await page.keyboard.press(keyToPress);
  } catch (error) {

  }
};

const launch = async (
  options = {
    headless: false,
    args: [
      //"--window-size=1920,1080",
      //`--disable-extensions-except=${ext1},${ext2},${ext3}`,
      //`--disable-extensions-except=${ext1}`,
    ],
    defaultViewport: null,
    userDataDir: "./user_data",
    //devtools: true,
  }
) => {
  let browser;
  try {
    browser = await puppeteer.launch(options);
  } catch (error) {

  }
  return browser;
};

const newPage = async (browser) => {
  let newPage;
  try {
    newPage = await browser.newPage();
  } catch (error) {

  }
  return newPage;
};

const goto = async (page, url, options = { waitUntil: "networkidle0" }) => {
  try {
    await page.goto(url, options).catch((err) => console.log(err));
  } catch (error) {

  }
};

const close = async (browser) => {
  try {
    await browser.close();
  } catch (error) {

  }
};

const click = async (page, selector) => {
  let click;
  try {
    await page.click(selector);
  } catch (error) {
    //logger.error(`Could not click on element ${selector}`);
    //logger.debug(error);
  }
  return click;
};

const waitForTimeout = async (page, timeInMs) => {
  try {
    await page.waitForTimeout(timeInMs);
  } catch (error) {

  }
};

module.exports = {
  click,
  close,
  goto,
  newPage,
  launch,
  waitForTimeout,
  waitForSelector,
  type,
  keyboardPress,
  waitForNavigation,
  keyboardType,
};

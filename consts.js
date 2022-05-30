const { generateUrls } = require("./API/urls");

const NEXT_PAGE_SELECTOR = "#ppdPk-Ej1Yeb-LgbsSe-tJiF1e";

const URLS = generateUrls(["plumber"]);

module.exports = {
  NEXT_PAGE_SELECTOR,
  URLS,
};

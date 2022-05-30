const fs = require("fs");
const googlePlacesResponseBusinessExtracter = (json) => {
  let businesses = [];
  json.map(async (row) => {
    if (row.length === 15) {
      const a = row[14];
      businesses.push({
        name: a[11],
        website: a[7] ? a[7][0] : "no website",
        reviewCount: a[4] ? a[4][3][1] : "no reviews",
        reviewScore: a[4] ? a[4][7] : "no review score",
        keywords: (function () {
          return a[13] ? a[13].join(", ") : "no keywords";
        })(),
        address: a[39] ? a[39] : "no address",
        phone: a[178] ? a[178][0][0] : "no number",
      });
    }
  });
  return businesses;
};

const googlePlacesXhrResponseCleaner = (res) => {
  // Removing /*""*/ string at the end
  const rawJson = res.replace(`/*""*/`, "");

  // Converting to JSON
  const cleanedJsonRaw = JSON.parse(rawJson);
  const jsonString = cleanedJsonRaw["d"];

  // Removing )]}' string at the start
  const cleanedJson = jsonString.replace(`)]}'`, "");

  // Convert to JSON object
  const json = JSON.parse(cleanedJson);

  // Return the data index
  return json[0][1];
};

const getInitialJson = async (page) => {
  const firstPageResultsFromWindow = await page.$$eval("html", async (el) => {
    const { APP_INITIALIZATION_STATE } = window;
    const json = JSON.parse(APP_INITIALIZATION_STATE[3][2].split("'\n")[1]);
    return json[0][1];
  });
  const firstPageResults = googlePlacesResponseBusinessExtracter(
    firstPageResultsFromWindow
  );
  return firstPageResults;
};

module.exports = {
  getInitialJson,
  googlePlacesXhrResponseCleaner,
  googlePlacesResponseBusinessExtracter,
};

// API

const scrollToBottom = async (page) => {
    await page.$$eval("html", () => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
  };
  
  const getCollectionItemIndex = async (page, textToMatch, selector) => {
    let position;
    try {
      position = await page.$eval(
        selector,
        (dropdown, item) => {
          let position;
          const linksInsideDropdown = dropdown.querySelectorAll("a");
          Array.from(linksInsideDropdown).map((dropdownItem, index) => {
            if (dropdownItem.textContent === item) position = index + 1;
          });
          return position;
        },
        textToMatch
      );
    } catch (err) {
      console.log(err);
    }
    return position;
  };
  
  module.exports = {
    scrollToBottom,
    getCollectionItemIndex,
  };
  
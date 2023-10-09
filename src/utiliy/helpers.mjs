import {setTimeout} from "timers/promises";

// Collection of helper functions

export const collectLinks = async (page, selector) => {
  const links = await page.evaluate(() => {
    return [...document.querySelectorAll(selector)].map((e) => e.href);
  }, selector);
};

export const extractText = (page, selector) => {
  return page.evaluate(
    (selector) => document.querySelector(selector)?.innerHTML,
    selector,
  );
};
export const extractPrice = (page, selector) => {
  return page.evaluate((selector) => {
    let node = document.querySelector(selector);
    if (node.hasChildNodes()) {
      return document.querySelector(`${selector} ins`)?.innerHTML;
    } else {
      return document.querySelector(`${selector}`)?.innerHTML;
    }
  }, selector);
};

export const extractImageLink = (page, selector) => {
  return page.evaluate(
    (selector) => document.querySelector(selector)?.src,
    selector,
  );
};

export const removePopup = async (
  page,
  popupSelector = "#popover-foreground",
) => {
  const hasPopup = await page.$(popupSelector);

  if (hasPopup) {
    await page.$eval(popupSelector, (popup) => popup.remove());
  }
};

export const extractVariantsData = async (page, optionSelector, selectedSelector, priceSelector) => {
  const variants = await page.evaluate(
    () => [...document.querySelectorAll(optionSelector)].map((e) => e.value),
    optionSelector,
  );
  let variantData = [];
  for (let variant of variants) {
    await page.select(selectedSelector, variant);
    await setTimeout(100);
      variantData.push({
      variant,
      price: await extractText(page, priceSelector),
    });
  }
  return variantData;
};

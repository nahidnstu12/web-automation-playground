import { Worker } from "bullmq";
import "dotenv/config.js";
import Redis from "ioredis";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import puppeteer from "puppeteer";

const connection = new Redis(process.env.REDIS_PATH, {
  maxRetriesPerRequest: null,
});

const db = new Low(new JSONFile("../../data/startech-product.json"), {});
await db.read();

const saveToDB = async (id, data) => {
  db.data[id] = data;
  await db.write();
};

const browser = await puppeteer.launch({
  headless: false,
  userDataDir: "/tmp/ecom-crawler1",
});

/**
 * @param {Page} page
 * @param {String} selector
 */
const extractText = (page, selector) => {
  return page.evaluate(
    (selector) => document.querySelector(selector)?.innerHTML,
    selector,
  );
};
const extractPrice = (page, selector) => {
  return page.evaluate((selector) => {
    let node = document.querySelector(selector);
    if (node.hasChildNodes()) {
      return document.querySelector(`${selector} ins`)?.innerHTML;
    } else {
      return document.querySelector(`${selector}`)?.innerHTML;
    }
  }, selector);
};

const extractImageLink = (page, selector) => {
  return page.evaluate(
    (selector) => document.querySelector(selector)?.src,
    selector,
  );
};
const removePopup = async (page, popupSelector = "#popover-foreground") => {
  const hasPopup = await page.$(popupSelector);

  if (hasPopup) {
    await page.$eval(popupSelector, (popup) => popup.remove());
  }
};

new Worker(
  "mobile-items",
  async (job) => {
    const productLink = job.data.url;
    const page = await browser.newPage();
    await page.goto(productLink, { waitUntil: "networkidle2", timeout: 8000 });

    await removePopup(page, ".popup");

    await page.waitForSelector(".product-details.content", { timeout: 8000 });
    console.log(productLink);

    const title = await extractText(page, "h1.product-name");
    const brand = await extractText(page, ".product-brand");
    const price = await extractPrice(page, ".product-price");
    const product_status = await extractText(page, ".product-status");
    const product_image = await extractImageLink(page, ".main-img");

    await saveToDB(productLink, {
      productLink,
      title,
      brand,
      price,
      product_image,
      product_status,
    });
    await page.close();
  },
  { connection },
);

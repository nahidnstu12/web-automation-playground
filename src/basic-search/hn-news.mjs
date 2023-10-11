import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

// Set the viewport's width and height
await page.setViewport({ width: 1920, height: 1080 });

await page.goto("https://hn.algolia.com");

// Type into search box
await page.type(
  ".SearchInput",
  "show hn",
);

await page.waitForSelector(".SearchResults");

try {
  await page.screenshot({ path: `../../data/capture-1.jpg` });
} catch (err) {
  console.log(`Error: ${err.message}`);
} finally {
  await browser.close();
  console.log(`Screenshot has been captured successfully`);
}

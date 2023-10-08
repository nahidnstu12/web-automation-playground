import { Queue } from "bullmq";
import "dotenv/config.js";
import Redis from "ioredis";
import puppeteer from "puppeteer";

const connection = new Redis(process.env.REDIS_PATH, {
    maxRetriesPerRequest: null,
});

const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "/tmp/ecom-crawler1",
});
const page = await browser.newPage();

await page.goto("https://www.startech.com.bd/mobile-phone", { waitUntil: "networkidle0" });
await page.waitForSelector('.p-item-name a');
// collect product links array
const productLinks = await page.evaluate(() => {
    return [...document.querySelectorAll('.p-item-name a')].map((e) => e.href);
});

console.log(productLinks);

// adding queue to all products link
const myQueue = new Queue("mobile-items", { connection });
for (let productLink of productLinks) {
    myQueue.add(productLink, { url: productLink }, { jobId: productLink });
}
await page.close();
await browser.close();
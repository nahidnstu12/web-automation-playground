import puppeteer from "puppeteer"

(async () => {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    // Set the viewport's width and height
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto('https://duckduckgo.com/');

    // Type into search box
    await page.type('#searchbox_input', 'How to wait for page to load in Puppeteer?');
    await page.click('.searchbox_searchButton__F5Bwq');
    // Wait and click on first result
    const searchResultSelector = 'article#r1-0';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    try {
        await page.waitForSelector('body');
        await page.screenshot({ path: `../data/capture-1.jpg` /*fullPage: true*/ });

    } catch (err) {
        console.log(`Error: ${err.message}`);
    } finally {
        await browser.close();
        console.log(`Screenshot has been captured successfully`);
    }
})();
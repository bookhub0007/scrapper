const puppeteer = require("puppeteer");
const fs = require("fs");

const args = ["UPSC+Books"];
const PAGES = 2;

(async () => {
  // Launch a new browser instance
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Base URL for the initial search
  const baseUrl = "https://www.amazon.in/s?";

  let allProducts = [];
  for (const searchText of args) {
    // Loop to navigate through pages and gather data
    let pageNum = 1;

    while (pageNum <= PAGES) {
      // Set to stop after 20 pages, adjust as needed
      try {
        console.log(`Scraping page ${pageNum}...`);

        // Navigate to the page with the page number in the URL
        await page.goto(`${baseUrl}k=${searchText}&page=${pageNum}`, {
          waitUntil: "domcontentloaded",
        });

        // Wait for products to load on each page
        await page.waitForSelector('[data-cel-widget^="search_result_"]');

        // Extract product details
        const products = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll('[data-cel-widget^="search_result_"]')
          ).map((product) => {
            let author_date = "";
            let author = "Unavalaible";
            let date = "";
            try {
              author_date = product.querySelectorAll(".a-size-base")[0].innerText;
              let split = author_date.split("|");
              author = split[0].trim().substring(2);
              date = split[1].trim()
            } catch (error) {
              console.log(error);
            }
            
            return {
              name:product.querySelector("h2 .a-size-medium")?.innerText,
              discountedPrice: product.querySelector(".a-price .a-offscreen")
                ?.innerText,
              price: product.querySelector(".a-text-price .a-offscreen")
                ?.innerText,
              imageUrl: product.querySelector(".s-image")?.src,
              data_uuid: product.getAttribute("data-uuid"),
              author,
              publicationDate:date
            };
          });
        });
        console.log(`Page ${pageNum} products:`, products);

        // Append this page's products to the main array
        allProducts = allProducts.concat(products);

        pageNum++; // Increment page number for the next loop
      } catch (error) {
        console.error(`Error on page ${pageNum}:`, error);
        break;
      }
    }
  }

  // Save all products to a JSON file
  fs.writeFileSync("products.json", JSON.stringify(allProducts, null, 2));
  console.log("Data saved to products.json");

  // Close the browser
  await browser.close();
})();

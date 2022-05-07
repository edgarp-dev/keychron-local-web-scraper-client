import ConsoleLogger from "./logger/ConsoleLogger";
import HeadlessBrowser from "./web-scrapping/HeadlessBrowser";
import KeycapSetScraper from "./web-scrapping/KeycapSetScraper";
import PaginationScraper from "./web-scrapping/PaginationScraper";

const keycapsUrl: string =
  "https://www.keychron.com/collections/q1-k2-oem-dye-sub-pbt-keycap-set";

async function handler() {
  try {
    const headlessBroswer = new HeadlessBrowser();
    const htmlFromUrl = await headlessBroswer.getHtmlContentFromUrl(keycapsUrl);

    ConsoleLogger.log("Scrapping started");

    const paginationScraper = new PaginationScraper();
    const paginationKeycapsUrls = paginationScraper.getKeycapsUrls(htmlFromUrl);
    paginationKeycapsUrls.forEach(async (keypcapPaginationUrl: string) => {
      ConsoleLogger.log(`Scrapping keycaps from: ${keypcapPaginationUrl}`);
      const htmlFromPaginationKeycapUrl =
        await headlessBroswer.getHtmlContentFromUrl(keypcapPaginationUrl);

      const keycapSetScraper = new KeycapSetScraper(
        htmlFromPaginationKeycapUrl
      );

      ConsoleLogger.log(
        `Saving batch of available keycaps from url: ${keypcapPaginationUrl}`
      );
      const availableKeycaps = keycapSetScraper.getAllAvailableKeycaps();
      ConsoleLogger.log(JSON.stringify(availableKeycaps));

      ConsoleLogger.log(
        `Saving batch of sold out keycaps from url: ${keypcapPaginationUrl}`
      );
      const soldOutKeycaps = keycapSetScraper.getAllSoldOutKeycaps();
      ConsoleLogger.log(JSON.stringify(soldOutKeycaps));
    });

    ConsoleLogger.log("Scrapping finished");
  } catch (error) {
    ConsoleLogger.logError(error.message);
  }
}

handler();

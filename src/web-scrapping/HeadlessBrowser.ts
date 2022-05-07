import * as puppeteer from "puppeteer";
import ConsoleLogger from "../logger/ConsoleLogger";

export default class HeadlessBrowser {
  public async getHtmlContentFromUrl(url: string): Promise<string> {
    const browser = await this.loadBrowser();
    const html = await this.loadHtmlFromUrl(url, browser);
    await browser.close();
    return html;
  }

  private async loadBrowser(): Promise<puppeteer.Browser> {
    ConsoleLogger.log("Loading browser");
    const browser = await puppeteer.launch({ headless: true });
    return browser;
  }

  private async loadHtmlFromUrl(
    url: string,
    browser: puppeteer.Browser
  ): Promise<string> {
    ConsoleLogger.log(`Loading page: ${url}`);
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    const data = await page.evaluate(
      () => document.querySelector("*").outerHTML
    );
    ConsoleLogger.log(`Finished loading page: ${url}`);
    return data;
  }
}


import { CheerioAPI } from 'cheerio';
import * as cheerio from 'cheerio';

export default class WebScraper {
    private cheerioClient: CheerioAPI;

    private constructor(cheerioClient: CheerioAPI) {
        this.cheerioClient = cheerioClient;
    }

    public static loadHtml(htmlContent: string): WebScraper {
        const cheerioClient = cheerio.load(htmlContent);
        return new WebScraper(cheerioClient);
    }

    public find(selector: string): cheerio.Cheerio<any> {
        return this.cheerioClient(selector);
    }
}
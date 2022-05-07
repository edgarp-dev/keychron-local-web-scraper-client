
import WebScraper from "./WebScraper";

export default class PaginationScrapper {
  public getKeycapsUrls(htmlContent: string): string[] {
    const paginationNumberPages = this.getPaginationNumberPages(htmlContent);
    const paginationUrls = this.createPaginationUrls(paginationNumberPages)
    return paginationUrls;
  }

  private getPaginationNumberPages(htmlContent: string): string[] {
    const paginationContainer = WebScraper.loadHtml(htmlContent).find(
      "div .boost-pfs-filter-bottom-pagination ul li"
    );
    
    const paginationItems: string[] = [];
    
    const paginationContent = paginationContainer.children();
    paginationContent.each((i, node: any) => {
      const innerText = node.children[0].data;
      if (this.isNumber(innerText)) {
        paginationItems.push(innerText);
      }
    });

    return paginationItems;
  }

  private isNumber(value: string): boolean {
    const reg = /^\d+$/;
    return reg.test(value);
  }

  private createPaginationUrls(paginationNumerPages: string[]): string[] {
    return paginationNumerPages.map(
      (paginationNumberPage: string) =>
        `https://www.keychron.com/collections/q1-k2-oem-dye-sub-pbt-keycap-set?page=${paginationNumberPage}`
    );
  }
}

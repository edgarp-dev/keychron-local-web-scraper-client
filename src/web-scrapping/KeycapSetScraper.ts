import KeycapSet from "../models/KeycapSet";
import WebScraper from "./WebScraper";

export default class KeycapSetParser {
  private readonly keycapSetHtmlContent: WebScraper;

  constructor(htmlContent: string) {
    this.keycapSetHtmlContent = WebScraper.loadHtml(htmlContent);
  }

  public getAllSoldOutKeycaps(): KeycapSet[] {
    const keycapsSet = this.getAllKeycapSets();
    return keycapsSet.filter(
      (keycapsSet: KeycapSet) => keycapsSet.isAvailable === false
    );
  }

  public getAllAvailableKeycaps(): KeycapSet[] {
    const keycapsSet = this.getAllKeycapSets();
    return keycapsSet.filter((keycapsSet: KeycapSet) => keycapsSet.isAvailable);
  }

  private getAllKeycapSets(): KeycapSet[] {
    const keycapProductIds = this.getKeycapProductIds();
    return keycapProductIds.map((productId: string) =>
      this.getKeycapSet(productId)
    );
  }

  private getKeycapProductIds(): string[] {
    const keycapSetsContainer = this.keycapSetHtmlContent
      .find("div .boost-pfs-filter-products")
      .children();

    const keycapsProductIds: string[] = [];
    keycapSetsContainer.each((i, node: any) => {
      const keycapSetProductId = node.attribs["data-id"] as string;
      keycapsProductIds.push(keycapSetProductId);
    });

    return keycapsProductIds;
  }

  private getKeycapSet(productId: string): KeycapSet {
    const keycapSetName: string = this.keycapSetHtmlContent
      .find(`div[data-id=${productId}] .boost-pfs-filter-product-item-title`)
      .text()
      .trim();

    const keycapSetImage = this.keycapSetHtmlContent.find(
      `div[data-id=${productId}] .boost-pfs-filter-product-item-main-image`
    );
    const keycapSetImageUrl: string = keycapSetImage
      .attr("data-src")
      .replace("{width}", "360");

    const keycapSetNormalPrice: string = this.keycapSetHtmlContent
      .find(
        `div[data-id=${productId}] .boost-pfs-filter-product-item-regular-price`
      )
      .text()
      .trim();

    const keycapSetSalePrice: string = this.keycapSetHtmlContent
    .find(
      `div[data-id=${productId}] .boost-pfs-filter-product-item-sale-price`
    )
    .text()
    .trim();

    const keycapSetPrice = keycapSetSalePrice || keycapSetNormalPrice;

    const isAvailable: boolean =
      this.keycapSetHtmlContent
        .find(`div[data-id=${productId}] .soldout`)
        .text()
        .trim() !== "Sold Out";

    const productHref: string = this.keycapSetHtmlContent
      .find(
        `div[data-id=${productId}] .boost-pfs-filter-product-item-image-link`
      )
      .attr("href");
    const productUrl = `https://www.keychron.com${productHref}`;

    return new KeycapSet(
      productId,
      keycapSetName,
      keycapSetImageUrl,
      keycapSetPrice,
      isAvailable,
      productUrl
    );
  }
}

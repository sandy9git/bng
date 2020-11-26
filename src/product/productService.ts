import { ProductCatalog, CombinedProductCatalog, ProductBarcode, MergedProductCatalog, MatchingProducts } from "./productTypes";

const categoriseProducts = (
  productCatalogA: ProductCatalog[],
  productBarcodesA: ProductBarcode[],
  productBarcodesB: ProductBarcode[],
  source: string
): CombinedProductCatalog => {
  const uniqueProducts: MergedProductCatalog[] = [];
  const matchingProducts: MatchingProducts[] = [];
  productCatalogA.forEach((product) => {
    const productBarcodes = productBarcodesA.filter(
      (productBarcode) => productBarcode.SKU == product.SKU
    );
    const allBarcodesForProductAAreInBarcodesForProductB = productBarcodes.every(
      (productBarcode) =>
        productBarcodesB.some(
          (productBarcodeB) => productBarcodeB.Barcode == productBarcode.Barcode
        )
    );

    if (allBarcodesForProductAAreInBarcodesForProductB) {
      matchingProducts.push({
        SKU: product.SKU,
        Description: product.Description,
        Barcodes: productBarcodes.map(
          (productBarcode) => productBarcode.Barcode
        ),
        Source: source,
      });
    } else {
      uniqueProducts.push({
        SKU: product.SKU,
        Description: product.Description,
        Source: source,
      });
    }
  });
  return { uniqueProducts, matchingProducts };
};

const mergeExactMatchingProducts = (
  matchingProductCatalogA: MatchingProducts[],
  matchingProductCatalogB: MatchingProducts[]
): MergedProductCatalog[] => {
  const mergedProductCatalog: MergedProductCatalog[] = [];
  matchingProductCatalogA.forEach((matchingProductA) => {
    const allBarcodesForProductAAreInBarcodesForProductB = matchingProductA.Barcodes.every(
      (productBarcodeA) =>
        matchingProductCatalogB.some((matchingProductB) =>
          matchingProductB.Barcodes.some(
            (productBarcodeB) => productBarcodeA == productBarcodeB
          )
        )
    );
    if (allBarcodesForProductAAreInBarcodesForProductB) {
      mergedProductCatalog.push({
        SKU: matchingProductA.SKU,
        Description: matchingProductA.Description,
        Source: matchingProductA.Source,
      });
    }
  });
  return mergedProductCatalog;
};

export { categoriseProducts, mergeExactMatchingProducts };
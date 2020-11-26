import { convertCsvFileToJson, convertJsonToCsvFile } from "./data/dataService";
import { ProductBarcode, ProductCatalog, MergedProductCatalog } from './product/productTypes';
import { mergeExactMatchingProducts, categoriseProducts } from "./product/productService";

const inputFolderPath = `${__dirname}/../input`;
const outputFolderPath = `${__dirname}/../`;

export const mergeProductCatalogs = async (inputFolderPath: string) => {
  const productCatalogA: ProductCatalog[] = await convertCsvFileToJson(
    `${inputFolderPath}/catalogA.csv`
  );
  const productBarcodesA: ProductBarcode[] = await convertCsvFileToJson(
    `${inputFolderPath}/barcodesA.csv`
  );
  const productCatalogB: ProductCatalog[] = await convertCsvFileToJson(
    `${inputFolderPath}/catalogB.csv`
  );
  const productBarcodesB: ProductBarcode[] = await convertCsvFileToJson(
    `${inputFolderPath}/barcodesB.csv`
  );

  const catalogA = categoriseProducts(
    productCatalogA,
    productBarcodesA,
    productBarcodesB,
    "A"
  );

  const catalogB = categoriseProducts(
    productCatalogB,
    productBarcodesB,
    productBarcodesA,
    "B"
  );

  const exactMatchingProducts = mergeExactMatchingProducts(
    catalogA.matchingProducts,
    catalogB.matchingProducts
  );

  const mergedProductCatalog: MergedProductCatalog[] = catalogA.uniqueProducts.concat(
    catalogB.uniqueProducts,
    exactMatchingProducts
  );

  const filePath = `${outputFolderPath}result.csv`;
  convertJsonToCsvFile(filePath, mergedProductCatalog);
}

mergeProductCatalogs(inputFolderPath);

  // Algorithm
  // 1. get all barcodes for each product in catalog a
  // 2. if all are available, add the product to matching collection
  // 3. if some are missing in barcode collection b, add product a to unique collection
  // 4. Perform above 3 for each product in catalog b
  // 5. find exact matching list from step 2
  // 6. merge unique products from catalog a, b and exact matching
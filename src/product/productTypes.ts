export interface MergedProductCatalog {
  SKU: string;
  Description: string;
  Source: string;
}

export interface MatchingProducts {
  SKU: string;
  Description: string;
  Barcodes: string[];
  Source: string;
}

export interface CombinedProductCatalog {
  uniqueProducts: MergedProductCatalog[];
  matchingProducts: MatchingProducts[];
}

export interface ProductCatalog {
  SKU: string;
  Description: string;
}

export interface ProductBarcode {
 SupplierID: string;
 SKU: string;
 Barcode: string;
}
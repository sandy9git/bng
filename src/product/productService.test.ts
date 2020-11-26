import { categoriseProducts, mergeExactMatchingProducts } from "./productService";
import { ProductCatalog, ProductBarcode, MatchingProducts } from "./productTypes";

describe("when categorising products", () => {
  describe("and product catalog A and product catalog B have same barcode", () => {
    it("should return only 1 product in matchingProducts and none in uniqueProducts", () => {
      // arrange
      const productCatalogA: ProductCatalog[] = [{
        SKU: '1',
        Description: 'Product 1'
      }];

      const productBarcodesA: ProductBarcode[] = [{
        SupplierID: '1',
        SKU: '1',
        Barcode: 'X'
      }];

      const productBarcodesB: ProductBarcode[] = [{
        SupplierID: '1',
        SKU: '1',
        Barcode: 'X'
      }];

      const expectedResult = {
        matchingProducts: [
          { Barcodes: ["X"], Description: "Product 1", SKU: "1", Source: "A" },
        ],
        uniqueProducts: [],
      };

      // act
      const result = categoriseProducts(
        productCatalogA,
        productBarcodesA,
        productBarcodesB,
        "A"
      );

      // assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe("and product catalog A and product catalog B have different barcodes", () => {
    it("should return only 1 product in uniqueProducts and none in matchingProducts", () => {
      // arrange
      const productCatalogA: ProductCatalog[] = [
        {
          SKU: "1",
          Description: "Product 1",
        },
      ];

      const productBarcodesA: ProductBarcode[] = [
        {
          SupplierID: "1",
          SKU: "1",
          Barcode: "X",
        },
      ];

      const productBarcodesB: ProductBarcode[] = [
        {
          SupplierID: "1",
          SKU: "1",
          Barcode: "Y",
        },
      ];

      const expectedResult = {
        matchingProducts: [],
        uniqueProducts: [
          {
            Description: "Product 1",
            SKU: "1",
            Source: "A",
          },
        ],
      };

      // act
      const result = categoriseProducts(
        productCatalogA,
        productBarcodesA,
        productBarcodesB,
        "A"
      );

      // assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe("and product catalog A has 2 barcodes, one matching with product catalog B and one different", () => {
    it("should return only 1 product in uniqueProducts and none in matchingProducts", () => {
      // arrange
      const productCatalogA: ProductCatalog[] = [
        {
          SKU: "1",
          Description: "Product 1",
        },
      ];

      const productBarcodesA: ProductBarcode[] = [
        {
          SupplierID: "1",
          SKU: "1",
          Barcode: "X",
        },
        {
          SupplierID: "1",
          SKU: "1",
          Barcode: "Y",
        },
      ];

      const productBarcodesB: ProductBarcode[] = [
        {
          SupplierID: "1",
          SKU: "1",
          Barcode: "X",
        },
      ];

      const expectedResult = {
        matchingProducts: [],
        uniqueProducts: [
          {
            Description: "Product 1",
            SKU: "1",
            Source: "A",
          },
        ],
      };

      // act
      const result = categoriseProducts(
        productCatalogA,
        productBarcodesA,
        productBarcodesB,
        "A"
      );

      // assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe("and product catalog A has 1 barcode and B has 2, one matching with product catalog A and one different", () => {
    it("should return only 1 product in matchingProducts and none in uniqueProducts", () => {
      // arrange
      const productCatalogA: ProductCatalog[] = [
        {
          SKU: "1",
          Description: "Product 1",
        },
      ];

      const productBarcodesA: ProductBarcode[] = [
        {
          SupplierID: "1",
          SKU: "1",
          Barcode: "X",
        },
      ];

      const productBarcodesB: ProductBarcode[] = [
        {
          SupplierID: "1",
          SKU: "1",
          Barcode: "X",
        },
        {
          SupplierID: "1",
          SKU: "1",
          Barcode: "Y",
        },
      ];

      const expectedResult = {
        matchingProducts: [
          { Barcodes: ["X"], Description: "Product 1", SKU: "1", Source: "A" },
        ],
        uniqueProducts: [],
      };

      // act
      const result = categoriseProducts(
        productCatalogA,
        productBarcodesA,
        productBarcodesB,
        "A"
      );

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});

describe("when merging exact matching products", () => {
  describe("and matching product catalog A and matching product catalog B have only 1 product", () => {
    it("should return only 1 product", () => {
      // arrange
      const matchingProductCatalogA: MatchingProducts[] = [
        { Barcodes: ["X"], Description: "Product 1", SKU: "1", Source: "A" },
      ];
      const matchingProductCatalogB: MatchingProducts[] = [
        { Barcodes: ["X"], Description: "Product 1", SKU: "1", Source: "B" },
      ];

      // act
      const result = mergeExactMatchingProducts(
        matchingProductCatalogA,
        matchingProductCatalogB
      );

      // assert
      expect(result).toEqual([
        { Description: "Product 1", SKU: "1", Source: "A" },
      ]);
    });
  });

  describe("and matching product catalog A has 1 and matching product catalog B has 2 products", () => {
    it("should return only 1 product", () => {
      // arrange
      const matchingProductCatalogA: MatchingProducts[] = [
        { Barcodes: ["X"], Description: "Product 1", SKU: "1", Source: "A" },
      ];
      const matchingProductCatalogB: MatchingProducts[] = [
        { Barcodes: ["X"], Description: "Product 1", SKU: "1", Source: "B" },
        { Barcodes: ["Y"], Description: "Product 2", SKU: "2", Source: "B" },
      ];

      // act
      const result = mergeExactMatchingProducts(
        matchingProductCatalogA,
        matchingProductCatalogB
      );

      // assert
      expect(result).toEqual([
        { Description: "Product 1", SKU: "1", Source: "A" },
      ]);
    });
  });

  describe("and matching product catalog A has 2 and matching product catalog B has 1 product", () => {
    it("should return only 1 product", () => {
      // arrange
      const matchingProductCatalogA: MatchingProducts[] = [
        { Barcodes: ["X"], Description: "Product 1", SKU: "1", Source: "A" },
        { Barcodes: ["Y"], Description: "Product 2", SKU: "2", Source: "A" },
      ];
      const matchingProductCatalogB: MatchingProducts[] = [
        { Barcodes: ["X"], Description: "Product 1", SKU: "1", Source: "B" }
      ];

      // act
      const result = mergeExactMatchingProducts(
        matchingProductCatalogA,
        matchingProductCatalogB
      );

      // assert
      expect(result).toEqual([
        { Description: "Product 1", SKU: "1", Source: "A" },
      ]);
    });
  });
});
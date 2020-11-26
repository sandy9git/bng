import { mergeProductCatalogs } from "./app";
import * as productService from "./product/productService";
import * as dataService from "./data/dataService";

const mockConvertCsvFileToJson = jest
  .spyOn(dataService, "convertCsvFileToJson")
  .mockImplementation((args) => {
    if (args.includes("catalog")) {
      return Promise.resolve([
        {
          SKU: "1",
          Description: "Product 1",
        },
      ]);
    } else {
      return Promise.resolve([
        {
          SupplierID: "1",
          SKU: "1",
          Barcode: "X",
        },
      ]);
    }
  });

const mockConvertJsonToCsvFile = jest.spyOn(
  dataService,
  "convertJsonToCsvFile"
).mockImplementation();

const mockCategoriseProducts = jest
  .spyOn(productService, "categoriseProducts")
  .mockReturnValue({
    uniqueProducts: [],
    matchingProducts: [
      {
        SKU: "1",
        Description: "Product 1",
        Barcodes: ["X"],
        Source: "A",
      },
    ],
  });

const mockMergeExactMatchingProducts = jest
  .spyOn(productService, "mergeExactMatchingProducts")
  .mockReturnValue([{ SKU: "1", Description: "Product 1", Source: "A" }]);

describe("when merging product catalogs", () => {
  it("should get input from csv files and save mereged output as csv file", async () => {
    
    await mergeProductCatalogs("test");

    expect(mockConvertCsvFileToJson).toHaveBeenCalled();
    
    expect(mockCategoriseProducts).toHaveBeenCalledWith(
      [{ Description: "Product 1", SKU: "1" }],
      [{ Barcode: "X", SKU: "1", SupplierID: "1" }],
      [{ Barcode: "X", SKU: "1", SupplierID: "1" }],
      "A"
    );

    expect(mockCategoriseProducts).toHaveBeenCalledWith(
      [{ Description: "Product 1", SKU: "1" }],
      [{ Barcode: "X", SKU: "1", SupplierID: "1" }],
      [{ Barcode: "X", SKU: "1", SupplierID: "1" }],
      "B"
    );

    expect(mockMergeExactMatchingProducts).toHaveBeenCalledWith(
      [{ Barcodes: ["X"], Description: "Product 1", SKU: "1", Source: "A" }],
      [{ Barcodes: ["X"], Description: "Product 1", SKU: "1", Source: "A" }]
    );

    expect(mockConvertJsonToCsvFile).toHaveBeenCalled();
  });
});

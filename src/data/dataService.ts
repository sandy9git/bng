import { createReadStream, createWriteStream } from "fs";
import { parse } from '@fast-csv/parse';
import { format } from "@fast-csv/format";

export const convertCsvFileToJson =  <T>(filePath: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const rows = [];
    createReadStream(filePath)
      .pipe(parse({ headers: true }))
      .on("error", (error) => reject(error))
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        return resolve(rows);
      });
  });
};

export const convertJsonToCsvFile = (filePath: string, data: Object[]) => {
  const fileWriteStream = createWriteStream(filePath);
  const csvStream = format({ headers: true });
  csvStream.pipe(fileWriteStream);

  data.forEach(dataItem => {
    csvStream.write(dataItem);
  })
  
  csvStream.end();
};

const someVar = undefined;
const express = require('express');
const app = express();
const port = 3000;
const reader = require('xlsx')
const readline = require('readline');
const file = reader.readFile('./readThisFile/Tr7_Virtual_Prices.xlsx')
const fs = require('fs');
let data = []

const sheets = file.SheetNames;

for(let i = 0; i < sheets.length; i++)
{
const temp = reader.utils.sheet_to_json(
		file.Sheets[file.SheetNames[i]])
temp.forEach((res) => {
	data.push(res)
})
}
app.use(express.json());

app.post('/search', (req, res) => {
    const prdCode = req.body.productCode;
    const typ = req.body.type;
    const pltfrm = req.body.platform;
    const lim = req.body.limit;
    const qty = req.body.quantity;
    const lcTime = req.body.licenseTime;
    const edton = req.body.edition;
    const property =req.body.properties;

    const listJSON=[prdCode,typ,pltfrm,lim, qty, lcTime, edton, property];

    const columnNameToSearch = [
        'Ürün Kodu',
        'Tipi',
        'Platform',
        'BW Limit',
        'Ürün Adedi',
        'Lisans Süresi',
        'Edition',
        'Özellikler'
    ]; 
    const columnsToReturn = [
      'Açıklama', 
      'Citrix Fiyatı',
      'TR7 Liste Fiyatı',
      'TR7 Dip Fiyatı'
    ];
  
    const searchResults = searchData(columnNameToSearch, listJSON);
  
    if (searchResults.length === 0) {
      res.status(404).json({ error: 'Data not found' });
    } else {
      const resultColumns = searchResults.map((result) => {
        const extractedColumns = {};
        columnsToReturn.forEach((columnName) => {
          extractedColumns[columnName] = result[columnName];
  
        });
        return extractedColumns;
      });
  
      res.json(resultColumns);
    }
  });
  function searchData(columnNames, queries) {
    const results = [];
    for (const item of data) {
      let match = true;
      for (let i = 0; i < columnNames.length; i++) {
        const columnName = columnNames[i];
        const query = queries[i];
  
        if (columnName && query) {
          if (item[columnName] !== query) {
            match = false;
            break; 
          }
        }
      }
      if (match) {
        results.push(item);
      }
    }
    return results;
  }
  
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });


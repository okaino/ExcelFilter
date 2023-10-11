const someVar = undefined;
const express = require('express');
const cors = require("cors");

const port = 8080;
const app = express();
const reader = require('xlsx')
const readline = require('readline');
const file = reader.readFile('./readThisFile/Tr7_Virtual_Prices.xlsx')
const fs = require('fs');

let data = []
let dataSetup = [];
let dataSupport = [];
let dataEducation = [];


const sheets = file.SheetNames;

for(let i = 0; i < sheets.length; i++)
{
const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);

if (sheets[i] === "VirtualProducts") {
  data = temp;
} else if (sheets[i] === "VirtualProductSetup") {
  dataSetup = temp;
} else if (sheets[i] === "VirtualProductSupport") {
  dataSupport = temp;
} else if (sheets[i] === "education") {
  dataEducation = temp;
}

}

app.use(express.json());
app.use(cors({
  origin: "http://172.16.101.118:8888"
}))
app.post('/search', (req, res) => {
  
    const typ = req.body.type;
    const pltfrm = req.body.platform;
    const lim = req.body.limit;
    const qty = req.body.quantity;
    const lcTime = req.body.license;
    const edton = req.body.edition;
    

    const listJSON=[ typ, pltfrm, lim, qty, lcTime, edton ];

    const columnNameToSearch = [
        'type',
        'platform',
        'bwLimit',
        'pCombination',
        'licenceDuration',
        'edition'
        
    ]; 
    const columnsToReturn = [
      'code',
      'type',
      'platform',
      'bwLimit',
      'pCombination',
      'licenceDuration',
      'edition',
      'modules',
      'desc', 
      'citrixPrice',
      'tr7Price',
      'minPrice'
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
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(resultColumns);
    }
  });

  app.post('/searchVPSetup', (req, res) => {

    const pLim = req.body.limit;
    const lSeries = req.body.edition;
    const lcation = req.body.location;
    const tickets = req.body.ticket;
    

    const listJSON=[ pLim, lSeries, lcation, tickets ];
    console.log(listJSON)  

    
    const columnNameToSearch = [
        'bwLimit',
        'edition',
        'locationInfo'
    ]; 
    const columnsToReturn = [
      'code',
      'type',
      'bwLimit',
      'edition',
      'pcode',
      'location',
      'locationInfo', 
      'onsiteVisit',
      'remoteConnection',
      'desc',
      'tr7Price',
      'minPrice'
    ];

    
    const searchResultsSetup = searchDataVSetup(columnNameToSearch, listJSON);
  


    if (searchResultsSetup.length === 0) {
      res.status(404).json({ error: 'Data not found' });
    } else {
      const resultColumns = searchResultsSetup.map((result) => {
        const extractedColumns = {};
        columnsToReturn.forEach((columnName) => {
          extractedColumns[columnName] = result[columnName];
        });
        
        return extractedColumns;
      });
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(resultColumns);
    }
  });

  app.post('/searchVPEducation', (req, res) => {

    
    const pLim = req.body.limit;
    const lSeries = req.body.edition;    

    const listJSON=[ pLim, lSeries ];
    console.log(listJSON)  


    
    const columnNameToSearch = []; 
    const columnsToReturn= [
      'code',
      'type',
      'location',
      'locationInfo',
      'onsiteVisit',
      'remoteConnection',
      'desc',
      'tr7Price',
      'minPrice'
    ];
  
    const searchResultsEducation = searchDataVEducation(columnNameToSearch, listJSON);

    if (searchResultsEducation.length === 0) {
      res.status(404).json({ error: 'Data not found' });
    } else {
      const resultColumns = searchResultsEducation.map((result) => {
        const extractedColumns = {};
        columnsToReturn.forEach((columnName) => {
          extractedColumns[columnName] = result[columnName];
        });
        
        return extractedColumns;
      });
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(resultColumns);
    }
  });

  app.post('/searchVPSupport', (req, res) => {

    const lDur = req.body.licenceDur;
    const pLim = req.body.limit;
    const lSeries = req.body.edition;
    const lcation = req.body.location;
    

    const listJSON=[ pLim, lSeries, lcation, lDur];

    
    const columnNameToSearch = [
        'bwLimit',
        'edition',
        'locationInfo',
        'licenceDuration'
    ]; 
    const columnsToReturn = [
      'code',
      'type',
      'bwLimit',
      'edition',
      'pcode',
      'location',
      'locationInfo', 
      'onsiteVisit',
      'remoteConnection',
      'desc',
      'tr7Price',
      'minPrice'
    ];

  
    const searchResultsSupport= searchDataVSupport(columnNameToSearch, listJSON);

    if (searchResultsSupport.length === 0) {
      res.status(404).json({ error: 'Data not found' });
    } else {
      const resultColumns = searchResultsSupport.map((result) => {
        const extractedColumns = {};
        columnsToReturn.forEach((columnName) => {
          extractedColumns[columnName] = result[columnName];
        });
        
        return extractedColumns;
      });
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(resultColumns);
    }
  });


  app.get('/type', (req, res) =>{
    const columnNameToSearch = [
      'type'
  ]; 
    const columnComboboxes = {};

  columnNameToSearch.forEach((columnName) => {
    const uniqueValues = [...new Set(data.map((item) => item[columnName]))];
    
    const filteredValues = uniqueValues.filter((value) => value !== undefined && value !== "");

    columnComboboxes[columnName] = filteredValues;
  });

  res.json(columnComboboxes);
  });

  app.get('/platform', (req, res) =>{
    const columnNameToSearch = [
      'platform'
  ]; 
    const columnComboboxes = {};

  columnNameToSearch.forEach((columnName) => {
    const uniqueValues = [...new Set(data.map((item) => item[columnName]))];
    
    const filteredValues = uniqueValues.filter((value) => value !== undefined && value !== "");

    columnComboboxes[columnName] = filteredValues;
  });

  res.json(columnComboboxes);
  });

  app.get('/limit', (req, res) =>{
    const columnNameToSearch = [
      'bwLimit'
  ]; 
    const columnComboboxes = {};

  columnNameToSearch.forEach((columnName) => {
    const uniqueValues = [...new Set(data.map((item) => item[columnName]))];
    
    const filteredValues = uniqueValues.filter((value) => value !== undefined && value !== "");

    columnComboboxes[columnName] = filteredValues;
  });

  res.json(columnComboboxes);
  });

  app.get('/quantity', (req, res) =>{
    const columnNameToSearch = [
      'pCombination'
  ]; 
    const columnComboboxes = {};

  columnNameToSearch.forEach((columnName) => {
    const uniqueValues = [...new Set(data.map((item) => item[columnName]))];
   
    const filteredValues = uniqueValues.filter((value) => value !== undefined && value !== "");

    columnComboboxes[columnName] = filteredValues;
  });

  res.json(columnComboboxes);
  });

  app.get('/license', (req, res) =>{
    const columnNameToSearch = [
      'licenceDuration'
  ]; 
    const columnComboboxes = {};

  columnNameToSearch.forEach((columnName) => {
    const uniqueValues = [...new Set(data.map((item) => item[columnName]))];
   
    const filteredValues = uniqueValues.filter((value) => value !== undefined && value !== "");

    columnComboboxes[columnName] = filteredValues;
  });

  res.json(columnComboboxes);
  });
  
  app.get('/edition', (req, res) => {
    const columnNameToSearch = [
      'edition'
  ]; 
    const columnComboboxes = {};

  columnNameToSearch.forEach((columnName) => {
    const uniqueValues = [...new Set(data.map((item) => item[columnName]))];
    
    const filteredValues = uniqueValues.filter((value) => value !== undefined && value !== "");

    columnComboboxes[columnName] = filteredValues;
  });

  res.json(columnComboboxes);
  });

  app.get('/feature', (req, res) =>{
    const columnNameToSearch = [
      'modules'
  ]; 
    const columnComboboxes = {};

  columnNameToSearch.forEach((columnName) => {
    const uniqueValues = [...new Set(data.map((item) => item[columnName]))];
    
    const filteredValues = uniqueValues.filter((value) => value !== undefined && value !== "");

    columnComboboxes[columnName] = filteredValues;
  });

  res.json(columnComboboxes);
  });

  app.get('/location', (req, res) =>{
    const columnNameToSearch = [
      'locationInfo'
  ]; 
    const columnComboboxes = {};

  columnNameToSearch.forEach((columnName) => {
    const uniqueValues = [...new Set(dataSupport.map((item) => item[columnName]))];
    
    const filteredValues = uniqueValues.filter((value) => value !== undefined && value !== "");

    columnComboboxes[columnName] = filteredValues;
  });

  res.json(columnComboboxes);
  });

  app.get('/ticket', (req, res) =>{
    const columnNameToSearch = [
      'Ticket'
  ]; 
    const columnComboboxes = {};

  columnNameToSearch.forEach((columnName) => {
    const uniqueValues = [...new Set(dataSetup.map((item) => item[columnName]))];
    
    const filteredValues = uniqueValues.filter((value) => value !== undefined && value !== "");

    columnComboboxes[columnName] = filteredValues;
  });

  res.json(columnComboboxes);
  });

  function searchData(columnNames, queries) {
    const results = [];
    for (const item of data) {
      let match = true;
      for (let i = 0; i < columnNames.length; i++) {
        const columnName = columnNames[i];
        const query = queries[i];
        if (columnName && typeof query === 'string' || typeof query === 'number') {
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

  function searchDataVSetup(columnNames, queries) {
    const results = [];
  
    for (const item of dataSetup) {
      let match = true;
      for (let i = 0; i < columnNames.length; i++) {
        const columnName = columnNames[i];
        const query = queries[i];
        const itemValue = item[columnName];

        if (typeof query === 'string' || typeof query === 'number') {
          
          if (itemValue !== query) {
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
  function searchDataVEducation(columnNames, queries) {
    const results = [];
  
    for (const item of dataEducation) {
      let match = true;
      for (let i = 0; i < columnNames.length; i++) {
        const columnName = columnNames[i];
        const query = queries[i];
        const itemValue = item[columnName];

        if (typeof query === 'string' || typeof query === 'number') {
          
          if (itemValue !== query) {
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
  
  function searchDataVSupport(columnNames, queries) {
    const results = [];
  
    for (const item of dataSupport) {
      let match = true;
      for (let i = 0; i < columnNames.length; i++) {
        const columnName = columnNames[i];
        const query = queries[i];
        const itemValue = item[columnName];

        if (typeof query === 'string' || typeof query === 'number') {
          
          if (itemValue !== query) {
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

app.listen(port, '172.16.101.118',() => {
    console.log(`Server is listening at http://172.16.101.118:${port}`);
  });


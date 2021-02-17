const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

let port = 3001;
const app = express();

// server goes here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


let jsonToCsv = (req, res) => {
  let csvData = []
  let csvColumns = [];

  // console.log('REQ in jsontocsv IS', req.body);
  console.log('PARSED IS', JSON.parse(req.body.query));

  let parsedBody = JSON.parse(req.body.query);

  // this sets up the columns for the csv formatted data
  let columns = (obj) => {
    for (let key in obj) {
      if (key !== 'children') {
        csvColumns.push(key);
      }
    }
  }
  columns(parsedBody);
  csvData.push(csvColumns);
  // csvColumns = csvColumns + '\n'; // will have to handle the newline later
  console.log(csvColumns);

  let rows = (obj) => {
    let dataRow = [];

    for (let i = 0; i < csvColumns.length; i++) {
      let k = csvColumns[i];
      dataRow.push(obj[k]);
    }
    console.log('PUSHING ROW', dataRow);
    csvData.push(dataRow);
    if(obj.children.length > 0) {
      for (let j = 0; j < obj.children.length; j++) {
        let child = obj.children[j];
        rows(child);
      }
    }
  }
  rows(parsedBody);
  console.log(csvData);
  let returnStr = csvify(csvData);
  return returnStr;
}

let csvify = (twodArray) => {
  let returnArr = [];

  for (let i = 0; i < twodArray.length; i++) {
    // looking at each row
    let arr = twodArray[i];
    returnArr.push(arr.join(','));
  }
  console.log(returnArr);
  let returnStr = returnArr.join('\n');
  console.log(returnStr);
  return returnStr;
}


app.use(express.static('public'));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, '/index.html'));
// });

app.post('/post_data', (req, res) => {
  let data = jsonToCsv(req, res);
  // in here, we will transform the incoming JSON into a CSV format then return it in the res object (probably)
  res.send(`<!DOCTYPE html>
  <head>
    <title>Client Side CSV sibmission</title>
  </head>
  <body>
    <div>
      <form action="/post_data" method="POST" id="jsonform">
        <input type="textarea" id="query" form="jsonform" name="query">
        <input id="submit" type="submit">
      </form>
    </div>
    <pre>${data}</pre>
    <script src="app.js"></script>
  </body>`);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
})

// csv = comma separated values

// custom middleware


// {
//   "firstName": "Joshie",
//   "lastName": "Wyattson",
//   "county": "San Mateo",
//   "city": "San Mateo",
//   "role": "Broker",
//   "sales": 1000000,
//   "children": [
//   {
//     "firstName": "Beth Jr.",
//     "lastName": "Johnson",
//     "county": "San Mateo",
//     "city": "Pacifica",
//     "role": "Manager",
//     "sales": 2900000,
//     "children": [
//       {
//         "firstName": "Smitty",
//         "lastName": "Won",
//         "county": "San Mateo",
//         "city": "Redwood City",
//         "role": "Sales Person",
//         "sales": 4800000,
//         "children": []
//       },
//       {
//         "firstName": "Allen",
//         "lastName": "Price",
//         "county": "San Mateo",
//         "city": "Burlingame",
//         "role": "Sales Person",
//         "sales": 2500000,
//         "children": []
//       }
//     ]
//   },
//   {
//     "firstName": "Beth",
//     "lastName": "Johnson",
//     "county": "San Francisco",
//     "city": "San Francisco",
//     "role": "Broker/Sales Person",
//     "sales": 7500000,
//     "children": []
//   }
// ]
// }
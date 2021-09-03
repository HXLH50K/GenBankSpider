const express = require("express");
const cheerio = require("cheerio");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const { resolve } = require("path");
const app = express();
app.use(cors());
const upload = multer({
  dest: "./static/upload"
});
app.use(upload.any());

let getHost = function(targetId, api = "https://www.ncbi.nlm.nih.gov/") {
  const idUrl =
    api + "nuccore/" + targetId + "?report=gilist&log$=seqview&format=text";
  let numId = "";
  const promise = new Promise((resolve, reject) => {
    axios
      .get(idUrl)
      .then(resp => {
        let $ = cheerio.load(resp.data);
        numId = $("pre")
          .text()
          .replace(/[\r\n]/g, "");
        let mainUrl = api + "sviewer/viewer.fcgi?id=" + numId;
        return new Promise(resolve => {
          resolve(axios.get(mainUrl));
        });
      })
      .then(resp => {
        let re = new RegExp('/host=".*"');
        let res = resp.data.match(re);
        if (!res) {
          resolve("null");
        } else {
          res = res[0];
          res = res.substring(7, res.length - 1);
          resolve(res);
        }
      })
      .catch(err => {
        let reason = `Failed - ${targetId}: ${err}`;
        reject(reason);
      });
  });
  return promise;
};

findStrIndex = function(str, cha, num) {
  var x = str.indexOf(cha);
  for (var i = 0; i < num; i++) {
    x = str.indexOf(cha, x + 1);
  }
  return x;
};

app.post("/upload", (req, res, next) => {
  let data = fs.readFileSync(req.files[0].path).toString(),
    lines = data.split("\n"),
    gbs = [],
    gb,
    regex = /^[A-Z0-9]{8}\.[0-9]$/,
    start,
    end;
  for (line of lines) {
    start = findStrIndex(line, "|", 3 - 1);
    end = findStrIndex(line, "|", 4 - 1);
    gb = line.substring(start + 1, end);
    if (regex.test(gb)) {
      gbs.push(gb);
    }
  }
  let tableData = [];
  let promiseList = [];
  for (i in gbs) {
    promiseList.push(
      new Promise((resolve, reject) => {
        let gb = gbs[i];
        getHost(gb)
          .then(result => {
            resolve({ gb, result });
          })
          .catch(reason => console.log(reason));
      })
    );
  }
  Promise.all(promiseList).then(respList => {
    respList.map(val => {
      tableData.push(val);
    });
    console.log(tableData);
    res.json(tableData);
  });
});
app.listen(8081, () => console.log("Example app listening on port 8081!"));

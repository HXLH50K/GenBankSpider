const cheerio = require("cheerio");
const axios = require("axios");
const jsonp = require("jsonp");

function getHost(targetId, api = "https://www.ncbi.nlm.nih.gov") {
  api = api + "/";
  const idUrl =
    api + "nuccore/" + targetId + "?report=gilist&log$=seqview&format=text";
  let numId = "";
  const promise = new Promise((resolve, reject) => {
    jsonp
      .get(idUrl)
      .then(resp => {
        let $ = cheerio.load(resp.data);
        numId = $("pre")
          .text()
          .replace(/[\r\n]/g, "");
        let mainUrl = api + "sviewer/viewer.fcgi?id=" + numId;
        let p1 = new Promise(resolve => {
          resolve(jsonp.get(mainUrl));
        });
        return p1;
      })
      .then(resp => {
        let re = new RegExp('/host=".*"');
        let start = resp.data.search(re);
        let end = resp.data.search("/db_xref");
        let result = resp.data
          .substring(start + 6, end)
          .trim()
          .replace(/\"/g, "");
        resolve(result);
      })
      .catch(err => {
        let reason = `Failed - ${targetId}: ${err}`;
        reject(reason);
      });
  });
  return promise;
}
// export { getHost };

let targetId = "KJ001580.1";
getHost(targetId)
  .then(result => {
    console.log(result);
  })
  .catch(reason => console.log(reason));

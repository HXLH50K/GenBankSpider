const cheerio = require("cheerio");
const axios = require("axios");

function getHost(targetId, api = "https://www.ncbi.nlm.nih.gov/") {
  // var api = ;
  // var api = "/api/";
  api = api + "/";
  return new Promise((resolver, reject) => {
    const idUrl =
      api + "nuccore/" + targetId + "?report=gilist&log$=seqview&format=text";
    var numId = "";
    axios
      .get(idUrl)
      .then(resp => {
        let $ = cheerio.load(resp.data);
        numId = $("pre")
          .text()
          .replace(/[\r\n]/g, "");
        let mainUrl = api + "sviewer/viewer.fcgi?id=" + numId;
        return new Promise(resolver => {
          resolver(axios.get(mainUrl));
        });
      })
      .then(resp => {
        var re = new RegExp('/host=".*"');
        var start = resp.data.search(re);
        var end = resp.data.search("/db_xref");
        var result = resp.data
          .substring(start + 6, end)
          .trim()
          .replace(/\"/g, "");
        resolver(result);
      })
      .catch(err => {
        console.log(`Failed - ${targetId}: ${err}`);
      });
  });
}
export { getHost };

// let targetId = "KJ001580.1";
// getHost(targetId).then(result => {
//   console.log(result);
// });

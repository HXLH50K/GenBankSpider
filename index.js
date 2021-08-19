const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')

// const app = express()
// let server = app.listen(3000, function () {
//   let host = server.address().address
//   let port = server.address().port
//   console.log('Your App is running at http://%s:%s', host, port)
// })

// let targetId = 'MG703253.1'
let targetId = 'KJ001580.1'
const idUrl = 'https://www.ncbi.nlm.nih.gov/nuccore/' + targetId + '?report=gilist&log$=seqview&format=text'
var numId = ''
axios
  .get(idUrl)
  .then(resp => {
    let $ = cheerio.load(resp.data)
    numId = $('pre')
      .text()
      .replace(/[\r\n]/g, '')
    let mainUrl = 'https://www.ncbi.nlm.nih.gov/sviewer/viewer.fcgi?id=' + numId
    return new Promise(resolver => {
      resolver(axios.get(mainUrl))
    })
  })
  .then(resp => {
    var re = new RegExp('/host=".*"')
    var start = resp.data.search(re)
    var end = resp.data.search('/db_xref')
    var result = resp.data
      .substring(start + 6, end)
      .trim()
      .replace(/\"/g, '')
    console.log(result)
  })
  .catch(err => {
    console.log(`Failed - ${targetId}: ${err}`)
  })

// app.get('/', async (req, res, next) => {
//   res.send(targetValue)
// })

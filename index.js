const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')

const app = express()
let server = app.listen(3000, function () {
  let host = server.address().address
  let port = server.address().port
  console.log('Your App is running at http://%s:%s', host, port)
})

const urlHost = 'https://www.ncbi.nlm.nih.gov/nuccore/'
let targetId = 'MG703253\\.1'
let targetValue = ''
superagent.get(urlHost + targetId).end((err, res) => {
  if (err) {
    // 如果访问失败或者出错，会这行这里
    console.log(`热点新闻抓取失败 - ${err}`)
  } else {
    // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res
    // 抓取热点新闻数据
    targetValue = getHost(res)
  }
})

let getHost = res => {
  let hotNews = []
  // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。

  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(res.text)
  console.log($('span#feature_' + targetId + '_source_0'))
  // 找到目标数据所在的页面元素，获取数据
  $('span#feature_' + targetId + '_source_0').each((idx, ele) => {
    console.log(idx)
    // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
    // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
    let news = {
      title: $(ele).text(), // 获取新闻标题
      href: $(ele).attr('href') // 获取新闻网页链接
    }
    // hotNews.push(news) // 存入最终结果数组
    hotNews.push(res.text)
  })

  return hotNews
}

app.get('/', async (req, res, next) => {
  res.send(targetValue)
})

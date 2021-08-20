目标功能：给定一个 id 编号（eg：KJ001580.1），从https://www.ncbi.nlm.nih.gov/nuccore/ 获得对应的 host 字段内容（eg：Rhipicephalus microplus）  
样例文件位于 /static/strain-s.tab  
核心爬虫文件位于 /plugin/getHost.mjs

Plan：

- [x] 给定 id，得到对应 host
- [x] 读取文件，解析出文件内多个 ids
- [x] 使用多个 ids 得到对应 hosts
- [x] vue 界面
- [ ] 优化性能
- [ ] 解析按钮防抖

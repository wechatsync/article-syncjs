# 文章同步助手网页SDK
使用本SDK可以从网页端注入文章内容,并拉起同步任务框


## 使用

```html
<!-- css -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wechatsync/article-syncjs@latest/dist/styles.css" />
<script src="https://cdn.jsdelivr.net/gh/wechatsync/article-syncjs@latest/dist/main.js"></script>
```

## API
拉起同步框
```js
window.syncPost({
  title: 'Ractor 下多线程 Ruby 程序指南',
  desc:
    '什么是 Ractor?Ractor 是 Ruby 3 新引入的特性。Ractor 顾名思义是 Ruby 和',
  content: 'hello world',
  thumb:
    'http://mmbiz.qpic.cn/mmbiz_jpg/CJcVm4ThlNOeib5w5A6MYk4Eg9ErnzZ73dEicribs3gPPUB4cCxiaeRm2ZfNOibHfl4TIo8h6VlFZeBRmLoMKgibvPdw/0?wx_fmt=jpeg',
})
```

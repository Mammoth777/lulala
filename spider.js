const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');
const url = 'http://www.xzit.edu.cn/tzgg/list.htm';

function saveFile(data) {
	fs.writeFile('./index.txt', data, 'utf-8', err => {
		if (err) return console.log(err);
	});
}


// 请求数据
http.get(url, res => {
	// 记录html
	let html = '';
	console.log(res.statusCode);
	res.setEncoding('utf-8');
	res.on('data', chunk => {
		html += chunk;
	})
	res.on('end', () => {
		// console.log(html);
		// 已经取得html, 用cheerio解析
		let $ = cheerio.load(html);
		let arr = $('.column-news-item').toArray();
		let resarr = [];
		let res = '';
		arr.forEach(function(ele, i) {
			let item = {
				title: $(`.column-news-item`).eq(i).children().first().text().trim(),
				time: $(`.column-news-item`).eq(i).children().first().next().text().trim(),
				href: 'http://www.xzit.edu.cn' + $(`.column-news-item`).eq(i).attr('href')
			}
			resarr.push(item);
			res += `title : ${item.title}\ntime : ${item.time}\nhref : ${item.href}\n\n`
		});
		
		saveFile(res);
		console.log('ok');
	})

})
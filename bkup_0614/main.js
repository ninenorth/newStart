const http = require('http')
const fs = require('fs');
const qs = require('querystring');
const path = require('path')
const static = require('node-static');
var template = require('./lib/template.js');
var file = new (static.Server)();


const server = http.createServer((req, res) => {

  // Dont know why it causes occasional 404...
  file.serve(req, res);

  if (req.url === '/') {

    let filePath = path.join(__dirname, '/', req.url);
    let extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case 'css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.jpg':
        contentType = 'image/png';
        break;
      case '.js':
        contentType = 'image/jpg';
        break;
    }

    // ============== create LISTs from JSON ==========================================

    fs.readFile(path.join(__dirname, 'data', 'url_list.json'), (err, data) => {
      if (err) {
        console.error('There was an error reading the file!', err);
        console.log(error.code);
      }
      var list_a = '';
      var list_b = '';
      var obj = JSON.parse(data);

      obj.listA.forEach((e, index, elem) => {
        list_a = list_a + ` 
        <li id = "item-${index}">
        <a href="${elem[index].url}" target="blank">${elem[index].title}</a><form name="listA" action="/delurl" method="POST">
        <button name = "listA" type="submit" value = "${index}">del</button></form></li>`
      });

      obj.listB.forEach((e, index, elem) => {
        list_b = list_b + ` 
        <li id = "item-${index}">
        <a href="${elem[index].url}" target="blank">${elem[index].title}</a><form name="listB" action="/delurl" method="POST">
        <button name = "listB" type="submit" value="${index}">del</button></form></li>`
      });

      var html = template.html(list_a, list_b);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(html, 'utf-8');

    });


  }

  // ================= add a LIST from FORM =========================================
  else if (req.url === '/addurl') {
    var body = '';
    req.on('data', (data) => {
      body = body + data;
    });
    req.on('end', () => {

      fs.readFile(path.join(__dirname, 'data', 'url_list.json'), (err, data) => {
        var obj = JSON.parse(data);
        var post = qs.parse(body);

        if (post.linktitle && post.linkurl) {

          console.log(post.linktitle);
          obj.listA.push({ title: post.linktitle, url: post.linkurl })
          var json = JSON.stringify(obj);

          writejsonfile(res, json);

        } else {
          res.writeHead(302, { Location: `/` });
          res.end();
        }

      });
      res.writeHead(302, { Location: `/` });
      res.end();
    });
  }

  // ================= Delete a ITEM from lists =========================================
  else if (req.url === '/delurl') {

    var key, value;
    req.on('data', (data) => {
      var data = String(data);
      var post = qs.parse(data);
      key = Object.keys(post)[0];
      value = Object.values(post)[0];

    });
    req.on('end', () => {

      fs.readFile(path.join(__dirname, 'data', 'url_list.json'), (err, data) => {
        var obj = JSON.parse(data);
        console.log(key + value)
        obj[key].splice(value, 1)
        var json = JSON.stringify(obj);

        writejsonfile(res, json);

      });

      res.writeHead(302, { Location: `/` });
      res.end();
    });
  }

  // ================= Reorder Lists =========================================
  else if (req.url === '/reorder') {
    var body = '';
    var arraylist = [];
    var key, value;
    req.on('data', (data) => {
      var data = String(data);
      var post = qs.parse(data);
      key = Object.keys(post)[0];
      value = Object.values(post)[0];
      body = body + String(data);
      arraylist = key.split(":");
      console.log(arraylist);


    });
    req.on('end', () => {
      fs.readFile(path.join(__dirname, 'data', 'url_list.json'), (err, data) => {
        var obj = JSON.parse(data);
        var newobj = [];
        obj[value].forEach((e, index) => {
          newobj.push(obj[value][arraylist[index]]);
        });
        obj[value] = newobj;

        var json = JSON.stringify(obj);

        writejsonfile(res, json);

      });

      res.writeHead(302, { Location: `/` });
      res.end();

    });
  }


});


//=======PACKAGING function=================================================================

function writejsonfile(res, data) {
  fs.writeFile(path.join(__dirname, 'data', 'url_list.json'), data, function (err) {
    res.writeHead(302, { Location: `/` });
    res.end();
  });
};








const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`server is running${PORT}`));












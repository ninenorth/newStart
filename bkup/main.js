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

    fs.readFile(path.join(__dirname, 'data', 'list_A.json'), (err, data) => {
      if (err) {
        console.error('There was an error reading the file!', err);
        console.log(error.code);
       }
      
      var obj = JSON.parse(data);
      var list = '';
      obj.forEach((e, index, elem) => {
        list = list + ` 
        <li id = "item-${index + 1}">
        <a href="${elem[index].url}" target="blank">${elem[index].title}</a><form action="/delurl" method="POST">
        <button name = "${index + 1}" type="submit" >del</button></form></li>`
      });
      var html = template.html(list);

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(html, 'utf-8');

    });
  } else if (req.url === '/addurl') {

    // ================= add a LIST from FORM =========================================
    var body = '';
    req.on('data', (data) => {
      body = body + data;
    });
    req.on('end', () => {

      fs.readFile(path.join(__dirname, 'data', 'list_A.json'), (err, data) => {
        var obj = JSON.parse(data);
        var post = qs.parse(body);

        if (post.linktitle && post.linkurl) {
           
          console.log(post.linktitle);
          obj.push({ title: post.linktitle, url: post.linkurl })
          var json = JSON.stringify(obj);

          fs.writeFile(path.join(__dirname, 'data', 'list_A.json'), json, function (err) {
            res.writeHead(302, { Location: `/` });
            res.end();
          });
        } else {
          res.writeHead(302, { Location: `/` });
          res.end();
        }

      });
      res.writeHead(302, { Location: `/` });
      res.end();
    });
  } else if (req.url === '/delurl') {

    // ================= Delete a ITEM from lists =========================================
    var itemindex = '';
    req.on('data', (data) => {
      var data = String(data);
      itemindex = data.replace("=", "");

    });
    req.on('end', () => {

      fs.readFile(path.join(__dirname, 'data', 'list_A.json'), (err, data) => {
        var obj = JSON.parse(data);


        itemindex = Number(itemindex) - 1;
        console.log(itemindex);
        var newobj = obj.splice(itemindex, 1)
        var json = JSON.stringify(obj);

        fs.writeFile(path.join(__dirname, 'data', 'list_A.json'), json, function (err) {
           res.writeHead(302, { Location: `/` });
          res.end();
        });

      });


      res.writeHead(302, { Location: `/` });
      res.end();
    });
  } else if (req.url === '/reorder') {


    // ================= Reorder Lists =========================================

    var body = '';
    var arraylist = [];
    req.on('data', (data) => {
      body = body + String(data);
      body = body.replace("=", "");
      arraylist = body.split("%3A")
      console.log(arraylist);

    });
    req.on('end', () => {
      fs.readFile(path.join(__dirname, 'data', 'list_A.json'), (err, data) => {
        var obj = JSON.parse(data);
        var newobj = [];
        obj.forEach((e, index) => {
          newobj.push(obj[arraylist[index] - 1]);
        });
        console.log(newobj)

        var json = JSON.stringify(newobj);

        fs.writeFile(path.join(__dirname, 'data', 'list_A.json'), json, function (err) {
          res.writeHead(302, { Location: `/` });
          res.end();
        });

      });

      res.writeHead(302, { Location: `/` });
      res.end();

    });
  }


});

const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`server is running${PORT}`));












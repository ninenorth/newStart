const http = require('http')
const fs = require('fs');
const qs = require('querystring');
const path = require('path')
const static = require('node-static');
const internalIp = require('ip');
var template = require('./lib/template.js');
var file = new (static.Server)();
var notetxt='';


const server = http.createServer((req, res) => {

  // Dont know why it causes occasional 404...
  file.serve(req, res);
  var myLocaIP = internalIp.address();
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

    // ============== Add Note Box ==========================================
    fs.readFile(path.join(__dirname, 'data', 'note_txt.txt'), (err, data) => {
     notetxt=String(data);
    });


    // ============== create LISTs from JSON ==========================================

    fs.readFile(path.join(__dirname, 'data', 'url_list.json'), (err, data) => {
      if (err) {
        console.error('There was an error reading the file!', err);
        console.log(error.code);
      }
      var list_a = '';
      var list_b = '';
      var list_c = '';
      var list_d = '';

      var obj = JSON.parse(data);
     
      list_a = appendItem(obj, 'listA', list_a);
      list_b = appendItem(obj, 'listB', list_b);
      list_c = appendItem(obj, 'listC', list_c);
      list_d = appendItem(obj, 'listD', list_d);
      
      var html = template.html(list_a, list_b, list_c, list_d, notetxt, myLocaIP);
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
        console.log(post.listtogo);
        if (post.linktitle && post.linkurl) {
          
          obj[post.listtogo].push({ title: post.linktitle, url: post.linkurl });

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
    var arraylist = [];
    var key, value;

    req.on('data', (data) => {
      var data = String(data);
      var post = qs.parse(data);
      key = Object.keys(post)[0];
      value = Object.values(post)[0];
      arraylist = key.split(":");

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
  
    // ================= Append Lists =========================================
  else if (req.url === '/appendnote') {

 
  var key, value;
    req.on('data', (data) => {
     var post = qs.parse(String(data));
     key = Object.keys(post)[0];
     value = Object.values(post)[0];
    });
    req.on('end', () => {

        fs.writeFile(path.join(__dirname, 'data', 'note_txt.txt'), value, function (err) {
          res.writeHead(302, { Location: `/` });
          res.end();
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

function appendItem(obj, listname, listdata ){
  obj[listname].forEach((e, index, elem) => {
    listdata = listdata + ` 
    <li id = "item-${index}">
    <a href="${elem[index].url}" target="_blank">${elem[index].title}<form class="deletebutton" name="${listname}" action="/delurl" method="POST">
    <button name = "${listname}" type="submit" value = "${index}" class="delbtn"></button></form></a></li>`
  });
  return listdata;
};


const PORT = process.env.PORT || 3300;
server.listen(PORT, () => console.log(`server is running${PORT}`));












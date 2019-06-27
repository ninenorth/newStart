var template = {
  html: function (listA, listB) {
    return `
      <html>
      <head>
          <meta charset="UTF-8">
          <title>NNTH start</title>
          <link rel="stylesheet" href="./style.css">
        </head>
      <body>
          <form id ="linkform" action="/addurl"  method="POST" >
              <div>
                  <input type="text" name="linktitle">
                  <input type="text" name="linkurl">
                  <input type="submit" value="addlink" >
               </div>
          </form>
          <div class="container">

          <div>
          <ul id="list-1" class="sortable">
              ${listA}
           </ul>
           <form id="reorder" action="/reorder" method="POST" >
           <button value="listA" id="sbtn-1" type="submit" form="reorder" formaction="/reorder" formmethod="POST" >reorder</button>
           </form>
           </div>


           <div>
           <ul id="list-2" class="sortable">
               ${listB}
            </ul>
            <form id="reorder" action="/reorder" method="POST">
            <button value="listB"  id="sbtn-2" type="submit" form="reorder" formaction="/reorder" formmethod="POST" >Reorder</button>
            </form>
            </div>


          </div>
          
          <script  src="./sortable.js"></script>
         
       </body>
      </html>
      `;
  },

  list: function (title, url, filelist) {
    var list = '<ul>';
    var i = 0;
    while (i < filelist.length) {
      list = list + `<li><a href="${url}" target="blank">${title}</a></li>`
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  }

}

module.exports = template;
var template = {
  html: function (listA, listB, listC, listD, note, myIP) {
    return `
      <html>
      <head>
          <meta charset="UTF-8">
          <title>NNTH start</title>
          <link rel="stylesheet" href="./public/style.css">
          <link href="https://fonts.googleapis.com/css?family=Barlow+Semi+Condensed:100,200,300,400,500,600,700,800,900|Barlow:100,200,300,400,500,600,700,800,900&display=swap" rel="stylesheet">
        </head>
      <body>
  
     <div class="header">
           
          <form id ="linkform" action="/addurl"  method="POST" >
          <u id="Nlogo">NNTH</u>
                <select name="listtogo">
                  <option value="listA"> a</option>
                  <option value="listB"> b</option>
                  <option value="listC"> c</option>
                  <option value="listD"> d</option>
                 </select>
                  <input type="text" name="linktitle" placeholder="title" style="width:130px;" autocomplete="off">
                  <input type="text" name="linkurl" placeholder="url" style="width:300px;" autocomplete="off">
                  <input type="submit" id="addbtn" value="add" >
                  <u id="myIP">${myIP}</u>
          </form>
          </div>
          <div class="container">

          
          <div>
          <form id="reorder" action="/reorder" method="POST" >
          <button value="listA" id="sbtn-1" type="submit" form="reorder" formaction="/reorder" formmethod="POST" class="circle">save</button>
          </form>
          <ul id="list-1" class="sortable">
              ${listA}
           </ul>
           </div>

           
           <div>
           <form id="reorder" action="/reorder" method="POST">
           <button value="listB"  id="sbtn-2" type="submit" form="reorder" formaction="/reorder" formmethod="POST" class="circle">save</button>
           </form>
           <ul id="list-2" class="sortable">
               ${listB}
            </ul>
            </div>


            <div>
            <form id="reorder" action="/reorder" method="POST">
            <button value="listC"  id="sbtn-3" type="submit" form="reorder" formaction="/reorder" formmethod="POST" class="circle">save</button>
            </form>
            <ul id="list-3" class="sortable">
                ${listC}
             </ul>
             </div>


             <div>
             <form id="reorder" action="/reorder" method="POST">
             <button value="listD"  id="sbtn-4" type="submit" form="reorder" formaction="/reorder" formmethod="POST"  class="circle">save</button>
             </form>
             <ul id="list-4" class="sortable">
                 ${listD}
              </ul>
              </div>

               <div>
                
                <form action="/appendnote" method="POST" >
                <button type="submit" class="notebtn">note</button>
                <textarea name="nostesbox"  class = "notesbox" rows="50" cols="30" spellcheck="false">
${note}
                </textarea>
                </form>
                   
               </div>



          </div>
          
          <script  src="./sortable.js"></script>
         
       </body>
      </html>
      `;
  }
}

module.exports = template;
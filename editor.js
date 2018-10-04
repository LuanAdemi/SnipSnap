const {
    ipcRenderer
} = require('electron')
const low = require('lowdb')
const signale = require('signale')
const FileSync = require('lowdb/adapters/FileSync')
adapter = new FileSync('db.json')
db = low(adapter)

window.onload = function() {
    getSnippets()
}

function getSnippets() {
    signale.await("Getting all Snippets...")
    var sinppetcount = db.get('count.count').value()
    for(i=0;i<sinppetcount;i++) {
        var snippetname = db.get('snippets').find({
            id: i + 1
        }).value().title
        var list = document.getElementById("list")
        var elem = document.createElement("li")
        var div = document.createElement("div")
        div.style.color = "#24D4F8"
        div.style.fontSize = "20px"
        div.innerHTML = "<strong>" + snippetname + "</strong>"
        elem.classList.add("list-group-item")
        elem.name = "snippet," +  (i + 1)
        div.name = "snippet," +  (i + 1)
        elem.appendChild(div)
        list.appendChild(elem)

    }
}

window.onclick = e => {
    //signale.log(e.target.name)
    if(e.target.name == undefined){

    }else if(e.target.name.includes("snippet")) {
        var splitstring = e.target.name.split(",")
        var id = splitstring[1]
        //signale.log(id)
        displaySnippetEditor(id)
    } else if(e.target.name.includes("codefield")) {
        var splitstring = e.target.name.split(",")
        var id = splitstring[1]
        
    } else {

    }
}

function displaySnippetEditor(id) {
    var pane = document.getElementById("pane")
    pane.innerHTML = ""
    var title = db.get('snippets').find({
        id: parseInt(id)
    }).value().title
    var code = db.get('snippets').find({
        id: parseInt(id)
    }).value().code
    var heading = document.createElement("h2")
    heading.textContent = title
    heading.style.color = "#24D4F8"
    heading.style.marginLeft = "5%"
    heading.style.zIndex = 0
    var language = db.get('snippets').find({
        id: parseInt(id)
    }).value().language
    var codefield = document.createElement("code")
    codefield.innerHTML = code.replace(/\n/g, "<br/>");
    codefield.classList.add(language)
    codefield.name = "codefield" + id
    //signale.log(code)
    hljs.highlightBlock(codefield)
    pane.appendChild(heading)
    pane.appendChild(codefield)
}


function blurScreen(state) {
    var pane = document.getElementById("pane")
    var blurdiv = document.createElement("div")
    blurdiv.style.color = "black"
    blurdiv.style.width = "100%"
    blurdiv.style.height = "100%"
    blurdiv.style.zIndex = 1
    blurdiv.style.position = "absolute"
    blurdiv.style.top = 0
    blurdiv.style.left = 0
    pane.appendChild(blurdiv)
    if (state == true) {
        
    } else {
        pane.aremoveChild(blurdiv)
    }
    
}
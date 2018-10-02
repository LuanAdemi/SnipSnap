/* 
An mich:

Um tags hinzuzufügen 

var currenttags = db.get('snippets').find({id: id}).value().tags
var tag = input von text input
var updatedtag = currenttags + tag
db.get('snippets')
  .find({ id: id })
  .assign({ tags: updatedtag})
  .write()

  ---> Bitte im Editor impementiren!




*/


const {
    ipcRenderer
} = require('electron')
const low = require('lowdb')
const signale = require('signale')
const FileSync = require('lowdb/adapters/FileSync')
var adapter = undefined
var db = undefined
var elem = undefined
var searchinput = undefined
var css = 'div elem:hover{ background-color: #00ff00 }';
var style = document.createElement('style');
const {clipboard} = require('electron')
var buttons = []

adapter = new FileSync('db.json')
db = low(adapter)

document.getElementById("header").hidden = true
ipcRenderer.on('windowisfocused', () => {
    removeAnimatedClass(false);
    showMainScreen();
})
ipcRenderer.on('windowisnotfocused', () => {
    removeAnimatedClass(true);
    document.getElementById("main").innerHTML = ""
})


function removeAnimatedClass(remove) {
    if (remove == true) {
        document.getElementById("header").hidden = true
        document.getElementById("header").classList.remove("animated")
        document.getElementById("header").classList.remove("fadeIn")
        document.getElementById("main").hidden = true
        document.getElementById("main").classList.remove("animated")
        document.getElementById("main").classList.remove("fadeIn")
        document.getElementById("footer").hidden = true
        document.getElementById("footer").classList.remove("animated")
        document.getElementById("footer").classList.remove("fadeIn")
    } else {
        document.getElementById("header").hidden = false
        document.getElementById("header").classList.add("animated")
        document.getElementById("header").classList.add("fadeIn")
        document.getElementById("main").hidden = false
        document.getElementById("main").classList.add("animated")
        document.getElementById("main").classList.add("fadeIn")
        document.getElementById("footer").hidden = false
        document.getElementById("footer").classList.add("animated")
        document.getElementById("footer").classList.add("fadeIn")
    }
}

document.getElementById("input").onkeyup = function () {
    search();
}


function search() {
    var sinppetcount = db.get('count.count').value()
    searchinput = document.getElementById("input")
    document.getElementById("main").innerHTML = ""
    for (i = 0; i < sinppetcount; i++) {
        searchsnippet = db.get('snippets').find({
            id: i + 1
        }).value().title
        if (searchsnippet.toLowerCase().includes(searchinput.value.toLowerCase())) {
            var id = i
            for (t = 0; t < sinppetcount; t++) {
                if (t == id) {
                    var currentsnippet = db.get('snippets').find({
                        id: id + 1
                    }).value()
                    elem = document.createElement('div');
                    elem.innerHTML = "<div>" + currentsnippet.title + "</div>"
                    elem.style.cssText = 'width:95%;height:100px;background:#151B26;margin-left:2.5%;margin-top:10px;color:#24D4F8;line-height:30px;text-indent: 10px;float-left;';
                    document.getElementById("main").appendChild(elem);
                    var copybutton = document.createElement("button")
                    copybutton.classList.add("button" + i)
                    copybutton.name = i +1
                    copybutton.innerHTML = `<img src='copy.png' width='20px' style='pointer-events: none; name='${copybutton.name}'>`
                    copybutton.style.cssText = "float:right;border:0px solid;background-color:#24D4F8;color:151B26;width:80px;height:40px;cursor:pointer;border-radius:10px;margin-right:10px;margin-bottom:10px;"
                    buttons.push(copybutton)
                    elem.appendChild(copybutton)
                    var tags = currentsnippet.tags.split(',');
                    var tagcolors = currentsnippet.colors.split(',');
                    for (e = 0; e < tags.length; e++) {
                        var tagdiv = document.createElement('div');
                        tagdiv.style.cssText = "position:relative;display:inline-block;text-indent:0px;border-radius:50px;min-width:40px;text-align:center;height:30px;margin-left:10px;margin-top:25px;"
                        tagdiv.style.backgroundColor = tagcolors[e]
                        tagdiv.style.color = "white"
                        tagdiv.innerHTML = '<a style="padding-left:10px;padding-right:10px;">' + tags[e] + '</a>'
                        elem.appendChild(tagdiv)
                       
                        
                        
                    }
                }

            }
        }
    }
    if (searchinput.value == "") {
        document.getElementById("main").innerHTML = ""
        showMainScreen();
    }



}

function showMainScreen() {
    document.getElementById("main").innerHTML = ""
    adapter = new FileSync('db.json')
    db = low(adapter)
    var sinppetcount = db.get('count.count').value()
    signale.debug('Got', sinppetcount, 'Snippets');
    if (sinppetcount == 0) {
        document.getElementById("main").innerHTML = '<img src="space.png" width="100%" style="-webkit-user-drag: none">'
    }
    for (i = 0; i < sinppetcount; i++) {
        var currentsnippet = db.get('snippets').find({
            id: i + 1
        }).value()
        var tags = currentsnippet.tags.split(',');
        var tagcolors = currentsnippet.colors.split(',');
        elem = document.createElement('div');
        elem.style.cssText = ""
        elem.innerHTML = "<div>" + currentsnippet.title + "</div>"
        elem.style.cssText = 'width:95%;height:100px;background:#151B26;margin-left:2.5%;margin-top:10px;color:#24D4F8;line-height:30px;text-indent: 10px;float-left;';
        document.getElementById("main").appendChild(elem);
        var copybutton = document.createElement("button")
            copybutton.classList.add("button" + i)
            copybutton.name = i +1
            copybutton.innerHTML = `<img src='copy.png' width='20px' style='pointer-events: none; name='${copybutton.name}'>`
            copybutton.style.cssText = "float:right;border:0px solid;background-color:#24D4F8;color:151B26;width:80px;height:40px;cursor:pointer;border-radius:10px;margin-right:10px;margin-bottom:10px;"
            buttons.push(copybutton)
        
        elem.appendChild(copybutton)
        for (t = 0; t < tags.length; t++) {
            var tagdiv = document.createElement('div');
            tagdiv.style.cssText = "position:relative;display:inline-block;text-indent:0px;border-radius:50px;min-width:40px;text-align:center;height:30px;margin-left:10px;margin-top:25px;"
            tagdiv.style.backgroundColor = tagcolors[t]
            tagdiv.style.color = "white"
            tagdiv.innerHTML = '<a style="padding-left:10px;padding-right:10px;">' + tags[t] + '</a>'
            
            elem.appendChild(tagdiv)
           
            
            
        }
    }
    
}

function quit() {
    ipcRenderer.send("quit")
}

window.onclick = e => {
    var clickedelement = e.target
    if (clickedelement.tagName == "BUTTON" || clickedelement.tagName == "IMG"){
        //signale.log(clickedelement.name)
        var text = db.get('snippets').find({id: parseInt(clickedelement.name)}).value()
        //signale.log(text)
        clipboard.writeText(text.code)
        
        document.getElementById("copied").classList.remove("fadeOut")
        document.getElementById("copied").hidden = false
        document.getElementById("copied").classList.add("animated")
        document.getElementById("copied").classList.add("fadeIn")
        var audio = new Audio('pling.mp3');
        audio.play();
        setTimeout(function(){
            document.getElementById("copied").classList.remove("fadeIn")
            document.getElementById("copied").classList.add("fadeOut")

        }, 2000);
       
        
        
    }
} 


        


// ==UserScript==
// @name         Sigil Max Crafting
// @namespace    http://tampermonkey.net/
// @version      v1.5
// @description  allows you to mass craft any item in the game, besides b-sides
// @author       MangoKitten
// @match        https://cubecollector.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cubecollector.net
// @grant        none
// ==/UserScript==


// SETTINGS
let totalaccentcolor = "#03FCDB"
let maxmult = 1.5


// declaration of variables
let iterationnum = 0
let iterationmax = 0
let sigilinterval
let matqtys = [0,0,0,0,0]
let currentmulti = 0
let currentcrafted = 0
let currentattempts = 0
let maxattempts = 0

// declaration of elements
const sigilcraftinput = document.createElement('input');
sigilcraftinput.id = 'crafting-input';
sigilcraftinput.type = "number"
sigilcraftinput.value = "1"
sigilcraftinput.style.marginLeft = '10px';
sigilcraftinput.min = "1"
sigilcraftinput.max = "1000"
sigilcraftinput.style.fontSize = ".8em"
sigilcraftinput.style.color = "var(--accentcolor)"
sigilcraftinput.style.background = "url(/JackpotBGS/Black.png)"
sigilcraftinput.style.opacity = "0.7"

const sigilcraftbutton = document.createElement('button');
sigilcraftbutton.id = 'crafting-button'
sigilcraftbutton.style.marginLeft = '10px';
sigilcraftbutton.innerHTML = "Mass-Craft!"
sigilcraftbutton.style.borderRadius = "10px"
sigilcraftbutton.style.fontSize = ".8em"
sigilcraftbutton.style.color = "var(--accentcolor)"
sigilcraftbutton.style.background = "var(--basecolor)"


const sigilcraftmessage = document.createElement('div');
sigilcraftmessage.id = "sigil-craft-toast"
sigilcraftmessage.classList = "toastnotification info"
sigilcraftmessage.style.color = "var(--messageinfo)"
sigilcraftmessage.style.zIndex = "9999"
sigilcraftmessage.style.position = "absolute"
sigilcraftmessage.style.top = "30%"
sigilcraftmessage.style.left = "15px"

const sigilcraftmessagetopne = document.createElement('div');
sigilcraftmessagetopne.id = "sigil-craft-toast-top-ne"
sigilcraftmessagetopne.classList = "toastnotifheader"
sigilcraftmessagetopne.innerHTML = "<span class=\"material-symbols-outlined\" style=\"color: var(--messageinfo);\">chevron_right</span> Your selection is out of range \(1-1000\)!"

const sigilcraftmessagetopesc = document.createElement('div');
sigilcraftmessagetopesc.id = "sigil-craft-toast-top-esc"
sigilcraftmessagetopesc.classList = 'toastnotifheader'
sigilcraftmessagetopesc.innerHTML = "<span class=\"material-symbols-outlined\" style=\"color: var(--messageinfo);\">chevron_right</span> Press Escape 3 times to end the script early!"

const sigilcraftmessagetopbroke = document.createElement('div');
sigilcraftmessagetopbroke.id = "sigil-craft-toast-top-broke"
sigilcraftmessagetopbroke.classList = 'toastnotifheader'
sigilcraftmessagetopbroke.innerHTML = "<span class=\"material-symbols-outlined\" style=\"color: var(--messageinfo);\">chevron_right</span> Youre too BROKE, so it stopped crafting!"


// parses a number with commas! taken from https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


function clearToast() {
    if (document.getElementById("sigil-craft-toast")) {
        try {
            document.getElementById("sigil-craft-toast-top-ne").remove()
        } catch (err) { }
        try {
            document.getElementById("sigil-craft-toast-top-esc").remove()
        } catch (err) { }
        try {
            document.getElementById("sigil-craft-toast-top-broke").remove()
        } catch (err) { }
        try {
            document.getElementById("sigil-craft-toast").remove()
        } catch (err) { }
    }
}

function throwToastNe() {
    clearToast()
    setTimeout( function () {
        document.body.appendChild(sigilcraftmessage)
        document.getElementById("sigil-craft-toast").appendChild(sigilcraftmessagetopne)
        setTimeout( function () {
            try {
                document.getElementById("sigil-craft-toast-top-ne").remove()
            } catch (err) { }
            try {
                document.getElementById("sigil-craft-toast-top-esc").remove()
            } catch (err) { }
            try {
                document.getElementById("sigil-craft-toast-top-broke").remove()
            } catch (err) { }
            try {
                document.getElementById("sigil-craft-toast").remove()
            } catch (err) { }
        }, 5000)
    }, 200)
}
function throwToastEsc() {
    clearToast()
    setTimeout( function () {
        document.body.appendChild(sigilcraftmessage)
        document.getElementById("sigil-craft-toast").appendChild(sigilcraftmessagetopesc)
        setTimeout( function () {
            try {
                document.getElementById("sigil-craft-toast-top-ne").remove()
            } catch (err) { }
            try {
                document.getElementById("sigil-craft-toast-top-esc").remove()
            } catch (err) { }
            try {
                document.getElementById("sigil-craft-toast-top-broke").remove()
            } catch (err) { }
            try {
                document.getElementById("sigil-craft-toast").remove()
            } catch (err) { }
        }, 5000)
    }, 200)
}
function throwToastBroke() {
    clearToast()
    setTimeout( function () {
        document.body.appendChild(sigilcraftmessage)
        document.getElementById("sigil-craft-toast").appendChild(sigilcraftmessagetopbroke)
        setTimeout( function () {
            try {
                document.getElementById("sigil-craft-toast-top-ne").remove()
            } catch (err) { }
            try {
                document.getElementById("sigil-craft-toast-top-esc").remove()
            } catch (err) { }
            try {
                document.getElementById("sigil-craft-toast-top-broke").remove()
            } catch (err) { }
            try {
                document.getElementById("sigil-craft-toast").remove()
            } catch (err) { }
        }, 5000)
    }, 200)
}

function testCurrentCrafted() {
    currentcrafted = Number(document.getElementsByClassName("popupheader")[0].children[0].innerHTML.slice(2))
}

function bootScript() {
    iterationmax = Number(document.getElementById("crafting-input").value)
    if (iterationmax > 0 && iterationmax < 1001) {
        maxattempts = Math.round(iterationmax*maxmult)
        currentcrafted = 0
        currentattempts = 0
        throwToastEsc()
        iterationnum = 0
        document.getElementById("crafting-button").remove()
        sigilinterval = setInterval( function () {
            if (document.getElementsByClassName("crccrtext")[0]) {
                throwToastBroke()
                clearInterval(sigilinterval)
                document.getElementsByClassName("craftingrecipename")[0].appendChild(sigilcraftbutton)
            } else {
                iterationnum = iterationnum + 1
                currentattempts = currentattempts + 1
                if (iterationnum > iterationmax) {
                    testCurrentCrafted()
                    if (currentcrafted >= maxattempts || currentattempts > maxattempts || currentcrafted >= iterationmax) {
                        console.log("success")
                        clearInterval(sigilinterval)
                        document.getElementsByClassName("craftingrecipename")[0].appendChild(sigilcraftbutton)
                    } else {
                        clearInterval(sigilinterval)
                        bootOverMax()
                    }
                } else {
                    document.getElementsByClassName("craftingrecipeconfirmbutton greenbutton")[0].click();
                    setTimeout( function () {
                        document.getElementsByClassName("craftingcountdowncancel greenbutton")[0].click();
                    }, 50)
                }
            }
        }, 350)
    } else {
        throwToastNe()
    }
}

function bootOverMax() {
    console.log("Over max!")
    sigilinterval = setInterval( function () {
        testCurrentCrafted()
        if (currentcrafted >= maxattempts || currentattempts > maxattempts || currentcrafted >= iterationmax) {
            clearInterval(sigilinterval)
            document.getElementsByClassName("craftingrecipename")[0].appendChild(sigilcraftbutton)
        } else {
            console.log(`Over min attempts, but not reached goal! Data: ${currentattempts}/${maxattempts}, ${currentcrafted}/${iterationmax}`)
            document.getElementsByClassName("craftingrecipeconfirmbutton greenbutton")[0].click();
            setTimeout( function () {
                document.getElementsByClassName("craftingcountdowncancel greenbutton")[0].click();
            }, 50)
        }
    }, 500);
}

function checkInputMenu() {
    if (matqtys[0] == 0) {
        matqtys = [0,0,0,0,0]
        matqtys[0] = Number(document.getElementsByClassName("craftingmaterialitemqualityamount")[0].innerHTML.replace("x","").replace(",",""))
        try {
            matqtys[1] = Number(document.getElementsByClassName("craftingmaterialitemqualityamount")[1].innerHTML.replace("x","").replace(",",""))
            matqtys[2] = Number(document.getElementsByClassName("craftingmaterialitemqualityamount")[2].innerHTML.replace("x","").replace(",",""))
            matqtys[3] = Number(document.getElementsByClassName("craftingmaterialitemqualityamount")[3].innerHTML.replace("x","").replace(",",""))
        } catch (err) { }
        try {
            matqtys[4] = Number(document.getElementsByClassName("craftingcurrencyputquantity")[0].innerHTML.replace("x","").replace(",",""))
        } catch (err) { }
    }
    if (matqtys[0] > 0) {
        currentmulti = matqtys[0] * Number(document.getElementById("crafting-input").value)
        document.getElementsByClassName("craftingmaterialitemqualityamount")[0].innerHTML = `<font style=\"color:${totalaccentcolor}\">\(x${numberWithCommas(currentmulti)}\)</font><br>x${numberWithCommas(matqtys[0])}`
    }
    if (matqtys[1] > 0) {
        currentmulti = matqtys[1] * Number(document.getElementById("crafting-input").value)
        document.getElementsByClassName("craftingmaterialitemqualityamount")[1].innerHTML = `<font style=\"color:${totalaccentcolor}\">\(x${numberWithCommas(currentmulti)}\)</font><br>x${numberWithCommas(matqtys[1])}`
    }
        if (matqtys[2] > 0) {
            currentmulti = matqtys[2] * Number(document.getElementById("crafting-input").value)
            document.getElementsByClassName("craftingmaterialitemqualityamount")[2].innerHTML = `<font style=\"color:${totalaccentcolor}\">\(x${numberWithCommas(currentmulti)}\)</font><br>x${numberWithCommas(matqtys[2])}`
    }
        if (matqtys[3] > 0) {
            currentmulti = matqtys[3] * Number(document.getElementById("crafting-input").value)
            document.getElementsByClassName("craftingmaterialitemqualityamount")[3].innerHTML = `<font style=\"color:${totalaccentcolor}\">\(x${numberWithCommas(currentmulti)}\)</font><br>x${numberWithCommas(matqtys[3])}`
    }
        if (matqtys[4] > 0) {
            currentmulti = matqtys[4] * Number(document.getElementById("crafting-input").value)
            document.getElementsByClassName("craftingcurrencyputquantity")[0].innerHTML = `<font style=\"color:${totalaccentcolor}\">\(x${numberWithCommas(currentmulti)}\)</font><br>x${numberWithCommas(matqtys[4])}`
    }
    }


    setInterval( function () {
        if (document.getElementById("crafting-input")) {
        } else {
            if (document.getElementsByClassName("craftingrecipename")[0]) {
                if (document.getElementsByClassName("craftingrecipename")[0].innerHTML.includes("Craft B-Side")) {
                } else {
                    document.getElementsByClassName("craftingrecipename")[0].appendChild(sigilcraftinput)
                    sigilcraftinput.addEventListener("keyup", function (e) {
                        checkInputMenu()
                    });
                    document.getElementsByClassName("craftingrecipename")[0].appendChild(sigilcraftbutton)
                    sigilcraftbutton.addEventListener("click", function (e) {
                        bootScript();
                    });
                }
            }
        }
    }, 500)

    setInterval( function () {
        if (document.getElementsByClassName("craftingrecipename")[0]) {
            checkInputMenu()
        } else {
            matqtys = [0,0,0,0,0]
        }
    }, 200)

    // inspired by trevor project, stolen from https://stackoverflow.com/questions/71574648/how-to-check-if-escape-key-has-been-pressed-3-times-like-the-trevor-project-web
    window.addEventListener("keydown", checkKeyPressed, false);
    let escapeTimerHandle = 0;
    let escapeCount = 0;
    function checkKeyPressed(evt) {
        if (evt.key === "Escape" || evt.key === "Esc") {
            clearTimeout(escapeTimerHandle);
            escapeCount++;
            if (escapeCount == 3) {
                clearInterval(sigilinterval)
                document.getElementsByClassName("craftingrecipename")[0].appendChild(sigilcraftbutton)
            } else {
                escapeTimerHandle = setTimeout(function(){
                    escapeCount = 0;
                }, 1000);
            }
        }
    }


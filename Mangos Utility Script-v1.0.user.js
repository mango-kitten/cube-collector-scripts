// ==UserScript==
// @name         Mangos Utility Script
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  contains various functions for help when scripting. please read the comments to see what each block does.
// @author       MangoKitten
// @match        https://cubecollector.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cubecollector.net
// @grant        none
// ==/UserScript==


// creating simple toast notifications, found in Sigil Max Crafting, by MangoKitten
const customtoastmessage = document.createElement('div');
customtoastmessage.id = "sigil-craft-toast"
customtoastmessage.classList = "toastnotification info"
customtoastmessage.style.color = "var(--messageinfo)"
customtoastmessage.style.zIndex = "9999"
customtoastmessage.style.position = "absolute"
customtoastmessage.style.top = "30%" // adjust me to change the vertical position of your toast message
customtoastmessage.style.left = "15px"

const customtoastmessagetopTEXTHERE = document.createElement('div');
customtoastmessagetopTEXTHERE.id = "sigil-craft-toast-top-IDHERE" // dont forget to change me!
customtoastmessagetopTEXTHERE.classList = "toastnotifheader"
customtoastmessagetopTEXTHERE.innerHTML = "<span class=\"material-symbols-outlined\" style=\"color: var(--messageinfo);\">chevron_right</span> Your text goes here \( use backslashes on things like \"quotes\" and parentheses\)!"
// duplicate the past 4 lines if you want more toast messages

function clearToast() {
    if (document.getElementById("sigil-craft-toast")) {
        try {
            document.getElementById("sigil-craft-toast-top-IDHERE").remove()
        } catch (err) { }
        // duplicate the past 3 lines if you have more toast messages
        try {
            document.getElementById("sigil-craft-toast").remove()
        } catch (err) { }
    }
}
function throwToastTYPEHERE() {
    clearToast()
    setTimeout( function () {
        document.body.appendChild(customtoastmessage)
        document.getElementById("sigil-craft-toast").appendChild(customtoastmessagetopTEXTHERE)
        setTimeout( function () {
            try {
                document.getElementById("sigil-craft-toast-top-IDHERE").remove()
            } catch (err) { }
            // duplicate the past 3 lines if you have more toast messages
            try {
                document.getElementById("sigil-craft-toast").remove()
            } catch (err) { }
        }, 5000)
    }, 200)
}


// auto-confirms any popup windows, like those coming from disenchanting divines - found in Auto Disenchant/Reclaim, by MangoKitten
window.confirm = function(message) {
    return true;
};


// allows you to end a script by pressing esc 3 times, inspired by trevor project, stolen from https://stackoverflow.com/questions/71574648/how-to-check-if-escape-key-has-been-pressed-3-times-like-the-trevor-project-web
window.addEventListener("keydown", checkKeyPressed, false);
let escapeTimerHandle = 0;
let escapeCount = 0;
function checkKeyPressed(evt) {
    if (evt.key === "Escape" || evt.key === "Esc") {
        clearTimeout(escapeTimerHandle);
        escapeCount++;
        if (escapeCount == 3) {
            endYourScriptFunction()
        } else {
            escapeTimerHandle = setTimeout(function(){
                escapeCount = 0;
            }, 1000);
        }
    }
}

function endYourScriptFunction() {
    console.log("Ended script!") // edit me!
}


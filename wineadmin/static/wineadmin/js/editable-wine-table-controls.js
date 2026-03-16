
var enableZoom = true;
function toggleZoom(){
    enableZoom = !enableZoom;

    // change the label next to the toggle button
    var lbl = document.getElementById("zoom-control-label");
    if(enableZoom){
        lbl.innerHTML = "Zoom (enabled)";
    }else{
        lbl.innerHTML = "Zoom (disabled)";
    }
    // enable/disable css 
    document.getElementById("zoomStyles").disabled = !enableZoom;
    
}

var disableSafety = true;
function toggleSafety(){
    // change the label next to the toggle button
    var lbl = document.getElementById("delete-safety-control-label");
    if(disableSafety){
        lbl.innerHTML = "Delete safety switch (disabled)";
    }else{
        lbl.innerHTML = "Delete safety switch (enabled)";
    }

    // enable/disable checkboxes and apply styling
    var buttons = document.getElementsByClassName("editable-wine-table-delete-input");
    var labels = document.getElementsByClassName("editable-wine-table-delete-label");
    for (var i = 0; i<buttons.length; i++){
        if(disableSafety){
            buttons[i].removeAttribute("disabled");
            labels[i].removeAttribute("style");
        }
        else{
            buttons[i].setAttribute("disabled", "true");
            labels[i].setAttribute("style", "opacity:25%;");
        }
        
    }

    disableSafety = !disableSafety;
}

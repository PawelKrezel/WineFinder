if(typeof slotMap === "undefined"){
    var slotMap = {};
}

function drawShelf(width, height, shelfID, headerContent=" <br> ", addHeader=true, addRowNo=false){
    let htmlCode = `<table id="${shelfID}">`;
    let msg = "";
    let cellID = "";
    if(addHeader){
        htmlCode += `<thead><tr><th colspan="${width}">${headerContent}</th></tr></thead>`;
    } htmlCode += `<tbody>`;

    for (let y=1; y<=height; y++){
        htmlCode += `<tr>`;
        for (let x=1; x<=width; x++){
            if(addRowNo){
                if(x==1 || x == width){
                    msg = y;
                }else{msg=""}
            }
        // follows the column-row-shelf pattern    
        cellID = `c${x}-r${y}-${shelfID}`;
        // html for actual slots will contain an input needed for wine allocation
        if(shelfID.slice(0, 1) == "s"){
            
            var display = msg;
            var title = cellID;
            var tooltipHTML = "";

            if(typeof slotMap !== "undefined"){
                if(slotMap[cellID]){

                    var wine = slotMap[cellID];

                    title = `${wine.name} @ ${cellID}`;
                    display = title.slice(0, 2);
                    
                    tooltipHTML = `
                    <div class="cellar-map-tooltip">
                        <strong>${wine.name}</strong><br>
                        ${wine.grape} (${wine.vintage})<br>
                        ${wine.region}, ${wine.country}<br>`;

                    if(wine.image){
                    tooltipHTML += `<img src="${wine.image}" class="cellar-map-tooltip-img"></div>`;
                    }else{tooltipHTML += `</div>`}
                }
            }

            htmlCode += `<td class="shelfSlot" id="${cellID}" title="${title}">
            <label for="input-${cellID}" class="cellar-map-label">
                ${display}
                ${tooltipHTML}
            </label>
            <input type="checkbox" name="slots" value="${cellID}" id="input-${cellID}" class="cellar-map-input">
            </td>`;


        }// html for non-slot cells (walls of the cellar) needs to be more simple
        else{
            htmlCode += `<td class="shelfSlot" id="${cellID}" value="${cellID}" title="${cellID}">${msg}</td>`;
        }

        
        }
        htmlCode += `</tr>`;
    }
    htmlCode += `</tbody></table>`;

    return htmlCode;
}

function drawCellar(){
    document.getElementById("s1-container").innerHTML = drawShelf(9, 25, "s1", "First shelf");
    document.getElementById("s2-container").innerHTML = drawShelf(9, 25, "s2", "Second shelf");
    document.getElementById("s3-container").innerHTML = drawShelf(9, 25, "s3", "Third shelf");
    document.getElementById("s4-container").innerHTML = drawShelf(7, 25, "s4", "Fourth shelf");
    document.getElementById("s5-container").innerHTML = drawShelf(9, 25, "s5", "Fifth shelf from the entrance<br>Second shelf from the bar");
    document.getElementById("s6-container").innerHTML = drawShelf(8, 25, "s6", "Sixth shelf from the entrance<br>First shelf from the bar");

    document.getElementById("g1-container").innerHTML = drawShelf(1, 25, "g1", "<br>", true, true);
    document.getElementById("g2-container").innerHTML = drawShelf(1, 25, "g2", "<br>", true, true);
    document.getElementById("g3-container").innerHTML = drawShelf(7, 25, "g3", "<br>", true, true);
    document.getElementById("g4-container").innerHTML = drawShelf(13, 25, "g4", "Curve Leading to the bar", true, true);
    document.getElementById("g5-container").innerHTML = drawShelf(1, 25, "g5", "<br>", true, true);
    setEventListenersForAllCells();
}
drawCellar();

function setEventListenersForAllCells(){

    var inputs = document.getElementsByClassName("cellar-map-input");
    for (var i = 0; i < inputs.length; i++){

        inputs[i].addEventListener("click", function(){

            var cell = this.parentElement;

            if(this.checked){
                cell.style.backgroundColor = "#8c0808";
            } else{
                cell.style.backgroundColor = "";
            }

        });

    }

}

var tooltipEnabled = true;
function toggleCellToolTip(){
    // change the label next to the toggle button
    var lbl = document.getElementById("cell-tooltip-control-label");
    if(tooltipEnabled){
        lbl.innerHTML = "Cell lookup (disabled)";
    }else{
        lbl.innerHTML = "Cell lookup (disabled) (enabled)";
    }

    tooltipEnabled = !tooltipEnabled;
    document.getElementById("cell-tooltip-styles").setAttribute("disabled", )
}
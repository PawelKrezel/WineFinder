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
        cellID = `${x}-${y}-${shelfID}`;
        htmlCode += `<td class="shelfSlot" id="${cellID}" value="${cellID}" title="${cellID}">${msg}</td>`;
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
    setEventListenersForAllCells()
}
drawCellar();
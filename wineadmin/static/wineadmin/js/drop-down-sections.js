function dropDown(id){
    var element = document.getElementById(id);
    if(element.hasAttribute("class")){
        element.removeAttribute("class");
    } else{
        element.setAttribute("class", "tucked-in");
    }
}

var aiPromptLoaded = false;

function loadAIPrompt(){

    if(aiPromptLoaded){
        return;
    }

    var tooltip = document.getElementById("prompt-content");

    fetch("/static/wineadmin/misc/AI-prompt.txt")
    .then(function(response){
        return response.text();
    })
    .then(function(data){

        tooltip.textContent = data; 
        aiPromptLoaded = true;

    });

}
loadAIPrompt();

function copyAIPrompt(){

    var btn = document.getElementById("copy-ai-prompt");
    var content = document.getElementById("prompt-content");

    if(!content){
        return;
    }

    navigator.clipboard.writeText(content.textContent);

    btn.textContent = "Copied! ✅";

    setTimeout(function(){
        btn.textContent = "Copy to clipboard";
    }, 1500);

}

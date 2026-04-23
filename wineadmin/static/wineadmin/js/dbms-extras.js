var aiPromptLoaded = false;

function loadAIPrompt(){

    if(aiPromptLoaded){
        return;
    }
    var tooltip = document.getElementById("prompt-content");
    // loads prompt from static files
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

    // UI changes after user clicks to confirm prompt was copied. resets after 1.5s
    navigator.clipboard.writeText(content.textContent);
    btn.textContent = "Copied! ✅";
    setTimeout(function(){
        btn.textContent = "Copy to clipboard";
    }, 1500);

}

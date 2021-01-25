// load first bird and show page
async function loadFirstBird(){
    await getNextBird().then((nextBird) => {
        document.getElementById("bird-name").innerHTML = nextBird.common_name;
        showPage();
    }).catch(err => {
        console.log('Request Failed', err);
        showError();
    });
}
function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("content").style.display = "block";
}
function showError(error) {
    var errorP = document.createElement("P");
    if (typeof(error)!=="undefined"){
        errorP.innerHTML = error;
    }else{
        errorP.innerHTML = "Problem loading page, please try again later";
    }
    document.getElementById("errorMessage").appendChild(errorP);
    document.getElementById("loader").style.display = "none";
    document.getElementById("content").style.display = "none";
}

// navigate through views
function playSoundButton(){

    // play sound
    // 

    // add 'reveal bird' button if quiz answer not visible
    if(document.getElementById("quiz-answer").style.display == "none"){
        document.getElementById("reveal-bird-button").style.display = "block";        
    }
}
async function revealBirdButton(){
    document.getElementById("listen").style.display = "none";
    document.getElementById("quiz-answer").style.display = "block";
    document.getElementById("reveal-bird-button").style.display = "none";

    // show 'next' button- unless moving to bird 10 (last bird)
    let page = parseInt(document.getElementById("page").innerHTML, 10);
    if (page == 10) {
        console.log("last bird done- show finish");
        document.getElementById("next-button").style.display = "none";
        document.getElementById("finish-block").style.display = "block";
    }
};
async function nextBirdButton(){
    document.getElementById("listen").style.display = "block";
    document.getElementById("quiz-answer").style.display = "none";
    document.getElementById("reveal-bird-button").style.display = "none";
    
    // increment page- up to page 10 (last bird)
    let page = parseInt(document.getElementById("page").innerHTML, 10);
    document.getElementById("page").innerHTML = page+1;

    // load next bird
    let nextBird = await getNextBird();
    document.getElementById("bird-name").innerHTML = nextBird.common_name;
}
async function quizGalleryButton(){
    window.location.replace("quiz-gallery");
}

// api functions
async function getNextBird(){

    // TEMP set manually- get user from auth
    user = { username: 'cdog' };

    // get bird from queue
    const response = await fetch('/api/birds/get-next-bird', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .catch(err => {
        console.log('Request Failed', err);
    });
    
    // handle response
    let json = await response.json();
    return json.nextBird;
}
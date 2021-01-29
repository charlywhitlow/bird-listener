// load first bird and show page
async function loadFirstBird(){
    await getNextBird()
        .then((nextBird) => {
            updateBirdFields(nextBird);
            showPage();
        })
        .catch(err => {
            console.log('Request Failed', err);
            showErrorPage();
        }
    );
}
function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("content").style.display = "block";
}
function showErrorPage(error) {
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

function playSoundButton(){
    // play audio, or pause if already playing
    if (document.getElementById("player").paused) { document.getElementById("player").play();}
    else document.getElementById("player").pause();

    // add 'reveal bird' button if quiz answer not already visible
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
        document.getElementById("next-button").style.display = "none";
        document.getElementById("finish-block").style.display = "block";
    }
};
async function nextBirdButton(){
    document.getElementById("player").pause(); // stop audio if playing
    document.getElementById("listen").style.display = "block";
    document.getElementById("quiz-answer").style.display = "none";
    document.getElementById("reveal-bird-button").style.display = "none";
    
    // increment page- up to page 10 (last bird)
    let page = parseInt(document.getElementById("page").innerHTML, 10);
    document.getElementById("page").innerHTML = page+1;

    // preload next bird
    let nextBird = await getNextBird();
    updateBirdFields(nextBird);
}
async function quizGalleryButton(){
    window.location.replace("quiz-gallery"); // navigate to gallery view
}

async function getNextBird(){
    user = { username: 'cdog' }; // TEMP set manually- get user from auth

    // get next bird from queue
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
function updateBirdFields(nextBird){
    document.getElementById("common-name").innerHTML = nextBird.common_name;
    document.getElementById("scientific-name").innerHTML = nextBird.scientific_name;
    document.getElementById("recordist").innerHTML = nextBird.recordist;
    document.getElementById("cc_license_code").innerHTML = nextBird.cc_license_code;
    document.getElementById("cc_license_code").href = nextBird.cc_license_url;
    document.getElementById("player").setAttribute('src', nextBird.sound_url);
    document.getElementById("xeno-url").href = 'https://www.xeno-canto.org/'+nextBird.xeno_id;
    document.getElementById("xeno-url").innerHTML = 'XC'+nextBird.xeno_id;
}
// load first bird and show page
async function loadFirstBird(){
    await getNextBird()
        .then((nextBird) => {
            updateBirdFields(nextBird);
            showStartPanel();
        })
        .catch(err => {
            console.log('Request Failed', err);
            showErrorPage();
        }
    );
}
function showStartPanel() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("start-panel").style.display = "block";
}
function startQuiz(){
    document.getElementById("start-panel").style.display = "none";
    document.getElementById("content").style.display = "block";
    document.getElementById("audio-player").autoplay = true;
    document.getElementById("audio-player").play();
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
function goToQuizReview(){
    window.location.replace("quiz-gallery");
}
// function playSoundButton(){
//     // play audio, or pause if already playing
//     if (document.getElementById("player").paused) { document.getElementById("player").play();}
//     else document.getElementById("player").pause();
//     // add 'reveal bird' button if quiz answer not already visible
//     if(document.getElementById("quiz-answer").style.display == "none"){
//         document.getElementById("reveal-bird-button").style.display = "block";        
//     }
// }
async function revealBird(){
    document.getElementById('reveal-button').style.display = "none";
    document.getElementById('common-name').style.visibility = "visible";
    document.getElementById('scientific-name').style.visibility = "visible";
    document.getElementById('image-license-panel').style.visibility = "visible";
    document.getElementById('bird-image').style.display = "";
    document.getElementById('image-placeholder').style.display = "none";
    // show 'review' button when on last bird (bird 10)
    let page = parseInt(document.getElementById("page").innerHTML, 10);
    if (page == 10) {
        document.getElementById("next-button").style.display = "none";
        document.getElementById("review-button").style.display = "";
    }else{
        document.getElementById('next-button').style.display = "";    
    }
};
async function showNextBird(){
    document.getElementById('audio-player').pause(); // stop audio if playing
    document.getElementById('reveal-button').style.display = "";
    document.getElementById('common-name').style.visibility = "hidden";
    document.getElementById('scientific-name').style.visibility = "hidden";
    document.getElementById('image-license-panel').style.visibility = "hidden";
    document.getElementById('bird-image').style.display = "none";
    document.getElementById('image-placeholder').style.display = "";
    document.getElementById("next-button").style.display = "none";
    // increment page- up to page 10 (last bird)
    let page = parseInt(document.getElementById("page").innerHTML, 10);
    document.getElementById("page").innerHTML = page+1;
    // preload next bird
    let nextBird = await getNextBird();
    updateBirdFields(nextBird);
}
// returns value of given cookie name if it exists
function getCookie(cookie_name) {
    var name = cookie_name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);

    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
// get next bird from user queue
async function getNextBird(){
    user = await { username: getCookie('username') };
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
    let json = await response.json();
    return json.nextBird;
}
// update bird in dom
function updateBirdFields(nextBird){
    document.getElementById("common-name").innerHTML = nextBird.common_name;
    document.getElementById("scientific-name").innerHTML = nextBird.scientific_name;
    // audio
    document.getElementById("audio-player").setAttribute('src', nextBird.sound_url);
    document.getElementById("sound-recordist").innerHTML = nextBird.sound_recordist;
    document.getElementById("sound-info").href = 'https://www.xeno-canto.org/'+nextBird.xeno_id;
    document.getElementById("xeno-id").innerHTML = 'XC'+nextBird.xeno_id;
    document.getElementById("sound-license-code").innerHTML = nextBird.sound_license_code;
    document.getElementById("sound-license").href = nextBird.sound_license_url;
    // image
    document.getElementById("bird-image").setAttribute('src', nextBird.image_url);
    document.getElementById("image-url").href = nextBird.image_url;
    document.getElementById("image-author").innerHTML = nextBird.image_author;
    document.getElementById("image-license").innerHTML = nextBird.image_license_code;
    document.getElementById("image-license").href = nextBird.image_license_url;
    let objectPosition = nextBird.image_css_x+"% "+nextBird.image_css_y+"%";
    document.getElementById('bird-image').style.objectPosition = objectPosition;
}

// on play, pause all audio elements except the current element
document.addEventListener('play', function(e){
    var audioPlayers = document.getElementsByTagName('audio');
    for(var i = 0, len = audioPlayers.length; i < len;i++){
        if(audioPlayers[i] != e.target){
            audioPlayers[i].pause();
        }
    }
}, true);

function sortAZ(){
    let birds = document.getElementsByClassName("bird-panel");
    for (let i = 0; i < birds.length; i++) {
        birds[i].style.order = i;
    }
}
function sortZA(){
    let birds = document.getElementsByClassName("bird-panel");
    for (let i = 0; i < birds.length; i++) {
        birds[i].style.order = -i;
    }
}

function filterBirds(str){
    // Loop through birds and hide those that don't match the search query
    let birds = document.getElementsByClassName('bird-panel');
    for (i = 0; i < birds.length; i++) {
        let commonName = birds[i].getElementsByClassName("common-name")[0].innerHTML;
        if (commonName.toLowerCase().indexOf(str.toLowerCase()) > -1) {
            birds[i].style.display = "";
        } else {
            birds[i].style.display = "none";
        }
    }
}
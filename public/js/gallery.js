
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

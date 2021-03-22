
// on play, pause all audio elements except the current element
document.addEventListener('play', function(e){
    var audioPlayers = document.getElementsByTagName('audio');
    for(var i = 0, len = audioPlayers.length; i < len;i++){
        if(audioPlayers[i] != e.target){
            audioPlayers[i].pause();
        }
    }
}, true);


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

function appendBirdsToDom(birds){
    let row = document.querySelector("#browse > div.container > div");
    birds.forEach(bird => {
        row.insertAdjacentHTML('beforeend', bird);
    });
}

function loadMore(){
    let page = document.getElementById('page');
    page.value ++;
    fetch('/api/birds/load-more', {
        method: "POST",
        body: JSON.stringify({page: page.value}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(res => res.json()) // get json
    .then(json => {
        appendBirdsToDom(json.birds)
        if (json.lastPage){
            // hide loadMore button on last page
            document.getElementById('loadMoreButton').style.visibility = 'hidden';
        }
    })
    .catch(err => console.log('Request Failed', err));
}
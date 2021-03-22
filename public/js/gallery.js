
// on play, pause all audio elements except the current element
document.addEventListener('play', function(e){
    var audioPlayers = document.getElementsByTagName('audio');
    for(var i = 0, len = audioPlayers.length; i < len;i++){
        if(audioPlayers[i] != e.target){
            audioPlayers[i].pause();
        }
    }
}, true);

// load more button
function loadMore(){
    let page = document.getElementById('page');
    page.value ++;
    fetch('/api/birds/load-more', {
        method: "POST",
        body: JSON.stringify({page: page.value}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(res => res.json())
    .then(json => {
        appendBirdsToDom(json.birds)
        if (json.lastPage){
            // hide loadMore button on last page
            document.getElementById('loadMoreButton').style.visibility = 'hidden';
        }
    })
    .catch(err => console.log('Request Failed', err));
}
function appendBirdsToDom(birds){
    let row = document.querySelector("#browse > div.container > div");
    birds.forEach(bird => {
        row.insertAdjacentHTML('beforeend', bird);
    });
}

// Autocomplete search bar adapted from: 
// https://www.w3schools.com/howto/howto_js_autocomplete.asp
function initAutocomplete(input, submit, searchTerms) {
    var currentFocus; // sets which listItem is currently in focus

    // execute when someone writes in the text field
    input.addEventListener("input", function(e) {
        closeAllLists();
        let str = this.value;
        if (!str) { return false; }
        currentFocus = -1;

        // create list div for matching items
        let list = document.createElement("DIV");
        list.setAttribute("id", this.id + "autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(list);

        // loop through term array and look for matches
        for (let i=0; i < searchTerms.length; i++) {
            if (searchTerms[i].toLowerCase().indexOf(str.toLowerCase()) > -1) {
                let listItem = document.createElement("DIV");
                listItem.innerHTML = searchTerms[i];
                listItem.innerHTML += "<input type='hidden' value='" + searchTerms[i] + "'>";

                // add select bird event to each li
                listItem.addEventListener("click", function(e) {
                    input.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                    searchBirds(input.value)
                });
                list.appendChild(listItem);
            }
        }
    });

    // execute when key pressed
    input.addEventListener("keydown", function(e) {
        let list = getActiveListItems();
        // down arrow, move focus down
        if (e.keyCode == 40) {
            currentFocus++;
            addActiveClass(list);
        }
        // up arrow, move focus up
        else if (e.keyCode == 38) {
            currentFocus--;
            addActiveClass(list);
        }
        // enter, select term
        else if (e.keyCode == 13) {
            e.preventDefault(); // prevent form from being submitted
            list = getActiveListItems(); // refresh list in case clicking enter after list has been closed
            submitForm(list);
        }
    });

    // execute when submit button clicked
    submit.addEventListener("click", function(e) {
        let list = getActiveListItems();
        submitForm(list)
    });

    // submit form
    function submitForm(list){
        if (currentFocus > -1) {
            if (list) {
                list[currentFocus].click(); // item selected, simulate click
            }else{
                searchBirds(input.value); // lists closed, search input text
            }
        }else{
            searchBirds(input.value); // lists open, search input text
            closeAllLists();
        }
    }
    // get updated list
    function getActiveListItems(){
        let list = document.getElementById(input.id + "autocomplete-list");
        if (list){
            list = list.getElementsByTagName("div");
        }
        return list;
    }
    // add/remove active class to list items when keying through list
    function addActiveClass(list) {
        if (!list) return false;
        removeActiveClass(list);
        if (currentFocus >= list.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (list.length - 1);
        list[currentFocus].classList.add("autocomplete-active");
    }
    function removeActiveClass(list) {
        for (var i = 0; i < list.length; i++) {
            list[i].classList.remove("autocomplete-active");
        }
    }
    // close all autocomplete lists, except the passed active element
    function closeAllLists(activeElement) {
        var list = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < list.length; i++) {
            if (activeElement != list[i] && activeElement != input) {
                list[i].parentNode.removeChild(list[i]);
            }
        }
    }
    // close all lists when someone clicks in the document
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

    function searchBirds(str){
        // loop through birds in dom, hide if not a match
        let matches = getMatches(str)
        let birds = document.getElementsByClassName('bird-panel');
        for (i = 0; i < birds.length; i++) {
            let index = matches.indexOf(birds[i].id);
            if (index == -1){
                birds[i].style.display="none"; // not a match- hide
            }else{
                birds[i].style.display=""; // show in dom
                matches.splice(index, 1); // remove from matches array
            }
        }
        // for matches not in dom, get bird from db and append to dom
        fetch('/api/birds/load-matching-birds', {
            method: "POST",
            body: JSON.stringify(matches),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(res => res.json())
        .then(json => {
            appendBirdsToDom(json.birds)
        })
        .catch(err => console.log('Request Failed', err));
    }

    function getMatches(str){
        let matches = []
        for (let i=0; i < searchTerms.length; i++) {
            if (searchTerms[i].toLowerCase().indexOf(str.toLowerCase()) > -1) {
                matches.push(searchTerms[i])
            }
        }
        return matches;
    }
}
let blanks = [];
let num = 0;
let pos = -1;
let textRed = "rgb(207, 18, 18)";
let backgroundRed = "rgb(219, 129, 129)";

// get relevant fields from birds.csv
async function getBlanks(){
    let blanks = await fetch('/api/admin/get-blanks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(json => json.blanks)
    .catch(err => console.log('Request Failed', err));  
    return blanks;
}

// save updates to birds.csv
async function saveUpdatesToCSV(updates){
    return await fetch('/api/admin/update-csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    })
    .then(response => response.json()) 
    .catch(err => console.log(err));
}

// load first bird
async function loadFirstBird(){

    // load blanks
    blanks = await getBlanks();
    num = blanks.length;
    document.getElementById("num").innerHTML = num;

    // load first bird
    let bird = getNextBird();
    loadBird(bird, true); // set defaults
}

function getNextBird(){
    incrementPos();
    return blanks[pos];
}
function getPreviousBird(){
    decrementPos();
    return blanks[pos];
}
function incrementPos(){
    pos++;
    document.getElementById("pos").innerHTML = pos+1;
    disableNavIfApplicable();
}
function decrementPos(){
    pos--;
    document.getElementById("pos").innerHTML = pos+1;
    disableNavIfApplicable();
}
function disableNavIfApplicable(){
    if (pos === num-1){
        document.getElementById('next-button').disabled = true;
    }else document.getElementById('next-button').disabled = false;
    if (pos === 0){
        document.getElementById('back-button').disabled = true;
    }else document.getElementById('back-button').disabled = false;
}

// update values in blanks array
function saveBird(){
    blanks[pos].image_css_x = document.getElementById('x').value;
    blanks[pos].image_css_y = document.getElementById('y').value;
}

// navigation buttons
function next(){
    saveBird();
    let bird = getNextBird();
    loadBird(bird, true);
}
function back(){
    saveBird();
    let bird = getPreviousBird();
    loadBird(bird, true);
}
async function saveAndQuit(){
    saveBird(); // save current bird

    // write all updates to csv
    let updates = []
    blanks.forEach(bird => {
        if(bird.image_css_x | bird.image_css_y){
            updates.push(bird);
        }        
    });
    let response = await saveUpdatesToCSV({
        'updates' : updates
    });
    
    // redirect to admin page (TBC)
    if (response.status === 'ok'){
        console.log('success- redirect')
    }else{
        console.log('error saving updates:')
        console.log(response)
    }
}

// load next bird on page
function loadBird(bird, setDefaults=false){
    setImage(bird.image_url);
    setCommonName(bird.common_name);
    setScientificName(bird.scientific_name);
    updateX(bird.image_css_x, setDefaults);
    updateY(bird.image_css_y, setDefaults);
}
function setImage(image_url){
    let img = document.getElementById("bird-image");
    img.setAttribute('src', image_url);
    img.onload = function(){
        if (img.naturalHeight > img.naturalWidth) {
            // disable x
            document.getElementById("x").disabled = true;
            document.getElementById("x").style.backgroundColor = 'grey';
            // enable y
            document.getElementById("y").disabled = false;
            document.getElementById("y").style.backgroundColor = 'white';
        }else{
            // disable y
            document.getElementById("y").disabled = true;
            document.getElementById("y").style.backgroundColor = 'grey';
            // enable x
            document.getElementById("x").disabled = false;
            document.getElementById("x").style.backgroundColor = 'white';
        }
    };    
}
function setCommonName(common_name){
    document.getElementById("common-name").innerHTML = common_name;
}
function setScientificName(scientific_name){
    document.getElementById("scientific-name").innerHTML = scientific_name;
}

// update x and y values on page
function updateX(x, setDefaults=false){
    if (setDefaults===true && x === ""){
        setImagePositionX(50);
        setInputValueX(50);
    }else if(x < 0){
        setImagePositionX(0);
        setInputValueX(0);
        document.getElementById('warning').style.color = textRed;
        document.getElementById('x').style.backgroundColor = backgroundRed;
    }else if(x > 100){
        setImagePositionX(100);
        setInputValueX(100);
        document.getElementById('warning').style.color = textRed;
        document.getElementById('x').style.backgroundColor = backgroundRed;
    }else{
        setImagePositionX(x);
        setInputValueX(x);
        document.getElementById('warning').style.color = "white";
        document.getElementById('x').style.backgroundColor = "white";
    }
}
function updateY(y, setDefaults=false){
    if (setDefaults===true && y === ""){
        setImagePositionY(50);
        setInputValueY(50);
    }else if(y < 0){
        setImagePositionY(0);
        setInputValueY(0);
        document.getElementById('warning').style.color = textRed;
        document.getElementById('y').style.backgroundColor = backgroundRed;
    }else if(y > 100){
        setImagePositionY(100);
        setInputValueY(100);
        document.getElementById('warning').style.color = textRed;
        document.getElementById('y').style.backgroundColor = backgroundRed;
    }else{
        setImagePositionY(y);
        setInputValueY(y);
        document.getElementById('warning').style.color = "white";
        document.getElementById('y').style.backgroundColor = "white";
    }
}
function setImagePositionX(x){
    let y = document.getElementById('y').value;
    document.getElementById('bird-image').style.objectPosition = `${x}% ${y}%`;
}
function setImagePositionY(y){
    let x = document.getElementById('x').value;
    document.getElementById('bird-image').style.objectPosition = `${x}% ${y}%`;
}
function setInputValueX(x){
    document.getElementById('x').value = x;
}
function setInputValueY(y){
    document.getElementById('y').value = y;
}

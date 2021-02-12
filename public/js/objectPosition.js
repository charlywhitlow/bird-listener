let blanks = [];

// get relevant fields from birds.csv
async function getBlanks(){
    let blanks = await fetch('/api/admin/get-css-fields', {
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

// load first bird
async function loadFirstBird(){

    // load blanks
    blanks = await getBlanks();

    // load first bird
    let bird = blanks.pop();
    // add to dom
    loadBird(bird, true); // set defaults
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
        document.getElementById('warning').style.visibility = "visible";
    }else if(x > 100){
        setImagePositionX(100);
        setInputValueX(100);
        document.getElementById('warning').style.visibility = "visible";
    }else{
        setImagePositionX(x);
        setInputValueX(x);
        document.getElementById('warning').style.visibility = "hidden";
    }
}
function updateY(y, setDefaults=false){
    if (setDefaults===true && y === ""){
        setImagePositionY(50);
        setInputValueY(50);
    }else if(y < 0){
        setImagePositionY(0);
        setInputValueY(0);
        document.getElementById('warning').style.visibility = "visible";
    }else if(y > 100){
        setImagePositionY(100);
        setInputValueY(100);
        document.getElementById('warning').style.visibility = "visible";
    }else{
        setImagePositionY(y);
        setInputValueY(y);
        document.getElementById('warning').style.visibility = "hidden";
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
// navigation buttons
function back(){
    console.log('back');
}
function next(){
    console.log('next');
}
function saveAndQuit(){
    console.log('saveAndQuit');
}

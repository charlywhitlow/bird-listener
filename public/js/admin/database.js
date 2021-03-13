let birds = []
let num = 0;
let pos = 0;
let textRed = "rgb(207, 18, 18)";
let backgroundRed = "rgb(219, 129, 129)";

function getURL(func, type){
    switch (func){
        case 'upload':
            return `/api/admin/upload-${type}-csv`

        case 'save':
            return `/api/admin/save-${type}`
    }
}
let feedbackDivs = {
    'uploadCSV' : 'upload-csv-feedback',
    'save' : 'save-feedback',
    'clearBirds' : 'clear-birds-feedback',
    'clearQueues' : 'clear-queues-feedback',
    'checkTable' : 'check-table-feedback',
    'objectFit' : 'object-fit-feedback',
    'userQueues' : 'update-queues-feedback'
}
const tableHeadings = {
    'names': {
        'common_name' : 'text',
        'scientific_name' : 'text'
    },
    'sounds': {
        'common_name' : 'text',
        'sound_name' : 'text',
        'difficulty' : 'text',
        'xeno_id' : 'text',
        'sound_info_url' : 'link',
        'sound_url' : 'link',
        'sound_recordist' : 'input',
        'sound_license_code' : 'input',
        'sound_license_url' : 'input'
    },
    'images': {
        'common_name' : 'text',
        'image_name' : 'input',
        'image_info_url' : 'link',
        'image_url' : 'link',
        'image_author_raw' : 'text',
        'image_author' : 'input',
        'image_license_code' : 'input',
        'image_license_url' : 'input',
        'image_css_x' : 'text',
        'image_css_y' : 'text'
    }
}
function clearFeedback(){
    for (let id in feedbackDivs) {
        let div = document.getElementById(feedbackDivs[id]);
        if (div !== undefined && div !== null){
            div.innerHTML = '';
        }
    }
}
function clearTable(){
    document.getElementById('birdsTable').innerHTML = '';
}
function enableSaveButton(){
    document.querySelector("#saveForm > input").style.visibility = "visible";
}
async function uploadCSV(type, afterCSVLoad=null){
    clearFeedback();
    clearTable();
    let feedbackDiv = document.getElementById(feedbackDivs['uploadCSV']);
    let csv = document.getElementById('uploadFile').files[0];
    let csvValid = checkValidCSV(csv);
    if (csvValid !== true){
        feedbackDiv.innerHTML = csvValid;
        return;
    }
    // if csv valid, fetch image data from api
    showLoader('upload');
    let url = getURL('upload', type)
    await postCSV(url)
    .then(data => {
        hideLoader('upload');
        addFeedback(data, feedbackDiv);
        // populate table and call afterCSVLoad function if set
        if (data.status !== 'failed'){
            populateTable(data.birds, tableHeadings[type]);
            if (afterCSVLoad) afterCSVLoad(data.birds);
        }
    });
}
function addFeedback(data, feedbackDiv){
    clearFeedback();
    let p = document.createElement("p");
    p.innerHTML = data.message;
    feedbackDiv.appendChild(p);
    if (data.errors){
        let ul = document.createElement("UL");
        data.errors.forEach(error => {
            let li = document.createElement("LI");
            li.innerHTML = error;
            ul.appendChild(li);
        });
        feedbackDiv.appendChild(ul);
    }
}
async function postCSV(url) {
    let formData = new FormData(document.getElementById('uploadForm'));
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    return response.json();
}
function checkValidCSV(csv){
    if(csv === undefined){
        return 'Please select a file';
    }
    if(csv.type!=="text/csv"){
        return 'Please select a CSV file';
    }
    if(csv.size > 1024 * 1024) {
        return 'File must be smaller than 1MB';
    }
    return true; // return true if no errors
}
async function saveData(url, json) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-type': 'application/json;charset=UTF-8'},
        body: json
    });
    return await response.json();
}
function showLoader(formName) {
    let id = `${formName}-loader-div`
    document.getElementById(id).style.display = "";
}
function hideLoader(formName) {
    let id = `${formName}-loader-div`
    document.getElementById(id).style.display = "none";
}
function populateTable(json, headings){
    // create table head
    let table = document.getElementById('birdsTable');
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key in headings) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
    // create table body
    let tbody = table.createTBody();
    for (let item of json) {
        let row = tbody.insertRow();
        for (let key in headings) {
            let cell = row.insertCell();
            let text = (item[key] === undefined) ? "" : item[key];
            let node;
            switch (headings[key]) {
            case 'text':
                node = document.createTextNode(text);
                break;
            case 'link':
                node = document.createElement('a');
                node.setAttribute('href', text);
                node.innerHTML = text;
                break;
            case 'input':
                node = document.createElement('input');
                node.setAttribute("type", "text");
                node.setAttribute("value", text);
                break;
            }
            cell.appendChild(node);
        }
    }
}
function parseTable(){
    // get headers
    let table = document.getElementById('birdsTable');
    let headers = [];
    for (cell of table.rows[0].cells){
        headers.push(cell.innerHTML)
    }    
    // get rows
    let data = [];
    for (let i=1; i<table.rows.length; i++) {
        let tableRow = table.rows[i];
        let rowData = {};
        for (let j=0; j<tableRow.cells.length; j++) {
            let td = tableRow.cells[j];
            if(td.firstElementChild === null){
                rowData[headers[j]] = td.innerText;
            }else{
                switch (td.firstElementChild.tagName) {
                    case 'A':
                        rowData[headers[j]] = tableRow.cells[j].firstChild.href;
                        break;
                    case 'INPUT':
                        rowData[headers[j]] = tableRow.cells[j].firstChild.value;
                        break;
                }
            }
        }
        data.push(rowData);
    }
    return JSON.stringify(data);
}
function addCssValuesToTable(){
    // get css heading indexes
    let table = document.getElementById('birdsTable');
    let css_x_index = -1;
    let css_y_index = -1;
    for (let i in table.rows[0].cells) {
        if (table.rows[0].cells[i].innerHTML === 'image_css_x'){
            css_x_index = i;
        }
        if (table.rows[0].cells[i].innerHTML === 'image_css_y'){
            css_y_index = i;
        }
    }
    // update table with css values
    for (let i=1; i<table.rows.length; i++) {
        let x = birds[i-1].image_css_x;
        let y = birds[i-1].image_css_y;
        table.rows[i].cells[css_x_index].innerHTML = x;
        table.rows[i].cells[css_y_index].innerHTML = y;
    }
}
function save(type){
    let json = parseTable();
    let url = getURL('save', type)
    saveData(url, json)
    .then(data => {
        let feedbackDiv = document.getElementById(feedbackDivs['save']);
        addFeedback(data, feedbackDiv)
    });
}
function confirmClearBirds(){
    let del = confirm('This deletes the birds table and user progress. Are you sure you want to continue?')
    if (del) {
        clearBirds();
    };
}
function clearBirds(){
    fetch('/api/admin/empty-birds-table', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json()).then(json => {
        let feedbackDiv = document.getElementById(feedbackDivs['clearBirds']);
        addFeedback(json, feedbackDiv)
    })
    .catch(err => {
        feedbackDiv.innerHTML = 'Problem clearing database';
        console.log(err);
    });
}
function confirmClearQueues(){
    let del = confirm('This deletes all user progress. Are you sure you want to continue?')
    if (del) {
        clearQueues();
    };
}
function clearQueues(){
    fetch('/api/admin/empty-queues', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json()).then(json => {
        let feedbackDiv = document.getElementById(feedbackDivs['clearQueues']);
        addFeedback(json, feedbackDiv)
    })
    .catch(err => {
        feedbackDiv.innerHTML = 'Problem clearing database';
        console.log(err);
    });
}
async function updateUserQueues(){
    fetch('/api/admin/update-user-queues', {
        method: "GET",
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(res => res.json()).then(json => {
        let feedbackDiv = document.getElementById(feedbackDivs['userQueues']);
        addFeedback(json, feedbackDiv)
    })
    .catch(err => {
        feedbackDiv.innerHTML = 'Problem updating queues';
        console.log(err);
    });
}
function loadObjectFitPanel(json){
    document.getElementById('birdsTable').style.display = 'none';
    birds = json;
    document.getElementById("object-fit-div").style.display = "";
    setPos(pos);
    setNum(birds.length);
    loadBird(birds[pos], true); // set defaults
}
// load next bird on page
function loadBird(bird, setDefaults=false){
    setImage(bird.image_url);
    setCommonName(bird.common_name);
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
function saveBird(){
    birds[pos].image_css_x = document.getElementById('x').value;
    birds[pos].image_css_y = document.getElementById('y').value;
}
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
function getNextBird(){
    incrementPos();
    return birds[pos];
}
function getPreviousBird(){
    decrementPos();
    return birds[pos];
}
function setNum(x){
    num = x;
    document.getElementById("num").innerHTML = x;
}
function setPos(x){
    pos = x;
    document.getElementById("pos").innerHTML = x+1;
    disableNavIfApplicable();
}
function incrementPos(){
    pos++;
    document.getElementById("pos").innerHTML = pos+1;
    disableNavIfApplicable();
    if (pos+1 === num) {
        document.getElementById("object-fit-button").style.visibility = 'visible';
    }
}
function confirmObjectFit(){
    saveBird(); // save current bird
    addCssValuesToTable();
    document.getElementById('birdsTable').style.display = '';
    enableSaveButton();
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
// update x and y values on page
function updateX(x, setDefaults=false){
    if (setDefaults===true && ( x === "" || x === undefined)){
        setImagePositionX(50);
        setInputValueX(50);
    }else if(x < 0){
        setImagePositionX(0);
        setInputValueX(0);
        document.getElementById('object-fit-warning').style.color = textRed;
        document.getElementById('x').style.backgroundColor = backgroundRed;
    }else if(x > 100){
        setImagePositionX(100);
        setInputValueX(100);
        document.getElementById('object-fit-warning').style.color = textRed;
        document.getElementById('x').style.backgroundColor = backgroundRed;
    }else{
        setImagePositionX(x);
        setInputValueX(x);
        document.getElementById('object-fit-warning').style.color = "white";
        document.getElementById('x').style.backgroundColor = "white";
    }
}
function updateY(y, setDefaults=false){
    if (setDefaults===true && ( y === "" || y === undefined)){
        setImagePositionY(50);
        setInputValueY(50);
    }else if(y < 0){
        setImagePositionY(0);
        setInputValueY(0);
        document.getElementById('object-fit-warning').style.color = textRed;
        document.getElementById('y').style.backgroundColor = backgroundRed;
    }else if(y > 100){
        setImagePositionY(100);
        setInputValueY(100);
        document.getElementById('object-fit-warning').style.color = textRed;
        document.getElementById('y').style.backgroundColor = backgroundRed;
    }else{
        setImagePositionY(y);
        setInputValueY(y);
        document.getElementById('object-fit-warning').style.color = "white";
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
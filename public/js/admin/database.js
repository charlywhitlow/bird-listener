function getURL(func, type){
    switch (func){
        case 'upload':
            return `/api/admin/upload-${type}-csv`

        case 'save':
            return `/api/admin/save-${type}-to-db`
    }
}
let feedbackDivs = {
    'uploadCSV' : 'upload-csv-feedback',
    'save' : 'save-feedback',
    'deleteDb' : 'empty-db-feedback',
    'checkTable' : 'check-table-feedback',
    'objectFit' : 'object-fit-feedback'
}
const tableHeadings = {
    'names': {
        'common_name' : 'text',
        'scientific_name' : 'text'
    },
    'images': {
        'common_name' : 'text',
        'image_info_url' : 'link',
        'image_name' : 'input',
        'image_url' : 'input',
        'image_author' : 'input',
        'image_license_code' : 'input',
        'image_license_url' : 'input'
    },
    'sounds': {
        'common_name' : 'text',
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
function uploadCSV(type, afterCSVLoad=null){
    clearTable();
    let feedbackDiv = document.getElementById(feedbackDivs.uploadCSV);
    let csv = document.getElementById('uploadFile').files[0];
    let csvValid = checkValidCSV(csv);
    if (csvValid !== true){
        feedbackDiv.innerHTML = csvValid;
        return;
    }
    let url = getURL('upload', type)
    postCSV(url)
    .then(data => {
        addFeedback(data, feedbackDiv);
        // populate table and call afterCSVLoad function if set
        if (data.status !== 'failed'){
            populateTable(data.birds, tableHeadings[type]);
            if (afterCSVLoad) afterCSVLoad();
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
    return response.json();
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
    // build rows
    let data = [];
    for (let i=1; i<table.rows.length; i++) {
        let tableRow = table.rows[i];
        let rowData = {};
        for (let j=0; j<tableRow.cells.length; j++) {
            rowData[ headers[j] ] = tableRow.cells[j].innerHTML;
        }
        data.push(rowData);
    }
    return JSON.stringify(data);
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
function emptyDatabase(){
    fetch('/api/admin/empty-db', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json()).then(data => {
        let feedbackDiv = document.getElementById('empty-db-feedback');
        addFeedback(data, feedbackDiv)
    })
    .catch(err => {
        feedbackDiv.innerHTML = 'Problem clearing database';
        console.log(err);
    });
}
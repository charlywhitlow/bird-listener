let feedbackDivs = {
    'uploadCSV' : 'upload-csv-feedback',
    'deleteDb' : 'empty-db-feedback'
}
function clearFeedback(feedbackDivs){
    for (let id in feedbackDivs) {
        document.getElementById(feedbackDivs[id]).innerHTML = '';
    }
}
function uploadNamesCSV(){
    clearFeedback(feedbackDivs);
    let feedbackDiv = document.getElementById('upload-csv-feedback');
    let csv = document.getElementById('uploadFile').files[0];
    let csvValid = checkValidCSV(csv);
    if (csvValid !== true){
        feedbackDiv.innerHTML = csvValid;
        return;
    }
    postCSVtoAPI(feedbackDiv);
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
function postCSVtoAPI(feedbackDiv){
    let formData = new FormData(document.getElementById('uploadForm'));
    fetch('/api/admin/add-names', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(json => {
        if(json.errors){
            feedbackDiv.innerHTML = json.message + ':<br>' + json.errors;
            console.log(json.errors)
        }else{
            feedbackDiv.innerHTML = json.message;
        }
    })
    .catch(err => {
        console.log('Upload Failed', err);
        feedbackDiv.innerHTML = json.message;
    });
}

function emptyDatabase(){
    clearFeedback(feedbackDivs);
    let feedbackDiv = document.getElementById('empty-db-feedback');

    fetch('/api/admin/empty-db', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json()).then(json => {
        feedbackDiv.innerHTML = json.message;
    })
    .catch(err => {
        feedbackDiv.innerHTML = 'Problem clearing database';
        console.log(err);
    });
}
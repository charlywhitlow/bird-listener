const getRequest = require(__root + '/util/apiRequest.js');


// return recording object (all fields) for given xeno_id
async function getRecordingInfoAllFields(xeno_id){
    let bird_url = birdURL(xeno_id);
    let bird_req = await getRequest(bird_url);
    bird_obj = bird_req.recordings[0];
    return bird_obj;
}

// return sound object (database fields) for given xeno_id
async function getRecordingInfo(xeno_id){
    let bird_url = birdURL(xeno_id);
    let bird_req = await getRequest(bird_url);
    bird_obj = bird_req.recordings[0];
    let recordings = await extractBirdObj(bird_obj)
    return recordings;
}

// extract database fields from bird object 
function extractBirdObj(bird_obj){

    let filename = bird_obj['file-name'];
    let license_url = "https:"+bird_obj.lic;
    let license_code = getLicenseCode(license_url);
    let sonogram_url = "https:"+bird_obj.sono.med;
    var sound_url = sonogram_url.split("ffts")[0]+filename;
    let recordist = bird_obj.rec;
    // let download_link = "https:"+bird_obj.file;
    
    return {
        'sound_url' : sound_url,
        'sound_sonogram_url' : sonogram_url,
        'sound_license_url' : license_url,
        'sound_license_code' : license_code,
        'sound_recordist' : recordist
        // 'sound_filename' : filename
        // 'sound_download_link' : download_link
    }
}

// returns search url for all uk recordings of given bird
function speciesSearchURL(scientific_name, page=null){
    return 'https://www.xeno-canto.org/api/2/recordings'+
        '?query='+scientific_name.replace(" ", "%20")+
        '%20cnt:%22United%20Kingdom%22'+
        '&page='+(page ? page : 1);
}

// returns recording object search url for a given recording id
function birdURL(id){
    return 'https://www.xeno-canto.org/api/2/recordings?query=nr:'+id
}

// extracts CC license code from url
function getLicenseCode(license_url){
    let split = license_url.split('licenses/');
    let elements = split[1].split('/');
    return elements[0].toUpperCase()+" "+elements[1]
}


module.exports = {
    getRecordingInfo,
    getRecordingInfoAllFields
}
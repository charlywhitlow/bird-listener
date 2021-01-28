const unirest = require('unirest');

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

// return bird object for given xeno_id
async function getBird(xeno_id){
    let bird_url = birdURL(xeno_id);
    let bird_req = await xenoRequest(bird_url);
    bird_obj = bird_req.recordings[0];
    return bird_obj;
}

// extract database fields from bird object 
function extractBirdObj(bird_obj){

    let filename = bird_obj['file-name'];
    let download_link = "https:"+bird_obj.file;
    let license_url = "https:"+bird_obj.lic;
    let sonogram_url = "https:"+bird_obj.sono.med;
    var sound_url = sonogram_url.split("ffts")[0]+filename;
    let recordist = bird_obj.rec;
    let location = bird_obj.loc;

    return {
        'sound-url' : sound_url,
        'sonogram-url' : sonogram_url,
        'license-url' : license_url,
        'recordist' : recordist,
        'location' : location,
        'download-link' : download_link,
        'filename' : filename
    }
}

// get request for given url
async function xenoRequest(url){
    return new Promise((resolve, reject) => {
        unirest.get(url)
        .headers({
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
        })
        .end(function (response) {
            if (response.error) {
                return reject(response.error)
            }
            return resolve(response.body);
        });
    })
}

module.exports = {
    speciesSearchURL,
    getBird,
    extractBirdObj
}
const unirest = require('unirest');

async function getResponse(url){
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

function uploadCSV(uploadPath, req){
    if (!req.files || Object.keys(req.files).length === 0) {
        return { 
            'status' : 'failed',
            'message' : 'No files were uploaded'
        };
    }
    req.files.uploadFile.mv(uploadPath, function(err) {
        if (err) return { 
            'status' : 'failed',
            'message' : 'Problem uploading file'
        }
    });
    return false;
}
function checkCSVHeaders(expectedHeaders, uploadHeaders){
    let headersOk = true;
    expectedHeaders.forEach(header => {
        if (!uploadHeaders.includes(header)){
            headersOk = false;
        }
    });
    return headersOk;
}

function getSoundLicenseCode(license_url){
    let split = license_url.split('licenses/');
    let elements = split[1].split('/');
    return elements[0].toUpperCase()+" "+elements[1]
}

async function getRecordingDetails(birds){
    for(let bird of birds) {
        await getResponse('https://www.xeno-canto.org/api/2/recordings?query=nr:'+bird.xeno_id)
        .then(res => res.recordings[0])
        .then(sound => {
            bird.sound_info_url = 'https://www.xeno-canto.org/'+bird.xeno_id;        
            bird.sound_recordist = sound.rec;
            bird.sound_license_url = "https:"+sound.lic;
            bird.sound_license_code = getSoundLicenseCode("https:"+sound.lic);
            bird.sound_url = "https:" + sound.sono.small.split("ffts")[0] + sound['file-name'];
        })
        .catch(err => console.log(err))
    }
    return birds;
}

module.exports = {
    uploadCSV,
    checkCSVHeaders,
    getRecordingDetails
}

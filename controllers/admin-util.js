const unirest = require('unirest');
const HTMLParser = require('node-html-parser');
const puppeteer = require('puppeteer');


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

async function getRecordingDetails(birds){
    for(let bird of birds) {
        await getResponse('https://www.xeno-canto.org/api/2/recordings?query=nr:'+bird.xeno_id)
        .then(res => res.recordings[0])
        .then(sound => {
            bird.sound_info_url = 'https://www.xeno-canto.org/'+bird.xeno_id;        
            bird.sound_recordist = sound.rec;
            bird.sound_license_url = "https:"+sound.lic;
            bird.sound_license_code = getRecordingLicenseCode("https:"+sound.lic);
            bird.sound_url = "https:" + sound.sono.small.split("ffts")[0] + sound['file-name'];
        })
        .catch(err => console.log(err))
    }
    return birds;
}
function getRecordingLicenseCode(license_url){
    let split = license_url.split('licenses/');
    let elements = split[1].split('/');
    return elements[0].toUpperCase()+" "+elements[1]
}

async function getImageDetails(birds){
    for(let bird of birds) {
        bird.image_info_url = bird.image_info_url.split('#')[0]; // remove any #section bookmarks
        bird.image_url = await getImageURL(bird.image_info_url); // use puppeteer to extract image_url
        let filename = bird.image_info_url.split('/wiki/')[1];
        let wikimedia_query_url = "https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=" 
            + filename + "&format=json"

        await getResponse(wikimedia_query_url)
        .then(res => {
            let page_key = (Array.isArray(Object.keys(res.query.pages))) ?
                Object.keys(res.query.pages)[0] :
                Object.keys(res.query.pages);
            if ('imageinfo' in res.query.pages[page_key]){
                return res.query.pages[page_key].imageinfo[0].extmetadata;
            }
        }).then(info => {
            bird.image_author_raw = (info.Artist) ? 
                info.Artist.value : '';
            bird.image_author = (info.Artist) ? 
                toProperCase( HTMLParser.parse(info.Artist.value).innerText ) : '';
            bird.image_license_code = (info.LicenseShortName) ?
                info.LicenseShortName.value : '';
            bird.image_license_url = (info.LicenseUrl) ? 
                info.LicenseUrl.value : '';
        })
        .catch(err => console.log(err))
    }
    return birds;
}
async function getImageURL(image_info_url) {
    // get image_url from image_info_page using Puppeteer
    const browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(image_info_url, {waitUntil: 'load'});
    const image_url = await page.evaluate(() => document.querySelector("#file > a").href)
    await browser.close();
    return image_url;
};

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
function toProperCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}


module.exports = {
    uploadCSV,
    checkCSVHeaders,
    getRecordingDetails,
    getImageDetails
}
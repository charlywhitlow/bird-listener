const unirest = require('unirest');
const apiRequest = require('./apiRequest.js');


// get required fields for given wikimedia info page url
async function getImageInfo(image_url){

    let query_url = "https://en.wikipedia.org/w/api.php?" + 
        "action=query&prop=imageinfo&iiprop=extmetadata&titles=" +
        getFilenameFromURL(image_url) + 
        "&format=json"

    let response = await apiRequest.getRequest(query_url);
    
    let page_key = Object.keys(response.query.pages)[0];
    let selectedFields = getSelectedFields(response.query.pages[page_key].imageinfo[0].extmetadata);

    return selectedFields;
}

// get required database fields from imageInfo json
function getSelectedFields(imageInfo){
    return {
        'image_author' : imageInfo.Artist.value,
        'image_license_code' : imageInfo.LicenseShortName.value,
        'image_license_url' : imageInfo.LicenseUrl.value
    }
}
// get image filename from wikimedia image URL
function getFilenameFromURL(url){
    let split1 = url.split('#')
    let split2 = split1[0].split('/wiki/')
    let filename = split2[1];
    return filename;
}


module.exports = getImageInfo;

// let url = "https://commons.wikimedia.org/wiki/File:Eurasian_blue_tit_Lancashire.jpg#mw-jump-to-license"
// getImageInfo(url)

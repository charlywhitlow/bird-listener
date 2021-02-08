const HTMLParser = require('node-html-parser');
const getRequest = require('../util/apiRequest.js');


// get required fields for given wikimedia info page url
async function getImageInfo(image_info_url){

    let query_url = "https://en.wikipedia.org/w/api.php?" + 
        "action=query&prop=imageinfo&iiprop=extmetadata&titles=" +
        getFilenameFromURL(image_info_url) + 
        "&format=json"

    let response = await getRequest(query_url);
    let page_key = (Array.isArray(Object.keys(response.query.pages))) ?
        Object.keys(response.query.pages)[0] :
        Object.keys(response.query.pages);

    if ('imageinfo' in response.query.pages[page_key]){
        let imageInfo = response.query.pages[page_key].imageinfo[0].extmetadata;
        return getSelectedFields(imageInfo);
    }else{
        return {
            'image_update_manually' : true
        }
    }
}
// get all fields for given wikimedia info page url
async function getImageInfoAllFields(image_info_url){

    let query_url = "https://en.wikipedia.org/w/api.php?" + 
        "action=query&prop=imageinfo&iiprop=extmetadata&titles=" +
        getFilenameFromURL(image_info_url) + 
        "&format=json"
    
    let response = await getRequest(query_url);
    let page_key = Object.keys(response.query.pages)[0];
    let recording_info = response.query.pages[page_key].imageinfo[0].extmetadata;

    return recording_info;
}
// get required database fields from imageInfo json
function getSelectedFields(imageInfo){
    return {
        'image_author_raw' : imageInfo.Artist.value,
        'image_author' : HTMLParser.parse(imageInfo.Artist.value).innerText,
        'image_license_code' : imageInfo.LicenseShortName.value,
        'image_license_url' : imageInfo.LicenseUrl.value
    }
}
// get image filename from wikimedia image URL
function getFilenameFromURL(url){
    return url.split('/wiki/')[1];
}
// remove any #section links from imageInfoURL
function extractMainImageInfoURL(url){
    return url.split('#')[0];
}


module.exports = {
    extractMainImageInfoURL,
    getImageInfo,
    getImageInfoAllFields
}

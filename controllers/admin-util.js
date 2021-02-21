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

module.exports = {
    uploadCSV,
    checkCSVHeaders
}

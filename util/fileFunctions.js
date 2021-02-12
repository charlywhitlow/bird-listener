const fs = require('fs');
const { Parser } = require('json2csv');


// archive file
async function archiveFile(filePath){
    let archivePath = getArchivePath(filePath);
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.rename(filePath, archivePath, function (err) {
                if (err) {
                    return reject({
                        "status":"error",
                        "error": err
                    });
                }
            })
        }else{
            return resolve({
                "status": "ok",
                "message": "file doesn't exist"
            });    
        }
        return resolve({
            "status": "ok"
        });
    })
}
function getArchivePath(filePath){
    let timestamp = timeStamp();
    let ext = filePath.split('.')[1];
    let root = filePath.substring(0, filePath.search('data')+4)
    return root+'/archive/birds_'+ext+'_'+timestamp+'.'+ext;
}
function timeStamp(){
    let date = new Date();
    let dateString = 
        date.getFullYear() +"-"+ 
        zeroPad(date.getMonth()+1, 2) +"-"+
        zeroPad(date.getDate(), 2) +"_"+
        zeroPad(date.getHours(), 2) +":"+
        zeroPad(date.getMinutes(), 2) +":"+
        zeroPad(date.getSeconds(), 2)
    return dateString;
}
function zeroPad(num, targetLength){
    return num.toString().padStart(targetLength, 0);
}

// write files
async function writeCSV(json, writePath){
    return new Promise((resolve, reject) => {
        
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(json);    

        fs.writeFile(writePath, csv,
            err => {
                if (err) {
                    return reject({
                        'status':'error',
                        'error': err
                    });
                };
                return resolve({
                    'status': 'ok',
                    'message': 'csv created'
                });
            }
        )
    })
}
async function writeJSON(json, writePath){
    return new Promise((resolve, reject) => {
        fs.writeFile(writePath, JSON.stringify(json), 
            err => {
                if (err) {
                    return reject({
                        'status':'error',
                        'error': err
                    });
                };
                return resolve({
                    'status': 'ok',
                    'message': 'json created'
                });
            }
        )
    })
}


module.exports = {
    archiveFile,
    writeCSV,
    writeJSON
}

const fs = require('fs');
const { Parser } = require('json2csv');
const birdsJSON = 'data/birds.json';
const birdsCSV = 'data/birds.csv';


// archive
async function archiveBirdsCSV(){
    
    let timestamp = timeStamp();
    let archivePath = 'data/archive/'+'birds_csv_'+timestamp+'.csv';

    return new Promise((resolve, reject) => {
        if (fs.existsSync(birdsCSV)) {
            fs.rename(birdsCSV, archivePath, function (err) {
                if (err) {
                    return reject({
                        "status":"error",
                        "error": err
                    });
                }
            })
        }
        return resolve({
            "status": "ok"
        });
    })
}
async function archiveBirdsJSON(){

    let timestamp = await timeStamp();
    let archive_path = 'data/archive/birds_json_'+timestamp+'.json';

    return new Promise((resolve, reject) => {
        if (fs.existsSync(birdsJSON)) {
            fs.rename(birdsJSON, archive_path, function (err) {
                if (err) {
                    return reject({
                        "status":"error",
                        "error": err
                    });
                }
            })
        }
        return resolve({
            "status": "ok"
        });
    })
}
function timeStamp(){
    let date = new Date();
    let dateString = 
        date.getFullYear()+"-"+ 
        date.getMonth()+1+"-"+
        date.getDate()+"_"+
        date.getHours()+":"+
        date.getMinutes()+":"+
        date.getSeconds()
    return dateString;
}

// write files
async function writeCSV(json, writePath=birdsCSV){
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
async function writeJSON(json, writePath=birdsJSON){
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
    archiveBirdsJSON,
    archiveBirdsCSV,
    writeCSV,
    writeJSON
}

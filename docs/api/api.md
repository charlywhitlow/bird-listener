# API

## Users
### check-username-available
    curl -X POST \
    http://localhost:8000/api/users/check-username-available \
    -H 'Content-Type: application/json' \
    -d '{ "username": "john" }'

```json
{"status":"ok","message":"Username available"}
```
```json
{"message":"Username taken"}
```
### check-email-available
    curl -X POST \
    http://localhost:8000/api/users/check-email-available \
    -H 'Content-Type: application/json' \
    -d '{ "email": "john@test.com" }'

```json
{"status":"ok","message":"Email available"}
```
```json
{"message":"Email already registered"}
```
### signup
    curl -X POST \
    http://localhost:8000/api/users/signup \
    -H 'Content-Type: application/json' \
    -d '{ "username": "john", "email": "john@test.com", "password": "1234" }'

```json
{"status":"ok","message":"User created"}
```
```json
{"message":"Email already registered, please login or try again"}
```
```json
{"message":"Username taken, please try again"}
```
```json
{"error":"user validation failed: email: Please enter a valid email"}
```
### login (with username)
    curl -X POST \
    http://localhost:8000/api/users/login \
    -H 'Content-Type: application/json' \
    -d '{ "username": "john", "password": "1234" }'

```json
{
    "status":"ok",
    "message":"User logged in",
    "user":{
        "_id":"XXX",
        "username":"john"
    }
}
```
```json
{"message":"User not found"}
```
### login (with email)
    curl -X POST \
    http://localhost:8000/api/users/login \
    -H 'Content-Type: application/json' \
    -d '{ "username": "john@test.com", "password": "1234" }'

```json
{
    "status":"ok",
    "message":"User logged in",
    "user":{
        "_id":"XXX",
        "username":"john"
    }
}
```
```json
{"message":"User not found"}
```
__________________

## Birds db
### get all birds in db
    curl -X GET \
    http://localhost:8000/api/birds/all \
    -H 'Content-Type: application/json'

```json
{   
    "status":"ok",
    "birds":[
        {
            "_id":"600afd62e8d87d5f17efdf7c",
            "common_name":"Robin",
            "scientific_name":"Erithacus rubecula",
            "__v":0
        },
        {
            "_id":"600b03496cab9f66ff80ef47",
            "common_name":"Blue tit",
            "scientific_name":"Cyanistes caeruleus",
            "__v":0
        }
    ]
}
```
### get a specific bird from db (by common name)
    curl -X POST \
    http://localhost:8000/api/birds/get \
    -H 'Content-Type: application/json' \
    -d '{ "common_name": "Robin" }'

```json
{
    "status":"ok",
    "bird":{
        "_id":"600afd62e8d87d5f17efdf7c",
        "common_name":"Robin",
        "scientific_name":"Erithacus rubecula",
        "__v":0
    }
}
```
### get a specific bird from db (by scientific name)
    curl -X POST \
    http://localhost:8000/api/birds/get \
    -H 'Content-Type: application/json' \
    -d '{ "scientific_name": "Erithacus rubecula" }'

```json
{
    "status":"ok",
    "bird":{
        "_id":"600afd62e8d87d5f17efdf7c",
        "common_name":"Robin",
        "scientific_name":"Erithacus rubecula",
        "__v":0
    }
}
```
### get next bird from user queue (and return it to back of queue)
    curl -X POST \
    http://localhost:8000/api/birds/get-next-bird \
    -H 'Content-Type: application/json' \
    -d '{ "username": "cdog" }'


```json
{
    "status":"ok",
    "message":"bird retrieved and moved to back of queue",
    "nextBird":{
        "_id":"600c59a99bee2f42c54d47b8",
        "common_name":"Robin"
    }
}
```
### add a single bird to the database
    curl -X POST \
    http://localhost:8000/api/birds/add \
    -H 'Content-Type: application/json' \
    -d '{ "common_name": "Robin", "scientific_name": "Erithacus rubecula" }'

```json
{
    "status":"ok",
    "message":"Bird added"
}
```
__________________

## Admin
### status
    curl -X GET \
    http://localhost:8000/api/status \
    -H 'Content-Type: application/json'
```json
{"status":"ok"}
```
### view birds.json file
    curl -X GET \
    http://localhost:8000/api/admin/view-birds-json \
    -H 'Content-Type: application/json'

```json
{
    "status":"ok",
    "birds":[ <array of birds> ]
}
```
### init db from birds.json file (and update user queues)
    curl -X GET \
    http://localhost:8000/api/admin/init-db \
    -H 'Content-Type: application/json'

```json
{"status":"ok","message":"database and user queues updated"}
```
### update birds species csv with sound/image info
    curl -X GET \
    http://localhost:8000/api/admin/update-csv \
    -H 'Content-Type: application/json'

```json
{"status":"ok","message":"csv updated"}
```
### create birds.json file from bird.csv
    curl -X GET \
    http://localhost:8000/api/admin/create-birds-json \
    -H 'Content-Type: application/json'

```json
{"status":"ok","message":"json created"}
```

### Xeno-Canto
### get recording info (database fields only)
    curl -X POST \
    http://localhost:8000/api/xeno-canto/get-recording-info \
    -H 'Content-Type: application/json' \
    -d '{ "xeno_id": "616438" }'

```json
{
    "status":"ok",
    "recording-obj":{
        "sound-url":"https://www.xeno-canto.org/sounds/uploaded/YYFMYIKWKB/XC616438-09Jan2021BirminghamUK.wav",
        "sonogram-url":"https://www.xeno-canto.org/sounds/uploaded/YYFMYIKWKB/ffts/XC616438-med.png",
        "license-url":"https://creativecommons.org/licenses/by-nc-sa/4.0/",
        "recordist":"James Ramsay",
        "location":"Great Britain (near  Birmingham), West Midlands, England",
        "download-link":"https://www.xeno-canto.org/616438/download",
        "filename":"XC616438-09Jan2021BirminghamUK.wav"}
}
```
### get recording info (all fields)
    curl -X POST \
    http://localhost:8000/api/xeno-canto/get-recording-info \
    -H 'Content-Type: application/json' \
    -d '{ "xeno_id": "616438", "all_fields" : "true" }'

```json
{
    "status":"ok",
    "recording":{
        "id":"616438",
        "gen":"Erithacus",
        "sp":"rubecula",
        "ssp":"",
        "en":"European Robin",
        "rec":"James Ramsay",
        "cnt":"United Kingdom",
        "loc":"Great Britain (near  Birmingham), West Midlands, England",
        "lat":null,
        "lng":null,
        "alt":"130",
        "type":"uncertain",
        "url":"//www.xeno-canto.org/616438",
        "file":"//www.xeno-canto.org/616438/download",
        "file-name":"XC616438-09Jan2021BirminghamUK.wav",
        "sono":{
            "small":"//www.xeno-canto.org/sounds/uploaded/YYFMYIKWKB/ffts/XC616438-small.png",
            "med":"//www.xeno-canto.org/sounds/uploaded/YYFMYIKWKB/ffts/XC616438-med.png",
            "large":"//www.xeno-canto.org/sounds/uploaded/YYFMYIKWKB/ffts/XC616438-large.png",
            "full":"//www.xeno-canto.org/sounds/uploaded/YYFMYIKWKB/ffts/XC616438-full.png"
        },
        "lic":"//creativecommons.org/licenses/by-nc-sa/4.0/",
        "q":"A",
        "length":"0:30",
        "time":"06:30","date":"2021-01-09",
        "uploaded":"2021-01-21",
        "also":[""],
        "rmk":"The recording is as was heard except for a HPF at about 1k and a boost at 4k. \r\nThis bird sings every morning from about 5.30am at least until 7.30am.\r\nI haven't seen it - it is in trees I think around a car park.\r\nTHe weather has been wet or dry, usually frosty.",
        "bird-seen":"no",
        "playback-used":"no"
        }
    }

```

### Wikimedia (TODO)
### get image info (all fields)
    curl -X POST \
    http://localhost:8000/api/wikimedia/get-image-info \
    -H 'Content-Type: application/json' \
    -d '{ "tbc": "tbc" }'

```json
```
### get image info (database fields only)
    curl -X POST \
    http://localhost:8000/api/wikimedia/get-image-info \
    -H 'Content-Type: application/json' \
    -d '{ "tbc": "tbc", "database_fields" : "true" }'

```json
{
}
```

__________________

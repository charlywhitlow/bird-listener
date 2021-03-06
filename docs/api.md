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
______________________________________

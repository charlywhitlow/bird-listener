
# Bird Listener

A web app to learn about UK bird sounds.

https://bird-listener.herokuapp.com/

__________________

## API

### status
    curl -X GET \
    http://localhost:8000/api/status \
    -H 'Content-Type: application/json'

        >> {"status":"ok"}

### check-username-available
    curl -X POST \
    http://localhost:8000/api/check-username-available \
    -H 'Content-Type: application/json' \
    -d '{ "username": "john" }'

        >> {"status":"ok","message":"Username available"}
        >> {"message":"Username taken"}

### check-email-available
    curl -X POST \
    http://localhost:8000/api/check-email-available \
    -H 'Content-Type: application/json' \
    -d '{ "email": "john@test.com" }'

        >> {"status":"ok","message":"Email available"}
        >> {"message":"Email already registered"}

### signup
    curl -X POST \
    http://localhost:8000/api/signup \
    -H 'Content-Type: application/json' \
    -d '{ "username": "john", "email": "john@test.com", "password": "1234" }'

        >> {"status":"ok","message":"User created"}
        >> {"message":"Email already registered, please login or try again"}
        >> {"message":"Username taken, please try again"}
        >> {"error":"user validation failed: email: Please enter a valid email"}

### login (with username)
    curl -X POST \
    http://localhost:8000/api/login \
    -H 'Content-Type: application/json' \
    -d '{ "username": "john", "password": "1234" }'

        >> {"status":"ok","message":"User logged in","user":{"_id":"XXX","username":"john"}}
        >> {"message":"User not found"}

### login (with email)
    curl -X POST \
    http://localhost:8000/api/login \
    -H 'Content-Type: application/json' \
    -d '{ "username": "john@test.com", "password": "1234" }'

        >> {"status":"ok","message":"User logged in","user":{"_id":"XXX","username":"john"}}
        >> {"message":"User not found"}

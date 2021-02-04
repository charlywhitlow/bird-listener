
# Bird Listener

A web app to learn about UK bird sounds.

https://bird-listener.herokuapp.com/
______________________________________
## Admin tasks
### Initialise database

1. Load birds.csv to birds.json
``` 
    curl -X GET \
    http://localhost:8000/api/admin/create-birds-json \
    -H 'Content-Type: application/json'
```

2. Update birds.json by extracting additional fields from wikimedia / xeno-canto
``` 
    curl -X GET \
    http://localhost:8000/api/admin/update-csv \
    -H 'Content-Type: application/json'
```

3. Write updated birds.json file to csv
``` 
    TODO
```

4. Update css object-position x and y coordinates
``` 
    TODO
```

5. Load updated birds.csv to birds.json
``` 
    // can we use this as is?
    curl -X GET \
    http://localhost:8000/api/admin/create-birds-json \
    -H 'Content-Type: application/json'
```
6. Write updated birds.json file to database
``` 
    curl -X GET \
    http://localhost:8000/api/admin/init-db \
    -H 'Content-Type: application/json'
```
______________________________________

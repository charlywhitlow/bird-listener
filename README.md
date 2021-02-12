
# Bird Listener

A web app to learn about UK bird sounds.

https://bird-listener.herokuapp.com/
______________________________________
## To initialise / update database:

1. ### Create birds.json from birds.csv

    * This first archives existing `birds.json` to `data/archive` directory
    * It then loads file `birds.csv` and writes contents to new `birds.json`

    ``` 
        curl -X GET \
        http://localhost:8000/api/admin/create-birds-json-from-csv \
        -H 'Content-Type: application/json'
    ```

2. ### Populate birds.json and birds.csv with additional fields from wikimedia / xeno-canto

    * This loads the current `birds.json` file
    * It uses the value in `xeno_id` column to extract information about the recording from Xeno-Canto
    * It uses the value in `image_info_url` column to extract information about the image from Wikimedia Commons
    * It then archives the current `birds.json` file to `data/archive`, and writes the updated json back to `birds.json`
    * Finally it archives the current `birds.csv` file to `data/archive`, then writes the updated json to `birds.csv` for manual checking

    ``` 
        curl -X GET \
        http://localhost:8000/api/admin/populate-birds-json-and-csv \
        -H 'Content-Type: application/json'
    ```

3. ### Manual checking

    * The programmatically pulled additional fields in `birds.csv` may have some problems which require manual checking, in particular:

        * Look in `image_update_manually` column for any rows with a 'true' need to be updated manually

        * Check `image_author` against `image_author_raw` to check an appropriate value has been extracted

        * Check values in other image and sounds columns look sensible
    
    * Next update the css object-fit values:

        * The following page can be used to loop through and update any rows of the spreadsheet which have blanks in either the image_css_x/y columns:

            * http://localhost:8000/admin/object-position

4. ### Update database from updated birds.csv file

    * When the manual checks are complete, we can run the `init-db-from-csv` function
    * This first loads the updated `birds.csv` and uses it to update `birds.json`
    * It then uses the updated `birds.json` file to build the database
    * NB- if running locally, can't run this using nodemon / devStart script as updating the json file restarts the server. Use `node app.jss` instead

``` 
    curl -X GET \
    http://localhost:8000/api/admin/init-db-from-csv \
    -H 'Content-Type: application/json'
```
______________________________________

## To view current birds.json:

* This loads and returns the current `birds.json`

    ``` 
        curl -X GET \
        http://localhost:8000/api/admin/view-birds-json \
        -H 'Content-Type: application/json'
    ```
______________________________________

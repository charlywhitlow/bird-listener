
# Bird Listener

This web app has been created to enable users to build and practice their knowledge of UK bird songs and calls.

#### See in action at:
### https://bird-listener.herokuapp.com/
(nb- hosted with Heroku's free tier in which app is powered off until accessed, so have patience when first loading the website)
_______________________________________________________________________________
### Git branch structure / auto-deployments:

* DEV
    * `dev` branch is default branch
    * create feature branches from dev
    * updates to `dev` auto-deploy to test environment:
        * https://bird-listener-dev.herokuapp.com/

* PROD
    * `prod` branch is project master (but not default)
    * updates to `prod` auto-deploy to production:
        * https://bird-listener.herokuapp.com/
_______________________________________________________________________________
## Install locally

1. Clone repo
    * `git clone git@github.com:charlywhitlow/bird-listener.git`
2. Install packages
    * `cd bird-listener`
    * `npm install`
3. Set up MongoDB database
    * I used MongoDB Atlas. Follow the steps to create a free account/database:
        * https://docs.atlas.mongodb.com/getting-started/
        * Make sure to add IP to whitelist
        * Get connection string from cluster page- 'connect', 'connect your application'
4. Create `.env` file consisting of the following:
    ```
    MONGO_CONNECTION_URL=[get connection string from MongoDB]
    TOKEN_SECRET=[password for creating tokens, enter a long random string]
    ```
5. Launch app
    * `npm run devStart`
        * recommended: runs with nodemon, restarting server on save
    * `node app.js`
    * view in browser: http://localhost:8000
6. Create new user in app using 'sign up'
7. Open MongoDB and manually set your new user to **admin = true**
8. Populate database from init CSV files:
    * Refreshing the 'menu' page should reveal an 'admin' button
    * In the admin dashboard, work through steps 1-4 as directed, adding names, sounds, images, and finally updating user queues
    * Init CSVs are located in: `data/init` dir

After following these steps you hopefully have a working website containing a sample of birds.
_______________________________________________________________________________
### Credits

All recordings are sourced from [Xeno-Canto](https://www.xeno-canto.org/)

All images are sourced from [Wikimedia Commons](https://commons.wikimedia.org/wiki/Commons:Welcome)

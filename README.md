# OpenSourcery::Beer

Code to run [beer.opensourcery.com](http://beer.opensourcery.com)

## Installation

 * `npm install`
 * `npm install supervisor -g`
 * `sudo apt-get install redis-server` or on a Mac: `brew install redis`
 * `supervisor app.js`

### Connecting to Untappd

 * Setup `config/secret.js` as follows:
   ```
   module.exports = {
     clientId: YourClientId,
     clientSecret: YourSecretKey,
     debug: false
   }
   ```

## Updating data from kegbot

  You will need a secret key. Send POST requests to {domain}/api with
  the following parameters:

    ```
    access_token: SECRETKEY
    temperature: Temperature in F
    kegs: [ percentKeg1, percentKeg2 ]
    ```

  For example, `kegs: [0.77, 0.42]` would indicate keg 1 is at 77% and keg 2 is at 42%.

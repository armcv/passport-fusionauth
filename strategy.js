// Load modules.
var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')
  , uri = require('url')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , request = require('request')
  , jwt = require('jsonwebtoken')
  , Profile = require('./lib/profile/profile');



/**
 * `Strategy` constructor.
 *
 * The Fusionauth authentication strategy authenticates requests by delegating to
 * Fusionauth using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Fusionauth application's client id
 *   - `clientSecret`  your Fusionauth application's client secret
 *   - `callbackURL`   URL to which Fusionauth will redirect the user after granting authorization
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL;
  options.tokenURL = options.tokenURL;

  OAuth2Strategy.call(this, options, verify);
  this.name = 'oauth2';
  this._userProfileURL = options.userProfileURL;
  
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Google.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `oauth2`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
    var decoded = jwt.decode(accessToken, { complete: true }); // Decode accessToken
    var url = this._userProfileURL + decoded.payload.sub; //set url
  
    //set header
    var headers = {
      'Authorization': 'JWT ' + accessToken
    };
    
    //set request parameter
    request.get({ headers: headers, url: url, null: null, method: 'GET' }, function (err, r, body) {
      var json;
  
      if (err) {
        console.log('error:', err); // Print the error if one occurred
        console.log('statusCode:', r && r.statusCode); // Print the response status code
     
        if (err.data) {
          try {
            json = JSON.parse(err.data);
          } catch (_) { }
        }
  
        if (json && json.message) {
          return done(new APIError(json.message));
        }
        return done(new InternalOAuthError('Failed to fetch user profile', err));
      }
  
      try {
        json = JSON.parse(body);
      } catch (ex) {
        return done(new Error('Failed to parse user profile'));
      }
  
      var profile = Profile.parse(json.user);
      profile.provider = 'oauth2';
      profile._raw = body;
      profile._json = json;
      done(null, profile);
    });

}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
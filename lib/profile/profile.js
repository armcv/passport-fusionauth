/**
 * Parse profile.
 *
 * Parses user profiles as fetched from Fusionauth user
 * info endpoint.
 *
 * The amount of detail in the profile varies based on the scopes granted by the
 * user. The following scope values add additional data:
 *
 *     `profile` - basic profile information
 *     `email` - email address
 *
 * References:
 *   - https://developers.google.com/identity/protocols/OpenIDConnect
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function(json) {
    if ('string' == typeof json) {
      json = JSON.parse(json);
    }
    
    var profile = {};
    profile.id = json.id;
    profile.displayName = json.fullName || json.username;
    if (json.family_name || json.given_name) {
      profile.name = { familyName: json.family_name,
                       givenName: json.given_name };
    }
    if (json.email) {
      profile.emails = [ { value: json.email, verified: json.verified } ];
    }
    if (json.picture) {
      profile.photos = [{ value: json.picture }];
    }
    
    return profile;
  };
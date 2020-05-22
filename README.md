# passport-fusionauth

[Passport](http://passportjs.org/) strategy for authenticating with [FusionAuth](https://fusionauth.io/)
using the OAuth 2.0 API.

This module lets you authenticate using FusionAuth in your Node.js applications.
By plugging into Passport, FusionAuth authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```bash
$ npm install passport-fusionauth
```

## Usage

#### Create an Application

Before using `passport-fusionauth`, you must register an application with FusionAuth.
Your application will be issued a client identifier (Client Id) and client secret (Client Secret), which
need to be provided to the strategy. You will also need to configure a callback
URL which matches the route in your application.

#### Configure Strategy

The FusionAuth authentication strategy authenticates users using a FusionAuth account
and OAuth tokens. The client id and client secret obtained when creating
an application are supplied as options when creating the strategy.  
## License

[The MIT License](http://opensource.org/licenses/MIT)

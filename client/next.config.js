const withCSS = require("@zeit/next-css")

module.exports = withCSS({
    publicRuntimeConfig: {
        APP_NAME: 'TECH4TECH',
        API: 'http://localhost:8080/api',
        PRODUCTION: false,
        DOMAIN: 'http://localhost:8000',
        FB_APP_ID: 'JASJFDASFDASDFASDF'
    }
})

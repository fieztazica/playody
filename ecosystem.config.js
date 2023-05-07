require('dotenv').config()
module.exports = {
    apps : [{
        name   : "playody",
        script : "server.js",
        node_args : '-r dotenv/config',
        env_production: {
            NODE_ENV: "production",
            PORT: process.env.PORT
        },
        env_development: {
            NODE_ENV: "development"
        },
        watch: true
    }]
}
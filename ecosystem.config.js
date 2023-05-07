module.exports = {
    apps : [{
        name   : "playody",
        script : "server.js",
        env_production: {
            NODE_ENV: "production",
        },
        env_development: {
            NODE_ENV: "development"
        },
        watch: true
    }]
}
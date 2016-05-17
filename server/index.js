const server = require('./server.js')

server.start(function(err) {
    if (err) throw err;
    console.log("Server is running at: ", server.info.uri);
})

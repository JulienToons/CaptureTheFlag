
/*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström 
    
    http://underscorediscovery.com
    
    MIT Licensed. See LICENSE for full license.
    Usage : node simplest.app.js
*/

   var 
        gameport        = process.env.PORT || 4004,

        io              = require('socket.io'),
        express         = require('express'),
        UUID            = require('node-uuid'),

        verbose         = false,
        app             = express.createServer();

    
    //Tell the server to listen for incoming connections
    app.listen( gameport );

    //Log something so we know that it succeeded.
    console.log('\t :: Express :: Listening on port ' + gameport );

    //By default, we forward the / path to index.html automatically.
    app.get( '/', function( req, res ){ 
        res.sendfile( __dirname + '/index.html' );
    });


    //This handler will listen for requests on /*, any file from the root of our server.
    //See expressjs documentation for more info on routing.

    app.get( '/*' , function( req, res, next ) {

        //This is the current file they have requested
        var file = req.params[0]; 

        //For debugging, we can track what files are requested.
        if(verbose) console.log('\t :: Express :: file requested : ' + file);  //verbose set to false

        //Send the requesting client the file.
        res.sendfile( __dirname + '/' + file );

    }); //app.get *



/* Socket.IO server set up. */

//Express and socket.io can work together to serve the socket.io client files for you.
//This way, when the client requests '/socket.io/' files, socket.io determines what the client needs.
        
    //Create a socket.io instance using our express server
    var sio = io.listen(app);

    //Configure the socket.io connection settings. 
    //sio.configure(function (){

       // sio.set('log level', 0);

        sio.set('authorization', function (handshakeData, callback) {
          callback(null, true); // error first callback style 
        });

    //});

    //Socket.io will call this function when a client connects, 
    //So we can send that client a unique ID we use so we can 
    //maintain the list of players.
    sio.sockets.on('connection', function (client) {
        
        //Generate a new UUID, looks something like 
        //and store this on their socket/connection
        client.userid = UUID();

         //tell the player they connected, giving them their id
        client.emit('onconnected', { id: client.userid } );

        //Useful to know when someone connects
        console.log('\t socket.io:: player ' + client.userid + ' connected!');
        
        //When this client disconnects
        client.on('disconnect', function () {

            //Useful to know when someone disconnects
            console.log('\t socket.io:: client disconnected :( ' + client.userid );

        }); //client.on disconnect
     
    }); //sio.sockets.on connection



    /* USE THE FOLLOWING CODE IN THE INDEX PAGE TO CALL THIS SCRIP
T    <!-- Notice the URL, this is handled by socket.io on the server automatically, via express -->
        <script type="text/javascript" src="/socket.io/socket.io.js"></script>
        
            <!-- This will create a connection to socket.io, and print the user serverid that we sent from the server side. --> 
        <script type="text/javascript">

                //This is all that needs
            var socket = io.connect('/');

                //Now we can listen for that event
            socket.on('onconnected', function( data ) {

                    //Note that the data is the object we sent from the server, as is. So we can assume its id exists. 
                console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );

            });

        </script>
    */
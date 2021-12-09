/*
 * This script is the entry point to the server.
 * 
 * @author Colby O'Keefe (A00428974)
 */

// requires
const EventEmitter = require("events");
let express = require("express");
let app = express();
let expressWS = require("express-ws")(app);

// creates a new event emitter and forward to lobby.js/game.js
let requestHandler = new EventEmitter();
require("./handlers/lobby.js")(requestHandler);
require("./handlers/matchmaking.js")(requestHandler)
require("./handlers/game.js")(requestHandler);

app.ws("/", (ws, req) => {
	// Emits an event when the server recieves a message
	ws.on("message", (rawData) => {
		const data = JSON.parse(rawData);
		try {
			requestHandler.emit(data.requestType, data, req);
		} catch(e) {
			console.log(e);
		}
	});
	
	// Emits close event on close
	ws.on("close", () => {
		requestHandler.emit("close", {}, req);
	});    
});

// Listens on port 8010 currently
app.listen(8010);

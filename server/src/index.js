const EventEmitter = require("events");
let express = require("express");
let app = express();
let expressWS = require("express-ws")(app);

let requestHandler = new EventEmitter();
require("./handlers/lobby.js")(requestHandler);
require("./handlers/game.js")(requestHandler);

app.ws("/", (ws, req) => {
	ws.on("message", (rawData) => {
		const data = JSON.parse(rawData);
		try {
			requestHandler.emit(data.requestType, data, req);
		} catch(e) {
			console.log(e);
		}
	});

	ws.on("close", () => {
		requestHandler.emit("close", {}, req);
	});    
});

app.listen(8010);

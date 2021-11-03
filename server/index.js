let express = require("express");
let app = express();
let expressWS = require("express-ws")(app);

const MAX_TIMEOUT = 2000;

var roomList = {
	"Test" : { // TODO: Check for repeating RID's
		"userList": [],
		"roomName": "Test Room",
		"messages": []
	} 
};
//TODO: Fix Memory Leak: Remove User from userWebSocket List when leave Server.
var userWebSockets = {}

function getUserFromWS(ws) {
	var UID = null;
	for (let key in userWebSockets) {
		if (userWebSockets[key] === ws) {
			UID = key;
			break;
		}
	}
	
	for (let key in roomList) {
		var foundUser = roomList[key].userList.find(u => u.user.UID === UID);
		if (foundUser !== undefined) return foundUser.user;
	}
	return undefined;
}

function getUserIndex(UID) {
	for (let key in roomList) {
		var foundIndex = roomList[key].userList.findIndex(u => u.user.UID === UID);
		if (foundIndex !== -1) return foundIndex;
	}
	return -1;
}

function joinRoom(RID, user, ws) {
	console.log(Object.keys(userWebSockets).length);
	if (roomList[RID] === undefined) {
		return false;
	}
	var foundUser = roomList[RID].userList.find((e) => {
		return e.user.UID == user.UID
	});

	if (foundUser === undefined) {
		console.log("New User!!!");
		const packet = {
			"user": user,
		}
		userWebSockets[user.UID] = ws;
		roomList[RID].userList.push(packet);
		return true;
	}
	else {
		console.log("Here!")
		userWebSockets[foundUser.user.UID] = ws; 
		return false;
	}
}

function emitToRoom(RID, packet) {
	roomList[RID].userList.forEach(u => userWebSockets[u.user.UID].send(JSON.stringify(packet)));
}

function removeUser(RID, userIndex) {
	let isLeader = roomList[RID].userList[userIndex].user.isLeader; 
	roomList[RID].userList.splice(userIndex, 1);
	emitToRoom(RID, {
		"responseType": "updateRoom",
		"room": roomList[RID]
	});

	if (isLeader && roomList.userList !== undefined) {
		roomList[RID].userList[0].user.isLeader = true;
		updateRoom(RID);
	}
}

function clearRooms() {
	for (let key in roomList) {
		roomList[key].userList.forEach((user, index, array) => {
			if(userWebSockets[user.user.UID].readyState === 3) {
				if(Date.now() - user.user.closeTime > MAX_TIMEOUT) {
					removeUser(key, index);
				}
			}
		});
		if (roomList[key].userList.length === 0) {
			delete roomList[key];
		}
	}

}

function updateRoom(RID) {
	
	emitToRoom(RID, {
		"responseType": "updateRoom",
		"room": roomList[RID]
	});
}

function addMessage(text, RID, user) {
	const message =  {
		"message": text,
		"userName": user.Name
	}
	roomList[RID].messages.push(message);

	updateRoom(RID);
}

app.ws("/", (ws, req) => {
	console.log("New connection has opened!");
	
	setInterval(() => {
		clearRooms();
	}, 5000);

	ws.on("open", () => {console.log("Opened! :>")});
	ws.on("message", (rawData) => {
		const data = JSON.parse(rawData);

		switch(data.requestType) {
			case "getRoomList":
			{
				console.log("At Get Room List")
				const packet = {
					"responseType": "updateRoomList",
					"roomList": roomList 
				};
				
				req.ws.send(JSON.stringify(packet));
				break;
			}
			case "joinRoom":
			{
				//console.log("At Join Room");
				//console.log(data);
				var hasNewUser = joinRoom(data.RID, data.user, req.ws);
				if(hasNewUser) {
					console.log("Emmiting to Room " + data.RID);
					updateRoom(data.RID);
				}
				
				break;
			}
			case "createRoom":
			{
				roomList[data.RID] = {
					"userList": [],
					"roomName": data.roomName,
					"messages": []
				}
				data.user.isLeader = true;
				joinRoom(data.RID, data.user, req.ws);
				//TODO: Make Case Into Functions (events)
				break;
			}
			case "getRoom":
			{
				const packet = {
					"responseType":"getRoom",
					"room":roomList[data.RID]
				}
				req.ws.send(JSON.stringify(packet));
				break;
			}
			case "exitRoom":
				let foundIndex = getUserIndex(data.user.UID);
				console.log(foundIndex)
				if (foundIndex !== -1) removeUser(data.RID, foundIndex);
				break;
			case "sendMessage":
				addMessage(data.message, data.RID, data.user);
				break;
			case "removeMessage":
				break;
			default:
				break;
		}

	});
	
	ws.on("close", () => {
		console.log("Closed! :<");
		let user = getUserFromWS(req.ws);
		if (user !== undefined) { 
			user.closeTime = Date.now();
		}
		req.ws.close();
	});

	
	
});

app.listen(8010);


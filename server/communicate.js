let serverData = require("./data.js");

function formatRoom(room) {
	return {
		"userList": room.userList,
		"roomName": room.roomName,
		"messages": room.messages,
		"slots": room.slots,
		"solved": room.solved,
		"currentScore": room.currentScore,
		"currentPlayerIndex": room.currentPlayerIndex,
		"usedLetters": room.usedLetters,
		"currentRound": room.currentRound,
		"maxNumberOfRounds": room.maxNumberOfRounds, 
		"currentPuzzleNumber": room.currentPuzzleNumber,
		"puzzlesPerRound": room.puzzlesPerRound,
		"puzzleQuestion": room.puzzleQuestion,
		"puzzleHint": room.puzzleHint,
		"puzzlePhrase": room.puzzlePhrase,
		"correctScore": room.correctScore,
		"lastKey": room.lastKey,
		"lossModifier": room.lossModifier,
		"maxPlayerCount": room.maxPlayerCount,
		"status": room.status,
		"hasVowel": room.hasVowel,
		"vowelPrice": room.vowelPrice
	};
}

module.exports = {
	"emitToRoom": (RID, packet) => {
		serverData.roomList[RID].userList.forEach(u => serverData.userWebSockets[u.UID].send(JSON.stringify(packet)));
	},
	"formatRoom": formatRoom,
	"formatRoomList": () => {
		var newRoomList = {};
		for (let key in serverData.roomList) {
			newRoomList[key] = (formatRoom(serverData.roomList[key]));
		}

		return newRoomList;
	}
};

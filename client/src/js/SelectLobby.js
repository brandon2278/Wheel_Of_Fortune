var createLobby; 
document.addEventListener("DOMContentLoaded", () =>  {
	createLobby = document.getElementById("create-lobby");
	createLobby.style.visibility = "hidden";
});

ws.onopen = () => {
	var packet = {"requestType": "getRoomList"};
	ws.send(JSON.stringify(packet));

	user = getUserInfomation();

	setInterval(() => {
		var packet = {"requestType": "getRoomList"};
		ws.send(JSON.stringify(packet));
	}, 5000);
};

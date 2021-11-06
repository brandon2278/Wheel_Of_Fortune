ws.onopen = () => {
	var packet = {"requestType": "getRoomList"};
	ws.send(JSON.stringify(packet));

	user = getUserInfomation();

	setInterval(() => {
		var packet = {"requestType": "getRoomList"};
		ws.send(JSON.stringify(packet));
	}, 5000);
};

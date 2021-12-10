<!--
	This file contains the code for the lobby page

	@author Colby O'Keefe (A00428974)
-->

<!DOCTYPE html>
<html lang="en">
<?php session_start();?>

<head>
	<?php include "../../src/php/getUser.php" ?>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" type="image/png" href="wallpapers/logo-5_0_0.png">
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">    
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
	<script src="../../src/js/Keyboard.js"></script>
	<link rel="stylesheet" href="../../src/style.css">
	<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
	<title>Wheel of Fortune</title>
</head>

<body align="center">
	<h2 align="center" class="lobby-title" id = "room-name"></h2>

	<div id = "lobby-content">
		<div id = "user-list-container">
			<h1 class="lobby-header">Users</h1>
			<div class="list-unstyled" id = "user-list">
			
			</div>
		</div>

		<div id = "middle-container">
			<h1 id = "player-count"></h1>
			<div id = "chat-container">
				<div id = "chat-window">
				</div>

				<input id = "message-box" class="useLobbyKeyboard"> <!-- Add Keybaord Here -->
				</input>
			</div>

			<div id = "control-container" align = "center">    
				<button onclick="readyUp()" class="btn btn-dark lobby-button" id="ready-up">Ready Up</button>
				<button onclick="forceStart()" class="btn btn-dark lobby-button" style = "display: none;" id="force-start">Force Start</button>
				<button onclick="leaveRoom()" class="btn btn-dark lobby-button" id="leave-room">Leave Room</button>
				<button onclick="reconnect()" class="btn btn-dark lobby-button" id="reconnect">Reconnect</button>
			</div>
		</div>
	</div>

</body>    
<script src = "../../src/js/Client.js"></script>
<script src="../../src/js/Lobby.js"></script>
</html>

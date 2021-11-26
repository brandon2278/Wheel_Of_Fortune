<!DOCTYPE html>
<html lang="en">
<?php session_start();?>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/png" href="wallpapers/logo-5_0_0.png">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">	
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    <script src = ./Client.js></script>
    <script src="Lobby.js"></script>
    <script src="Keyboard.js"></script>
    <link rel="stylesheet" href="style.css">
    <title>Wheel of Fortune</title>
    <script>
	function getUserInfomation() {
             return {
                 "Name": <?php echo '"'.$_SESSION['userId'].'"'; ?>,
                 "UID" : <?php echo '"'.$_SESSION['Id'].'"'; ?>
             }
        }
    </script>
</head>

<body align="center">

	<div id = "lobby-content">
		<div id = "user-list-container">
		<h1 style="margin: 20px">User List</h1>
			<ul class="list-unstyled" id = "user-list">
				
			</ul>
		</div>

		<div id = "middle-container">
			<h1 style="margin: auto;" id = "room-name"></h1>
			<h1 style="margin: auto;" id = "player-count"></h1>
			<div id = "chat-container">
				<div id = "chat-window">
				</div>

				<input id = "message-box" class="useLobbyKeyboard"> <!-- Add Keybaord Here -->
				</input>
			</div>

			<div id = "control-container" align = "center">	
				<button onclick="readyUp()" class="btn btn-dark" style="font-size: 2em;">Ready Up</button>
				<button onclick="forceStart()" class="btn btn-dark" style = "display: none; font-size: 2em;" id="force-start">Force Start</button>
				<button onclick="leaveRoom()" class="btn btn-dark" style="font-size: 2em">Leave Room</button>
			</div>
		</div>

		<div id = "game-info-container">
			<h1 style="margin: 20px">Game Infomation</h1>
		</div>	
	</div>

</body>	

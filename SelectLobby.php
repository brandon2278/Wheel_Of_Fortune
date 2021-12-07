<?php session_start();?>
<!DOCTYPE html>
<html lang="en">

<head>
	<script>
	function getUserInfomation() {
             return {
                 "Name": <?php echo '"'.$_SESSION['userId'].'"'; ?>,
		 "UID" : <?php echo '"'.$_SESSION['Id'].'"'; ?>,
		 "closeTime": -1,
		 "isLeader": false,
		 "isReady": false,
		 "score": 0,
		 "mouseX": 0,
		 "mouseY": 0,
		 "inGame": false,
		 "pointerColor": "red"
                }
        }
    </script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <style>
	.swal-overlay {
		z-index: 1;
	}
        .swal-modal {
            background-color: rgba(72, 21, 131, 0.9);
	    border: none;
        }

        .swal-title {
            color: rgb(255, 223, 79);
        }
    </style>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/png" href="wallpapers/logo-5_0_0.png">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">	
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
    <script> window.name = 'null' </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    <script src="./Keyboard.js"></script>
    <link rel="stylesheet" href="style.css">
    <title>Wheel of Fortune</title>
</head>

<body align="center">
 <section align="center" id="create-lobby" style = "position: fixed; width: 100vw; height: 60vh;">
        <div class="mask d-flex align-items-center h-100 gradient-custom-3">
            <div class="container h-100">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-12 col-md-9 col-lg-7 col-xl-6">
                        <div class="card bg-dark" style="border-radius: 15px; color:  rgb(255, 223, 79); --bs-bg-opacity: 0.8;">
                            <div class="card-body p-5">
                                <div>
                                    <h2 class="text-uppercase text-center mb-5">Create Game</h2>
                                </div>
                                    <div class="form-outline mb-4">
                                        <label class="form-label" for="word">name</label>
                                        <input id = "create-game-name" type="text" value = "New Lobby" class="useLobbyKeyboard form-control form-control-lg">
                                    </div>

                                    <div class="form-outline mb-4">
                                        <label class="form-label" for="sound">Player Count</label>
                                        <input id = "create-game-player-count" type="number" value = "4" class="form-control form-control-lg" max = "10">
                                    </div>

                                    <div class="form-outline mb-4">
                                        <label class="form-label" for="sound">Nubmer of Rounds</label>
                                        <input id = "create-game-round-count" type="number" value = "3" class="form-control form-control-lg">
                                    </div>

                                    <div class="form-outline mb-4">
                                        <label class="form-label" for="sound">Number of Puzzles per Round</label>
                                        <input id = "create-game-puzzle-count" type="number" value = "3" class="form-control form-control-lg">
                                    </div>

                                    <div class="form-outline mb-4">
                                        <label class="form-label" for="sound">Reward for Winning Round</label>
                                        <input id = "create-game-round-reward" type="number" value = "500" class="form-control form-control-lg">
                                    </div>

                                    <div class="form-outline mb-4">
                                        <label class="form-label" for="picture">Wrong Answer Multiplier</label>
                                        <input id = "create-game-bankrupt-multiplier" type="number" step = "0.1" value = "1" min = "0" max = "1" class="form-control form-control-lg">
				    </div>

                                    <div class="form-outline mb-4">
                                        <label class="form-label" for="picture">Vowel Price</label>
                                        <input id = "create-game-vowel-price" type="number" step= "1" value = "250" class="form-control form-control-lg">
				    </div>

				    <div class="form-outline-mb-4"> 
				    <label class="form-label" for="picture">Password</label>
				    <input id="create-game-has-password" type="checkbox" onchange="displayPasswordCreation()"></input>
				    </div>

                                    <div class="form-outline mb-4" id="create-password" style="display: none;">
                                        <label class="form-label" for="word">Lobby Password</label>
                                        <input id = "create-game-password" type="text" value = "" class="useLobbyKeyboard form-control form-control-lg">
                                    </div>

                                    <button onclick = "createGame()" class="btn btn-warning" style="font-family:fortune;">Create</button>
                                    <button onclick = "closeCreateGame()" class="btn btn-warning" style="font-family:fortune;">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div id="lobby" style="width: 100%; height: 100%;">
    </div>
</body>	
<script src ="./Client.js"></script>
<script src="./SelectLobby.js"></script>
</html>

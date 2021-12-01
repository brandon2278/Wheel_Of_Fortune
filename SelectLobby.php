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
		 "score": 0
                }
        }
    </script>
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
    <section align="center" id="create-lobby">
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
                                        <input id = "create-game-name" type="text" value = "New Lobby" class="useGameKeyboard form-control form-control-lg">
                                        <label class="form-label" for="word">name</label>
                                    </div>

                                    <div class="form-outline mb-4">
                                        <input id = "create-game-player-count" type="number" value = "4" class="form-control form-control-lg">
                                        <label class="form-label" for="sound">Player Count</label>
                                    </div>

                                    <div class="form-outline mb-4">
                                        <input id = "create-game-round-count" type="number" value = "3" class="form-control form-control-lg">
                                        <label class="form-label" for="sound">Nubmer of Rounds</label>
                                    </div>

                                    <div class="form-outline mb-4">
                                        <input id = "create-game-puzzle-count" type="number" value = "3" class="form-control form-control-lg">
                                        <label class="form-label" for="sound">Number of Puzzles per Round</label>
                                    </div>

                                    <div class="form-outline mb-4">
                                        <input id = "create-game-round-reward" type="number" value = "500" class="form-control form-control-lg">
                                        <label class="form-label" for="sound">Reward for Winning Round</label>
                                    </div>

                                    <div class="form-outline mb-4">
                                        <input id = "create-game-bankrupt-multiplier" type="number" step = "0.1" value = "1" min = "0" max = "1" class="form-control form-control-lg">
                                        <label class="form-label" for="picture">Bankrupt Multiplier</label>
                                    </div>

                                    <button onclick = "createGame()" class="btn btn-warning" style="font-family:fortune;">Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div id="lobby">
    </div>
</body>	
<script src ="./Client.js"></script>
<script src="./SelectLobby.js"></script>
</html>

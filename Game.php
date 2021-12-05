<!DOCTYPE html>
<?php session_start();?>
<html>
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
		 "madeMove": false
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
    <link rel="stylesheet" href="style.css">
    <script src="./Keyboard.js"></script>
    <script src="./Winwheel.js"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>    
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
    <title>Wheel of Fortune</title>
  </head>

  <body>

    <div id = "game-panel">
        <div id = "game-panel-tabs">
            <div class = "game-panel-tab game-panel-tab-selected" onclick = "gamePanelChangeTab(0)">chat</div>
            <div class = "game-panel-tab" onclick = "gamePanelChangeTab(1)">users</div>
            <div class = "game-panel-tab" onclick = "gamePanelChangeTab(2)">info</div>
        </div>
        <div id = "game-panel-content">
            <div class = "game-panel-content-area" id = "game-panel-chat">
                <div id = "game-panel-chat-message-container">
                </div>
                <input id = "message-box" class="useLobbyKeyboard">
            </div>
            <div class = "game-panel-content-area" id = "game-panel-users">
                <div class = "game-panel-user">
                </div>
            </div>
            <div class = "game-panel-content-area" id = "game-panel-info">
            </div>
        </div>
    </div>
     <div id="myModal" class="modal" style="display: none;">
		<div class="modal-content1">
			<div align="center">
				<table class="wheelContainer" cellpadding="0" cellspacing="0" border="0">
					<tbody>
						<tr class="container1">
							<td>
								<canvas class="canvas" id="canvas" width="400" height="389"></canvas>
								<canvas class="the_wheel" id="canvas" width="434" height="520"></canvas>
							</td>
							<td>
								<div class="power_controls">
									<br>
									<br>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>

    <div id="pictureContainer">

    </div>

    <center>
    <div id="solveContainer">

		<h3 id="question-container">
			<span id="question-title"></span>
			<br>
			<img id="question-image"> </img>
        		<h3 style='font-family: serif;' id="question-sound" >
            			<button class="btn btn-warning" id="phraseBtn" >
                			<i class="fas fa-volume-up"></i> 
				</button>
				<span id="question-word">
				</span>
			</h3> 
    		</h3>

                <div class="solver">
                    <form>
                        <div align="center" class="response" for="word">
                            <h2>Mi'Kmaw Response</h2>
                        </div>
                        <div class="puzzle-section">
                            <div class="puzzle-grid">
                                <!-- Empty containers to make up the puzzle grid -->
                                <div class="letter-container empty"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container empty"></div>
                                <!-- Containers that will contain the phrases -->
                                <div class="letter-container">
                                    <span id="0" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="1" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="2" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="3" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="4" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="5" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="6" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="7" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="8" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="9" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="10" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="11" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="12" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="13" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="14" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="15" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="16" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="17" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="18" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="19" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="20" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="21" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="22" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="23" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="24" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="25" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="26" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="27" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="28" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="29" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="30" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="31" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="32" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="33" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="34" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="35" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="36" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="37" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="38" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="39" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="40" class="letter-content"></span>
                                </div>
                                <div class="letter-container">
                                    <span id="41" class="letter-content"></span>
                                </div>
                                <!-- Empty containers to make up the puzzle grid -->
                                <div class="letter-container empty"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container"></div>
                                <div class="letter-container empty"></div>
                            </div>

                        </div>
                        <!-- Keyboard -->
                        <div class="keyboard-section" id="keyboard-section" style="font-family: serif; visibility: hidden;">

                            <div id="A" class="keyboard-letters temp-disabled">A</div>
                            <div id="E" class="keyboard-letters 
                            temp-disabled">E</div>
                            <div id="I" class="keyboard-letters temp-disabled">I</div>
                            <div id="J" class="keyboard-letters temp-disabled">J</div>
                            <div id="K" class="keyboard-letters temp-disabled">K</div>
                            <div id="L" class="keyboard-letters temp-disabled">L</div>
                            <div id="M" class="keyboard-letters temp-disabled">M</div>
                            <div id="N" class="keyboard-letters temp-disabled">N</div>
                            <div id="O" class="keyboard-letters temp-disabled">O</div>
                            <div id="P" class="keyboard-letters temp-disabled">P</div>
                            <div id="Q" class="keyboard-letters temp-disabled">Q</div>
                            <div id="S" class="keyboard-letters temp-disabled">S</div>
                            <div id="T" class="keyboard-letters temp-disabled">T</div>
                            <div id="U" class="keyboard-letters temp-disabled">U</div>
                            <div id="W" class="keyboard-letters temp-disabled">W</div>
                            <div id="Y" class="keyboard-letters temp-disabled">Y</div>
                            <div id="Á" class="keyboard-letters temp-disabled">Á</div>
                            <div id="É" class="keyboard-letters temp-disabled">É</div>
                            <div id="Í" class="keyboard-letters temp-disabled">Í</div>
                            <div id="Ɨ" class="keyboard-letters temp-disabled">Ɨ</div>
                            <div id="Ó" class="keyboard-letters temp-disabled">Ó</div>
                            <div id="Ú" class="keyboard-letters temp-disabled">Ú</div>
                        </div>
                    </form>
                        <div id="option-container">
                          <button  class="btn btn-warning" onclick="spinWheel()" id="spin-wheel-btn">Spin Wheel</button>
                          <button  class="btn btn-warning" onclick="buyVowel()" id="buy-vowel-btn">Buy Vowel</button>
                          <button  class="btn btn-warning" onclick="solve()">Solve</button>
                          <br></br>
                         </div>
                          <button class="btn btn-warning" id="hint"><i class="fas fa-volume-up"></i> Hint</button>
                </div>
            </div>
        </div>
    </div>
    </center>

    <div id="keyContainer">

    </div>

  </body>
  <script src = ./Client.js></script>
  <script src="./Game.js"></script>
  <script src="./initWheel.js"></script>
</html>


<!-- This Page is the phrases section of the web app Mi'kmaw Wheel of Fortune -->
<!-- Group 11 -->
<!-- Created and Designed By: Brandon, Colby, Monica, Elisa and Lugin -->

<!-- Under Construction areas are the Solve feature and the bankrupt feature! -->

<!-- Session start for logged in user! -->
<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" type="image/png" href="../../assets/images/logo-5_0_0.png">
	<!-- Bootsrap css -->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
	<!-- Jquery -->
	<script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
	<!-- Wheel of Fortune Wheel javascript-->
	<script src='../../src/js/Winwheel.js'></script>
	<!--Mi'kmaw Keybaord Javascript -->
	<script src="../../src/js/Keyboard.js"></script>
	<script type="module" src="../../src/js/index.js"></script>
	<!-- Alert Javascript -->
	<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
	<!-- Fonts and Icons for keyboard -->
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<!-- Icons for buttons -->
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
	<!-- Javascript for the wheel spinning feature -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>

	<!-- Main Css -->
	<link rel="stylesheet" href="../../src/style.css">
	<!-- Title -->
	<title>Wheel of Fortune</title>
	<!-- Style for the money won after spining the wheel -->
	<style>
		.swal-modal {
			background-color: rgba(72, 21, 131, 0.9);
			border: none;
		}

		.swal-title {
			color: rgb(255, 223, 79);
		}
	</style>
</head>

<?php
// Require Database Name and Password
require '../../src/php/db.php';
// Create connection
$conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
// Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}

?>

<body id="home">
	<!-- Div containing user score stored in database -->
	<div class="score">
		<center>
			<h5 id="score">
				<?php
				// Gets the users score
				$sql1 = "SELECT score FROM users WHERE username= '" . $_SESSION['userId'] . "' ";
				$result = $conn->query($sql1);
				if ($result->num_rows > 0) {
					// output data
					while ($row = $result->fetch_assoc()) {
						// Example: Bank: $1000
						echo "BANK: $" . $row["score"] . "";
						$score = $row["score"];
					}
				} else {
					echo "0 results";
				}
				?>
			</h5>
		</center>
	</div>



	<script>
		localStorage.setItem('score', <?php echo $score ?>);
		// If user new and no score yet automatically shows Bank : $0
		if (localStorage.getItem('score') == null || JSON.parse(localStorage.getItem('score')) == 0) {
			document.getElementById('score').innerHTML = "BANK: $0 ";
		}
	</script>
	<div id="spinModal" class="modal">
		<div class="modal-content1">
			<div align="center">
				<table class="wheelContainer" cellpadding="0" cellspacing="0" border="0">
					<tr class="container1">
						<td> <canvas class="canvas" id="canvas" width="400" height="389"></canvas>
							<canvas class="the_wheel" id="canvas" width="434" height="520"></canvas>
						</td>
						<td>
							<div class="power_controls">
								<br>
							</div>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
	<center>
		<div>
			<div>
				<div>
					<center>
						<h1> Wheel of FOrtune</h1>
					</center>
				</div>
				<div class="gameBtns">
					<!-- Form for shuffling between different phrases -->
					<div class="row">
						<form id="shuffleForm" action="" method="post">
							<button id="shuffling" name="shuffle" type="submit" class="btn btn-warning"><i class="fas fa-random"></i> Shuffle</button>
						</form>
						<button id="translate" style="margin: 20px;" class="btn btn-warning"> <i class="fas fa-globe"></i> Translate</button>
						<button id="hint" style="margin-left: 20px; " class="btn btn-warning"><i class="fas fa-volume-up"></i> HINT </button>
					</div>
				</div>
				<!-- Modal for translation of Mi'kmaw Phrase -->
				<div id="translater" class="modal">
					<!-- Modal content -->
					<div class="translater">
						<div id="translation"></div>
					</div>
				</div>
				<!-- Modal after solving the puzzle -->
				<div id='win' class="modal">
					<div class='translater'>
						<div id="winner">
						</div>
					</div>
				</div>
				<div id='solve' class="modal">
					<div class='translater'>
						<div id="solved">
							<span id="closed1" class="close">&times;</span>
							<form class="container" id="solvedForm" action="" method="post">
								<div class="form-outline mb-4">
									<label class="form-label" for="guess">Enter Guess:</label>
									<input class="form-control form-control-lg useLobbyKeyboard" name="guess" type="text">
								</div>
								<input type="hidden" id="solvedUsrScore" name="solvedUsrScore" value="" />
								<input id="solveBtn" class="btn btn-warning" type="submit" name="solveBtn" value="SOLVE">
							</form>
						</div>
					</div>
				</div>
				<?php
				// Database table containing phrases
				$table = 'phrases';

				$sql = "SELECT * FROM $table";
				//Fucntion that counts the number of rows in a table
				if ($result = mysqli_query($conn, $sql)) {
					$rowcount = mysqli_num_rows($result);
				}

				// Gets the phraseNum from the user which is just an id number between 1 and the number of rows in the table
				$phraseID = "SELECT phraseID FROM users WHERE username= '" . $_SESSION['userId'] . "' ";
				$result = $conn->query($phraseID);
				if ($result->num_rows > 0) {
					while ($row = $result->fetch_assoc()) {
						$phraseNum = $row["phraseID"];
					}
				} else {
					echo "0 results";
				}
				//PhraseID is given a random number between 1 and the number of rows in the table
				$phraseID = rand(1, $rowcount);

				// If its null or 0 the user is given a random PhraseId to start with which is used
				// to get one of the phrases from the table using one of their ID which will equal the phraseID
				if ($phraseNum == 0 || $phraseNum == null) {
					$num = $phraseID;
					if (isset($_SESSION['Id'])) {
						$phraseUP = "UPDATE users
						SET phraseID = '$num' 
						WHERE username= '" . $_SESSION['userId'] . "' ";
						$conn->query($phraseUP);
					}
				}
				// If its not null its just given the phraseNum retrieved from the user in the databse.
				//This is done so even if the page is rloaded the random generator doesnot give a different phrase each time. 
				else {
					$num = $phraseNum;
				}
				//Shuffle button activated to change to a different phrase by settign the users phraseId to 0 so it has to get
				// a one from the random generator.
				if (array_key_exists('shuffle', $_POST)) {
					shuffled($conn);
				}
				function shuffled($conn)
				{
					if (isset($_SESSION['Id'])) {
						$phraseUP = "UPDATE users
						SET phraseID = '0' 
						WHERE username= '" . $_SESSION['userId'] . "' ";
						$conn->query($phraseUP);
					}
					//This is mainly to stop resubmission of the POST method if page is reload
					//And also removed used and saved letters from local storage.Then a reload!
					echo "<script>
							if(window.history.replaceState){
								window.history.replaceState(null, null, window.location.href);
							}
							localStorage.removeItem('savedLetter');
							localStorage.removeItem('usedLetters');
							location.reload();
						</script>";
				}

				// Retrieves the English translation for the mi'kmaw phrase
				$translate = "SELECT translation FROM $table WHERE id= $num ";
				$result = $conn->query($translate);
				if ($result->num_rows > 0) {
					while ($row = $result->fetch_assoc()) {
						echo "<script>
								var translation = document.getElementById('translation'); 
								translation.innerHTML = '<span class=\"close\">&times;</span><div>" . $row["translation"] . "</div>'
							</script>";
					}
				} else {
					echo "0 results";
				}

				//Gets the information of one of the phrases in the databse table
				$sql = "SELECT id, phrase, response, translation, respTranslation, phraseSound, responseSound FROM $table WHERE id=$num";
				$result = $conn->query($sql);

				if ($result->num_rows > 0) {
					// output data
					while ($row = $result->fetch_assoc()) {
						// This outputs the mi'kmaw phrase that you need tp guess the response to!
						echo "<h3> Mi'kmaw Phrase: 
						<h3 style='font-family: serif;' ><button class=\"btn btn-warning\" id=\"phraseBtn\" >
						<i class=\"fas fa-volume-up\"></i> </button> " . $row["phrase"] . "</h3>
						</h3>";
						$responseSound = $row["responseSound"];
						$phraseSound = $row["phraseSound"];
						$response = $row["response"];
						$respTranslation = $row["respTranslation"];
					}
				} else {
					echo "0 results";
				}
				$conn->close();
				?>


				<!-- This is the puzzle grid!-->
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
						<div class="keyboard-section" style="font-family: serif;">

							<div id="A" class="keyboard-letters temp-disabled">A</div>
							<div id="E" class="keyboard-letters temp-disabled">E</div>
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
				</div>
			</div>
		</div>
	</center>
	<div class="controlBtns">
		<div class="row">
			<button id="solvePhrase" class="btn btn-warning" style="margin-top: -20px; margin-bottom: 20px;">SOLVE</button>
			<a href="../../" class="btn btn-warning">Quit!</a>
			<div id="spinBtn"></div>
		</div>
	</div>

	<div>
		<audio id="phraseSound">
			<source src='../../assets/game/back/<?php echo $phraseSound ?>' type="audio/mpeg">
		</audio>
		<audio id="sounds">
			<source src='../../assets/game/back/<?php echo $responseSound ?>' type="audio/mpeg">
		</audio>
		<audio id="letter">
			<source src='../../assets/audio/reveal.mp3' type="audio/mpeg">
		</audio>
		<audio id="failed">
			<source src='../../assets/audio/Buzzer.mp3' type="audio/mpeg">
		</audio>
		<audio id="winnerSound">
			<source src='../../assets/audio/solve.mp3' type="audio/mpeg">
		</audio>
	</div>



	<!-- Forms that send user score and temp score to the php side to be sent to the database -->
	<form name="theForm" id="subm" action="" method="post">
		<input type="hidden" id="tempScore" name="tempScore" value="" />
		<input type="hidden" id="usrScore" name="usrScore" value="" />
		<input type="hidden" id="reveal" name="reveal" value="1" />
	</form>
	<form name="fail" id="fail" action="" method="post">
		<input type="hidden" id="tempScore1" name="tempScore1" value="" />
		<input type="hidden" id="usrScore1" name="usrScore1" value="" />
		<input type="hidden" id="fail" name="fail" value="0" />
	</form>
	<form name="winScore" action="" method="post">
		<input type="hidden" id="usrScore2" name="usrScore2" value="" />
		<input type="hidden" name="winScore" value="0" />
	</form>
	<form name="bankrupt" id="bankrupt" action="" method="post">
		<input type="hidden" id="bankrupt" name="bankrupt" value="0" />
	</form>
	<script>
		var word = "<?php echo $response ?>";
		var translation = "<?php echo $respTranslation ?>";
		// After each letter is guessed it resets tempScore and the page so the wheel will pop up again
		// Also after reload it clears the windows state so resubmission of the previous letter pressed does not get posted
		function reset() {
			if (window.history.replaceState) {
				window.history.replaceState(null, null, window.location.href);
			}
			localStorage.setItem('tempScore', '0');
			location.reload();
		}
	</script>
	<?php
	if (isset($_POST['solveBtn'])) {
		require '../../src/php/db.php';
		// Create connection
		$conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		$guess = $_POST["guess"];
		$usrScore = $_POST["solvedUsrScore"];
		if (((strtoupper($response)) == (strtoupper($guess)))) {
			$newScore = $usrScore + 2000;
			if (isset($_SESSION['Id'])) {
				$sql = "UPDATE users
				SET score = '$newScore'
				WHERE username= '" . $_SESSION['userId'] . "' ";
				$conn->query($sql);
			}

			// If the counter is equal the length of the phrase then it has been solved
			// It plays the winning sound and prints out the correct phrase and translation
			// Then when exits shuffles to another phrase
			echo "
			<script type='text/javascript'>
					var win = document.getElementById('win'); 
					var winner = document.getElementById('winner'); 
					win.style.display = 'block';
					winner.innerHTML = '<span id=\"close\" class=\"close\">&times;</span><h3>Congratulations</h3><div style=\"font-family: serif;\"><h2> The Correct Response: " . $response . "</h2><h2> The Response Translation: " . $respTranslation . "</h2></div>';
					var winnerSound = document.getElementById('winnerSound');winnerSound.volume = 0.4; winnerSound.play();
					var span1 = document.getElementById('close');
					span1.onclick = function () {
						win.style.display = \"none\";
						var resetWin = document.getElementById(\"shuffling\");
						resetWin.click();
					}
			</script>";
		} else {
			if ($usrScore > 500) {
				$newScore = $usrScore - 500;
			} else {
				$newScore = 0;
			}
			if (isset($_SESSION['Id'])) {

				$sql = "UPDATE users
				SET score = '$newScore'
				WHERE username= '" . $_SESSION['userId'] . "' ";
				$conn->query($sql);
			}
			// Plays failed buzzer sound
			echo "
			<script type='text/javascript'>
				var buzzer = document.getElementById('failed');
				buzzer.play();
				var win = document.getElementById('win'); 
				var winner = document.getElementById('winner'); 
				win.style.display = 'block';
				winner.innerHTML = '<span id=\"close\" class=\"close\">&times;</span><h3>Incorrect</h3><div style=\"font-family: serif;\"><h2> The Correct Response: " . $response . "</h2><h2> The Response Translation: " . $respTranslation . "</h2></div>';
				var span1 = document.getElementById('close');
				span1.onclick = function () {
					win.style.display = \"none\";
					var resetWin = document.getElementById(\"shuffling\");
					resetWin.click();
				}
			</script>";
		}
		// Calculates user score!

		$conn->close();
	}

	// If letter is correct this addsmoney to the user score
	if (isset($_POST['reveal'])) {
		require '../../src/php/db.php';
		// Create connection
		$conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		$tempScore = $_POST["tempScore"];
		$usrScore = $_POST["usrScore"];

		// Calculates user score!
		if ($usrScore !== NULL || $usrScore !== 0) {
			$oldScore = $usrScore;
			$newScore = $oldScore + $tempScore;
		} else {
			$newScore = $oldScore - $tempScore;
		}
		if (isset($_SESSION['Id'])) {

			$sql = "UPDATE users
			SET score = '$newScore'
			WHERE username= '" . $_SESSION['userId'] . "' ";
			$conn->query($sql);
		}

		echo "
		<script type='text/javascript'>
			reset();
		</script>";
		$conn->close();
	}
	if (isset($_POST['winScore'])) {
		require '../../src/php/db.php';
		// Create connection
		$conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		$tempScore = 5000;
		$usrScore = $_POST["usrScore"];

		$newScore = $usrScore + $tempScore;

		if (isset($_SESSION['Id'])) {
			$sql = "UPDATE users
			SET score = '$newScore'
			WHERE username= '" . $_SESSION['userId'] . "' ";
			$conn->query($sql);
		}
		echo "<script type='text/javascript'>
				var resetWin = document.getElementById(\"shuffling\");
				resetWin.click();
			</script>";
		$conn->close();
	}
	// If letter is wrong this removes money from user score
	if (isset($_POST['fail'])) {
		require '../../src/php/db.php';
		// Create connection
		$conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		$tempScore = $_POST["tempScore1"];
		$usrScore = $_POST["usrScore1"];
		// Calculates user score after failing to guess correct word
		if ($usrScore >= $tempScore) {
			$newScore = $usrScore - $tempScore;
		} else {
			$newScore = 0;
		}
		if (isset($_SESSION['Id'])) {

			$sql = "UPDATE users
			SET score = '$newScore'
			WHERE username= '" . $_SESSION['userId'] . "' ";
			$conn->query($sql);
		}
		$conn->close();

		// Plays failed buzzer sound
		echo '<script type="text/javascript">
			var buzzer = document.getElementById("failed");
			buzzer.play();
			setTimeout(reset, 2000);
		</script>';
	}
	if (isset($_POST['bankrupt'])) {
		require '../../src/php/db.php';
		// Create connection
		$conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		$newScore = 0;
		if (isset($_SESSION['Id'])) {

			$sql = "UPDATE users
			SET score = '$newScore'
			WHERE username= '" . $_SESSION['userId'] . "' ";
			$conn->query($sql);
		}
		$conn->close();

		// Plays bankrupt sound
		echo '<script type="text/javascript">
			reset();
		</script>';
	}

	?>


</body>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
	window.jQuery || document.write('<script src="jquery.min.js"><\/script>')
</script>
<script type="module" src="../../src/js/index.js"></script>

<!-- Wheel Javscript -->
<script src="../../src/js/wheel.js"></script>

</html>

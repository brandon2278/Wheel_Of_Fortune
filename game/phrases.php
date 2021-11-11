<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/png" href="wallpapers/logo-5_0_0.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
    <script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src='../Winwheel.js'></script>
    <script src="../Keyboard.js"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <link rel="stylesheet" href="../style.css">
    <title>Wheel of Fortune</title>
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
require '../includes/db.php';
// Create connection
$conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>

<body id="home">
    <div class="score">
        <center>
            <h5 id="score">
                <?php
                $sql1 = "SELECT score FROM users WHERE username= '" . $_SESSION['userId'] . "' ";
                $result = $conn->query($sql1);
                if ($result->num_rows > 0) {
                    // output data
                    while ($row = $result->fetch_assoc()) {
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

        if (localStorage.getItem('score') == null || JSON.parse(localStorage.getItem('score')) == 0) {
            document.getElementById('score').innerHTML = "BANK: $0 ";
        }

        if (localStorage.getItem('tempScore') == null || JSON.parse(localStorage.getItem('tempScore')) == 0) {
            document.body.innerHTML = '<div id="myModal" class="modal"><div class="modal-content1"><div align="center">' +
                '<table class="wheelContainer" cellpadding="0" cellspacing="0" border="0">' +
                '<tr class="container1"><td> <canvas class="canvas" id="canvas" width="400" height="389"></canvas>' +
                '<canvas class="the_wheel" id="canvas" width="434" height="520"></canvas></td><td><div class="power_controls">' +
                '<center><img id="spin_button" src="../wallpapers/spin_on.png" alt="Spin" onClick="startSpin();" /></center><br /><br />' +
                '</div></td></tr></table></div></div></div>';
        }



        let theWheel = new Winwheel({
            'numSegments': 13, // Specify number of segments.
            'outerRadius': 195, // Set outer radius so wheel fits inside the background.
            'textFontSize': 26, // Set font size as desired.
            'innerRadius': 55, // Make wheel hollow so segments dont go all way to center.
            'textAlignment': 'outer',
            'textOrientation': 'vertical',
            'segments': // Define segments including colour and text.
                [{
                    
                        'fillStyle': '#add8e6',
                        'text': '100'
                    },
                    {
                        'fillStyle': '#FF0000',
                        'text': '800'
                    },
                    {
                        'fillStyle': '#FFD580',
                        'text': '300'
                    },
                    {
                        'fillStyle': '#FFC0CB',
                        'text': '650'
                    },
                    {
                        'fillStyle': '#CBC3E3',
                        'text': '200'
                    },
                    {
                        'fillStyle': '#90EE90',
                        'text': '500'
                    },
                    {
                        'fillStyle': '#FFA500',
                        'text': '900'
                    },
                    {
                        'fillStyle': '#000000',
                        'text': 'BANKRUPT',
                        'textFontSize': 16,
                        'textFillStyle': '#ffffff'
                    },
                    {
                        'fillStyle': '#aaa9ad',
                        'text': '5000'
                    },
                    {
                        'fillStyle': '#90EE90',
                        'text': '500'
                    },
                    {
                        'fillStyle': '#FFFF00',
                        'text': '600'
                    },
                    {
                        'fillStyle': '#FF7F50',
                        'text': '400'
                    },
                    {
                        'fillStyle': '#FFA500',
                        'text': '700'
                    }
                ],
            'animation': // Specify the animation to use.
            {
                'type': 'spinToStop',
                'duration': 8,
                'spins': 4,
                'callbackFinished': alertPrize, // Function to call whent the spinning has stopped.
                'callbackSound': playSound, // Called when the tick sound is to be played.
                'soundTrigger': 'pin' // Specify pins are to trigger the sound.
            },
            'pins': // Turn pins on.
            {
                'number': 13,
                'fillStyle': 'silver',
                'outerRadius': 4,
            }
        });

        // Loads the tick audio sound in to an audio object.
        let audio = new Audio('../sounds/tick.mp3');

        // This function is called when the sound is to be played.
        function playSound() {
            // Stop and rewind the sound if it already happens to be playing.
            audio.pause();
            audio.currentTime = 0;

            // Play the sound.
            audio.play();
        }

        // Vars used by the code in this page to do power controls.
        let wheelPower = 0;
        let wheelSpinning = false;

        // -------------------------------------------------------
        // Function to handle the onClick on the power buttons.
        // -------------------------------------------------------
        function powerSelected(powerLevel) {
            // Ensure that power can't be changed while wheel is spinning.
            if (wheelSpinning == false) {
                // Reset all to grey incase this is not the first time the user has selected the power.


                // Now light up all cells below-and-including the one selected by changing the class.

                document.getElementById('pw2').className = "pw2";

                // Set wheelPower var used when spin button is clicked.
                wheelPower = powerLevel;

                // Light up the spin button by changing it's source image and adding a clickable class to it.
                document.getElementById('spin_button').src = "..\wallpapers\spin_on.png";
                document.getElementById('spin_button').className = "clickable";
            }
        }

        // -------------------------------------------------------
        // Click handler for spin button.
        // -------------------------------------------------------
        function startSpin() {
            // Ensure that spinning can't be clicked again while already running.
            if (wheelSpinning == false) {
                // Based on the power level selected adjust the number of spins for the wheel, the more times is has
                // to rotate with the duration of the animation the quicker the wheel spins.
                if (wheelPower == 2) {
                    theWheel.animation.spins = 8;
                }

                // Disable the spin button so can't click again while wheel is spinning.
                document.getElementById('spin_button').className = "";

                // Begin the spin animation by calling startAnimation on the wheel object.
                theWheel.startAnimation();

                // Set to true so that power can't be changed and spin button re-enabled during
                // the current animation. The user will have to reset before spinning again.
                wheelSpinning = true;
            }
        }

        var bank;
        // -------------------------------------------------------
        // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters
        // note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
        // -------------------------------------------------------
        function alertPrize(indicatedSegment) {



            localStorage.setItem('tempScore', indicatedSegment.text);
            if (localStorage.getItem('tempScore') == "BANKRUPT") {
                localStorage.setItem('score', '0');
                localStorage.setItem('tempScore', '0');
                //location.href = "bankrupt.php";
            }

            // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
            if (indicatedSegment.text == "BANKRUPT") {
                alert("You are now bankrupt!");
            } else {

                swal({
                        title: "You Have Won $" + indicatedSegment.text,
                        button: {
                            text: "continue",
                            value: true,
                            visible: true,
                            className: "btn btn-warning",
                            closeModal: true,
                        }
                    })
                    .then((value) => {
                        location.reload();
                    });
                var close = document.getElementById("myModal");
                close.style.display = "none";
            }

        }
    </script>

    <center>
        <div>
            <div>
                <div>
                    <center>
                        <h1> Wheel of FOrtune</h1>
                    </center>
                </div>
                <div>
                    <form action="" method="post">
                        <button id="shuffling" name="shuffle" type="submit" class="btn btn-warning"><i class="fas fa-random"></i> Shuffle</button>
                    </form>
                    <button id="translate" style="margin: 20px;" class="btn btn-warning"> <i class="fas fa-globe"></i> Translate</button>
                    <button onClick="hint()" style="margin: 20px;" class="btn btn-warning"><i class="fas fa-volume-up"></i> HINT </button>
                </div>

                <div id="translater" class="modal">
                    <!-- Modal content -->
                    <div class="translater">
                        <div id="translation"></div>
                    </div>

                </div>
                <div id='win' class="modal">
                    <div class='translater'>
                        <div id="winner">
                        </div>
                    </div>
                </div>

                <?php
                $table = 'phrases';

                $sql = "SELECT * FROM $table";
                if ($result = mysqli_query($conn, $sql)) {
                    $rowcount = mysqli_num_rows($result);
                }

                $phraseID = "SELECT phraseID FROM users WHERE username= '" . $_SESSION['userId'] . "' ";
                $result = $conn->query($phraseID);
                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        $phraseNum = $row["phraseID"];
                    }
                } else {
                    echo "0 results";
                }
                $phraseID = rand(1, $rowcount);

                if ($phraseNum == 0 || $phraseNum == null) {
                    $num = $phraseID;
                    if (isset($_SESSION['Id'])) {
                        $phraseUP = "UPDATE users
                        SET phraseID = '$num' 
                        WHERE username= '" . $_SESSION['userId'] . "' ";
                        $conn->query($phraseUP);
                    }
                } else {
                    $num = $phraseNum;
                }
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
                    echo "<script>
                            if(window.history.replaceState){
                                window.history.replaceState(null, null, window.location.href);
                            }
                            localStorage.removeItem('savedLetter');
                            location.reload();
                        </script>";
                }


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


                $sql = "SELECT id, phrase, response, translation, respTranslation, phraseSound, responseSound FROM $table WHERE id=$num";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    // output data
                    while ($row = $result->fetch_assoc()) {
                        echo "<h3> Mi'kmaw Phrase: 
                        <h3 style='font-family: serif;' ><button class=\"btn btn-warning\" onclick='phraseSound()' >
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
                <style>
                    .input {
                        border: none;
                        color: dimgrey;
                        font: 5ch consolas, serif;
                        letter-spacing: .5ch;
                    }

                    .input:focus {
                        outline: none;
                        color: dodgerblue;
                    }

                    .input-back {
                        background-color: rgb(255, 193, 7);
                        padding: 10px;
                        align-items: center;
                    }
                </style>

                <div class="solver">
                    <form>
                        <div align="center" class="response" for="word">
                            <h2>Mi'Kmaw Response</h2>
                        </div>
                        <div class="puzzle-section">
                            <div class="puzzle-grid">
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
                        <div class="keyboard-section" style="font-family: serif;">

                            <div id="key" class="keyboard-letters temp-disabled">A</div>
                            <div id="key" class="keyboard-letters temp-disabled">E</div>
                            <div id="key" class="keyboard-letters temp-disabled">I</div>
                            <div id="key" class="keyboard-letters temp-disabled">J</div>
                            <div id="key" class="keyboard-letters temp-disabled">K</div>
                            <div id="key" class="keyboard-letters temp-disabled">L</div>
                            <div id="key" class="keyboard-letters temp-disabled">M</div>
                            <div id="key" class="keyboard-letters temp-disabled">N</div>
                            <div id="key" class="keyboard-letters temp-disabled">O</div>
                            <div id="key" class="keyboard-letters temp-disabled">P</div>
                            <div id="key" class="keyboard-letters temp-disabled">Q</div>
                            <div id="key" class="keyboard-letters temp-disabled">S</div>
                            <div id="key" class="keyboard-letters temp-disabled">T</div>
                            <div id="key" class="keyboard-letters temp-disabled">U</div>
                            <div id="key" class="keyboard-letters temp-disabled">W</div>
                            <div id="key" class="keyboard-letters temp-disabled">Y</div>
                            <div id="key" class="keyboard-letters temp-disabled">Á</div>
                            <div id="key" class="keyboard-letters temp-disabled">É</div>
                            <div id="key" class="keyboard-letters temp-disabled">Í</div>
                            <div id="key" class="keyboard-letters temp-disabled">Ɨ</div>
                            <div id="key" class="keyboard-letters temp-disabled">Ó</div>
                            <div id="key" class="keyboard-letters temp-disabled">Ú</div>
                        </div>
                        <center><button onclick="solve()" class="btn btn-warning" style="margin: 20px;">SOLVE</button></center>
                    </form>
                </div>
            </div>
        </div>
    </center>
    

    <center><a href="../index.php" class="btn btn-warning">Quit!</a></center>
    <div>

        <audio id="sounds">
            <source src=<?php echo $responseSound ?> type="audio/mpeg">
        </audio>
        <audio id="letter">
            <source src='../audio/reveal.mp3' type="audio/mpeg">
        </audio>
        <audio id="failed">
            <source src='../audio/Buzzer.mp3' type="audio/mpeg">
        </audio>
        <audio id="phraseSound">
            <source src='<?php echo $phraseSound ?>' type="audio/mpeg">
        </audio>
        <audio id="winnerSound">
            <source src='../audio/solve.mp3' type="audio/mpeg">
        </audio>
    </div>


    </div>




    </div>
    </center>

    <script>

        function solve(){
            console.log("does nothing yet!");
        }

        var failCount = 0;
        var count = 0;
        var savedLetter;
        if (localStorage.getItem('savedLetter') != null) {
            savedLetter = localStorage.getItem('savedLetter');
            savedLetter.split("");
            var usedLength = savedLetter.length;
        }
        String.prototype.equalsIgnoreCase = function(compareString) {
            return this.toLowerCase() === compareString.toLowerCase();
        };
        var word = "<?php echo $response ?>";
        word.split("");
        var length = word.length;
        for (var i = 0; i < length; i++) {
            var id = i.toString();
            var letter = document.getElementById(id);
            if (word[i] !== " ") {
                $(letter).parent().css('background', '#9370DB');
                for (var j = 0; j < usedLength; j++) {
                    if (localStorage.getItem('savedLetter') != null) {
                        if (word[i].equalsIgnoreCase(savedLetter[j])) {
                            letter.innerHTML += savedLetter[j];
                            count++;
                        }
                    }
                }
            } else {
                count++;
            }
        }
	
	
	var keys = document.querySelectorAll(".keyboard-letters")
	keys.forEach(key => {
		key.onclick = function() {
		    key = key.innerHTML;
		    for (var i = 0; i < length; i++) {
			var id = i.toString();
			var letter = document.getElementById(id);
			if (word[i].equalsIgnoreCase(key)) {
			    reveal();
			    if (localStorage.getItem('savedLetter') != null && !(localStorage.getItem('savedLetter').includes(key))) {
				savedLetter = savedLetter.concat(key);
			    } else if (localStorage.getItem('savedLetter') == null) {
				savedLetter = key;
			    }
			    localStorage.setItem('savedLetter', savedLetter);
			    letter.innerHTML += word[i].toUpperCase();
			} else {
			    failCount++;
			    if (failCount == length) {
				fail();
			    }

			}
		    }
		}
	});

    </script>
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

    <script>
        var tempScore = JSON.parse(localStorage.getItem('tempScore'));
        document.getElementById("tempScore").value = tempScore;
        document.getElementById("tempScore1").value = tempScore;
        var usrScore = JSON.parse(localStorage.getItem('score'));
        document.getElementById("usrScore").value = usrScore;
        document.getElementById("usrScore1").value = usrScore;

        function reveal() {
            document.theForm.submit();
        }

        function fail() {
            document.fail.submit();
        }


        function reset() {
            if (window.history.replaceState) {
                window.history.replaceState(null, null, window.location.href);
            }
            localStorage.setItem('tempScore', '0');
            location.reload();
        }
    </script>
    <?php

    if (isset($_POST['reveal'])) {
        require '../includes/db.php';
        // Create connection
        $conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $tempScore = $_POST["tempScore"];
        $usrScore = $_POST["usrScore"];

        if ($usrScore !== NULL || $usrScore !== 0) {
            $oldScore = $usrScore;
            $newScore = $oldScore + $tempScore;
        } else {
            $newScore = $oldScore + $tempScore;
        }
        if (isset($_SESSION['Id'])) {

            $sql = "UPDATE users
            SET score = '$newScore'
            WHERE username= '" . $_SESSION['userId'] . "' ";
            $conn->query($sql);
        }

        echo "
        <script type='text/javascript'>
            var letter = document.getElementById('letter');
            letter.play();
            if(count == length){
                var win = document.getElementById('win'); 
                var winner = document.getElementById('winner'); 
                win.style.display = 'block';
                winner.innerHTML = '<span id=\"close\" class=\"close\">&times;</span><h3>Congratulations</h3><div style=\"font-family: serif;\"><h2> The Correct Response: " . $response . "</h2><h2> The Response Translation: " . $respTranslation . "</h2></div>';
                var winnerSound = document.getElementById('winnerSound');winnerSound.volume = 0.4; winnerSound.play();
                
            }else{
                setTimeout(reset, 2000);
            }
            
        </script>";
        $conn->close();
    }
    if (isset($_POST['fail'])) {
        require '../includes/db.php';
        // Create connection
        $conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $tempScore = $_POST["tempScore1"];
        $usrScore = $_POST["usrScore1"];

        if ($usrScore !== NULL || $usrScore !== 0) {
            $score = $tempScore;
            $oldScore = $usrScore;
            $newScore = $oldScore - $score;
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

        echo '<script type="text/javascript">
            var buzzer = document.getElementById("failed");
            buzzer.play();
            setTimeout(reset, 2000);
        </script>';
    }

    ?>


</body>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
    window.jQuery || document.write('<script src="jquery.min.js"><\/script>')
</script>
<script type="module" src="../index.js"></script>
<script>
    var span = document.getElementsByClassName("close")[0];
    var span1 = document.getElementsByClassName("close")[1];
    var resetWin = document.getElementById("shuffling");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        translater.style.display = "none";
    }
    var hintAudio = document.getElementById("sounds");
    var phrase = document.getElementById('phraseSound');

    function hint() {
        hintAudio.play();
    }

    function phraseSound() {
        phrase.play();
    }
    span1.onclick = function() {
        win.style.display = "none";
        resetWin.click();

    }
</script>

</html>

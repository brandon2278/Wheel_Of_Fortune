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
    <link rel="shortcut icon" type="image/png" href="wallpapers/logo-5_0_0.png">
    <!-- Bootsrap css -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
    <!-- Jquery -->
    <script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
    <!-- Wheel of Fortune Wheel javascript-->
    <script src='../Winwheel.js'></script>
    <!--Mi'kmaw Keybaord Javascript -->
    <script src="../Keyboard.js"></script>
    <script type="module" src="../index.js"></script>
    <!-- Alert Javascript -->
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <!-- Fonts and Icons for keyboard -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- Icons for buttons -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    <!-- Javascript for the wheel spinning feature -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    <!-- Main Css -->
    <link rel="stylesheet" href="../style.css">
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
require '../includes/db.php';
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
        //After every guess, tempScore is reset triggering modal to show wheel of fortune
        if (localStorage.getItem('tempScore') == null || JSON.parse(localStorage.getItem('tempScore')) == 0) {
            document.body.innerHTML = '<div id="myModal" class="modal"><div class="modal-content1"><div align="center">' +
                '<table class="wheelContainer" cellpadding="0" cellspacing="0" border="0">' +
                '<tr class="container1"><td> <canvas class="canvas" id="canvas" width="400" height="389"></canvas>' +
                '<canvas class="the_wheel" id="canvas" width="434" height="520"></canvas></td><td><div class="power_controls">' +
                '<center><img id="spin_button" src="../wallpapers/spin_on.png" alt="Spin" onClick="startSpin();" /></center><br /><br />' +
                '</div></td></tr></table></div></div></div>';
        }


        //The Wheel of Fortune Wheel
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
                'callbackFinished': alertPrize, // Function to call when the spinning has stopped.
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
        let bankr = new Audio('../audio/bankr.mp3');
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

            // If the segment it lands on is "Bankrupt" it sets the score to 0.
            localStorage.setItem('tempScore', indicatedSegment.text);
            if (localStorage.getItem('tempScore') == "BANKRUPT") {
                localStorage.setItem('score', '0');
                localStorage.setItem('tempScore', '0');
            }

            // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
            if (indicatedSegment.text == "BANKRUPT") {
                bankr.play();
                swal({
                        icon: 'error',
                        title: "You Are Now BANKRUPT",
                        button: {
                            text: "continue",
                            value: true,
                            visible: true,
                            className: "btn btn-warning",
                            closeModal: true,
                        }
                    })
                    .then((value) => {
                        bankrupt();
                    });
                var close = document.getElementById("myModal");
                close.style.display = "none";
            } else {
                // Alert for how much you won after spinning wheel
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
                    <!-- Form for shuffling between different phrases -->
                    <form action="" method="post">
                        <button id="shuffling" name="shuffle" type="submit" class="btn btn-warning"><i class="fas fa-random"></i> Shuffle</button>
                    </form>
                    <button id="translate" style="margin: 20px;" class="btn btn-warning"> <i class="fas fa-globe"></i> Translate</button>
                    <button onClick="hint()" style="margin: 20px;" class="btn btn-warning"><i class="fas fa-volume-up"></i> HINT </button>
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
                            <div id="V" class="keyboard-letters temp-disabled">W</div>
                            <div id="Y" class="keyboard-letters temp-disabled">Y</div>
                            <div id="Á" class="keyboard-letters temp-disabled">Á</div>
                            <div id="É" class="keyboard-letters temp-disabled">É</div>
                            <div id="Í" class="keyboard-letters temp-disabled">Í</div>
                            <div id="Ɨ" class="keyboard-letters temp-disabled">Ɨ</div>
                            <div id="Ó" class="keyboard-letters temp-disabled">Ó</div>
                            <div id="Ú" class="keyboard-letters temp-disabled">Ú</div>
                        </div>
                        <!-- Solve button to later on solve the problem in one try if they know it -->
                    </form>
                </div>
            </div>
        </div>
    </center>
    <center><button onclick="solve()" class="btn btn-warning" style="margin: 20px;">SOLVE</button></center>

    <!-- Quit button takes you to Home page -->
    <center><a href="../index.php" class="btn btn-warning">Quit!</a></center>
    <!-- Contains all the different audios used -->
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
        //Fail counter
        var failCount = 0;
        // Solved counter
        var count = 0;
        // Correct letters used
        var savedLetter;
        // All letters that have been guessed
        var usedLetter;
        if (localStorage.getItem('usedLetters') !== null) {
            usedLetter = localStorage.getItem('usedLetters');
        }
        if (localStorage.getItem('savedLetter') != null) {
            savedLetter = localStorage.getItem('savedLetter');
            savedLetter.split("");
            var usedLength = savedLetter.length;
        }
        // Function to compare strings if they are equal
        String.prototype.equalsIgnoreCase = function(compareString) {
            return this.toLowerCase() === compareString.toLowerCase();
        };
        // This prints out the letters that have already been guessed correctly
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

        // Gets each key from the keyboard and if clicked displays the letter in the puzzle grid if correct
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
                        localStorage.setItem('usedLetters', savedLetter);
                        letter.innerHTML += word[i].toUpperCase();
                    } else {
                        if (localStorage.getItem('usedLetters') != null && !(localStorage.getItem('usedLetters').includes(key))) {
                            usedLetter = usedLetter.concat(key);
                        } else if (localStorage.getItem('usedLetters') == null) {
                            usedLetter = key;
                        }
                        localStorage.setItem('usedLetters', usedLetter);
                        // Fail counter, if the letter clicked does not equal 
                        //any letter in the word it counts each fail and if the 
                        //fail matches the length of the word it plays the fail 
                        //sound and removes points from user
                        failCount++;
                        if (failCount == length) {
                            fail();
                        }

                    }

                }
            }
        });
        // This disables all the used Letters or any letter that has already been pressed
        var usedKeys = document.querySelectorAll(".temp-disabled")
        usedKeys.forEach(key1 => {
            var key1 = key1.innerHTML;
            if (localStorage.getItem('usedLetters') !== null) {
                var usedLetters = localStorage.getItem('usedLetters');
                usedLetters.split("");
                var letterAmount = usedLetters.length;
                for (var i = 0; i < letterAmount; i++) {
                    if (key1.equalsIgnoreCase(usedLetters[i])) {
                        var letterId = document.getElementById(key1);
                        letterId.style.pointerEvents = "none";
                        letterId.style.color = "#014991";
                    }
                }
            }
        });
    </script>
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
    <form name="bankrupt" id="bankrupt" action="" method="post">
        <input type="hidden" id="bankrupt" name="bankrupt" value="0" />
    </form>

    <script>
        var solver = document.getElementById('solve');
        // Function to later allow user to solve
        function solve() {
            solver.style.display = "block";
            var solved = document.getElementById('solved');
            solved.innerHTML = '<span onclick="closed()" class=\"close\">&times;</span><div><form class="container" action="" method="post" > ' +
                '<div class="form-outline mb-4">' +
                '<label class="form-label" for=\"guess\">Enter Guess:</label>' +
                '<input class="form-control form-control-lg useGameKeyboard" name="guess" type="text"></div>' +
                ' <input type="hidden" id="tempScore2" name="tempScore2" value="" />' +
                '<input type="hidden" id="usrScore2" name="usrScore2" value="" />' +
                '<input class="btn btn-warning" type="button" name="solved" value="SOLVE">' +
                '</form></div>';
        }
        var tempScore = JSON.parse(localStorage.getItem('tempScore'));
        document.getElementById("tempScore").value = tempScore;
        document.getElementById("tempScore1").value = tempScore;
        document.getElementById("tempScore2").value = tempScore;
        var usrScore = JSON.parse(localStorage.getItem('score'));
        document.getElementById("usrScore").value = usrScore;
        document.getElementById("usrScore1").value = usrScore;
        document.getElementById("usrScore2").value = usrScore;

        // Reveal correct letter and add money to user bank
        function reveal() {
            document.theForm.submit();
        }

        // Plays buzzer sound and removes money from user bank
        function fail() {
            document.fail.submit();
        }

        function bankrupt() {
            document.bankrupt.submit();
        }

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
    if (isset($_POST['solved'])) {
        require '../includes/db.php';
        // Create connection
        $conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        
        $guess = $_POST["guess"];
        $tempScore = $_POST["tempScore"];
        $usrScore = $_POST["usrScore"];
        if (strcasecmp($response, $guess) == 0) {
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
            </script>";
        }else{
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
            // Plays failed buzzer sound
            echo '<script type="text/javascript">
                var buzzer = document.getElementById("failed");
                buzzer.play();
                setTimeout(reset, 2000);
            </script>';
        }
        // Calculates user score!

        $conn->close();
    }

    // If letter is correct this addsmoney to the user score
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
        // Calculates user score!
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

        // If the counter is equal the length of the phrase then it has been solved
        // It plays the winning sound and prints out the correct phrase and translation
        // Then when exits shuffles to another phrase
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
    // If letter is wrong this removes money from user score
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
        // Calculates user score after failing to guess correct word
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

        // Plays failed buzzer sound
        echo '<script type="text/javascript">
            var buzzer = document.getElementById("failed");
            buzzer.play();
            setTimeout(reset, 2000);
        </script>';
    }
    if (isset($_POST['bankrupt'])) {
        require '../includes/db.php';
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
<script type="module" src="../index.js"></script>
<script>
    // script to close modals
    var span = document.getElementsByClassName("close")[0];
    var span1 = document.getElementsByClassName("close")[1];
    var span2 = document.getElementById("closed");
    var resetWin = document.getElementById("shuffling");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        translater.style.display = "none";
    }

    var hintAudio = document.getElementById("sounds");
    var phrase = document.getElementById('phraseSound');

    // PLays hint audio
    function hint() {
        hintAudio.play();
    }
    // Plays the phrase audio
    function phraseSound() {
        phrase.play();
    }

    function closed() {
        solver.style.display = "none";

    }
    // Span to close winning modal and reset to a next phrase
    span1.onclick = function() {
        win.style.display = "none";
        resetWin.click();
    }
</script>

</html>
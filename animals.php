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
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
    <script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src='./Winwheel.js'></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    <link rel="stylesheet" href="style.css">
    <title>Wheel of Fortune</title>
</head>
<style>
    #image {
        max-width: 300px;
    }
</style>

<?php

require 'includes/db.php';
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
    <div>
        <center>
            <h1> Wheel of FOrtune</h1>
        </center>
    </div>



    <script>
        localStorage.setItem('score', <?php echo $score ?>);

        if (localStorage.getItem('score') == null || JSON.parse(localStorage.getItem('score')) == 0) {
            document.getElementById('score').innerHTML = "BANK: $0 ";
        }

        if (localStorage.getItem('tempScore') == null || JSON.parse(localStorage.getItem('tempScore')) == 0) {
            document.body.innerHTML = '<div id="myModal" class="modal"><div class="modal-content1"><div align="center"><table class="wheelContainer" cellpadding="0" cellspacing="0" border="0"><tr class="container1"><td> <canvas class="canvas" id="canvas" width="400" height="389"></canvas><canvas class="the_wheel" id="canvas" width="434" height="520"></canvas></td><td><div class="power_controls"><center><img id="spin_button" src="wallpapers/spin_on.png" alt="Spin" onClick="startSpin();" /></center><br /><br /></div></td></tr></table></div></div></div>'
        }



        let theWheel = new Winwheel({
            'numSegments': 12, // Specify number of segments.
            'outerRadius': 195, // Set outer radius so wheel fits inside the background.
            'textFontSize': 26, // Set font size as desired.
            'innerRadius': 55, // Make wheel hollow so segments dont go all way to center.
            'textAlignment': 'outer',
            'textOrientation': 'vertical',
            'segments': // Define segments including colour and text.
                [{
                        'fillStyle': '#eae56f',
                        'text': '300'
                    },
                    {
                        'fillStyle': '#89f26e',
                        'text': '600'
                    },
                    {
                        'fillStyle': '#7de6ef',
                        'text': '100'
                    },
                    {
                        'fillStyle': '#e7706f',
                        'text': '400'
                    },
                    {
                        'fillStyle': '#eae56f',
                        'text': '900'
                    },
                    {
                        'fillStyle': '#89f26e',
                        'text': '800'
                    },
                    {
                        'fillStyle': '#89f26e',
                        'text': '200'
                    },
                    {
                        'fillStyle': '#89f26e',
                        'text': '700'
                    },
                    {
                        'fillStyle': '#89f26e',
                        'text': '500'
                    },
                    {
                        'fillStyle': '#7de6ef',
                        'text': '1000'
                    },
                    {
                        'fillStyle': '#000000',
                        'text': 'BANKRUPT',
                        'textFontSize': 16,
                        'textFillStyle': '#ffffff'
                    },
                    {
                        'fillStyle': '#e7706f',
                        'text': '10000'
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
                'number': 12,
                'fillStyle': 'silver',
                'outerRadius': 4,
            }
        });

        // Loads the tick audio sound in to an audio object.
        let audio = new Audio('sounds/tick.mp3');

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
                document.getElementById('spin_button').src = "wallpapers\spin_on.png";
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
                location.href = "bankrupt.php";
            }

            // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
            if (indicatedSegment.text == "BANKRUPT") {
                alert("You are now bankrupt!");
            } else {
                alert("You have won " + indicatedSegment.text);
                location.reload();
            }

        }
    </script>

    <center>

        <div>
            <div>
                <button style="margin: 20px;" class="btn btn-warning" onClick="window.location.reload();"><i class="fas fa-random"></i> Shuffle</button>
                <button onClick="hint()" style="margin: 20px;" class="btn btn-warning"><i class="fas fa-volume-up"></i> HINT </button>

                <?php
                $table = 'animals';

                $sql = "SELECT * FROM animals";
                if ($result = mysqli_query($conn, $sql)) {
                    $rowcount = mysqli_num_rows($result);
                }

                $num = rand(1, $rowcount);


                $sql = "SELECT id, word, picture, sound FROM $table WHERE id=$num";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    // output data
                    while ($row = $result->fetch_assoc()) {
                        echo "<div><img alt='picture' id='image' max-width='300' src='{$row['picture']}'></div>";
                        $sound = $row["sound"];
                        $pic = $row["picture"];
                        $wordLength = strlen($row["word"]);
                        $lineLength = strlen($row["word"]) * 1.475;
                    }
                } else {
                    echo "0 results";
                }
                $conn->close();
                ?>
                <style>
                    .input {
                        border: none;
                        background:
                            repeating-linear-gradient(90deg,
                                black 0,
                                black 1ch,
                                transparent 0,
                                transparent 1.5ch) 0 100%/<?php echo $lineLength; ?>ch 2px no-repeat;
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
                        ;
                        padding: 10px;
                        width: <?php echo $lineLength * 30; ?>px;
                    }
                </style>

                <div class="solver">
                    <form action="solvedAnimals.php" method="get">
                        <label for="word">
                            <h2>Mi'Kmaw Word</h2>
                        </label>
                        <center>
                            <div class="input-back">
                                <input class="input" maxlength='<?php echo $wordLength; ?>' type="text" name="mWord">
                                <input type="hidden" name="ID" value="<?php echo $num; ?>" />
                                <input type="hidden" id="tempScore" name="tempScore" value="" />
                                <input type="hidden" id="usrScore" name="usrScore" value="" />
                            </div>
                        </center>
                        <center><input id="subm" value="SOLVE" class="btn btn-warning" type="submit" style="margin: 20px;"></center>

                    </form>
                </div>
                <script>
                    var tempScore = JSON.parse(localStorage.getItem('tempScore'));
                    document.getElementById("tempScore").value = tempScore;
                    var usrScore = JSON.parse(localStorage.getItem('score'));
                    document.getElementById("usrScore").value = usrScore;
                </script>
                <a href="index.php" class="btn btn-warning">Quit!</a>
                <div>

                    <audio id="sounds">
                        <source src=<?php echo $sound ?> type="audio/mpeg">
                    </audio>
                </div>


            </div>
            
        </div>
    </center>

</body>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
    window.jQuery || document.write('<script src="jquery.min.js"><\/script>')
</script>
<script type="module" src="./index.js"></script>
<script>
    var audio1 = document.getElementById("sounds");

    function hint() {
        audio1.play();
    }
</script>

</html>
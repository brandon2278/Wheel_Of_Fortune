<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
    <script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src='./Winwheel.js'></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    <link rel="stylesheet" href="style.css">
    <title>Wheel of Fortune</title>
</head>


<body>
    <div class="score">
        <center>
            <h5 id="score"></h5>
        </center>
    </div>
    <div class="title">
        <center>
            <h1> Wheel of Fortune</h1>
        </center>
    </div>

    <div align="center">

        <table class="wheelContainer" cellpadding="0" cellspacing="0" border="0">
            <tr class="container">

                <td>
                    <canvas class="canvas" id='canvas' width='400' height='389'>
                        Canvas not supported, use another browser.
                    </canvas>
                    <canvas class="the_wheel" id="canvas" width="434" height="520">
                        <p align="center">Sorry, your browser doesn't support canvas. Please try another.</p>
                    </canvas>
                </td>

                <td>
                    <div class="power_controls">
                        <center><img id="spin_button" src="spin_on.png" alt="Spin" onClick="startSpin();" /></center>
                        <br /><br />
                    </div>
                </td>


            </tr>
        </table>
    </div>

    <script>
        if (localStorage.getItem('score') == null) {
            document.getElementById('score').innerHTML = "BANK: $0 ";
        } else {
            document.getElementById('score').innerHTML = "BANK: $" + localStorage.getItem('score');
        }

        let theWheel = new Winwheel({
            'numSegments': 9, // Specify number of segments.
            'outerRadius': 145, // Set outer radius so wheel fits inside the background.
            'textFontSize': 28, // Set font size as desired.
            'segments': // Define segments including colour and text.
                [{
                        'fillStyle': '#eae56f',
                        'text': '100'
                    },
                    {
                        'fillStyle': '#89f26e',
                        'text': '200'
                    },
                    {
                        'fillStyle': '#7de6ef',
                        'text': '300'
                    },
                    {
                        'fillStyle': '#e7706f',
                        'text': '400'
                    },
                    {
                        'fillStyle': '#eae56f',
                        'text': '500'
                    },
                    {
                        'fillStyle': '#89f26e',
                        'text': '750'
                    },
                    {
                        'fillStyle': '#7de6ef',
                        'text': '1000'
                    },
                    {
                        'fillStyle': '#808080',
                        'text': 'reset'
                    },
                    {
                        'fillStyle': '#e7706f',
                        'text': '10000'
                    }
                ],
            'animation': // Specify the animation to use.
            {
                'type': 'spinToStop',
                'duration': 5, // Duration in seconds.
                'spins': 8, // Number of complete spins.
                'callbackFinished': alertPrize
            }
        });

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
                document.getElementById('spin_button').src = "spin_on.png";
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


        // -------------------------------------------------------
        // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters
        // note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
        // -------------------------------------------------------
        function alertPrize(indicatedSegment) {
            localStorage.setItem('tempScore', indicatedSegment.text);
            if (localStorage.getItem('tempScore') == "reset") {
                localStorage.setItem('score', '0');
                localStorage.setItem('tempScore', '0');
                location.reload();
            }
            // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
            if(indicatedSegment.text == "reset"){
                alert("You are now bankrupt!");
            }else{
                alert("You have won " + indicatedSegment.text);
            }
            
        }
    </script>

    <center>

        <div>
            <div>
                <button class="butn" onClick="window.location.reload();">Shuffle</button>

                <?php


                $num = rand(1, 5);


                $serverName = "sql5.freemysqlhosting.net";
                $dbUsername = "sql5441723";
                $dbPassword = "zkZfThlgHa";
                $dbName = "sql5441723";
                // Create connection
                $conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
                // Check connection
                if ($conn->connect_error) {
                    die("Connection failed: " . $conn->connect_error);
                }

                $sql = "SELECT id, word, engWord, sound FROM words WHERE id=$num";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    // output data
                    while ($row = $result->fetch_assoc()) {
                        echo "<h3> English Word: " . $row["engWord"] . "</h3>";
                        $sound = $row["sound"];
                        $engWord = $row["engWord"];
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
                                dimgrey 0,
                                dimgrey 1ch,
                                transparent 0,
                                transparent 1.5ch) 0 100%/<?php echo $lineLength; ?>ch 2px no-repeat;
                        color: dimgrey;
                        font: 5ch consolas, monospace;
                        letter-spacing: .5ch;
                    }

                    .input:focus {
                        outline: none;
                        color: dodgerblue;
                    }
                </style>
                <div class="solver">
                    <form action="solved.php" method="get">
                        <label for="word">
                            <h2>Mi'Kmaq Word</h2>
                        </label>
                        <center><input class="input" maxlength='<?php echo $wordLength; ?>' type="text" name="mWord"></center>
                        <input type="hidden" name="ID" value="<?php echo $num; ?>" />
                        <center><input id="subm" value="SOLVE" class="butn" type="submit"></center>
                    </form>
                    <center><button class="butn" onclick="hint()"><i class="fas fa-volume-up"></i> HINT </button></center>
                </div>
                <div>

                    <audio id="sounds">
                        <source src=<?php echo $sound ?> type="audio/mpeg">
                    </audio>
                </div>



            </div>




        </div>
    </center>
</body>
<script>
    var audio = document.getElementById("sounds");

    function hint() {
        audio.play();
    }
</script>

</html>
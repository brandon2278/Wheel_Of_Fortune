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
    <script src='Winwheel.js'></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    <link rel="stylesheet" href="style.css">
    <title>Wheel of Fortune</title>
</head>



<body>
    <center>
        <div>
            <center>
                <h1>Wheel of FOrtune</h1>
            </center>
        </div>
        <div>




            <div>
                
                <button style="margin: 20px;" class="btn btn-warning" onclick="location.href = 'animals.php';">Next</button>
                <?php
                

                require 'includes/db.php';
                // Create connection
                $conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
                // Check connection
                if ($conn->connect_error) {
                    die("Connection failed: " . $conn->connect_error);
                }

                $num = $_GET["ID"];
                $usrWord = $_GET["mWord"];
                $tempScore = $_GET["tempScore"];
                $usrScore = $_GET["usrScore"];

                $sql = "SELECT id, word, picture FROM animals WHERE id=$num";
                $result = $conn->query($sql);




                if ($result->num_rows > 0) {
                    // output data
                    while ($row = $result->fetch_assoc()) {
                        if (strcasecmp($row["word"], $usrWord) == 0) {

                            echo "<h3>Congratulations</h3> <h4>The Correct Word was: " . $row["word"] . "</h4>";
                ?>
                            <script>
                                var tempScore = localStorage.getItem('tempScore');

                                if (localStorage.getItem('score') !== null) {
                                    var score = tempScore;
                                    var oldScore = localStorage.getItem('score');
                                    newScore = parseInt(oldScore) + parseInt(score);
                                    localStorage.setItem('score', newScore);
                                } else {
                                    var tempScore = localStorage.getItem('tempScore');
                                    localStorage.setItem('score', tempScore);
                                }

                                localStorage.setItem('tempScore', '0');
                            </script>


                            <?php
                            if ($usrScore !== NULL || $usrScore !== 0) {
                                $oldScore = $usrScore;
                                $newScore = $oldScore + $tempScore;
                            } else {
                                $newScore = $oldScore - $tempScore;
                            }
                        } else {
                            echo "<h3> Incrorrect </h3> <h4>The Correct Word is: " . $row["word"] . "</h4>";


                            ?>

                            <script>
                                var tempScore = localStorage.getItem('tempScore');

                                if (localStorage.getItem('score') !== null) {
                                    var score = tempScore;
                                    var oldScore = localStorage.getItem('score');
                                    var newScore = parseInt(oldScore) - parseInt(score);
                                    localStorage.setItem('score', newScore);

                                } else {
                                    var tempScore = localStorage.getItem('tempScore');
                                    localStorage.setItem('score', tempScore);
                                }

                                localStorage.setItem('tempScore', '0');
                            </script>

                <?php

                            if ($usrScore !== NULL || $usrScore !== 0) {
                                $score = $tempScore;
                                $oldScore = $usrScore;
                                $newScore = $oldScore - $score;
                            } else {
                                $newScore = 0 - $tempScore;
                            }
                        }
                    }
                } else {
                    echo "INCORRECT";
                }







                if (isset($_SESSION['Id'])) {

                    $sql = "UPDATE users
                    SET score = '$newScore'
                    WHERE username= '" . $_SESSION['userId'] . "' ";
                    $conn->query($sql);
                }



                $conn->close();
                ?>



            </div>





        </div>
    </center>
</body>

</html>
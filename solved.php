<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                <h1>Wheel of Fortune</h1>
            </center>
        </div>
        <div>




            <div>

                <button class="butn" onclick="location.href = 'index.php';">Next</button>
                <?php







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

                $num = $_GET["ID"];
                $usrWord = $_GET["mWord"];

                $sql = "SELECT id, word, engWord FROM words WHERE id=$num";


                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    // output data
                    while ($row = $result->fetch_assoc()) {
                        if (strcasecmp($row["word"], $usrWord) == 0) {
                            echo "<h3>Congratulations</h3> <h4>The Correct Word is: " . $row["word"] . "</h4>";
                ?>
                            <script>
                                var tempScore = localStorage.getItem('tempScore');

                                if (localStorage.getItem('score') !== null) {
                                    var score = tempScore;
                                    var oldScore = localStorage.getItem('score');
                                    var newScore = parseInt(oldScore) + parseInt(score);
                                    localStorage.setItem('score', newScore);

                                } else {
                                    var tempScore = localStorage.getItem('tempScore');
                                    localStorage.setItem('score', tempScore);
                                }

                                localStorage.setItem('tempScore', '0');
                            </script>

                        <?php

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
                        }
                    }
                } else {
                    echo "INCORRECT";
                }



                $conn->close();
                ?>



            </div>





        </div>
    </center>
</body>

</html>
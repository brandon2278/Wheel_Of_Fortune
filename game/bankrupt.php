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
    <script src='../Winwheel.js'></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    <link rel="stylesheet" href="../style.css">
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

                <button style="margin: 20px;" class="btn btn-warning" onclick="window.history.go(-1);">Next</button>

                <?php
                require '../includes/db.php';
                $conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
                // Check connection
                if ($conn->connect_error) {
                    die("Connection failed: " . $conn->connect_error);
                }







                echo "<div><h4>You are now BANKRUPT!</h4></div>";
                $newScore = 0;

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
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
    <title>Upload</title> 
</head>



<body  id="home" class="index">
        <div class="home-screen">
            <div align="center">
                <h2>Choose a Category</h2>
                <ul class="list-unstyled">
                    
                    <li><a class="btn btn-dark" href="upload/animals.php" role="button"> Animals </a></li>
                    <li><a class="btn btn-dark" href="upload/greetings.php" role="button"> Greetings </a></li>
                    <li><a class="btn btn-dark" href="upload/phrases.php" role="button"> Phrases </a></li>
                    <li><a class="btn btn-dark" href="#" role="button"> Food </a></li>
                    <li><a class="btn btn-dark" href="#" role="button"> Earth </a></li>
                    <li><a class="btn btn-dark" href="#" role="button"> Calendar </a></li>
                    <li><a class="btn btn-dark" href="#" role="button"> Numbers </a></li>
                </ul>
                <a class="btn btn-warning" href="index.php">Return Home</a>
            </div>
        </div>






</body>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
    window.jQuery || document.write('<script src="jquery.min.js"><\/script>')
    localStorage.setItem('tempScore', '0');
</script>
<script type="module" src="./index.js">
</script>

</html>
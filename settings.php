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



<body id="home" class="index">
    <center>
        <div align="center">
            <h1><i class="fas fa-cog"></i> Settings</h1>
        </div>
        <div class="home-screen">
            <div class="settings">
                <a href="upload.php" class="btn btn-warning" type="submit"><i class="fas fa-upload"></i> Upload New Words</a>
                <a href="delete.php" class="btn btn-warning" type="submit"><i class="fas fa-trash-alt"></i> Delete Words</a>
                <a href="data.php" class="btn btn-warning" type="submit"><i class="fas fa-database"></i> Word Database</a>
                <center><a style="margin: 20px;" href="index.php" class="btn btn-warning">Back</a></center>
            </div>
        </div>


    </center>



</body>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
    window.jQuery || document.write('<script src="jquery.min.js"><\/script>')
    localStorage.setItem('tempScore', '0');
</script>
<script type="module" src="./index.js">
</script>

</html>
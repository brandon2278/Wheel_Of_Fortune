<?php

if(isset($_POST['login-submit'])){

    require 'dbh.inc.php';

    $user = $_POST['username'];
    $password = $_POST['pwd'];

    if(empty($user) || empty($password)){
        header("Location: ../index.php?error=emptyfields");
        exit();
    }
    else{
        $sql = "SELECT * FROM users WHERE username=?; ";
        $stmt = mysqli_stmt_init($conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            header("Location: ../index.php?error=sqlerror1");
            exit();
        }
        else{

            mysqli_stmt_bind_param($stmt, "s", $user);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            if($row = mysqli_fetch_assoc($result)){
                $pwdCheck = password_verify($password, $row['passcode']);
                if($pwdCheck == false){
                    header("Location: ../index.php?error=wrongpwd");
                    exit();
                }
                else if($pwdCheck == true){
                    session_start();
                    $_SESSION['Id'] = $row['id'];
                    $_SESSION['userId'] = $row['username'];
                    $_SESSION['first'] = $row['firstName'];
                    $_SESSION['usrScore'] = $row['score'];
                    $_SESSION['tempScore'] = $row['tempScore'];
                    header("Location: ../index.php?login=success");
                    exit();
                }
                else{
                    header("Location: ../index.php?error=wrongpwd");
                    exit();
                }

            }
            else{
                header("Location: ../index.php?error=nouser");
                exit();
            }

        }
    }

}
else{
    header("Location: ../index.php");
    exit();
}
<?php

if(isset($_POST['signup-submit'])){

    require 'dbh.inc.php';

    $firstName = $_POST['firstName'];
    $username = $_POST['username'];
    $pwd = $_POST['pwd'];
    $passwordRepeat = $_POST['pwd-repeat'];

    if(empty($username) || empty($pwd) || empty($passwordRepeat)){
        header("Location: ../create.php?error=emptyfields&uid=".$username);
        exit();
        
    }
    else if(!preg_match("/^[a-zA-Z0-9]*$/", $username)){
        header("Location: ../create.php?error=invalidmailuid");
        exit();
    }
    else if($pwd !== $passwordRepeat){
        header("Location: ../create.php?error=passwordcheck&uid=".$username);
        exit();
    }
    else{

        $sql = "SELECT username FROM users WHERE username=?";
        $stmt = mysqli_stmt_init($conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            header("Location: ../create.php?error=sqlerror1");
            exit();
        }
        else {
            mysqli_stmt_bind_param($stmt, "s", $username);    
            mysqli_stmt_execute($stmt);  
            mysqli_stmt_store_result($stmt); 
            $resultCheck = mysqli_stmt_num_rows($stmt); 
            if($resultCheck > 0){
                header("Location: ../create.php?error=usertaken");
                exit();
            }
            else{
                $sql = "INSERT INTO users (firstName, username, passcode) VALUES (?, ?, ?)";
                $stmt = mysqli_stmt_init($conn);
                if(!mysqli_stmt_prepare($stmt, $sql)){
                    header("Location: ../create.php?error=sqlerror2");
                    exit();
                } 
                else{

                    $hashedPwd = password_hash($pwd, PASSWORD_DEFAULT);

                    mysqli_stmt_bind_param($stmt, "sss",$firstName, $username, $hashedPwd);    
                    mysqli_stmt_execute($stmt);  
                    header("Location: ../index.php?signup=success");
                   
                    exit();
                    
                }
            }
        }
    }
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
}
else{
    header("Location: ../index.php");
    exit();
}
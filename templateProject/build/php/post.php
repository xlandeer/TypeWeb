<?php

    //Get Connection

    function executeQuery($conn, $sql) {
        if (mysqli_query($conn, $sql)) {
            echo "New record created successfully";
        } else { 	
            echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        }
    }
	// function to reate a connection to databse
	function connToDB($servername, $username, $password, $dbname) {
		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if (!$conn) {
			//die("Connection failed: " . mysqli_connect_error(). "<br>");
			return false;
		}else {
			// return connection if connection is created
			return $conn;
		}
    }

    $sname = "127.0.0.1";
	$uname = "root";
	$pswd = "";
	$dbname = "Cocktail";

    $conn = connToDB($sname, $uname, $pswd, $dbname);

    //POST REQUEST

	if ( $_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST)) {
		//Your Post request code here
	} else {
        echo 'Please use the affiliated Script for the HTTP Method!';
        http_response_code(405); 
		die();
    }
?>
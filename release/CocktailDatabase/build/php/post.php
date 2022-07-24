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
		if($_POST["intention"] == "save") {
			$cocktailname = $_POST["name"];
			$imageurl = $_POST["imageUrl"];
			$ingredients = $_POST["ingredients"];
			$description = $_POST["description"];
			

			$sql = "INSERT INTO cocktail(cocktail_name, image_url, description)";
			$sql .= "VALUES('$cocktailname', '$imageurl', '$description')";

			executeQuery($conn, $sql);

			$sql = "SELECT MAX(id) AS ID FROM cocktail";
			$id = (int)mysqli_query($conn, $sql)->fetch_assoc()["ID"];
			
			
			foreach ($ingredients["map"] as $key => $amt) {
				$amtInt = (int)$amt["amt"];
				$amtMeasure = $amt["measure"];
				$sql = "INSERT INTO ingredients(cocktail_id, ingr_name, ingr_amt, ingr_measure)";
				$sql .= "Values($id, '$key', $amtInt, '$amtMeasure')";
				executeQuery($conn, $sql);
			}
		}else {
			$id = $_POST['id'];
			$sql = "DELETE FROM cocktail WHERE id = $id";
			unlink($_POST['imgPath']);
			executeQuery($conn, $sql);
		}

	} else {
        echo 'Please use the affiliated Script for the HTTP Method!';
        http_response_code(405); 
		die();
    }
?>
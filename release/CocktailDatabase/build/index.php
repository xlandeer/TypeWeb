<?php

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

	// connect to database	
	$conn = connToDB($sname, $uname, $pswd, $dbname);

	// If database is not setup:
	// createTables($conn);

   	$RequestMethod = filter_input(INPUT_SERVER, 'REQUEST_METHOD', FILTER_SANITIZE_STRING);
	if ( $RequestMethod === 'POST' && !empty($_POST)) {
		if($_POST["intention"] == "save") {
			$cocktailname = $_POST["name"];
			$imageurl = $_POST["imageUrl"];
			$ingredients = $_POST["ingredients"];
			var_dump($ingredients);

			$sql = "INSERT INTO cocktail(cocktail_name, image_url)";
			$sql .= "VALUES('$cocktailname', '$imageurl')";

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

	}else if($_SERVER['REQUEST_METHOD'] === 'GET'  && isset($_GET['searchFilter']) && isset($_GET['attribute']))	{
        $results = [];
		$attr = $_GET['attribute'] == "ingr_name" ? "i.ingr_name" : "c.cocktail_name";

        $sql = 'SELECT c.id, c.cocktail_name, c.image_url FROM cocktail c LEFT JOIN ingredients i ON c.id = i.cocktail_id WHERE '.$_GET["attribute"].' LIKE "%'.$_GET["searchFilter"].'%" GROUP BY c.cocktail_name;';
		$searchRes = mysqli_query($conn, $sql);
		if ($searchRes->num_rows > 0) {
			
			// output data of each row
			while($row = $searchRes->fetch_assoc()) {
				$ingredientRes = [];
				$id = (int)$row['id'];
                $sql = "SELECT ingr_name, ingr_amt, ingr_measure FROM ingredients WHERE cocktail_id = $id";
                $ingrRes = mysqli_query($conn, $sql);
				
                if ($ingrRes->num_rows > 0) {
                    while($rowIngr = $ingrRes->fetch_assoc()) {
                        $rowResIngr = ['ingr_name' => $rowIngr["ingr_name"], 'ingr_amt' => $rowIngr["ingr_amt"], 'ingr_measure' => $rowIngr['ingr_measure']];
                        array_push($ingredientRes, $rowResIngr);
                    }
				}
				$rowRes = ['name' => $row["cocktail_name"], 'imageUrl' => $row["image_url"], 'ingredients' => $ingredientRes, 'id' => $id];
				array_push($results, $rowRes);
			}
			echo(json_encode($results));
		}
		
        
	}else {
		http_response_code(405); 
		die();
    }
    // end the connection
    mysqli_close($conn);	
    

    

?>

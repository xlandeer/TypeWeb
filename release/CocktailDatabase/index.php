<?php


    function createTables($conn) {
        $sql = "CREATE TABLE cocktail(id INT PRIMARY KEY AUTO_INCREMENT, cocktail_name varchar(50), image_url varchar(100))";
        executeQuery($conn,$sql);
        $sql = "CREATE TABLE ingredients(cocktail_id INT, ingr_name VARCHAR(50), ingr_amt INT, ingr_measure VARCHAR(10)";
        $sql .= "CONSTRAINT PK_Cocktail PRIMARY KEY (cocktail_id, ingr_name));";
        executeQuery($conn,$sql);
        $sql = "ALTER TABLE ingredients ";
        $sql .= "ADD CONSTRAINT FK_COCKTAIL_ID FOREIGN KEY (cocktail_id) REFERENCES Cocktail(id) ";
        $sql .= "ON DELETE CASCADE;";
        executeQuery($conn,$sql);
        
    }

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
			executeQuery($conn, $sql);
		}

	}else if($_SERVER['REQUEST_METHOD'] === 'GET'  && isset($_GET['searchFilter']))	{
        $results = [];
        $sql = 'SELECT id, cocktail_name, image_url FROM cocktail WHERE cocktail_name LIKE "%'.$_GET["searchFilter"].'%";';
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

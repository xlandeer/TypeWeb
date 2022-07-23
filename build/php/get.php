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

    //GET REQUEST

    if($_SERVER['REQUEST_METHOD'] === 'GET'  && isset($_GET['searchFilter']) && isset($_GET['attribute']))	{
        $results = [];
		$attr = $_GET['attribute'] == "ingr_name" ? "i." : "c.";
		$attr .= $_GET['attribute'];

        $sql = 'SELECT c.id, c.cocktail_name, c.image_url, c.description FROM cocktail c LEFT JOIN ingredients i ON c.id = i.cocktail_id WHERE '.$_GET["attribute"].' LIKE "%'.$_GET["searchFilter"].'%" GROUP BY c.cocktail_name;';
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
				$rowRes = ['name' => $row["cocktail_name"], 'imageUrl' => $row["image_url"], 'ingredients' => $ingredientRes, 'id' => $id, 'description' => $row["description"]];
				array_push($results, $rowRes);
			}
			echo(json_encode($results));
		}
		
        
	}else {
        
		http_response_code(405); 
		die();
    }
?>
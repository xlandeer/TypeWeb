<?php


    function createTables($conn) {
        $sql = "CREATE TABLE Cocktail(id INT PRIMARY KEY AUTO_INCREMENT, cocktail_name varchar(50), image_url varchar(100))";
        executeQuery($conn,$sql);
        $sql = "CREATE TABLE Ingredients(cocktail_id INT, ingr_name VARCHAR(50), ingr_amt INT,";
        $sql .= "CONSTRAINT PK_Cocktail PRIMARY KEY (cocktail_id, ingr_name));";
        executeQuery($conn,$sql);
        $sql = "ALTER TABLE Ingredients ";
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
	$dbname = "cocktail";

	// connect to database	
	$conn = connToDB($sname, $uname, $pswd, $dbname);

   	$RequestMethod = filter_input(INPUT_SERVER, 'REQUEST_METHOD', FILTER_SANITIZE_STRING);
	if ( $RequestMethod === 'POST' && !empty($_POST)) {
		$cocktailname = $_POST["name"];
		$imageurl = $_POST["imageUrl"];
		//$ingredients = $_POST[ingredients];

		$sql = "INSERT INTO cocktail(cocktail_name, image_url)";
		$sql .= "VALUES('$cocktailname', '$imageurl')";
		executeQuery($conn, $sql);

	}else if($_SERVER['REQUEST_METHOD'] === 'GET'  && isset($_GET['searchFilter']))	{
		$sql = 'SELECT cocktail_name, image_url FROM cocktail WHERE cocktail_name LIKE "%'.$_GET["searchFilter"].'%";';
		
		$searchRes = mysqli_query($conn, $sql);
		var_dump($searchRes);
	}else {
		http_response_code(405); 
		die();
	}
    // end the connection
    mysqli_close($conn);	
    

    

?>

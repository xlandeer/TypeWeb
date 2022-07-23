<?php
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
    function executeQuery($conn, $sql) {
        if (mysqli_query($conn, $sql)) {
            echo "New record created successfully";
        } else { 	
            echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        }
    }
    $sname = "127.0.0.1";
	$uname = "root";
	$pswd = "";
	$dbname = "Cocktail";

	// connect to database	
	$conn = connToDB($sname, $uname, $pswd, $dbname);
    $sql = "CREATE TABLE cocktail(id INT PRIMARY KEY AUTO_INCREMENT, cocktail_name varchar(50), image_url varchar(100), description varchar(500));";
    executeQuery($conn,$sql);
    $sql = "CREATE TABLE ingredients(cocktail_id INT, ingr_name VARCHAR(50), ingr_amt INT, ingr_measure VARCHAR(10)";
    $sql .= "CONSTRAINT PK_Cocktail PRIMARY KEY (cocktail_id, ingr_name));";
    executeQuery($conn,$sql);
    $sql = "ALTER TABLE ingredients ";
    $sql .= "ADD CONSTRAINT FK_COCKTAIL_ID FOREIGN KEY (cocktail_id) REFERENCES cocktail(id) ";
    $sql .= "ON DELETE CASCADE;";
    executeQuery($conn,$sql);

    // end the connection
    mysqli_close($conn);	
?>
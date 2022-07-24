<?php
    //On Linux your directory might not be writable. To fix execute the following line as an admin user; php upload.php - returns 1 if it worked;
    //echo chmod("../images",0777);

    
    $filename = $_FILES['file']['name'];

    $location = "../images/".basename($filename);
    // echo(json_encode(is_writable("images")));
    if(move_uploaded_file($_FILES['file']['tmp_name'],$location)) {
        echo 'Success ';
    } else {
        // echo(json_encode(chmod("/images", 0777)));
        echo 'Failed to upload to ';
    }

?>
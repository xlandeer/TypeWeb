<?php

    $filename = $_FILES['file']['name'];

    $location = "../$directoryName/".basename($filename);
    // echo(json_encode(is_writable("images")));
    if(move_uploaded_file($_FILES['file']['tmp_name'],$location)) {
        echo 'Success ';
    } else {
        // echo(json_encode(chmod("/images", 0777)));
        echo 'Failed to upload to ';
    }

?>
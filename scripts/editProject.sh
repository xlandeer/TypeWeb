#!/bin/bash
if [ $# -eq 0 ]
    then
        echo "Please supply the path of the Project being edited!"
    else
        cp -r $1/src .
        cp -r $1/css build
        cp -r $1/images build
        cp $1/index.html build
        cp $1/index.js build
        cp $1/index.js.map build
        cp $1/index.php build

fi


#!/bin/bash
if [ $# -eq 0 ]
    then
        echo "Please supply the directory the Project should be saved under!"
    else
        rm -r $1
        cp -r src $1
        cp -r build $1
        
fi


#!/bin/bash
if [ $# -eq 0 ]
    then
        echo "Please supply the name the Project should be saved under!"
    else
        cp -r src release/$1/
        cp -r build release/$1/
        
fi


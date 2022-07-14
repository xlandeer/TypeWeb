#!/bin/bash
if [ $# -eq 0 ]
    then
        echo "Please supply the name the Project should be saved under!"
    else
        cp -r src release/$1/
        cp -r build/css release/$1/
        cp -r build/images release/$1/
        cp build/index.html release/$1/
        cp build/index.js release/$1/
        cp build/index.js.map release/$1/
fi


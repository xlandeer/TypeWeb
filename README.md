# TypeWeb #
Description: Small project by aspiring programmers wanting to learn to work with TypeScript.
Partly learned from:
"Programming TypeScript by Boris Cherny (O’Reilly). Copyright 2019 Boris Cherny, 978-1-492-03765-1.”

* Project Ideas:
  - [x] Checklist
  - [x] Maze Generator
  - [ ] Cocktail Database
  - [ ] Chess-Engine(Already begun)
  - [ ] Small scoped browser Game
  
# Requirements #
* Apache2 WebServer and MySQLServer(e.g. [**XAMPP**](https://www.apachefriends.org/de/index.html))


## Setup ##
```sh
$ npm init
$ npm install --save-dev typescript tslint @types/node
```
## Compile ##
```sh
$ /node_modules/.bin/tsc -p tsconfig.json
```
## Run ##
```sh
$ node ./build/index.js 
```
## Save Project ##
### Example ###
```sh
$ scripts/saveProject.sh Checklist
```
## Edit Project ##
### Example ###
```sh
$ scripts/editProject.sh release/Checklist
```

## New Project ##
```sh
$ scripts/newProject.sh
```

## Setup Database ##
```sh
$ php build/dbSetup.php
```

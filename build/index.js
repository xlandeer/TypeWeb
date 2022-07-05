"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
})(Direction || (Direction = {}));
class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.stack = new Array();
        this.map = new Array(this.width);
        for (let x = 0; x < this.width; x++) {
            this.map[x] = new Array(this.height);
            for (let y = 0; y < this.height; y++) {
                this.map[x][y] = new Cell([true, true, true, true], x, y);
            }
        }
        this.generateMaze();
    }
    generateMaze() {
        this.stack.push(this.map[0][0]);
        let deadend = false;
        while (this.stack.length) {
            while (!deadend) {
                let current = this.stack.pop();
                if (current) {
                    let neighbours = this.getAvailableNeighbours(current);
                    if (neighbours.length) {
                        let neighbour = neighbours[Math.floor((Math.random() * neighbours.length))];
                        this.removeWallsBetween(current, neighbour);
                        this.stack.push(neighbour.cell);
                    }
                    else {
                        deadend = true;
                    }
                    // this.stack.push(current);
                }
            }
            this.stack.pop();
            deadend = false;
        }
    }
    removeWallsBetween(currentCell, nextCell) {
        currentCell.setWall(nextCell.direction, false);
        nextCell.cell.setWall((nextCell.direction + 2) % 4, false);
    }
    getAvailableNeighbours(cell) {
        let neighbours = [];
        const cellPos = cell.getPosition();
        // check cell on the right side
        if (cellPos.posX + 1 < this.width) {
            if (!this.map[cellPos.posX + 1][cellPos.posY].visited) {
                neighbours.push({ cell: this.map[cellPos.posX + 1][cellPos.posY], direction: Direction.Right });
            }
        }
        // check cell on the left side
        if (cellPos.posX - 1 > this.width) {
            if (!this.map[cellPos.posX - 1][cellPos.posY].visited) {
                neighbours.push({ cell: this.map[cellPos.posX - 1][cellPos.posY], direction: Direction.Left });
            }
        }
        // check cell infront
        if (cellPos.posY + 1 < this.height) {
            if (!this.map[cellPos.posX][cellPos.posY + 1].visited) {
                neighbours.push({ cell: this.map[cellPos.posX][cellPos.posY + 1], direction: Direction.Up });
            }
        }
        // check cell behind
        if (cellPos.posY - 1 > this.height) {
            if (!this.map[cellPos.posX][cellPos.posY - 1].visited) {
                neighbours.push({ cell: this.map[cellPos.posX][cellPos.posY - 1], direction: Direction.Down });
            }
        }
        return neighbours;
    }
    printMap() {
        console.log(this.map[0]);
    }
}
class Cell {
    constructor(walls, posX, posY) {
        this.walls = walls;
        this.posX = posX;
        this.posY = posY;
        this.visited = false;
    }
    // public getWalls () {
    //     return this.walls;
    // }
    setWall(direction, value) {
        this.walls[direction] = value;
    }
    getPosition() {
        return { posX: this.posX, posY: this.posY };
    }
}
let maze = new Maze(5, 5);
maze.printMap();
//# sourceMappingURL=index.js.map
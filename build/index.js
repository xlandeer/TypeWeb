"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
})(Direction || (Direction = {}));
class Maze {
    constructor(width, height, parent = document.querySelector('main')) {
        var _a;
        this.width = width;
        this.height = height;
        this.parent = parent;
        this.stack = new Array();
        this.map = new Array(this.width);
        this.mazeWrapper = document.createElement('div');
        this.mazeWrapper.setAttribute('class', 'maze-wrapper');
        this.mazeWrapper.style.display = 'grid';
        this.mazeWrapper.style.gridTemplateColumns = `repeat(${this.width}, 30px)`;
        this.mazeWrapper.style.gridTemplateRows = `repeat(${this.height}, 30px)`;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.appendChild(this.mazeWrapper);
        for (let y = 0; y < this.height; y++) {
            this.map[y] = new Array(this.width);
            for (let x = 0; x < this.height; x++) {
                this.map[y][x] = new Cell([true, true, true, true], y, x, this.mazeWrapper);
            }
        }
        this.generateMaze();
    }
    generateMaze() {
        return __awaiter(this, void 0, void 0, function* () {
            this.stack.push(this.map[0][0]);
            this.map[0][0].visited = true;
            let deadend = false;
            while (this.stack.length) {
                while (!deadend) {
                    let current = this.stack.pop();
                    if (current) {
                        let neighbours = this.getAvailableNeighbours(current);
                        this.stack.push(current);
                        if (neighbours.length) {
                            let neighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
                            yield this.removeWallsBetween(current, neighbour);
                            neighbour.cell.visited = true;
                            this.stack.push(neighbour.cell);
                        }
                        else {
                            deadend = true;
                        }
                    }
                }
                this.stack.pop();
                deadend = false;
            }
        });
    }
    removeWallsBetween(currentCell, nextCell) {
        return __awaiter(this, void 0, void 0, function* () {
            yield currentCell.setWall(nextCell.direction, false);
            yield nextCell.cell.setWall((nextCell.direction + 2) % 4, false);
        });
    }
    getAvailableNeighbours(cell) {
        let neighbours = [];
        const cellPos = cell.getPosition();
        // check cell on the right side
        if (cellPos.posX + 1 < this.width) {
            if (!this.map[cellPos.posY][cellPos.posX + 1].visited) {
                neighbours.push({
                    cell: this.map[cellPos.posY][cellPos.posX + 1],
                    direction: Direction.Right,
                });
            }
        }
        // check cell on the left side
        if (cellPos.posX - 1 >= 0) {
            if (!this.map[cellPos.posY][cellPos.posX - 1].visited) {
                neighbours.push({
                    cell: this.map[cellPos.posY][cellPos.posX - 1],
                    direction: Direction.Left,
                });
            }
        }
        // check cell infront
        if (cellPos.posY + 1 < this.height) {
            if (!this.map[cellPos.posY + 1][cellPos.posX].visited) {
                neighbours.push({
                    cell: this.map[cellPos.posY + 1][cellPos.posX],
                    direction: Direction.Down,
                });
            }
        }
        // check cell behind
        if (cellPos.posY - 1 >= 0) {
            if (!this.map[cellPos.posY - 1][cellPos.posX].visited) {
                neighbours.push({
                    cell: this.map[cellPos.posY - 1][cellPos.posX],
                    direction: Direction.Up,
                });
            }
        }
        return neighbours;
    }
    printMap() {
        // for (let y: number = 0; y < this.height; y++) {      
        //   for (let x: number = 0; x < this.width; x++) {
        //     this.map[y][x].drawCell();
        //   }
        // }
        let mazeString = '';
        for (let y = 0; y < this.height; y++) {
            for (let i = 0; i < 3; i++) {
                for (let x = 0; x < this.width; x++) {
                    const cellWalls = this.map[y][x].getWalls();
                    if (i == 0) {
                        mazeString += (cellWalls[Direction.Up]) ? '111' : '101';
                    }
                    else if (i == 1) {
                        mazeString += (cellWalls[Direction.Left]) ? '1' : '0';
                        mazeString += '0';
                        mazeString += (cellWalls[Direction.Right]) ? '1' : '0';
                    }
                    else {
                        mazeString += (cellWalls[Direction.Down]) ? '111' : '101';
                    }
                }
                mazeString += '\n';
            }
        }
        console.log(mazeString);
    }
}
class Cell {
    constructor(walls, posY, posX, mazeWrapper) {
        this.walls = walls;
        this.posY = posY;
        this.posX = posX;
        this.mazeWrapper = mazeWrapper;
        this.div = document.createElement('div');
        this.visited = false;
        this.mazeWrapper.appendChild(this.div);
    }
    getWalls() {
        return this.walls;
    }
    setWall(direction, value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.walls[direction] = value;
            yield this.drawCell();
        });
    }
    getPosition() {
        return { posX: this.posX, posY: this.posY };
    }
    drawCell() {
        return new Promise((resolve) => {
            //   setTimeout(() => {
            //     let div: HTMLElement = document.createElement('div');
            //     if (this.walls[Direction.Up]) div.style.borderTop = '1px solid #fff';
            //     if (this.walls[Direction.Right]) div.style.borderRight = '1px solid #fff';
            //     if (this.walls[Direction.Down]) div.style.borderBottom = '1px solid #fff';
            //     if (this.walls[Direction.Left]) div.style.borderLeft = '1px solid #fff';
            //     this.mazeWrapper.appendChild(div);
            //     resolve()
            //   }, time)
            // })
            window.setTimeout(() => {
                this.div.style.border = 'none';
                if (this.walls[Direction.Up])
                    this.div.style.borderTop = '1px solid #fff';
                if (this.walls[Direction.Right])
                    this.div.style.borderRight = '1px solid #fff';
                if (this.walls[Direction.Down])
                    this.div.style.borderBottom = '1px solid #fff';
                if (this.walls[Direction.Left])
                    this.div.style.borderLeft = '1px solid #fff';
                resolve();
            }, 10);
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    let maze = new Maze(15, 15);
    maze.printMap();
});
//# sourceMappingURL=index.js.map
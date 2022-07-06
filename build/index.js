"use strict";
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
            for (let x = 0; x < this.width; x++) {
                this.map[y][x] = new Cell([true, true, true, true], y, x, this.mazeWrapper);
            }
        }
        this.generateMaze();
    }
    generateMaze() {
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
                        this.removeWallsBetween(current, neighbour);
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
    checkWalls(neighbours) {
        let ret = [];
        for (const neighbour of neighbours) {
            if (neighbour.cell.getWalls()[neighbour.direction])
                ret.push(neighbour);
        }
        return ret;
    }
    printMap() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.map[y][x].drawCell();
            }
        }
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
    printPath() {
        let path = [];
        this.map.forEach((cellArray) => {
            cellArray.forEach((cell) => {
                cell.visited = false;
            });
        });
        path.push(this.map[0][0]);
        this.map[0][0].visited = true;
        let deadend = false;
        let current;
        while ((current === null || current === void 0 ? void 0 : current.getPosition().posX) !== this.width - 1 && (current === null || current === void 0 ? void 0 : current.getPosition().posY) !== this.height - 1) {
            while (!deadend) {
                current = path.pop();
                if (current) {
                    let neighbours = this.checkWalls(this.getAvailableNeighbours(current));
                    path.push(current);
                    if (neighbours.length) {
                        let neighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
                        neighbour.cell.visited = true;
                        path.push(neighbour.cell);
                    }
                    else {
                        deadend = true;
                    }
                }
            }
            console.log(current);
            path.pop();
            deadend = false;
        }
        console.log(path);
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
        this.walls[direction] = value;
    }
    getPosition() {
        return { posX: this.posX, posY: this.posY };
    }
    drawCell() {
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
        this.div.style.border = 'none';
        if (this.walls[Direction.Up])
            this.div.style.borderTop = '1px solid #fff';
        if (this.walls[Direction.Right])
            this.div.style.borderRight = '1px solid #fff';
        if (this.walls[Direction.Down])
            this.div.style.borderBottom = '1px solid #fff';
        if (this.walls[Direction.Left])
            this.div.style.borderLeft = '1px solid #fff';
    }
}
document.addEventListener("DOMContentLoaded", () => {
    let maze = new Maze(15, 15);
    maze.printMap();
    maze.printPath();
});
//# sourceMappingURL=index.js.map
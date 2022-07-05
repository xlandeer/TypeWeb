import { dir } from "console";

enum Direction {
  Up,
  Right,
  Down,
  Left
}



class Maze {
  private map: Cell[][];
  private stack: Cell[] = new Array()

  constructor(private width: number, private height: number) {
    this.map = new Array(this.width);
    for (let x: number = 0; x < this.width; x++) {
      this.map[x] = new Array(this.height);
      for (let y: number = 0; y < this.height; y++) {
        this.map[x][y] = new Cell([true, true, true, true], x, y);
      }
    }

    this.generateMaze();
  }

  private generateMaze() {
    this.stack.push(this.map[0][0]);
    let deadend: boolean = false;
    while (this.stack.length) {
      while (!deadend) {
        let current = this.stack.pop();
        if (current) {
          let neighbours = this.getAvailableNeighbours(current);
          if (neighbours.length) {
            let neighbour = neighbours[Math.floor((Math.random() * neighbours.length))]
            this.removeWallsBetween(current, neighbour);

            this.stack.push(neighbour.cell);
          } else {
            deadend = true;
          }
          // this.stack.push(current);
        }
      }
      

      this.stack.pop();
      deadend = false;

    }
  }


  private removeWallsBetween(currentCell: Cell, nextCell: { cell: Cell, direction: Direction }) {
    currentCell.setWall(nextCell.direction, false);
    nextCell.cell.setWall((nextCell.direction + 2) % 4, false);
  }

  private getAvailableNeighbours(cell: Cell) {
    let neighbours: { cell: Cell, direction: Direction }[] = [];
    const cellPos = cell.getPosition()

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

  public printMap() {
    console.log(this.map[0]);
  }
}

class Cell {
  visited: boolean = false;
  constructor(private walls: boolean[], private posX: number, private posY: number) {
  }

  // public getWalls () {
  //     return this.walls;
  // }

  public setWall(direction: Direction, value: boolean) {
    this.walls[direction] = value;
  }

  public getPosition() {
    return { posX: this.posX, posY: this.posY };
  }
}

let maze = new Maze(5, 5);
maze.printMap();
enum Direction {
  Up,
  Right,
  Down,
  Left,
}

class Maze {
  private map: Cell[][];
  private stack: Cell[] = new Array();

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
            let neighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
            this.removeWallsBetween(current, neighbour);
            
            current.visited = true;
            neighbour.cell.visited = true;
            // this.stack.push(current);
            this.stack.push(neighbour.cell);
          } else {
            deadend = true;
          }
          this.stack.push(current);
        }
      }

      this.stack.pop();
      deadend = false;
    }
  }

  private removeWallsBetween(
    currentCell: Cell,
    nextCell: { cell: Cell; direction: Direction }
  ) {
    currentCell.setWall(nextCell.direction, false);
    nextCell.cell.setWall((nextCell.direction + 2) % 4, false);        
  }

  private getAvailableNeighbours(cell: Cell) {
    let neighbours: { cell: Cell; direction: Direction }[] = [];
    const cellPos = cell.getPosition();

    // check cell on the right side
    if (cellPos.posX + 1 < this.width) {
      if (!this.map[cellPos.posX + 1][cellPos.posY].visited) {
        neighbours.push({
          cell: this.map[cellPos.posX + 1][cellPos.posY],
          direction: Direction.Right,
        });
      }
    }
    // check cell on the left side
    if (cellPos.posX - 1 >= 0) {
      if (!this.map[cellPos.posX - 1][cellPos.posY].visited) {
        neighbours.push({
          cell: this.map[cellPos.posX - 1][cellPos.posY],
          direction: Direction.Left,
        });
      }
    }
    // check cell infront
    if (cellPos.posY + 1 < this.height) {
      if (!this.map[cellPos.posX][cellPos.posY + 1].visited) {
        neighbours.push({
          cell: this.map[cellPos.posX][cellPos.posY + 1],
          direction: Direction.Down,
        });
      }
    }
    // check cell behind
    if (cellPos.posY - 1 >= 0) {
      if (!this.map[cellPos.posX][cellPos.posY - 1].visited) {
        neighbours.push({
          cell: this.map[cellPos.posX][cellPos.posY - 1],
          direction: Direction.Up,
        });
      }
    }
    return neighbours;
  }

  public printMap() {
    let mazeWrapper: HTMLElement | null = document.querySelector('.maze-wrapper');
    if (mazeWrapper != null) {
      mazeWrapper.style.display = 'grid';
      mazeWrapper.style.gridTemplateColumns = `repeat(${this.width}, 30px)`;
      mazeWrapper.style.gridTemplateRows = `repeat(${this.height}, 30px)`;
      for (let y: number = 0; y < this.height; y++) {
        for (let x: number = 0; x < this.width; x++) {
          const cellWalls = this.map[x][y].getWalls();
          let div: HTMLElement = document.createElement('div');         
          if (cellWalls[Direction.Up]) div.style.borderTop = '1px solid #fff';
          if (cellWalls[Direction.Right]) div.style.borderRight = '1px solid #fff';
          if (cellWalls[Direction.Down]) div.style.borderBottom = '1px solid #fff';
          if (cellWalls[Direction.Left]) div.style.borderLeft = '1px solid #fff';
          mazeWrapper.appendChild(div);
        }

      }
    }
    let mazeString = '';
    for (let y: number = 0; y < this.height; y++) {
      for(let i: number = 0; i < 3; i++) {
        for (let x: number = 0; x < this.width; x++) {
          const cellWalls = this.map[x][y].getWalls();
          if (i == 0) {
            mazeString += (cellWalls[Direction.Up]) ? '111' : '101';
          }else if(i == 1) {
            mazeString += (cellWalls[Direction.Left]) ? '1' : '0';
            mazeString += '0';
            mazeString += (cellWalls[Direction.Right]) ? '1' : '0';
          }else {
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
  visited: boolean = false;
  constructor(
    private walls: boolean[],
    private posX: number,
    private posY: number
  ) {}

  public getWalls () {
      return this.walls;
  }
  public setWall(direction: Direction, value: boolean) {
    this.walls[direction] = value;    
  }

  public getPosition() {
    return { posX: this.posX, posY: this.posY };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let maze = new Maze(8, 8);
  maze.printMap();
});
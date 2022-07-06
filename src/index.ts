enum Direction {
  Up,
  Right,
  Down,
  Left,
}

class Maze {
  private map: Cell[][];
  private stack: Cell[] = new Array();
  private mazeWrapper: HTMLDivElement;

  constructor(private width: number, private height: number, private parent: HTMLElement |null = document.querySelector('main')) {
    this.map = new Array(this.width);
    this.mazeWrapper = document.createElement('div');
    this.mazeWrapper.setAttribute('class', 'maze-wrapper');
    this.mazeWrapper.style.display = 'grid';
    this.mazeWrapper.style.gridTemplateColumns = `repeat(${this.width}, 30px)`;
    this.mazeWrapper.style.gridTemplateRows = `repeat(${this.height}, 30px)`;
    this.parent?.appendChild(this.mazeWrapper);

    for (let y: number = 0; y < this.height; y++) {
      this.map[y] = new Array(this.width);
      for (let x: number = 0; x < this.height; x++) {
        this.map[y][x] = new Cell([true, true, true, true], y, x, this.mazeWrapper);
      }
    }

    
    this.generateMaze();
  }

  private async generateMaze() {
    this.stack.push(this.map[Math.floor(Math.random() * this.width)][Math.floor(Math.random() * this.height)]);
    let deadend: boolean = false;
    while (this.stack.length) {
      while (!deadend) {        
        let current = this.stack.pop();
        
        if (current) {
          let neighbours = this.getAvailableNeighbours(current);
          this.stack.push(current);
          if (neighbours.length) {
            let neighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
            await this.removeWallsBetween(current, neighbour);
            
            neighbour.cell.visited = true;
            this.stack.push(neighbour.cell);
          } else {
            deadend = true;
          }
        }
      }

      this.stack.pop();
      deadend = false;
    }
  }

  private async removeWallsBetween(
    currentCell: Cell,
    nextCell: { cell: Cell; direction: Direction }
  ) {
    await currentCell.setWall(nextCell.direction, false);
    await nextCell.cell.setWall((nextCell.direction + 2) % 4, false);        
  }

  private getAvailableNeighbours(cell: Cell) {
    let neighbours: { cell: Cell; direction: Direction }[] = [];
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

  public printMap() {
    // for (let y: number = 0; y < this.height; y++) {      
    //   for (let x: number = 0; x < this.width; x++) {
    //     this.map[y][x].drawCell();
    //   }
    // }
    
    let mazeString = '';
    for (let y: number = 0; y < this.height; y++) {
      for(let i: number = 0; i < 3; i++) {
        for (let x: number = 0; x < this.width; x++) {
          const cellWalls = this.map[y][x].getWalls();
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
  private div: HTMLElement = document.createElement('div');
  visited: boolean = false;
  constructor(
    private walls: boolean[],
    private posY: number,
    private posX: number,
    private mazeWrapper: HTMLDivElement
  ) {
    this.mazeWrapper.appendChild(this.div);
  }

  public getWalls () {
      return this.walls;
  }
  public async setWall(direction: Direction, value: boolean) {
    this.walls[direction] = value; 
    await this.drawCell();   
  }

  public getPosition() {
    return { posX: this.posX, posY: this.posY };
  }

  public drawCell() {
    return new Promise<void>((resolve) => {
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
        if (this.walls[Direction.Up]) this.div.style.borderTop = '1px solid #fff';
        if (this.walls[Direction.Right]) this.div.style.borderRight = '1px solid #fff';
        if (this.walls[Direction.Down]) this.div.style.borderBottom = '1px solid #fff';
        if (this.walls[Direction.Left]) this.div.style.borderLeft = '1px solid #fff';
        resolve();
      }, 10)
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let maze = new Maze(15, 15);
  maze.printMap();
});
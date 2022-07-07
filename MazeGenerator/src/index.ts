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

  constructor(private width: number, private height: number, private parent: HTMLElement | null = document.querySelector('main')) {
    this.map = new Array(this.width);
    this.mazeWrapper = document.createElement('div');
    this.mazeWrapper.setAttribute('class', 'maze-wrapper');
    this.mazeWrapper.style.display = 'grid';
    this.mazeWrapper.style.gridTemplateColumns = `repeat(${this.width}, 30px)`;
    this.mazeWrapper.style.gridTemplateRows = `repeat(${this.height}, 30px)`;
    this.parent?.appendChild(this.mazeWrapper);

    for (let y: number = 0; y < this.height; y++) {
      this.map[y] = new Array(this.width);
      for (let x: number = 0; x < this.width; x++) {
        this.map[y][x] = new Cell([true, true, true, true], y, x, this.mazeWrapper);
      }
    }


    this.generateMaze();
  }

  private generateMaze() {
    this.stack.push(this.map[0][0]);
    this.map[0][0].visited = true;
    let deadend: boolean = false;
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
          } else {
            deadend = true;
          }
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

  private checkWalls(neighbours: { cell: Cell, direction: Direction }[]) {
    let ret: { cell: Cell, direction: Direction }[] = [];
    for (const neighbour of neighbours) {
      if (!neighbour.cell.getWalls()[(neighbour.direction+2)%4]) ret.push(neighbour);
    }
    return ret;
  }


  public printMap() {
    for (let y: number = 0; y < this.height; y++) {
      for (let x: number = 0; x < this.width; x++) {
        this.map[y][x].drawCell();
      }
    }
/*
    let mazeString = '';
    for (let y: number = 0; y < this.height; y++) {
      for (let i: number = 0; i < 3; i++) {
        for (let x: number = 0; x < this.width; x++) {
          const cellWalls = this.map[y][x].getWalls();
          if (i == 0) {
            mazeString += (cellWalls[Direction.Up]) ? '111' : '101';
          } else if (i == 1) {
            mazeString += (cellWalls[Direction.Left]) ? '1' : '0';
            mazeString += '0';
            mazeString += (cellWalls[Direction.Right]) ? '1' : '0';
          } else {
            mazeString += (cellWalls[Direction.Down]) ? '111' : '101';
          }
        }
        mazeString += '\n';
      }
    }
    console.log(mazeString);
*/
  }

  public async printPath(animation: boolean) {
    let path: Cell[] = [];
    this.map.forEach((cellArray: Cell[]) => {
      cellArray.forEach((cell: Cell) => {
        cell.visited = false;
      });
    });

    path.push(this.map[0][0]);
    this.map[0][0].visited = true;
    let deadend: boolean = false;
    let current: Cell | undefined;
    while (
      !(current?.getPosition().posX == this.width - 1 &&
      current?.getPosition().posY == this.height - 1)
    ) {
      while (!deadend) {
        current = path.pop();

        if (current) {
          let neighbours = this.checkWalls(this.getAvailableNeighbours(current));
          path.push(current);
          if (neighbours.length) {
            let neighbour =
              neighbours[Math.floor(Math.random() * neighbours.length)];

            neighbour.cell.visited = true;
            path.push(neighbour.cell);
          } else {
            deadend = true;
          }
        }
      }
      
      path.pop();
      deadend = false;
      
    }
    path.push(current);
    //console.log(path);
    for (let idx = 0; idx < path.length; idx++) {
      await path[idx].setAsPath(idx * 100 * (+ animation));
    }
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

  public getWalls() {
    return this.walls;
  }
  public setWall(direction: Direction, value: boolean) {
    this.walls[direction] = value;
  }

  public getPosition() {
    return { posX: this.posX, posY: this.posY };
  }

  public async setAsPath(time: number) {
      setTimeout(() => {
        this.div.className = "path";
      }, time)
    
    
  }

  public drawCell() {
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
    if (this.walls[Direction.Up]) this.div.style.borderTop = '1px solid #fff';
    if (this.walls[Direction.Right]) this.div.style.borderRight = '1px solid #fff';
    if (this.walls[Direction.Down]) this.div.style.borderBottom = '1px solid #fff';
    if (this.walls[Direction.Left]) this.div.style.borderLeft = '1px solid #fff';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let createBtn = document.querySelector('.controls-wrapper .create-btn');
  if(createBtn) {
    createBtn.addEventListener('click', () => {
      const animationCheckbox: HTMLInputElement | null = document.querySelector('.controls-wrapper .animation-input-wrapper #animation-input');
      const widthTextField: HTMLInputElement | null= document.querySelector('.controls-wrapper .width-input-wrapper #width-input');
      const heightTextField: HTMLInputElement | null= document.querySelector('.controls-wrapper .height-input-wrapper #height-input');
      if(widthTextField?.value && heightTextField?.value && animationCheckbox) {
        document.querySelector('main .maze-wrapper')?.remove();
        let maze = new Maze(parseInt(widthTextField.value), parseInt(heightTextField.value));
        maze.printMap();
        maze.printPath(animationCheckbox.checked);
      }
      
      
    })
  }
    
  
});
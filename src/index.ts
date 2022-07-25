namespace Utils {
  export function appendElements(
    parent: Element,
    ...nodes: HTMLElement[]
  ) {
    for (const node of nodes) {
      parent.appendChild(node);
    }
  }
  export function createElementWithAttributes<elementType extends HTMLElement>(name: string, ...attributes: [string, string][]) : elementType {
    let element = document.createElement(name) as elementType;
    for (const attribute of attributes) {
      element.setAttribute(attribute[0], attribute[1]);
    }
    return element;
  }

  export async function uploadFile(file: File) {
    let formData = new FormData();
    
    
    if(file){
      formData.append("file",file);

      const response = await fetch('php/upload.php', {
        method: "POST",
        body: formData
      });
      //console.log(await response);

    }
  }
}

class Position {
  constructor(private posX: number, private posY: number) {

  }
  
};

class Ship {
  public coords: Position[];
  constructor(...coords: Position[]) {
    this.coords = coords;
  }
  
}



class BattleField {
  fieldWrapper: HTMLDivElement = Utils.createElementWithAttributes('div',['class','field-wrapper']);
  field: Cell[][] = new Array();
  private ships: Ship[] = new Array();
  shipPositions: Position[] = new Array();
  constructor(private width: number, private height: number) {

    this.fieldWrapper.style.gridTemplateColumns = `repeat(${this.width}, 30px)`;
    this.fieldWrapper.style.gridTemplateRows = `repeat(${this.height}, 30px)`;
    
    parentDOMElement?.appendChild(this.fieldWrapper);

    for (let y: number = 0; y < this.height; y++) {
      this.field[y] = new Array(this.width);
      for (let x: number = 0; x < this.width; x++) {
        this.field[y][x] = new Cell(new Position(x,y),this.fieldWrapper);
      }
    }


  }

  private checkShip(position: Position) {
    for (const shipPos of this.shipPositions) {
      if(shipPos == position) {
        return true;
      }
    }
    return false;
  }

  private generateShips() {
    let noMoreShips;
    
    while(!noMoreShips) {
      //TODO 
    }
  }

}

class Cell {
  private div: HTMLDivElement;
  private isShip: boolean = false;
  constructor(
    private position: Position,
    private mazeWrapper: HTMLDivElement
  ) {
    this.div = Utils.createElementWithAttributes('div',['class','field-cell']);
    this.mazeWrapper.appendChild(this.div);
    this.div.addEventListener('click',() => {this.asShip()});
  }

  public getPosition() {
    return this.position;
  }

  private asShip() {
    this.div.className = "field-cell-ship";
    this.isShip = true;
  }
  
}


let parentDOMElement = document.querySelector('main');
document.querySelector(".input-wrapper .add-btn")?.addEventListener('click', () => {

});

let battleField: BattleField = new BattleField(20,20);
namespace Utils {
  export function appendElements(parent: Element, ...nodes: HTMLElement[]) {
    for (const node of nodes) {
      parent.appendChild(node);
    }
  }
  export function createElementWithAttributes<elementType extends HTMLElement>(
    name: string,
    ...attributes: [string, string][]
  ): elementType {
    const element = document.createElement(name) as elementType;
    for (const attribute of attributes) {
      element.setAttribute(attribute[0], attribute[1]);
    }
    return element;
  }

  export async function uploadFile(file: File) {
    const formData = new FormData();

    if (file) {
      formData.append("file", file);

      const response = await fetch("php/upload.php", {
        method: "POST",
        body: formData,
      });
      // console.log(await response);
    }
  }
}

class Position {
  constructor(public posX: number, public posY: number) {}
}



class Ship {
  private isSet: boolean = false;
  private core: Position = new Position(0, 0);
  private coords: Position[] = [];
  private coordsHit: Position[] = [];
  public isDestroyed: boolean = false;
  private readonly coreOffsets: [number, number][];
  constructor(private parent: BattleField, ...coreOffsets: [number, number][]) {
    this.coreOffsets = coreOffsets;
  }


  // TODO: rework method
  public isShipInBounds(corePosition: Position) {
    for (const offset of this.coreOffsets) {
      if (corePosition.posX + offset[0] >= fieldWidth ||
        corePosition.posY + offset[1] >= fieldHeight ||
        corePosition.posX + offset[0] < 0 ||
        corePosition.posY + offset[1] < 0
      ) {
        return false;
      }
    }
    return true;
  }

  public projectShip(corePosition: Position, field: Cell[][]) {
    this.clearCoords(field);
    if (!this.isSet && this.isShipInBounds(corePosition)) {
      this.core = corePosition;
      field[corePosition.posX][corePosition.posY].asShip(this);
      this.coords.push(corePosition);
      for (const offset of this.coreOffsets) {
        field[corePosition.posY + offset[1]][corePosition.posX + offset[0]].asShip(this);
        this.coords.push(
          new Position(
            corePosition.posX + offset[0],
            corePosition.posY + offset[1]
          )
        );
      }
      return true;
    }
    return false;
  }

  private clearCoords(field: Cell[][]) {
    if (this.coords.length) {
      for (const coord of this.coords) {
        field[coord.posX][coord.posY].asNormal();
      }
      this.coords = [];
    }
  }

  public setShip() {
    this.isSet = true;
    for (const coord of this.coords) {
      this.parent.field[coord.posX][coord.posY].setAsShip();
    }
  }

  public getCoords() {
    return this.coords;
  }

  public checkHits(cell: Cell) {
    this.coordsHit.push(cell.getPosition());
    if (this.coordsHit.length === this.coords.length) {
      this.isDestroyed = true;
      this.parent.checkDestroyedShips();
      for (const cellElement of this.coords) {
        this.parent.field[cellElement.posY][cellElement.posX].setAsDestroyed();
      }
    }
  }
}

class Cell {
  private readonly div: HTMLDivElement;
  public isShip: boolean = false;
  private parentShip: Ship | undefined = undefined;
  private hit: boolean = false;
  constructor(
      private position: Position,
      private mazeWrapper: HTMLDivElement,
      private parent: BattleField,
      private isUsed: boolean = true
  ) {
    this.div = Utils.createElementWithAttributes("div", [
      "class",
      "field-cell",
    ]);
    this.mazeWrapper.appendChild(this.div);
    this.setEventListeners()
  }

  setEventListeners ()  {
    if(this.isUsed) {
      this.div.addEventListener("click", () => {
        Cell.constructShipOnCell(this);
      } );
      this.div.addEventListener("mouseover", (event: any) => {
        Cell.projectShipOnCell(this);
      } );
    } else {
      this.div.addEventListener("click", () => {
        this.setHit();
      } );
    }
  }

  private setHit() {
    if(!this.hit) {
      this.div.className = this.isShip ? "field-cell-hit-ship" : "field-cell-hit";
      this.hit = true;
      this.parentShip?.checkHits(this);
      console.log(this.getPosition());
    }
  }

  static projectShipOnCell(cell: Cell) {
    if (!cell.isShip && activeShip !== undefined) {
      activeShip.projectShip(cell.position, cell.parent.field);
    }
  }

  static constructShipOnCell(cell: Cell) {
    if (activeShip !== undefined) {
      if (cell.parent.checkShip(activeShip)) {
        activeShip.setShip();
        cell.parent.addShip(activeShip);
        activeShip = availableShips.pop();
      }
    }
  }

  public getPosition() {
    return this.position;
  }

  public asShip(parentShip: Ship) {
    this.div.className = "field-cell-ship";
    this.parentShip = parentShip;
  }

  public asNormal() {
    if (!this.isShip) {
      this.div.className = "field-cell";
    }
    this.parentShip = undefined;
  }

  public setAsShip() {
    this.isShip = true;
  }

  public setAsDestroyed() {
    this.div.className = "field-cell-destroyed";
  }
}

class BattleField {
  fieldWrapper: HTMLDivElement;
  field: Cell[][] = [];
  private ships: Ship[] = [];
  set: boolean = false;
  private allDestroyed: boolean = false;
  constructor(private width: number, private height: number, private userControlled: boolean = true) {
    this.fieldWrapper = Utils.createElementWithAttributes("div", [
      "class",
      userControlled? "field-wrapper": "field-wrapper-ai",
    ]);
    this.fieldWrapper.style.gridTemplateColumns = `repeat(${this.width}, 30px)`;
    this.fieldWrapper.style.gridTemplateRows = `repeat(${this.height}, 30px)`;

    for (let y: number = 0;y < this.height; y++) {
      this.field[y] = new Array(this.width);
      for (let x: number = 0; x < this.width; x++) {
        this.field[y][x] = new Cell(
            new Position(x, y),
            this.fieldWrapper,
            this,
            userControlled
        );
      }
    }

    if (!userControlled) {
      this.placeShips([
            new Ship( this,[0, 1], [0, 2], [0, 3], [0, 4] ),
            new Ship( this,[1, 0], [2, 0], [3, 0], [4, 0] ),
            new Ship( this,[1, 1], [2, 1], [3, 1], [4, 1] ),
      ]);
    }
  }

  public draw() {
    parentDOMElement?.appendChild(this.fieldWrapper);
  }

  public checkShip(ship: Ship) {
    // check if coordinates are already assigned
    if (!ship.getCoords().length) return false;

    for (const coord of ship.getCoords()) {
      if (this.field[coord.posX][coord.posY].isShip) {
        return false;
      }
    }
    return true;
  }

  public addShip(ship: Ship) {
    this.ships.push(ship);
  }

  private placeShips(unsetShips: Ship[]) {
    for (const ship of unsetShips) {
      let corePosition: Position;
      do {
        corePosition = new Position(
            Math.floor(Math.random() * fieldWidth),
            Math.floor(Math.random() * fieldHeight)
        );
      } while(!ship.projectShip(corePosition, this.field));
      ship.setShip();
      this.addShip(ship);
      console.log(ship.getCoords());
    }
  }

  public checkDestroyedShips() {
    for (const ship of this.ships) {
      if(!ship.isDestroyed) {
        return false;
      }
    }
    this.allDestroyed = true;
    console.log('all ships destroyed');
    return true;
  }
}


const parentDOMElement = document.querySelector(".battle-field-wrapper");

const fieldWidth = 15;
const fieldHeight = 15;

let ownField: BattleField = new BattleField(fieldWidth, fieldHeight);
let enemyField: BattleField = new BattleField(fieldWidth, fieldHeight, false);

ownField.draw();

const availableShips: Ship[] = [
  new Ship( ownField,[0, 1], [0, 2], [0, 3], [0, 4]),
];
let activeShip: Ship | undefined = availableShips.pop();

document
  .querySelector(".input-wrapper .start-btn")
  ?.addEventListener("click", () => {
    ownField.set = true;
    enemyField.draw();
    enemyField.set = true;
  });



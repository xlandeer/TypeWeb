// tslint:disable-next-line:no-namespace
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
  private readonly coreOffsets: [number, number][];
  constructor(...coreOffsets: [number, number][]) {
    this.coreOffsets = coreOffsets;
  }

  public projectShip(corePosition: Position, field: Cell[][]) {
    this.clearCoords(field);
    if (!this.isSet) {
      this.core = corePosition;
      field[corePosition.posX][corePosition.posY].asShip();
      this.coords.push(corePosition);
      for (const offset of this.coreOffsets) {
        if (
          corePosition.posX + offset[0] <= fieldWidth - 1 &&
          corePosition.posY + offset[1] <= fieldHeight - 1 &&
          corePosition.posX + offset[0] >= 0 &&
          corePosition.posY + offset[1] >= 0
        ) {
          field[corePosition.posX + offset[0]][corePosition.posY + offset[1]].asShip();
          this.coords.push(
            new Position(
              corePosition.posX + offset[0],
              corePosition.posY + offset[1]
            )
          );
        }
      }
    }
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
      battleField.field[coord.posX][coord.posY].setAsShip();
    }
  }

  public getCoords() {
    return this.coords;
  }
}

class BattleField {
  fieldWrapper: HTMLDivElement = Utils.createElementWithAttributes("div", [
    "class",
    "field-wrapper",
  ]);
  field: Cell[][] = [];
  private ships: Ship[] = [];
  shipPositions: Position[] = [];
  set: boolean = false;

  constructor(private width: number, private height: number) {
    this.fieldWrapper.style.gridTemplateColumns = `repeat(${this.width}, 30px)`;
    this.fieldWrapper.style.gridTemplateRows = `repeat(${this.height}, 30px)`;

    parentDOMElement?.appendChild(this.fieldWrapper);

    for (let x: number = 0; x < this.width; x++) {
      this.field[x] = new Array(this.width);
      for (let y: number = 0; y < this.height; y++) {
        this.field[x][y] = new Cell(
            new Position(x, y),
            this.fieldWrapper,
            this
        );
      }
    }
  }

  public checkShip(ship: Ship) {
    for (const coord of ship.getCoords()) {
      if (battleField.field[coord.posX][coord.posY].isShip()) {
        return false;
      }
    }
    return true;
  }

  public addShip(ship: Ship) {
    this.ships.push(ship);
  }
}

class Cell {
  private readonly div: HTMLDivElement;
  private ship: boolean = false;
  constructor(
    private position: Position,
    private mazeWrapper: HTMLDivElement,
    private parent: BattleField
  ) {
    this.div = Utils.createElementWithAttributes("div", [
      "class",
      "field-cell",
    ]);
    this.mazeWrapper.appendChild(this.div);
    this.div.addEventListener("click", () => {
      Cell.constructShipOnCell(this);
    });
    this.div.addEventListener("mouseover", (event: any) => {
      Cell.projectShipOnCell(this);
    });
  }

  static projectShipOnCell(cell: Cell) {
    if (!cell.ship && activeShip !== undefined) {
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

  public asShip() {
    this.div.className = "field-cell-ship";
  }

  public asNormal() {
    if (!this.ship) {
      this.div.className = "field-cell";
    }
  }

  public setAsShip() {
    this.ship = true;
  }

  public isShip() {
    return this.ship;
  }
}

const parentDOMElement = document.querySelector("main");
const availableShips: Ship[] = [
  new Ship([0, 0], [0, 1], [0, 2], [0, 3], [0, 4]),
];
let activeShip: Ship | undefined = availableShips.pop();

document
  .querySelector(".input-wrapper .add-btn")
  ?.addEventListener("click", () => {
    battleField.set = true;
  });

const fieldWidth = 15;
const fieldHeight = 15;

let battleField: BattleField = new BattleField(fieldWidth, fieldHeight);

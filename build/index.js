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
var _a;
// tslint:disable-next-line:no-namespace
var Utils;
(function (Utils) {
    function appendElements(parent, ...nodes) {
        for (const node of nodes) {
            parent.appendChild(node);
        }
    }
    Utils.appendElements = appendElements;
    function createElementWithAttributes(name, ...attributes) {
        const element = document.createElement(name);
        for (const attribute of attributes) {
            element.setAttribute(attribute[0], attribute[1]);
        }
        return element;
    }
    Utils.createElementWithAttributes = createElementWithAttributes;
    function uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData();
            if (file) {
                formData.append("file", file);
                const response = yield fetch("php/upload.php", {
                    method: "POST",
                    body: formData,
                });
                // console.log(await response);
            }
        });
    }
    Utils.uploadFile = uploadFile;
})(Utils || (Utils = {}));
class Position {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }
}
class Ship {
    constructor(...coreOffsets) {
        this.isSet = false;
        this.core = new Position(0, 0);
        this.coords = [];
        this.coreOffsets = coreOffsets;
    }
    // TODO: rework method
    isChipInBounds(corePosition, field) {
        for (const offset of this.coreOffsets) {
            if (corePosition.posX + offset[0] >= fieldWidth ||
                corePosition.posY + offset[1] >= fieldHeight ||
                corePosition.posX + offset[0] < 0 ||
                corePosition.posY + offset[1] < 0) {
                return false;
            }
        }
        return true;
    }
    projectShip(corePosition, field) {
        this.clearCoords(field);
        if (!this.isSet && this.isChipInBounds(corePosition, field)) {
            this.core = corePosition;
            field[corePosition.posX][corePosition.posY].asShip();
            this.coords.push(corePosition);
            for (const offset of this.coreOffsets) {
                // if (
                //   corePosition.posX + offset[0] <= fieldWidth - 1 &&
                //   corePosition.posY + offset[1] <= fieldHeight - 1 &&
                //   corePosition.posX + offset[0] >= 0 &&
                //   corePosition.posY + offset[1] >= 0
                // ) {
                field[corePosition.posX + offset[0]][corePosition.posY + offset[1]].asShip();
                this.coords.push(new Position(corePosition.posX + offset[0], corePosition.posY + offset[1]));
                // }
            }
        }
    }
    clearCoords(field) {
        if (this.coords.length) {
            for (const coord of this.coords) {
                field[coord.posX][coord.posY].asNormal();
            }
            this.coords = [];
        }
    }
    setShip() {
        this.isSet = true;
        for (const coord of this.coords) {
            battleField.field[coord.posX][coord.posY].setAsShip();
        }
    }
    getCoords() {
        return this.coords;
    }
}
class BattleField {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.fieldWrapper = Utils.createElementWithAttributes("div", [
            "class",
            "field-wrapper",
        ]);
        this.field = [];
        this.ships = [];
        this.shipPositions = [];
        this.set = false;
        this.fieldWrapper.style.gridTemplateColumns = `repeat(${this.width}, 30px)`;
        this.fieldWrapper.style.gridTemplateRows = `repeat(${this.height}, 30px)`;
        parentDOMElement === null || parentDOMElement === void 0 ? void 0 : parentDOMElement.appendChild(this.fieldWrapper);
        for (let x = 0; x < this.width; x++) {
            this.field[x] = new Array(this.width);
            for (let y = 0; y < this.height; y++) {
                this.field[x][y] = new Cell(new Position(x, y), this.fieldWrapper, this);
            }
        }
    }
    checkShip(ship) {
        // check if coordinates are already assigned  
        if (!ship.getCoords().length)
            return false;
        for (const coord of ship.getCoords()) {
            if (battleField.field[coord.posX][coord.posY].isShip()) {
                return false;
            }
        }
        return true;
    }
    addShip(ship) {
        this.ships.push(ship);
    }
}
class Cell {
    constructor(position, mazeWrapper, parent) {
        this.position = position;
        this.mazeWrapper = mazeWrapper;
        this.parent = parent;
        this.ship = false;
        this.div = Utils.createElementWithAttributes("div", [
            "class",
            "field-cell",
        ]);
        this.mazeWrapper.appendChild(this.div);
        this.div.addEventListener("click", () => {
            Cell.constructShipOnCell(this);
        });
        this.div.addEventListener("mouseover", (event) => {
            Cell.projectShipOnCell(this);
        });
    }
    static projectShipOnCell(cell) {
        if (!cell.ship && activeShip !== undefined) {
            activeShip.projectShip(cell.position, cell.parent.field);
        }
    }
    static constructShipOnCell(cell) {
        if (activeShip !== undefined) {
            if (cell.parent.checkShip(activeShip)) {
                activeShip.setShip();
                cell.parent.addShip(activeShip);
                activeShip = availableShips.pop();
            }
        }
    }
    getPosition() {
        return this.position;
    }
    asShip() {
        this.div.className = "field-cell-ship";
    }
    asNormal() {
        if (!this.ship) {
            this.div.className = "field-cell";
        }
    }
    setAsShip() {
        this.ship = true;
    }
    isShip() {
        return this.ship;
    }
}
const parentDOMElement = document.querySelector("main");
const availableShips = [
    new Ship([0, 0], [0, 1], [0, 2], [0, 3], [0, 4]),
];
let activeShip = availableShips.pop();
(_a = document
    .querySelector(".input-wrapper .add-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    battleField.set = true;
});
const fieldWidth = 15;
const fieldHeight = 15;
let battleField = new BattleField(fieldWidth, fieldHeight);
//# sourceMappingURL=index.js.map
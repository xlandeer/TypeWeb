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
    constructor(parent, ...coreOffsets) {
        this.parent = parent;
        this.isSet = false;
        this.core = new Position(0, 0);
        this.coords = [];
        this.coordsHit = [];
        this.isDestroyed = false;
        this.coreOffsets = coreOffsets;
    }
    // TODO: rework method
    isShipInBounds(corePosition) {
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
        if (!this.isSet && this.isShipInBounds(corePosition)) {
            this.core = corePosition;
            field[corePosition.posY][corePosition.posX].asShip(this);
            this.coords.push(corePosition);
            for (const offset of this.coreOffsets) {
                field[corePosition.posY + offset[1]][corePosition.posX + offset[0]].asShip(this);
                this.coords.push(new Position(corePosition.posX + offset[0], corePosition.posY + offset[1]));
            }
            return true;
        }
        return false;
    }
    clearCoords(field) {
        if (this.coords.length) {
            for (const coord of this.coords) {
                field[coord.posY][coord.posX].asNormal();
            }
            this.coords = [];
        }
    }
    setShip() {
        this.isSet = true;
        for (const coord of this.coords) {
            this.parent.field[coord.posY][coord.posX].setAsShip();
        }
    }
    getCoords() {
        return this.coords;
    }
    checkHits(cell) {
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
    constructor(position, mazeWrapper, parent, isUsed = true) {
        this.position = position;
        this.mazeWrapper = mazeWrapper;
        this.parent = parent;
        this.isUsed = isUsed;
        this.isShip = false;
        this.parentShip = undefined;
        this.hit = false;
        this.div = Utils.createElementWithAttributes("div", [
            "class",
            "field-cell",
        ]);
        this.mazeWrapper.appendChild(this.div);
        this.setEventListeners();
    }
    setEventListeners() {
        if (this.isUsed) {
            this.div.addEventListener("click", () => {
                Cell.constructShipOnCell(this);
            });
            this.div.addEventListener("mouseover", (event) => {
                Cell.projectShipOnCell(this);
            });
        }
        else {
            this.div.addEventListener("click", () => {
                this.setHit();
            });
        }
    }
    setHit() {
        var _a;
        if (!this.hit) {
            this.div.className = this.isShip ? "field-cell-hit-ship" : "field-cell-hit";
            this.hit = true;
            (_a = this.parentShip) === null || _a === void 0 ? void 0 : _a.checkHits(this);
            console.log(this.getPosition());
        }
    }
    static projectShipOnCell(cell) {
        if (!cell.isShip && activeShip !== undefined) {
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
    asShip(parentShip) {
        this.div.className = "field-cell-ship";
        this.parentShip = parentShip;
    }
    asNormal() {
        if (!this.isShip) {
            this.div.className = "field-cell";
        }
        this.parentShip = undefined;
    }
    setAsShip() {
        this.isShip = true;
    }
    setAsDestroyed() {
        this.div.className = "field-cell-destroyed";
    }
}
class BattleField {
    constructor(width, height, userControlled = true) {
        this.width = width;
        this.height = height;
        this.userControlled = userControlled;
        this.field = [];
        this.ships = [];
        this.set = false;
        this.allDestroyed = false;
        this.fieldWrapper = Utils.createElementWithAttributes("div", [
            "class",
            userControlled ? "field-wrapper" : "field-wrapper-ai",
        ]);
        this.fieldWrapper.style.gridTemplateColumns = `repeat(${this.width}, 30px)`;
        this.fieldWrapper.style.gridTemplateRows = `repeat(${this.height}, 30px)`;
        for (let y = 0; y < this.height; y++) {
            this.field[y] = new Array(this.width);
            for (let x = 0; x < this.width; x++) {
                this.field[y][x] = new Cell(new Position(x, y), this.fieldWrapper, this, userControlled);
            }
        }
        if (!userControlled) {
            this.placeShips([
                new Ship(this, [0, 1], [0, 2], [0, 3], [0, 4]),
                new Ship(this, [1, 0], [2, 0], [3, 0], [4, 0]),
                new Ship(this, [1, 1], [2, 1], [3, 1], [4, 1]),
            ]);
        }
    }
    draw() {
        parentDOMElement === null || parentDOMElement === void 0 ? void 0 : parentDOMElement.appendChild(this.fieldWrapper);
    }
    checkShip(ship) {
        // check if coordinates are already assigned
        if (!ship.getCoords().length)
            return false;
        for (const coord of ship.getCoords()) {
            if (this.field[coord.posX][coord.posY].isShip) {
                return false;
            }
        }
        return true;
    }
    addShip(ship) {
        this.ships.push(ship);
    }
    placeShips(unsetShips) {
        for (const ship of unsetShips) {
            let corePosition;
            do {
                corePosition = new Position(Math.floor(Math.random() * fieldWidth), Math.floor(Math.random() * fieldHeight));
            } while (!ship.projectShip(corePosition, this.field));
            ship.setShip();
            this.addShip(ship);
            console.log(ship.getCoords());
        }
    }
    checkDestroyedShips() {
        for (const ship of this.ships) {
            if (!ship.isDestroyed) {
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
let ownField = new BattleField(fieldWidth, fieldHeight);
let enemyField = new BattleField(fieldWidth, fieldHeight, false);
ownField.draw();
const availableShips = [
    new Ship(ownField, [0, 1], [0, 2], [0, 3], [0, 4]),
];
let activeShip = availableShips.pop();
(_a = document
    .querySelector(".input-wrapper .start-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    ownField.set = true;
    enemyField.draw();
    enemyField.set = true;
});
//# sourceMappingURL=index.js.map
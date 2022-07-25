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
        let element = document.createElement(name);
        for (const attribute of attributes) {
            element.setAttribute(attribute[0], attribute[1]);
        }
        return element;
    }
    Utils.createElementWithAttributes = createElementWithAttributes;
    function uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let formData = new FormData();
            if (file) {
                formData.append("file", file);
                const response = yield fetch('php/upload.php', {
                    method: "POST",
                    body: formData
                });
                //console.log(await response);
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
;
class Ship {
    constructor(...coords) {
        this.coords = coords;
    }
}
class BattleField {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.fieldWrapper = Utils.createElementWithAttributes('div', ['class', 'field-wrapper']);
        this.field = new Array();
        this.ships = new Array();
        this.shipPositions = new Array();
        this.fieldWrapper.style.gridTemplateColumns = `repeat(${this.width}, 30px)`;
        this.fieldWrapper.style.gridTemplateRows = `repeat(${this.height}, 30px)`;
        parentDOMElement === null || parentDOMElement === void 0 ? void 0 : parentDOMElement.appendChild(this.fieldWrapper);
        for (let y = 0; y < this.height; y++) {
            this.field[y] = new Array(this.width);
            for (let x = 0; x < this.width; x++) {
                this.field[y][x] = new Cell(new Position(x, y), this.fieldWrapper);
            }
        }
    }
    checkShip(position) {
        for (const shipPos of this.shipPositions) {
            if (shipPos == position) {
                return true;
            }
        }
        return false;
    }
    generateShips() {
        let noMoreShips;
        while (!noMoreShips) {
            //TODO 
        }
    }
}
class Cell {
    constructor(position, mazeWrapper) {
        this.position = position;
        this.mazeWrapper = mazeWrapper;
        this.isShip = false;
        this.div = Utils.createElementWithAttributes('div', ['class', 'field-cell']);
        this.mazeWrapper.appendChild(this.div);
        this.div.addEventListener('click', () => { this.asShip(); });
    }
    getPosition() {
        return this.position;
    }
    asShip() {
        this.div.className = "field-cell-ship";
        this.isShip = true;
    }
}
let parentDOMElement = document.querySelector('main');
(_a = document.querySelector(".input-wrapper .add-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
});
let battleField = new BattleField(20, 20);
//# sourceMappingURL=index.js.map
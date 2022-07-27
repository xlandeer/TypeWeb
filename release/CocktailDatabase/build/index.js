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
var _a, _b;
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
    function uploadFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let formData = new FormData();
            let files = imageUpload.files;
            if (files) {
                formData.append("file", files[0]);
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
class IngredientMap {
    constructor(map = {}) {
        this.map = map;
    }
    *generateIterator() {
        for (const ingredientKey in this.map) {
            yield { key: ingredientKey, value: this.map[ingredientKey] };
        }
    }
    set(key, value) {
        this.map[key] = value;
    }
    get(key) {
        return this.map[key];
    }
    print() {
        let iterator = this.generateIterator();
        for (const ingredient of iterator) {
            console.log(ingredient.key + ": " + ingredient.value);
        }
    }
}
class Cocktail {
    constructor(name, ingredients, imgPath, description, parent, id) {
        this.name = name;
        this.ingredients = ingredients;
        this.imgPath = imgPath;
        this.description = description;
        this.parent = parent;
        this.id = id;
    }
    addRepresentation() {
        //Create every Element with Attributes
        let cocktailWrapper = Utils.createElementWithAttributes("div", ["class", "cocktail-wrapper"]);
        let image = Utils.createElementWithAttributes("img", ["src", this.imgPath]);
        let nameLabel = Utils.createElementWithAttributes("h2");
        nameLabel.textContent = this.name;
        let description = Utils.createElementWithAttributes("div", ["classname", "cocktail-description"]);
        description.textContent = this.description;
        let deleteBtn = Utils.createElementWithAttributes("input", ["type", "image"], ["src", "images/x_btn.svg"]);
        //Add DeleteBtn Event Listener
        const copy = this;
        deleteBtn.addEventListener("click", () => {
            Cocktail.deleteFromStorage(copy);
        });
        //generate Ingredientlist
        let ingredients = document.createElement("ul");
        let iterator = this.ingredients.generateIterator();
        for (const ingredrient of iterator) {
            let ingredient = document.createElement("li");
            ingredient.textContent = ingredrient.key + ": " + ingredrient.value.amt + " " + ingredrient.value.measure;
            ingredients.appendChild(ingredient);
        }
        //Append Elements to their corresponding Parent
        Utils.appendElements(cocktailWrapper, image, nameLabel, ingredients, description, deleteBtn);
        Utils.appendElements(this.parent, cocktailWrapper);
    }
    static loadFromStorage(attr = "cocktail_name", searchFilter = "") {
        $.ajax({
            url: "php/get.php",
            type: "GET",
            data: { attribute: attr, searchFilter: searchFilter },
            success: function (returnData) {
                parentDOMElement.innerHTML = "";
                if (returnData) {
                    for (const element of JSON.parse(returnData)) {
                        let newIngredients = new IngredientMap();
                        for (const ingr of element.ingredients) {
                            newIngredients.set(ingr.ingr_name, {
                                amt: parseInt(ingr.ingr_amt),
                                measure: ingr.ingr_measure,
                            });
                        }
                        const newCocktail = new Cocktail(element.name, newIngredients, element.imageUrl, element.description, parentDOMElement, element.id);
                        newCocktail.addRepresentation();
                    }
                }
            },
            error: function (xhr, status, error) {
                let errorMessage = xhr.status + ": " + xhr.statusText;
                console.log("Error - " + errorMessage);
            },
        });
    }
    static deleteFromStorage(cocktail) {
        $.ajax({
            url: "php/post.php",
            type: "POST",
            // all data || notation in JSON
            data: { intention: "delete", id: cocktail.id, imgPath: "../" + cocktail.imgPath },
            success: function (data, status, xhr) {
                Cocktail.loadFromStorage();
            },
        });
    }
    static saveToStorage(cocktail) {
        // $.ajax({
        //     method: "POST",
        //     url: "index.php",
        //     data: {name: cocktail.name, imageUrl: cocktail.imgPath}
        // }).catch(function(response) {
        //     console.log(response);
        // });
        $.ajax({
            url: "php/post.php",
            type: "POST",
            // all data || notation in JSON
            data: {
                intention: "save",
                name: cocktail.name,
                imageUrl: cocktail.imgPath,
                ingredients: cocktail.ingredients,
                description: cocktail.description
            },
            success: function (data, status, xhr) {
                Cocktail.loadFromStorage();
            },
        });
    }
    getIngredients() {
        return this.ingredients;
    }
}
const cocktailName = document.querySelector(".input-wrapper .name");
const inputIngrName = document.querySelector(".input-wrapper .add-ingr-name");
const inputIngrAmt = document.querySelector(".input-wrapper .add-ingr-amt");
const selectIngrMeasure = document.querySelector(".input-wrapper .meas-select");
const parentDOMElement = document.querySelector(".cocktail-section");
const ingredientWrapper = document.querySelector(".input-wrapper .ingredient-wrapper");
let ingredients = new IngredientMap();
const cocktailFilter = document.querySelector(".search-wrapper .cocktail-filter");
const attributeToSearch = document.querySelector(".search-wrapper .search-for-select");
const imageUpload = document.querySelector(".input-wrapper #image-upload");
const description = document.querySelector(".input-wrapper .cocktail_description");
cocktailFilter.addEventListener("input", (event) => {
    Cocktail.loadFromStorage(attributeToSearch.value, cocktailFilter.value);
});
attributeToSearch.addEventListener('change', () => {
    Cocktail.loadFromStorage(attributeToSearch.value, cocktailFilter.value);
});
(_a = document.querySelector(".input-wrapper .add-ingr-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    if (inputIngrName.value &&
        /^[0-9]+$/g.test(inputIngrAmt.value) &&
        selectIngrMeasure.value) {
        // store ingredient in map
        ingredients.set(inputIngrName.value, {
            amt: parseInt(inputIngrAmt.value),
            measure: selectIngrMeasure.value,
        });
        // output ingredient to the user
        ingredientWrapper.innerHTML += `<div>${inputIngrName.value}: ${inputIngrAmt.value} ${selectIngrMeasure.value}</div>`;
        // reset the input fields
        inputIngrName.value = "";
        inputIngrAmt.value = "";
    }
});
(_b = document.querySelector(".input-wrapper .add-cocktail-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    Utils.uploadFile().then(() => {
        let imagePath = "ERROR";
        if (imageUpload.files) {
            imagePath = "images/" + imageUpload.files[0].name;
        }
        if (cocktailName.value && imagePath && description.value) {
            const newCocktail = new Cocktail(cocktailName.value, ingredients, imagePath, description.value, parentDOMElement);
            Cocktail.saveToStorage(newCocktail);
            ingredients = new IngredientMap();
            cocktailName.value = "";
            ingredientWrapper.innerHTML = "";
            imageUpload.value = "";
            description.value = "";
        }
    });
}));
document.addEventListener("DOMContentLoaded", () => {
    Cocktail.loadFromStorage();
});
//# sourceMappingURL=index.js.map
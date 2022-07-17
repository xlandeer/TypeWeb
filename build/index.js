"use strict";
var _a, _b;
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
    constructor(name, ingredients, imgPath, parent) {
        this.name = name;
        this.ingredients = ingredients;
        this.imgPath = imgPath;
        this.parent = parent;
        this.id = ++Cocktail.amount;
        this.addRepresentation();
    }
    addRepresentation() {
        let cocktailWrapper = document.createElement('div');
        cocktailWrapper.setAttribute('class', 'cocktail-wrapper');
        let image = document.createElement('img');
        image.src = this.imgPath;
        let nameLabel = document.createElement('h2');
        nameLabel.textContent = this.name;
        let ingredients = document.createElement('ul');
        let iterator = this.ingredients.generateIterator();
        for (const ingredrient of iterator) {
            let ingredient = document.createElement('li');
            ingredient.textContent = ingredrient.key + ': ' + ingredrient.value;
            ingredients.appendChild(ingredient);
        }
        cocktailWrapper.appendChild(image);
        cocktailWrapper.appendChild(nameLabel);
        cocktailWrapper.appendChild(ingredients);
        this.parent.appendChild(cocktailWrapper);
    }
    static loadFromStorage() {
        for (const key in Object.assign({}, localStorage)) {
            let objectStr = localStorage.getItem(key);
            if (objectStr) {
                let cocktailObject = JSON.parse(objectStr);
                let ingredients = new IngredientMap(cocktailObject.ingredients.map);
                let cocktail = new Cocktail(cocktailObject.name, ingredients, cocktailObject.imgPath, parentDOMElement);
            }
        }
    }
    getIngredients() {
        return this.ingredients;
    }
}
Cocktail.amount = 0;
const cocktailName = document.querySelector('.input-wrapper .name');
const cocktailPicture = document.querySelector('.input-wrapper #photo');
const inputIngrName = document.querySelector('.input-wrapper .add-ingr-name');
const inputIngrAmt = document.querySelector('.input-wrapper .add-ingr-amt');
const parentDOMElement = document.querySelector('.cocktail-wrapper');
const ingredientWrapper = document.querySelector('.input-wrapper .ingredient-wrapper');
let ingredients = new IngredientMap();
(_a = document.querySelector('.input-wrapper .add-ingr-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    if (inputIngrName.value && /^[0-9]+$/g.test(inputIngrAmt.value)) {
        // store ingredient in map
        ingredients.set(inputIngrName.value, parseInt(inputIngrAmt.value));
        // output ingredient to the user
        ingredientWrapper.innerHTML += `<div>${inputIngrName.value}: ${inputIngrAmt.value}</div>`;
        // reset the input fields
        inputIngrName.value = '';
        inputIngrAmt.value = '';
    }
});
(_b = document.querySelector('.input-wrapper .add-cocktail-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    if (cocktailName.value && /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm.test(cocktailPicture.value)) {
        const newCocktail = new Cocktail(cocktailName.value, ingredients, cocktailPicture.value, parentDOMElement);
        localStorage.setItem('C' + newCocktail.id, JSON.stringify(newCocktail));
        ingredients = new IngredientMap();
        cocktailName.value = '';
        cocktailPicture.value = '';
        ingredientWrapper.innerHTML = '';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    Cocktail.loadFromStorage();
});
//# sourceMappingURL=index.js.map
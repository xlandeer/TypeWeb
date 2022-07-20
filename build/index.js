"use strict";
var _a, _b, _c;
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
    constructor(name, ingredients, imgPath, parent, id) {
        this.name = name;
        this.ingredients = ingredients;
        this.imgPath = imgPath;
        this.parent = parent;
        this.id = id;
    }
    addRepresentation() {
        let cocktailWrapper = document.createElement('div');
        // cocktailWrapper.setAttribute('data-id', this.id?.toString());
        cocktailWrapper.setAttribute('class', 'cocktail-wrapper');
        let image = document.createElement('img');
        image.src = this.imgPath;
        let nameLabel = document.createElement('h2');
        nameLabel.textContent = this.name;
        let ingredients = document.createElement('ul');
        let deleteBtn = document.createElement('button');
        let iterator = this.ingredients.generateIterator();
        for (const ingredrient of iterator) {
            let ingredient = document.createElement('li');
            ingredient.textContent = ingredrient.key + ': ' + ingredrient.value.amt + ' ' + ingredrient.value.measure;
            ingredients.appendChild(ingredient);
        }
        const copy = this;
        deleteBtn.addEventListener('click', () => {
            Cocktail.deleteFromStorage(copy);
        });
        cocktailWrapper.appendChild(image);
        cocktailWrapper.appendChild(nameLabel);
        cocktailWrapper.appendChild(ingredients);
        cocktailWrapper.appendChild(deleteBtn);
        this.parent.appendChild(cocktailWrapper);
    }
    static loadFromStorage(searchFilter = '') {
        $.ajax({
            url: 'index.php',
            type: 'GET',
            data: { searchFilter: searchFilter },
            success: function (returnData) {
                parentDOMElement.innerHTML = '';
                if (returnData) {
                    for (const element of JSON.parse(returnData)) {
                        let newIngredients = new IngredientMap();
                        for (const ingr of element.ingredients) {
                            newIngredients.set(ingr.ingr_name, { amt: parseInt(ingr.ingr_amt), measure: ingr.ingr_measure });
                        }
                        const newCocktail = new Cocktail(element.name, newIngredients, element.imageUrl, parentDOMElement, element.id);
                        newCocktail.addRepresentation();
                    }
                }
            },
            error: function (xhr, status, error) {
                let errorMessage = xhr.status + ': ' + xhr.statusText;
                console.log('Error - ' + errorMessage);
            }
        });
    }
    static deleteFromStorage(cocktail) {
        $.ajax({
            url: 'index.php',
            type: 'POST',
            // all data || notation in JSON
            data: { intention: "delete", id: cocktail.id },
            success: function (data, status, xhr) {
                Cocktail.loadFromStorage();
            }
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
            url: 'index.php',
            type: 'POST',
            // all data || notation in JSON
            data: { intention: "save", name: cocktail.name, imageUrl: cocktail.imgPath, ingredients: cocktail.ingredients },
            success: function (data, status, xhr) {
                Cocktail.loadFromStorage();
            }
        });
    }
    getIngredients() {
        return this.ingredients;
    }
}
const cocktailName = document.querySelector('.input-wrapper .name');
const cocktailPicture = document.querySelector('.input-wrapper #photo');
const inputIngrName = document.querySelector('.input-wrapper .add-ingr-name');
const inputIngrAmt = document.querySelector('.input-wrapper .add-ingr-amt');
const selectIngrMeasure = document.querySelector('.input-wrapper .meas-select');
const parentDOMElement = document.querySelector('.cocktail-section');
const ingredientWrapper = document.querySelector('.input-wrapper .ingredient-wrapper');
let ingredients = new IngredientMap();
const cocktailFilter = document.querySelector('.search-wrapper .cocktail-filter');
cocktailFilter.addEventListener('input', (event) => {
    Cocktail.loadFromStorage(cocktailFilter.value);
});
(_a = document.querySelector('.btn-cocktail-filter')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    if (cocktailFilter.value) {
        Cocktail.loadFromStorage(cocktailFilter.value);
    }
});
(_b = document.querySelector('.input-wrapper .add-ingr-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    if (inputIngrName.value && /^[0-9]+$/g.test(inputIngrAmt.value) && selectIngrMeasure.value) {
        // store ingredient in map
        ingredients.set(inputIngrName.value, { amt: parseInt(inputIngrAmt.value), measure: selectIngrMeasure.value });
        // output ingredient to the user
        ingredientWrapper.innerHTML += `<div>${inputIngrName.value}: ${inputIngrAmt.value} ${selectIngrMeasure.value}</div>`;
        // reset the input fields
        inputIngrName.value = '';
        inputIngrAmt.value = '';
    }
});
(_c = document.querySelector('.input-wrapper .add-cocktail-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    if (cocktailName.value && /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm.test(cocktailPicture.value)) {
        const newCocktail = new Cocktail(cocktailName.value, ingredients, cocktailPicture.value, parentDOMElement);
        Cocktail.saveToStorage(newCocktail);
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
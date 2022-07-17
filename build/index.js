"use strict";
var _a, _b;
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
        let cocktailStructure = '';
        cocktailStructure = '<div class="cocktail col-12 col-md-6 col-lg-4 my-4">';
        cocktailStructure += '<div class="cocktail-wrapper">';
        cocktailStructure += '<div class="cocktail-img">';
        cocktailStructure += `<img src="${this.imgPath}">`;
        cocktailStructure += '</div>';
        cocktailStructure += '<div class="cocktail-content">';
        cocktailStructure += `<h2>${this.name}</h2>`;
        cocktailStructure += '<ul class="ingredients-list">###INGREDIENTS###</ul>';
        cocktailStructure += '</div>';
        cocktailStructure += '</div>';
        cocktailStructure += '</div>';
        let ingredientsStructure = '';
        for (const ingredrient of this.ingredients) {
            ingredientsStructure += `<li class="ingredient">${ingredrient[0]}: <span>${ingredrient[1]}</span></li>`;
        }
        console.log(cocktailStructure.replace('###INGREDIENTS###', ingredientsStructure));
        cocktailStructure = cocktailStructure.replace('###INGREDIENTS###', ingredientsStructure);
        this.parent.innerHTML = cocktailStructure;
    }
}
Cocktail.amount = 0;
const cocktailName = document.querySelector('.input-wrapper .name');
const cocktailPicture = document.querySelector('.input-wrapper #photo');
const inputIngrName = document.querySelector('.input-wrapper .add-ingr-name');
const inputIngrAmt = document.querySelector('.input-wrapper .add-ingr-amt');
const parentDOMElement = document.querySelector('.cocktail-wrapper');
const ingredientWrapper = document.querySelector('.input-wrapper .ingredient-wrapper');
let ingredients = new Map();
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
        ingredients.clear();
        cocktailName.value = '';
        cocktailPicture.value = '';
        ingredientWrapper.innerHTML = '';
    }
});
//# sourceMappingURL=index.js.map
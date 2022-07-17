class Cocktail{
    static amount: number = 0;
    id: number;
    constructor(private name: string, private ingredients: Map<string, number>, private imgPath: string, private parent: HTMLDivElement) {
        this.id = ++Cocktail.amount;
        this.addRepresentation();
    }

    addRepresentation() {
        let cocktailStructure: string = '';
        cocktailStructure   = '<div class="cocktail col-12 col-md-6 col-lg-4 my-4">';
        cocktailStructure       += '<div class="cocktail-wrapper">';
        cocktailStructure           += '<div class="cocktail-img">';
        cocktailStructure               += `<img src="${this.imgPath}">`;
        cocktailStructure           += '</div>';
        cocktailStructure           += '<div class="cocktail-content">';
        cocktailStructure               += `<h2>${this.name}</h2>`;
        cocktailStructure               += '<ul class="ingredients-list">###INGREDIENTS###</ul>';
        cocktailStructure           += '</div>';
        cocktailStructure       += '</div>';
        cocktailStructure   += '</div>';

        let ingredientsStructure: string = '';
        for (const ingredrient of this.ingredients) {
            ingredientsStructure += `<li class="ingredient">${ingredrient[0]}: <span>${ingredrient[1]}</span></li>`;
        }       
        cocktailStructure = cocktailStructure.replace('###INGREDIENTS###', ingredientsStructure);
        this.parent.innerHTML  = cocktailStructure;
    }
    // addIngredient(name: string, value: number) {
    //     this.ingredients.set(name,value);
    // }
}

const cocktailName = document.querySelector('.input-wrapper .name') as HTMLInputElement;
const cocktailPicture = document.querySelector('.input-wrapper #photo') as HTMLInputElement;
const inputIngrName = document.querySelector('.input-wrapper .add-ingr-name') as HTMLInputElement;
const inputIngrAmt = document.querySelector('.input-wrapper .add-ingr-amt') as HTMLInputElement;

const parentDOMElement = document.querySelector('.cocktail-wrapper') as HTMLDivElement;
const ingredientWrapper = document.querySelector('.input-wrapper .ingredient-wrapper') as HTMLDivElement;
let ingredients: Map<string, number> = new Map();

document.querySelector('.input-wrapper .add-ingr-btn')?.addEventListener('click', () => {
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

document.querySelector('.input-wrapper .add-cocktail-btn')?.addEventListener('click', () => {
    if (cocktailName.value && /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm.test(cocktailPicture.value)) {
        const newCocktail: Cocktail = new Cocktail(cocktailName.value, ingredients, cocktailPicture.value, parentDOMElement);
        ingredients.clear();
        cocktailName.value = '';
        cocktailPicture.value = '';
        ingredientWrapper.innerHTML = '';
    }
});
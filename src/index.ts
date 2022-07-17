class IngredientMap {
    constructor(private map: { [key: string]: number } = {}) {

    }

    *generateIterator() {
        for (const ingredientKey in this.map) {
            yield { key: ingredientKey, value: this.map[ingredientKey] };
        }
    }

    public set(key: string, value: number) {
        this.map[key] = value;
    }
    public get(key: string) {
        return this.map[key];
    }

    public print() {
        let iterator = this.generateIterator();
        for (const ingredient of iterator) {
            console.log(ingredient.key + ": " + ingredient.value);

        }
    }


}




class Cocktail {
    static amount: number = 0;
    id: number;
    constructor(private name: string, private ingredients: IngredientMap, private imgPath: string, private parent: HTMLDivElement) {
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
        for (const key in { ...localStorage }) {
            let objectStr = localStorage.getItem(key);
            if (objectStr) {

                let cocktailObject = JSON.parse(objectStr);

                let ingredients = new IngredientMap(cocktailObject.ingredients.map);

                let cocktail = new Cocktail(cocktailObject.name, ingredients, cocktailObject.imgPath, parentDOMElement);

            }
        }


    }

    public getIngredients() {
        return this.ingredients;
    }
}

const cocktailName = document.querySelector('.input-wrapper .name') as HTMLInputElement;
const cocktailPicture = document.querySelector('.input-wrapper #photo') as HTMLInputElement;
const inputIngrName = document.querySelector('.input-wrapper .add-ingr-name') as HTMLInputElement;
const inputIngrAmt = document.querySelector('.input-wrapper .add-ingr-amt') as HTMLInputElement;

const parentDOMElement = document.querySelector('.cocktail-wrapper') as HTMLDivElement;
const ingredientWrapper = document.querySelector('.input-wrapper .ingredient-wrapper') as HTMLDivElement;
let ingredients = new IngredientMap();

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
        localStorage.setItem('C' + newCocktail.id, JSON.stringify(newCocktail));

        ingredients = new IngredientMap();
        cocktailName.value = '';
        cocktailPicture.value = '';
        ingredientWrapper.innerHTML = '';

    }
});

document.addEventListener('DOMContentLoaded', () => {
    Cocktail.loadFromStorage();
})
type Amount = {amt: number, measure: string}


class IngredientMap {


    constructor(private map: { [key: string]: Amount } = {}) {

    }

    *generateIterator() {
        for (const ingredientKey in this.map) {
            yield { key: ingredientKey, value: this.map[ingredientKey] };
        }
    }

    public set(key: string, value: Amount) {
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
    constructor(private name: string, private ingredients: IngredientMap, private imgPath: string, private parent: HTMLDivElement , private id?: number) {
        
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
        deleteBtn.addEventListener('click',() => {
            Cocktail.deleteFromStorage(copy);
        });
        cocktailWrapper.appendChild(image);
        cocktailWrapper.appendChild(nameLabel);
        cocktailWrapper.appendChild(ingredients);
        cocktailWrapper.appendChild(deleteBtn);
        this.parent.appendChild(cocktailWrapper);
    }

    static loadFromStorage(searchFilter: string = '') {
        $.ajax({
            url: 'index.php',
            type: 'GET',
            data: {searchFilter: searchFilter},
            success: function (returnData) {
                parentDOMElement.innerHTML = '';
                if(returnData) {
                    for (const element of JSON.parse(returnData)) {
                        let newIngredients = new IngredientMap();
                        for (const ingr of element.ingredients) {
                            newIngredients.set(ingr.ingr_name, {amt: parseInt(ingr.ingr_amt), measure: ingr.ingr_measure});
                        }
                        const newCocktail: Cocktail = new Cocktail(element.name, newIngredients as IngredientMap, element.imageUrl, parentDOMElement, element.id);                    
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

    static deleteFromStorage(cocktail: Cocktail) {
        $.ajax({
            url: 'index.php',// url where the data should be sent
            type: 'POST',  // http method

            // all data || notation in JSON
            data: { intention: "delete", id: cocktail.id},
            success: function (data, status, xhr) {
                Cocktail.loadFromStorage();
            }
        });
    }

    static saveToStorage(cocktail: Cocktail) {
		// $.ajax({
        //     method: "POST",
        //     url: "index.php",
        //     data: {name: cocktail.name, imageUrl: cocktail.imgPath}
        // }).catch(function(response) {
        //     console.log(response);
        // });  
        $.ajax({
            url: 'index.php',// url where the data should be sent
            type: 'POST',  // http method

            // all data || notation in JSON
            data: { intention: "save", name: cocktail.name, imageUrl: cocktail.imgPath, ingredients:cocktail.ingredients },
            success: function (data, status, xhr) {
                Cocktail.loadFromStorage();
            }
        });
    }

    public getIngredients() {
        return this.ingredients;
    }
}

const cocktailName = document.querySelector('.input-wrapper .name') as HTMLInputElement;
const cocktailPicture = document.querySelector('.input-wrapper #photo') as HTMLInputElement;
const inputIngrName = document.querySelector('.input-wrapper .add-ingr-name') as HTMLInputElement;
const inputIngrAmt = document.querySelector('.input-wrapper .add-ingr-amt') as HTMLInputElement;
const selectIngrMeasure = document.querySelector('.input-wrapper .meas-select') as HTMLSelectElement;

const parentDOMElement = document.querySelector('.cocktail-section') as HTMLDivElement;
const ingredientWrapper = document.querySelector('.input-wrapper .ingredient-wrapper') as HTMLDivElement;
let ingredients = new IngredientMap();

const cocktailFilter = document.querySelector('.search-wrapper .cocktail-filter') as HTMLInputElement;

cocktailFilter.addEventListener('input', (event: any) => { 
    Cocktail.loadFromStorage(cocktailFilter.value);

})


document.querySelector('.input-wrapper .add-ingr-btn')?.addEventListener('click', () => {
    if (inputIngrName.value && /^[0-9]+$/g.test(inputIngrAmt.value) && selectIngrMeasure.value) {
        // store ingredient in map

        ingredients.set(inputIngrName.value, {amt: parseInt(inputIngrAmt.value),measure: selectIngrMeasure.value} );
        // output ingredient to the user
        ingredientWrapper.innerHTML += `<div>${inputIngrName.value}: ${inputIngrAmt.value} ${selectIngrMeasure.value}</div>`;
        // reset the input fields
        inputIngrName.value = '';
        inputIngrAmt.value = '';
    }
});

document.querySelector('.input-wrapper .add-cocktail-btn')?.addEventListener('click', () => {
    if (cocktailName.value && /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm.test(cocktailPicture.value)) {
        const newCocktail: Cocktail = new Cocktail(cocktailName.value, ingredients, cocktailPicture.value, parentDOMElement);

        Cocktail.saveToStorage(newCocktail);
        ingredients = new IngredientMap();
        cocktailName.value = '';
        cocktailPicture.value = '';
        ingredientWrapper.innerHTML = '';

    }
});

document.addEventListener('DOMContentLoaded', () => {
    Cocktail.loadFromStorage();
})
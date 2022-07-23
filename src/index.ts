

type Amount = { amt: number; measure: string };
namespace Utils {
  export function appendElements(
    parent: Element,
    ...nodes: HTMLElement[]
  ) {
    for (const node of nodes) {
      parent.appendChild(node);
    }
  }
  export function createElementWithAttributes(name: string, ...attributes: [string, string][]) {
    let element = document.createElement(name);
    for (const attribute of attributes) {
      element.setAttribute(attribute[0], attribute[1]);
    }
    return element;
  }

  export async function uploadFile() {
    let formData = new FormData();
    let files = imageUpload.files;
    
    
    if(files){
      formData.append("file",files[0]);

      const response = await fetch('php/upload.php', {
        method: "POST",
        body: formData
      });
      //console.log(await response);

    }
  }
}

class IngredientMap {
  constructor(private map: { [key: string]: Amount } = {}) {}

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
  constructor(
    private name: string,
    private ingredients: IngredientMap,
    private imgPath: string,
    private description: string,
    private parent: HTMLDivElement,
    private id?: number
  ) {}

  addRepresentation() {
    //Create every Element with Attributes
    let cocktailWrapper = Utils.createElementWithAttributes("div",["class","cocktail-wrapper"]);
    let image = Utils.createElementWithAttributes("img",["src",this.imgPath]);
    let nameLabel = Utils.createElementWithAttributes("h2");nameLabel.textContent = this.name;
    let description = Utils.createElementWithAttributes("div", ["classname", "cocktail-description"]); description.textContent = this.description;
    let deleteBtn = Utils.createElementWithAttributes("input",["type", "image"],["src", "images/x_btn.svg"]);

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
    Utils.appendElements(cocktailWrapper,image,nameLabel,ingredients,description,deleteBtn);
    Utils.appendElements(this.parent,cocktailWrapper);
  }

  static loadFromStorage(attr: string = "cocktail_name",searchFilter: string = "") {
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
            const newCocktail: Cocktail = new Cocktail(
              element.name,
              newIngredients as IngredientMap,
              element.imageUrl,
              element.description,
              parentDOMElement,
              element.id
            );
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

  static deleteFromStorage(cocktail: Cocktail) {
    $.ajax({
      url: "php/post.php", // url where the data should be sent
      type: "POST", // http method

      // all data || notation in JSON
      data: { intention: "delete", id: cocktail.id, imgPath: cocktail.imgPath},
      success: function (data, status, xhr) {
        Cocktail.loadFromStorage();
      },
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
      url: "php/post.php", // url where the data should be sent
      type: "POST", // http method

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

  public getIngredients() {
    return this.ingredients;
  }
}

const cocktailName = document.querySelector(
  ".input-wrapper .name"
) as HTMLInputElement;
const inputIngrName = document.querySelector(
  ".input-wrapper .add-ingr-name"
) as HTMLInputElement;
const inputIngrAmt = document.querySelector(
  ".input-wrapper .add-ingr-amt"
) as HTMLInputElement;
const selectIngrMeasure = document.querySelector(
  ".input-wrapper .meas-select"
) as HTMLSelectElement;

const parentDOMElement = document.querySelector(
  ".cocktail-section"
) as HTMLDivElement;
const ingredientWrapper = document.querySelector(
  ".input-wrapper .ingredient-wrapper"
) as HTMLDivElement;

let ingredients = new IngredientMap();

const cocktailFilter = document.querySelector(
  ".search-wrapper .cocktail-filter"
) as HTMLInputElement;

const attributeToSearch = document.querySelector(
  ".search-wrapper .search-for-select"
) as HTMLSelectElement;

const imageUpload = document.querySelector(
  ".input-wrapper #image-upload"
) as HTMLInputElement;

const description = document.querySelector(
  ".input-wrapper .cocktail_description"
) as HTMLTextAreaElement;

cocktailFilter.addEventListener("input", (event: any) => {
  Cocktail.loadFromStorage(attributeToSearch.value,cocktailFilter.value);
});
attributeToSearch.addEventListener('change', () => {
  Cocktail.loadFromStorage(attributeToSearch.value,cocktailFilter.value);
})

document.querySelector(".input-wrapper .add-ingr-btn")
  ?.addEventListener("click", () => {
    if (
      inputIngrName.value &&
      /^[0-9]+$/g.test(inputIngrAmt.value) &&
      selectIngrMeasure.value
    ) {
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

document.querySelector(".input-wrapper .add-cocktail-btn")
  ?.addEventListener("click", async () => {
    Utils.uploadFile().then(() => {
      let imagePath = "ERROR";
      if(imageUpload.files) {
        imagePath = "images/" + imageUpload.files[0].name;
      }
      if (cocktailName.value && imagePath && description.value) {
        const newCocktail: Cocktail = new Cocktail(
          cocktailName.value,
          ingredients,
          imagePath,
          description.value,
          parentDOMElement
        );

        Cocktail.saveToStorage(newCocktail);
        ingredients = new IngredientMap();
        cocktailName.value = "";
        ingredientWrapper.innerHTML = "";
        imageUpload.value = "";
        description.value = "";
      }
      
    });
    
  });

document.addEventListener("DOMContentLoaded", () => {
  Cocktail.loadFromStorage();
});

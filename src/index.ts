class Cocktail{
    static amount: number = 0;
    id: number;
    ingredients: Map<string, number> = new Map();
    constructor(private imgPath: string, private parent: HTMLDivElement) {
        this.id = ++Cocktail.amount;
        
    }

    addIngredient(name: string, value: number) {
        this.ingredients.set(name,value);
    }
}
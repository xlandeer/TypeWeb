
class ListNode {
  private parent;
  private nodeWrapper;

<<<<<<< Updated upstream
  constructor(
    private text: string,
  ) {
    this.parent = document.querySelector(".checklist-inner")
    this.nodeWrapper = document.createElement("div")
    this.nodeWrapper.className = 'node-wrapper'
    let nodeElements = this.createNodeElements()
    appendElements(this.nodeWrapper, nodeElements.tick,nodeElements.node,nodeElements.deleteBtn )
    console.log(this.nodeWrapper)
    if (this.parent) {
      appendElements(this.parent, this.nodeWrapper)
    }
<<<<<<< HEAD
    nodeElements.deleteBtn.addEventListener('click', () => this.nodeWrapper.remove())
  }

  private createNodeElements() {
    let tick = this.addElement("input",["classname","tick"],["type","checkbox"])
    let node = this.addElement("div",["classname","node"],["textContent",this.text])
    let deleteBtn = this.addElement("div",["classname","delete-btn"])
    console.log(deleteBtn)
    return{tick,node,deleteBtn}
=======
    deleteBtn.addEventListener('click', () => this.delete(this.nodeWrapper))
=======
  constructor(private text: string) {
    this.parent = document.querySelector(".checklist-inner");
    this.nodeWrapper = document.createElement("div");
    this.nodeWrapper.className = "node-wrapper";
    let nodeElements = this.createNodeElements();
    ListNode.appendElements(
      this.nodeWrapper,
      nodeElements.tick,
      nodeElements.node,
      nodeElements.deleteBtn
    );
    if (this.parent) {
      ListNode.appendElements(this.parent, this.nodeWrapper);
    }
    nodeElements.deleteBtn.addEventListener("click", () =>
      this.nodeWrapper.remove()
    );
>>>>>>> 38c3fc3 (Usage of setAttribute and added svg image)
  }

  private createNodeElements() {
    let tick = this.addElement("input",["class", "tick"],["type", "checkbox"]);
    let node = this.addElement("div", ["class", "node"]);
    let deleteBtn = this.addElement("input", ["class", "delete-btn"], ["type", "image"],["src", "icons/x_btn.svg"]);
    node.textContent = this.text;
    return { tick, node, deleteBtn };
>>>>>>> Stashed changes
  }
  // TODO: addElement function HTML Hardcode overload
  // Backend Save function of Data
<<<<<<< HEAD

  private addElement(name: string,...attributes: [string,string][]) {
    let element = document.createElement(name)
    for (const attribute of attributes) {
      element.setAttribute(attribute[0],attribute[1])
=======
<<<<<<< Updated upstream
  private addElements(...elementNames: string[]) {
    let ret: Element[] = [];
    for (const elementName of elementNames) {
      ret.push(document.createElement(elementName));
>>>>>>> 38c3fc3 (Usage of setAttribute and added svg image)
    }
    return element
  }



}


function appendElements<T extends HTMLElement>(parent: Element, ...nodes: T[]) {
  for (const node of nodes) {
    parent.appendChild(node);
  }
}
let addBtn = document.querySelector('.add-btn')
addBtn?.addEventListener('click', () => {
  const input = document.querySelector('.checklist .checklist-controls input') as HTMLInputElement | null
  if (input?.value) {
    let node = new ListNode(input.value)
    input.value = ''
  }
<<<<<<< HEAD
})
=======
})

/*
<div class="node">
  <div class="check">haken</div>
  <div class="node-text">Text</div>
</div>
*/
=======

  private addElement(name: string, ...attributes: [string, string][]) {
    let element = document.createElement(name);
    for (const attribute of attributes) {
      element.setAttribute(attribute[0], attribute[1]);
    }
    return element;
  }
  public static createNewListNode() {
    const input: HTMLInputElement | null = document.querySelector(
      ".checklist .checklist-controls input"
    );
    if (input?.value) {
      let node = new ListNode(input.value);
      input.value = "";
    }
  };
  public static appendElements<T extends HTMLElement>(parent: Element, ...nodes: T[]) {
    for (const node of nodes) {
      parent.appendChild(node);
    }
  }
}


let addBtn = document.querySelector(".add-btn");
let ms2Enter = document.getElementById("textField");
ms2Enter?.addEventListener("keypress", (e: KeyboardEvent) => {
  if (e.key == "Enter") {
    ListNode.createNewListNode();
  }
});
addBtn?.addEventListener("click", ListNode.createNewListNode);
>>>>>>> Stashed changes
>>>>>>> 38c3fc3 (Usage of setAttribute and added svg image)

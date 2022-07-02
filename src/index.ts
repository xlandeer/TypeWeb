class ListNode {
  private parent;
  private nodeWrapper;
  private ticked = false;


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
  }

  private createNodeElements() {
    let tick = this.addElement("input", ["class", "tick"], ["type", "checkbox"]);
    let node = this.addElement("div", ["class", "node"]);
    let deleteBtn = this.addElement("input", ["class", "delete-btn"], ["type", "image"], ["src", "icons/x_btn.svg"]);
    node.textContent = this.text;
    deleteBtn.addEventListener("click", () =>
      this.nodeWrapper.remove()
    );
    tick.addEventListener('change', (e:any) => {
      if(e.target.checked) {
        this.ticked = true;
      } else {
        this.ticked = false;
      }
    });
    return { tick, node, deleteBtn };
  }
  // TODO: JSON representation implementation

  private addElement(name: string, ...attributes: [string, string][]) {
    let element = document.createElement(name);
    for (const attribute of attributes) {
      element.setAttribute(attribute[0], attribute[1]);
    }
    return element;
  }
  private static addElementAsJson(node: ListNode) {

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
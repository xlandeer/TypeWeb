class ListNode {
  private parent;
  private nodeWrapper;
  private id;
  private static nodeAmount = 0;

  constructor(private text: string, private checked: boolean = false) {
    this.id = ListNode.nodeAmount;
    ListNode.nodeAmount++;

    this.parent = document.querySelector(".checklist-inner");
    this.nodeWrapper = document.createElement("div");
    this.nodeWrapper.className = "node-wrapper";
    let nodeElements = this.createNodeElements();
    ListNode.appendElements(
      this.nodeWrapper,
      nodeElements.check,
      nodeElements.node,
      nodeElements.deleteBtn
    );
    if (this.parent) {
      ListNode.appendElements(this.parent, this.nodeWrapper);
    }
  }

  private createNodeElements() {
    let a = document.createElement("input");
    let check = this.addElement(
      "input",
      ["class", "check"],
      ["type", "checkbox"]
    ) as HTMLInputElement;
    check.checked = this.checked;
    let node = this.addElement("div", ["class", "node"]);
    let deleteBtn = this.addElement(
      "input",
      ["class", "delete-btn"],
      ["type", "image"],
      ["src", "images/x_btn.svg"]
    );
    node.textContent = this.text;
    deleteBtn.addEventListener("click", () => {
      this.nodeWrapper.remove();
      localStorage.removeItem(this.id.toString());
      ListNode.nodeAmount--;
    });
    check.addEventListener("change", () => {
      this.checked = !this.checked;

      localStorage.removeItem(this.id.toString());
      localStorage.setItem(this.id.toString(), JSON.stringify(this));
    });
    return { check, node, deleteBtn };
  }

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
      localStorage.setItem(node.id.toString(), JSON.stringify(node));
    }
  }
  public static appendElements<T extends HTMLElement>(
    parent: Element,
    ...nodes: T[]
  ) {
    for (const node of nodes) {
      parent.appendChild(node);
    }
  }
  public static generateFromStorage() {
    for (const item in { ...localStorage }) {
      const n = localStorage.getItem(item);
      if (n) {
        let nodeObject: ListNode = JSON.parse(n);
        let node: ListNode = new ListNode(nodeObject.text, nodeObject.checked);
      }
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  ListNode.generateFromStorage();
  let addBtn = document.querySelector(".add-btn");
  let ms2Enter = document.getElementById("textField");
  ms2Enter?.addEventListener("keypress", (e: KeyboardEvent) => {
    if (e.key == "Enter") {
      ListNode.createNewListNode();
    }
  });
  addBtn?.addEventListener("click", ListNode.createNewListNode);
});

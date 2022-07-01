class ListNode {
  private parent
  private nodeWrapper

  constructor(
    private text: string,
  ) {
    this.parent = document.querySelector(".checklist-inner")
    this.nodeWrapper = document.createElement("div")
    this.nodeWrapper.className = 'node-wrapper'
    let deleteBtn = document.createElement("div")
    let node = document.createElement("div")
    let tick = document.createElement("input")
    tick.type = 'checkbox'
    node.textContent = text
    node.className = 'node'
    tick.className = 'tick'
    deleteBtn.className = 'delete-btn'
    appendElement(this.nodeWrapper, tick, node, deleteBtn)
    if (this.parent) {
      appendElement(this.parent, this.nodeWrapper)
    }
    deleteBtn.addEventListener('click', () => this.delete(this.nodeWrapper))
  }
  ///TODO: addElement function (Overloads)
  private addElements(...elementNames: string[]) {
    let ret: Element[] = [];
    for (const elementName of elementNames) {
      ret.push(document.createElement(elementName));
    }
    return ret;
  }

  private delete(nodeWrapper: Element) {
    nodeWrapper.remove();
  }


}

function appendElement(parent: Element, ...nodes: Element[]) {
  for (const node of nodes) {
    parent.appendChild(node);
  }
}
let addBtn = document.querySelector('.add-btn')
addBtn?.addEventListener('click', () => {
  const input = document.querySelector('.checklist .checklist-controls input') as HTMLInputElement | null
  if (input?.value) {
    let node = new ListNode(input.value)
  }
})

/*
<div class="node">
  <div class="check">haken</div>
  <div class="node-text">Text</div>
</div>
*/
class ListNode {
  parent
  node
  constructor(
    private text: string
  ) {
    this.parent = document.querySelector(".checklist-inner")
    this.node = document.createElement("div")
    this.node.textContent = text
    this.node.className = 'node'
    this.parent?.appendChild(this.node)
  }
}


let addBtn = document.querySelector('.add-btn')
addBtn?.addEventListener('click', () => {
  const input = document.querySelector('.checklist .checklist-controls input') as HTMLInputElement | null
  if (input?.value) {
    let node = new ListNode(input.value)
  }
})

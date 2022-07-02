"use strict";
class ListNode {
    constructor(text) {
        this.text = text;
        this.parent = document.querySelector(".checklist-inner");
        this.nodeWrapper = document.createElement("div");
        this.nodeWrapper.className = 'node-wrapper';
        let nodeElements = this.createNodeElements();
        appendElements(this.nodeWrapper, nodeElements.tick, nodeElements.node, nodeElements.deleteBtn);
        console.log(this.nodeWrapper);
        if (this.parent) {
            appendElements(this.parent, this.nodeWrapper);
        }
        nodeElements.deleteBtn.addEventListener('click', () => this.nodeWrapper.remove());
    }
    createNodeElements() {
        let tick = this.addElement("input", ["classname", "tick"], ["type", "checkbox"]);
        let node = this.addElement("div", ["classname", "node"], ["textContent", this.text]);
        let deleteBtn = this.addElement("div", ["classname", "delete-btn"]);
        console.log(deleteBtn);
        return { tick, node, deleteBtn };
    }
    ///TODO: addElement function (Overloads)
    // Backend Save function of Data
    addElement(name, ...attributes) {
        let element = document.createElement(name);
        for (const attribute of attributes) {
            element.setAttribute(attribute[0], attribute[1]);
        }
        return element;
    }
}
function appendElements(parent, ...nodes) {
    for (const node of nodes) {
        parent.appendChild(node);
    }
}
let addBtn = document.querySelector('.add-btn');
addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', () => {
    const input = document.querySelector('.checklist .checklist-controls input');
    if (input === null || input === void 0 ? void 0 : input.value) {
        let node = new ListNode(input.value);
        input.value = '';
    }
});
/*
<div class="node">
  <div class="check">haken</div>
  <div class="node-text">Text</div>
</div>
*/ 
//# sourceMappingURL=index.js.map
"use strict";
class ListNode {
    constructor(text) {
        this.text = text;
        this.parent = document.querySelector(".checklist-inner");
        this.nodeWrapper = document.createElement("div");
        this.nodeWrapper.className = 'node-wrapper';
        let deleteBtn = document.createElement("div");
        let node = document.createElement("div");
        let tick = document.createElement("input");
        tick.type = 'checkbox';
        node.textContent = text;
        node.className = 'node';
        tick.className = 'tick';
        appendElement(this.nodeWrapper, tick, node);
        if (this.parent) {
            appendElement(this.parent, this.nodeWrapper);
        }
    }
    addElements(...elementNames) {
        let ret = [];
        for (const elementName of elementNames) {
            ret.push(document.createElement(elementName));
        }
        return ret;
    }
    delete() {
    }
}
function appendElement(parent, ...nodes) {
    for (const node of nodes) {
        parent.appendChild(node);
    }
}
let addBtn = document.querySelector('.add-btn');
addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', () => {
    const input = document.querySelector('.checklist .checklist-controls input');
    if (input === null || input === void 0 ? void 0 : input.value) {
        let node = new ListNode(input.value);
    }
});
/*
<div class="node">
  <div class="check">haken</div>
  <div class="node-text">Text</div>
</div>
*/ 
//# sourceMappingURL=index.js.map
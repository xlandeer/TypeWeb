"use strict";
class ListNode {
    constructor(text) {
        this.text = text;
        this.ticked = false;
        this.parent = document.querySelector(".checklist-inner");
        this.nodeWrapper = document.createElement("div");
        this.nodeWrapper.className = "node-wrapper";
        let nodeElements = this.createNodeElements();
        ListNode.appendElements(this.nodeWrapper, nodeElements.tick, nodeElements.node, nodeElements.deleteBtn);
        if (this.parent) {
            ListNode.appendElements(this.parent, this.nodeWrapper);
        }
    }
    createNodeElements() {
        let tick = this.addElement("input", ["class", "tick"], ["type", "checkbox"]);
        let node = this.addElement("div", ["class", "node"]);
        let deleteBtn = this.addElement("input", ["class", "delete-btn"], ["type", "image"], ["src", "icons/x_btn.svg"]);
        node.textContent = this.text;
        deleteBtn.addEventListener("click", () => this.nodeWrapper.remove());
        tick.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.ticked = true;
            }
            else {
                this.ticked = false;
            }
        });
        return { tick, node, deleteBtn };
    }
    // TODO: JSON representation implementation
    addElement(name, ...attributes) {
        let element = document.createElement(name);
        for (const attribute of attributes) {
            element.setAttribute(attribute[0], attribute[1]);
        }
        return element;
    }
    static addElementAsJson(node) {
    }
    static createNewListNode() {
        const input = document.querySelector(".checklist .checklist-controls input");
        if (input === null || input === void 0 ? void 0 : input.value) {
            let node = new ListNode(input.value);
            input.value = "";
        }
    }
    ;
    static appendElements(parent, ...nodes) {
        for (const node of nodes) {
            parent.appendChild(node);
        }
    }
}
let addBtn = document.querySelector(".add-btn");
let ms2Enter = document.getElementById("textField");
ms2Enter === null || ms2Enter === void 0 ? void 0 : ms2Enter.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        ListNode.createNewListNode();
    }
});
addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener("click", ListNode.createNewListNode);
//# sourceMappingURL=index.js.map
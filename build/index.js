"use strict";
class ListNode {
    constructor(text) {
        this.text = text;
        this.parent = document.querySelector(".checklist-inner");
        this.nodeWrapper = document.createElement("div");
<<<<<<< Updated upstream
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
<<<<<<< HEAD
=======
    addElements(...elementNames) {
        let ret = [];
        for (const elementName of elementNames) {
            ret.push(document.createElement(elementName));
=======
        this.nodeWrapper.className = "node-wrapper";
        let nodeElements = this.createNodeElements();
        ListNode.appendElements(this.nodeWrapper, nodeElements.tick, nodeElements.node, nodeElements.deleteBtn);
        if (this.parent) {
            ListNode.appendElements(this.parent, this.nodeWrapper);
        }
        nodeElements.deleteBtn.addEventListener("click", () => this.nodeWrapper.remove());
    }
    createNodeElements() {
        let tick = this.addElement("input", ["class", "tick"], ["type", "checkbox"]);
        let node = this.addElement("div", ["class", "node"]);
        let deleteBtn = this.addElement("input", ["class", "delete-btn"], ["type", "image"], ["src", "icons/x_btn.svg"]);
        node.textContent = this.text;
        return { tick, node, deleteBtn };
    }
    // TODO: addElement function HTML Hardcode overload
>>>>>>> 38c3fc3 (Usage of setAttribute and added svg image)
    // Backend Save function of Data
    addElement(name, ...attributes) {
        let element = document.createElement(name);
        for (const attribute of attributes) {
            element.setAttribute(attribute[0], attribute[1]);
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
>>>>>>> 38c3fc3 (Usage of setAttribute and added svg image)
        }
        return element;
    }
<<<<<<< Updated upstream
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
<<<<<<< HEAD
        input.value = '';
=======
=======
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
>>>>>>> Stashed changes
>>>>>>> 38c3fc3 (Usage of setAttribute and added svg image)
    }
});
addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener("click", ListNode.createNewListNode);
//# sourceMappingURL=index.js.map
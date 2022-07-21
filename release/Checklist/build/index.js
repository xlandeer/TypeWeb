"use strict";
class ListNode {
    constructor(text, checked = false) {
        this.text = text;
        this.checked = checked;
        this.id = ListNode.nodeAmount;
        ListNode.nodeAmount++;
        this.parent = document.querySelector(".checklist-inner");
        this.nodeWrapper = document.createElement("div");
        this.nodeWrapper.className = "node-wrapper";
        let nodeElements = this.createNodeElements();
        ListNode.appendElements(this.nodeWrapper, nodeElements.check, nodeElements.node, nodeElements.deleteBtn);
        if (this.parent) {
            ListNode.appendElements(this.parent, this.nodeWrapper);
        }
    }
    createNodeElements() {
        let a = document.createElement("input");
        let check = this.addElement("input", ["class", "check"], ["type", "checkbox"]);
        check.checked = this.checked;
        let node = this.addElement("div", ["class", "node"]);
        let deleteBtn = this.addElement("input", ["class", "delete-btn"], ["type", "image"], ["src", "images/x_btn.svg"]);
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
    addElement(name, ...attributes) {
        let element = document.createElement(name);
        for (const attribute of attributes) {
            element.setAttribute(attribute[0], attribute[1]);
        }
        return element;
    }
    static createNewListNode() {
        const input = document.querySelector(".checklist .checklist-controls input");
        if (input === null || input === void 0 ? void 0 : input.value) {
            let node = new ListNode(input.value);
            input.value = "";
            localStorage.setItem(node.id.toString(), JSON.stringify(node));
        }
    }
    static appendElements(parent, ...nodes) {
        for (const node of nodes) {
            parent.appendChild(node);
        }
    }
    static generateFromStorage() {
        for (const item in Object.assign({}, localStorage)) {
            const n = localStorage.getItem(item);
            if (n) {
                let nodeObject = JSON.parse(n);
                let node = new ListNode(nodeObject.text, nodeObject.checked);
            }
        }
    }
}
ListNode.nodeAmount = 0;
document.addEventListener("DOMContentLoaded", () => {
    ListNode.generateFromStorage();
    let addBtn = document.querySelector(".add-btn");
    let ms2Enter = document.getElementById("textField");
    ms2Enter === null || ms2Enter === void 0 ? void 0 : ms2Enter.addEventListener("keypress", (e) => {
        if (e.key == "Enter") {
            ListNode.createNewListNode();
        }
    });
    addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener("click", ListNode.createNewListNode);
});
//# sourceMappingURL=index.js.map
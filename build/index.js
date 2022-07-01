"use strict";
class ListNode {
    constructor(text) {
        var _a;
        this.text = text;
        this.parent = document.querySelector(".checklist-inner");
        this.node = document.createElement("div");
        this.node.textContent = text;
        this.node.className = 'node';
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.appendChild(this.node);
    }
}
let addBtn = document.querySelector('.add-btn');
addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', () => {
    const input = document.querySelector('.checklist .checklist-controls input');
    if (input === null || input === void 0 ? void 0 : input.value) {
        let node = new ListNode(input.value);
    }
});
//# sourceMappingURL=index.js.map
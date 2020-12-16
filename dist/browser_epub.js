"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const preview_links = __importStar(require("./lib/preview_links"));
const spec = __importStar(require("./lib/epub_data"));
const markdown_start = `
See:

`;
const markdown = `* For {title}:
    * [Preview]({preview})
    * [Diff]({diff})
`;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function main(e) {
    try {
        // Get the data from the HTML
        const number = document.getElementById('number');
        const url = `https://github.com/w3c/${spec.repo_name}/pull/${number.value}`;
        // Get the service name
        const service = document.getElementById('service');
        // These are the possible specs
        // find the corresponding checkbox and see if it has been checked.
        // if yes, then the corresponding path should be used
        const parts = spec.parts.filter((part) => {
            const choice = document.getElementById(part.short_name);
            if (choice === null || choice.checked === false) {
                return false;
            }
            else {
                return true;
            }
        });
        const URLs = await preview_links.get_data(url, service.value, true, parts.map((part) => part.path));
        const final = URLs.reduce((accumulator, currentValue, currentIndex) => {
            return accumulator + markdown.replace('{title}', parts[currentIndex].title).replace('{preview}', currentValue.new).replace('{diff}', currentValue.diff);
        }, '');
        // This is the place for the generated output
        const markdown_box = document.getElementById('markdown');
        markdown_box.value = markdown_start + final;
    }
    catch (err) {
        alert(`preview error: ${err}`);
    }
}
window.addEventListener('load', () => {
    const go_button = document.getElementById('go');
    go_button.addEventListener('click', main);
});
//# sourceMappingURL=browser_epub.js.map
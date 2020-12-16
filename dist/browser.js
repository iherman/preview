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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function main(e) {
    try {
        // Get the data from the HTML
        const url = document.getElementById('url');
        // This is the flag on whether this is a pure html file or a ReSpec
        const text = document.getElementById('text');
        const respec = !text.checked;
        // This is the place for the generated output
        const markdown = document.getElementById('markdown');
        // Get the preview data and generate a markdown snippet
        const URLs = await preview_links.get_data(url.value, respec);
        markdown.value = preview_links.constants.markdown.replace('{preview}', URLs[0].new).replace('{diff}', URLs[0].diff);
    }
    catch (err) {
        alert(`preview error: ${err}`);
    }
}
window.addEventListener('load', () => {
    const go_button = document.getElementById('go');
    go_button.addEventListener('click', main);
});
//# sourceMappingURL=browser.js.map
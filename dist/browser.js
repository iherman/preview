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
const get_urls = __importStar(require("./lib/get_urls"));
const constants = __importStar(require("./lib/constants"));
async function dummy(e) {
    const URLs = await get_urls.get_data('http://example.org', true);
}
async function main(e) {
    const url = document.getElementById('url');
    const text = document.getElementById('text');
    const respec = !text.checked;
    const markdown = document.getElementById('markdown');
    const URLs = await get_urls.get_data(url.value, respec);
    const result = constants.markdown.replace('{preview}', URLs.new).replace('{diff}', URLs.diff);
    markdown.value = result;
}
window.addEventListener('load', () => {
    const go_button = document.getElementById('go');
    go_button.addEventListener('click', main);
});
//# sourceMappingURL=browser.js.map
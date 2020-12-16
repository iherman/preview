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
const { program } = require('commander');
async function main() {
    program
        .name('preview')
        .usage('[option] [pr_url')
        .description('Create a markdown snippet that can be inserted into as a PR comment for preview')
        .option('-t, --text', 'whether the source is a plain vanilla HTML (as opposed to respec')
        .parse(process.argv);
    if (program.args.length === 0) {
        console.error('preview error: no PR URL has been provided; exiting');
        process.exit(-1);
    }
    else {
        const url = program.args[0];
        const respec = program.text === undefined;
        try {
            const URLs = await preview_links.get_data(url, respec);
            console.log(preview_links.constants.markdown.replace('{preview}', URLs[0].new).replace('{diff}', URLs[0].diff));
        }
        catch (e) {
            console.log(`preview error: ${e}`);
            process.exit(-1);
        }
    }
}
main();
//# sourceMappingURL=main.js.map
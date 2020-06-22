"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_browser = exports.markdown = exports.spec_gen = exports.html_diff = exports.gh_api = exports.old_version = exports.new_version = void 0;
const statically = 'https://cdn.statically.io/gh/{owner}/{repo}/{branch}/index.html';
const githack = 'https://raw.githack.com/{owner}/{repo}/{branch}/index.html';
exports.new_version = statically;
exports.old_version = 'https://{owner}.github.io/{repo}/';
exports.gh_api = 'https://api.github.com/repos/{owner}/{repo}/pulls/{number}';
exports.html_diff = 'https://services.w3.org/htmldiff?doc1={old}&doc2={new}';
exports.spec_gen = 'https://labs.w3.org/spec-generator/?type=respec&url={url}';
exports.markdown = `
See:

* [Preview]({preview})
* [Diff]({diff})
`;
/**
 * Flag to decide whether the code runs in a browser or in node.js
 */
exports.is_browser = (process === undefined || process.title === 'browser');
//# sourceMappingURL=constants.js.map
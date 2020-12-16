(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./lib/preview_links":2}],2:[function(require,module,exports){
(function (process){
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
exports.get_data = exports.constants = void 0;
/* eslint-disable @typescript-eslint/no-namespace */
var constants;
(function (constants) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const statically = 'https://cdn.statically.io/gh/{owner}/{repo}/{branch}/{file}';
    const githack = 'https://raw.githack.com/{owner}/{repo}/{branch}/{file}';
    // export const new_version = statically;
    constants.new_version = githack;
    constants.old_version = 'https://{owner}.github.io/{repo}/{file}';
    constants.gh_api = 'https://api.github.com/repos/{owner}/{repo}/pulls/{number}';
    constants.html_diff = 'https://services.w3.org/htmldiff?doc1={old}&doc2={new}';
    constants.spec_gen = 'https://labs.w3.org/spec-generator/?type=respec&url={url}';
    constants.markdown = `
See:

* [Preview]({preview})
* [Diff]({diff})
`;
    /**
     * Flag to decide whether the code runs in a browser or in node.js
     */
    constants.is_browser = (process === undefined || process.title === 'browser');
})(constants = exports.constants || (exports.constants = {}));
/* ======================================= Interface to Fetch ========================= */
const node_fetch = __importStar(require("node-fetch"));
/**
 * The effective fetch implementation run by the rest of the code.
 *
 * There is no default fetch implementation for `node.js`, hence the necessity to import 'node-fetch'. However, if the code
 * runs in a browser, there is an error message whereby only the fetch implementation in the Window is acceptable.
 *
 * This variable is a simple, polyfill like switch between the two, relying on the existence (or not) of the
 * `process` variable (built-in for `node.js`).
 *
 */
const my_fetch = constants.is_browser ? fetch : node_fetch.default;
/**
 * Generate all the URLs based on the JSON data of the PR. That JSON data is the one
 * returned by the Github API
 *
 * @param main_repo - identification of the main repo, ie, the target of the PR
 * @param octocat - the data returned by the Github API for the PR
 * @param respec - whether the sources are to be encapsulated into a spec generator call for respec in the html diff
 * @param path - the path of the file to be converted
 */
function get_urls(main_repo, octocat, respec, path = 'index.html') {
    /**
    * The URL used in the spec generator must be percent encoded
    */
    const encodeurl = (url) => {
        return url.replace(/\?/g, '%3F').replace(/\&/g, '%26');
    };
    // Get the data for the repository of the submission
    const head_repo = octocat.head.repo.full_name.split('/');
    const submission_repo = {
        owner: head_repo[0],
        repo: head_repo[1],
    };
    // Get the data for the submission branch
    const submission_branch = {
        branch: octocat.head.ref,
    };
    // Get the new version's URL
    const new_version = constants.new_version
        .replace('{owner}', submission_repo.owner)
        .replace('{repo}', submission_repo.repo)
        .replace('{branch}', submission_branch.branch)
        .replace('{file}', path);
    // Get the original versions' URL (used for the diff)
    const old_version = constants.old_version
        .replace('{owner}', main_repo.owner)
        .replace('{repo}', main_repo.repo)
        .replace('{file}', path);
    // If we the sources are in ReSpec, the URLs used in the HTML diff must be a call out to the spec generator
    // to generate the final HTML on the fly. Note that the URLs must be percent encoded.
    const new_spec = respec ? encodeurl(constants.spec_gen.replace('{url}', new_version)) : new_version;
    const old_spec = respec ? encodeurl(constants.spec_gen.replace('{url}', old_version)) : old_version;
    return {
        new: new_version,
        diff: constants.html_diff.replace('{old}', old_spec).replace('{new}', new_spec)
    };
}
/**
 * Get the preview and html diff URLs for a PR.
 *
 * @async
 * @param url - URL of the PR
 * @param respec - Flag whether the documents are in ReSpec, ie, should be converted before establish the diffs
 */
async function get_data(url, respec = true, paths = ['index.html']) {
    /**
     *
     * The standard idiom to get JSON data via fetch
     * @async
     */
    const fetch_json = async (resource_url) => {
        const response = await my_fetch(resource_url);
        return await response.json();
    };
    // The URL for the PR.
    const parsed_path = new URL(url).pathname.split('/');
    const home_repo = {
        owner: parsed_path[1],
        repo: parsed_path[2],
    };
    const pr_number = parsed_path[4];
    const gh_api_url = constants.gh_api
        .replace('{owner}', home_repo.owner)
        .replace('{repo}', home_repo.repo)
        .replace('{number}', pr_number);
    const octocat = await fetch_json(gh_api_url);
    return paths.map((path) => get_urls(home_repo, octocat, respec, path));
}
exports.get_data = get_data;

}).call(this,require('_process'))
},{"_process":4,"node-fetch":3}],3:[function(require,module,exports){
(function (global){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
if (global.fetch) {
	exports.default = global.fetch.bind(global);
}

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);

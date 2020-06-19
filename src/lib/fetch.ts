/**
 * ## Fetch
 *
 * Wrappers around the fetch function.
 *
 * @packageDocumentation
 */

 /**
 *
 *
 */


import * as node_fetch from 'node-fetch';
import * as urlHandler from 'url';
import * as constants  from './constants';

/**
 * The effective fetch implementation run by the rest of the code.
 *
 * There is no default fetch implementation for `node.js`, hence the necessity to import 'node-fetch'. However, if the code
 * runs in a browser, there is an error message whereby only the fetch implementation in the Window is acceptable.
 *
 * This variable is a simple, polyfill like switch between the two, relying on the existence (or not) of the
 * `process` variable (built-in for `node.js`).
 *
 * I guess this makes this entry a bit polyfill like:-)
 */
const my_fetch: ((arg :string) => Promise<any>) = constants.is_browser ? fetch : node_fetch.default;

/**
 * Fetch a resource.
 *
 * @param resource_url
 * @param force_text - whether the resource should be returned as text in case no content type is set by the server
 * @returns - resource; either a simple text, or a Stream
 * @async
 */
export async function fetch_json(resource_url :string) :Promise<any> {
    // If there is a problem, an exception is raised
    // Note that if this was used in a browser only, there are shortcuts in the fetch function for this, but that is not the case for
    // node-fetch. :-(
    return new Promise((resolve, reject) => {
        try {
            // This is a real URL, whose content must be accessed via HTTP(S)
            // An exception is raised if the URL has security/sanity issues.
            my_fetch(resource_url)
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        reject(new Error(`HTTP response ${response.status}: ${response.statusText} on ${resource_url}`));
                    }
                })
                .then((body) => {
                    resolve(JSON.parse(body));
                })
                .catch((err) => {
                    reject(new Error(`Problem accessing ${resource_url}: ${err}`));
                });
        } catch (err) {
            reject(err);
        }
    });
}


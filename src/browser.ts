import * as preview_links from './lib/preview_links.ts';

/**
 * Even handler for the action button on the form.
 * @param _e
 */
async function go(_e: Event) {
    try {
        // Get the data from the HTML
        const url      = document.getElementById('url') as HTMLInputElement;

        // Get the service name
        const service  = document.getElementById('service') as HTMLSelectElement;

        // This is the flag on whether this is a pure html file or a ReSpec
        const text     = document.getElementById('text') as HTMLInputElement;
        const respec   = !text.checked

        // This is the place for the generated output
        const markdown = document.getElementById('markdown') as HTMLTextAreaElement;

        // Get the preview data and generate a markdown snippet
        const URLs :preview_links.URLs[] = await preview_links.get_data(url.value, service.value, respec);
        markdown.value = preview_links.constants.markdown.replace('{preview}', URLs[0].new).replace('{diff}', URLs[0].diff);
    } catch (err) {
        alert(`preview error: ${err}`);
    }
}

globalThis.addEventListener('load', () => {
    const go_button = document.getElementById('go');
    if (go_button) {
        go_button.addEventListener('click', go)
    }
});

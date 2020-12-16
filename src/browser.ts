import * as preview_links from './lib/preview_links';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function main(e: Event) {
    try {
        // Get the data from the HTML
        const url      = document.getElementById('url') as HTMLInputElement;

        // This is the flag on whether this is a pure html file or a ReSpec
        const text     = document.getElementById('text') as HTMLInputElement;
        const respec   = !text.checked

        // This is the place for the generated output
        const markdown = document.getElementById('markdown') as HTMLTextAreaElement;

        // Get the preview data and generate a markdown snippet
        const URLs :preview_links.URLs[] = await preview_links.get_data(url.value, respec);
        markdown.value = preview_links.constants.markdown.replace('{preview}', URLs[0].new).replace('{diff}', URLs[0].diff);
    } catch (err) {
        alert(`preview error: ${err}`);
    }
}

window.addEventListener('load', () => {
    const go_button = document.getElementById('go');
    go_button.addEventListener('click', main);
});

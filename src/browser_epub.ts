import * as preview_links from './lib/preview_links.ts';
import * as specs         from './lib/epub_data.ts';

const markdown_start = `
See:

`;

const markdown = `* For {title}:
    * [Preview]({preview})
    * [Diff]({diff})
`;


async function main(_e: Event) {
    try {
        // Get the data from the HTML
        const number   = document.getElementById('number') as HTMLInputElement;
        const url      = `https://github.com/${specs.repo_owner}/${specs.repo_name}/pull/${number.value}`;

        // Get the service name
        const service  = document.getElementById('service') as HTMLSelectElement;

        // These are the possible specs
        // find the corresponding checkbox and see if it has been checked.
        // if yes, then the corresponding path should be used
        const parts: specs.Part[] = specs.parts.filter((part: specs.Part): boolean => {
            const choice = document.getElementById(part.short_name) as HTMLInputElement;
            return !(choice === null || choice.checked === false);
        });

        const URLs :preview_links.URLs[] = await preview_links.get_data(url, service.value, true, parts.map((part) => part.path));
        const final = URLs.reduce((accumulator: string, currentValue: preview_links.URLs, currentIndex: number): string => {
            return accumulator + markdown.replace('{title}', parts[currentIndex].title).replace('{preview}', currentValue.new).replace('{diff}', currentValue.diff);
        }, '');

        // This is the place for the generated output
        const markdown_box = document.getElementById('markdown') as HTMLTextAreaElement;
        markdown_box.value = markdown_start + final;

    } catch (err) {
        alert(`preview error: ${err}`);
    }
}

globalThis.addEventListener('load', () => {
    const go_button = document.getElementById('go');
    if (go_button) {
        go_button.addEventListener('click', main);
    }
});

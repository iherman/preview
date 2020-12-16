import * as preview_links from './lib/preview_links';
import * as spec          from './lib/epub_data';

const markdown_start = `
See:

`;

const markdown = `* For {title}:
    * [Preview]({preview})
    * [Diff]({diff})
`;


// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function main(e: Event) {
    try {
        // Get the data from the HTML
        const number   = document.getElementById('number') as HTMLInputElement;
        const url      = `https://github.com/w3c/${spec.repo_name}/pull/${number.value}`;

        // These are the possible specs
        // find the corresponding checkbox and see if it has been checked.
        // if yes, then the corresponding path should be used
        const parts: spec.Part[] = spec.parts.filter((part: spec.Part): boolean => {
            const choice = document.getElementById(part.short_name) as HTMLInputElement;
            if (choice === null || choice.checked === false) {
                return false;
            } else {
                return true;
            }
        });

        const URLs :preview_links.URLs[] = await preview_links.get_data(url, true, parts.map((part) => part.path));
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

window.addEventListener('load', () => {
    const go_button = document.getElementById('go');
    go_button.addEventListener('click', main);
});

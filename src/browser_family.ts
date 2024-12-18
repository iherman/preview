import * as preview_links from './lib/preview_links.ts';
import * as specs         from './lib/multiple_data.ts';

const markdown_start = `
See:

`;

const markdown = `* For {title}:
    * [Preview]({preview})
    * [Diff]({diff})
`;

function finalizePage() {
    const crateChoice = (part :specs.Part): string => {
        const pattern: string = '<input type="checkbox" name="{short_name}" id="{short_name}"><label for="{short_name}">{title}</label><br>  ';
        return pattern
                .replaceAll('{short_name}', part.short_name)
                .replaceAll('{title}', part.title);
    };


    /* Modify the title elements, using the "family" entry of the imported data */
    const headTitle = document.getElementsByTagName('title').item(0);
    if (headTitle && headTitle.textContent) {
        headTitle.textContent = headTitle.textContent.replace('{title}', specs.family);
    }
    const mainTitle = document.querySelector('header h1');
    if (mainTitle && mainTitle.textContent) {
        mainTitle.textContent = mainTitle.textContent.replaceAll('{title}', specs.family);
    }

    const choices = ["Specifications:<br/>  ", ...specs.parts.map(crateChoice)].join('\n').slice(0,-6);

    const spec_choices = document.getElementById('spec_choices');
    if (spec_choices) {
        spec_choices.innerHTML = choices;
    }
}



async function go(_e: Event) {
    try {
        // Get the data from the HTML
        const number   = document.getElementById('number') as HTMLInputElement;

        const url: string = ((value): string => {
            if (value) {
                return `https://github.com/${specs.repo_owner}/${specs.repo_name}/pull/${value}`
            } else {
                throw 'No PR number has been provided.';
            }
        })(number.value) ;

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
    finalizePage();
    const go_button = document.getElementById('go');
    if (go_button) {
        go_button.addEventListener('click', go);
    }
});

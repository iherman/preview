import * as preview_links                     from './lib/preview_links.ts';
import { findFamily, type Family, type Part } from './lib/multiple_data.ts';

const markdown_start = `
See:

`;

const markdown = `* For {title}:
    * [Preview]({preview})
    * [Diff]({diff})
`;

/**
 * The form data, i.e., a choice button for each specification in the family, is generated
 * dynamically, using the family data (indirectly imported via `./lib/multiple_data.ts`.
 *
 * This function is called once at load time.
 */
function finalizePage(specs: Family) {
    // Generate a single chose for a specification
    const createChoice = (part :Part): string => {
        const pattern: string = '<input type="checkbox" name="{short_name}" id="{short_name}"><label for="{short_name}">{title}</label><br>  ';
        return pattern
                .replaceAll('{short_name}', part.short_name)
                .replaceAll('{title}', part.title);
    };

    // Modify the title elements, using the "family" entry of the imported data
    const headTitle = document.getElementsByTagName('title').item(0);
    if (headTitle && headTitle.textContent) {
        headTitle.textContent = headTitle.textContent.replace('{title}', specs.family);
    }
    const mainTitle = document.querySelector('header h1');
    if (mainTitle && mainTitle.textContent) {
        mainTitle.textContent = mainTitle.textContent.replaceAll('{title}', specs.family);
    }

    // Generate all the choices as a sequence of HTML strings
    //
    // The last entry in the construction removes the trailing `<br>&nbsp;&nbsp;` which is put there
    // by the choice entry construction
    const choices = ["Specifications:<br/>  ", ...specs.parts.map(createChoice)].join('\n').slice(0,-6);

    // Insert the choice entries into the HTML source
    const spec_choices = document.getElementById('spec_choices');
    if (spec_choices) {
        spec_choices.innerHTML = choices;
    }
}

/**
 * Event handler to generate the Markdown snippets for a specific family.
 *
 * @param _e
 * @param specs
 */
async function go(_e: Event, specs: Family) {
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
        // Filter using the corresponding checkbox and see if it has been checked.
        // If yes, then the corresponding path should be used
        const parts: Part[] = specs.parts.filter((part: Part): boolean => {
            const choice = document.getElementById(part.short_name) as HTMLInputElement;
            return !(choice === null || choice.checked === false);
        });

        const URLs :preview_links.URLs[] = await preview_links.get_data(url, service.value, true, parts.map((part) => part.path));
        const final = URLs.reduce((accumulator: string, currentValue: preview_links.URLs, currentIndex: number): string => {
            return accumulator + markdown
                                    .replace('{title}', parts[currentIndex].title)
                                    .replace('{preview}', currentValue.new)
                                    .replace('{diff}', currentValue.diff);
        }, '');

        // This is the place for the generated output
        const markdown_box = document.getElementById('markdown') as HTMLTextAreaElement;
        markdown_box.value = markdown_start + final;
    } catch (err) {
        alert(`preview error: ${err}`);
    }
}

globalThis.addEventListener('load', () => {
    // Find the reference to the family name in the data-preview attribute
    // of the html element.
    try {
        const html: HTMLElement | null = document.getElementsByTagName('html').item(0);
        if (html === null) {
            throw new Error('No html element???');
        }

        const id = html.dataset.preview;
        if (id == undefined) {
            throw new Error('No family id provided');
        }

        // If the specs are not found, an exception is raised in the findFamily function
        const specs: Family = findFamily(id);

        // As its name suggests: finalize the page, ie, set the title, and generate the choices
        finalizePage(specs);

        const go_button = document.getElementById('go');
        if (go_button) {
            go_button.addEventListener('click', (e) => go(e, specs));
        }
    } catch(e) {
        alert(`${e}`)
    }
});

import * as get_urls from './lib/get_urls';
import * as constants from './lib/constants'

async function dummy(e :Event) {
    const URLs :get_urls.URLs = await get_urls.get_data('http://example.org', true);
}

async function main(e :Event) {
    const url      = document.getElementById('url')  as HTMLInputElement;
    const text     = document.getElementById('text') as HTMLInputElement;
    const respec   = !text.checked
    const markdown = document.getElementById('markdown') as HTMLTextAreaElement;


    const URLs :get_urls.URLs = await get_urls.get_data(url.value, respec);

    const result :string = constants.markdown.replace('{preview}', URLs.new).replace('{diff}', URLs.diff);

    markdown.value = result;
}

window.addEventListener('load', () => {
    const go_button = document.getElementById('go');
    go_button.addEventListener('click', main);
});

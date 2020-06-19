import * as get_urls from './lib/get_urls';


async function main() {
    const URLs :get_urls.URLs = await get_urls.get_data(process.argv[2]);
    console.log(JSON.stringify(URLs, null, 4));
}

main();

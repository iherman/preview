import type { Family } from "./multiple_type.ts";

export const dbw: Family = {
    id: "dbw",
    family: "DPP and Business Wallet Vocabularies",
    repo_owner: "w3c",
    repo_name: "vc-dpp-bw",
    parts: [
        {
            path: "bw/index.html",
            title: "Vocabulary for digital product passports",
            short_name: "vc-dpp",
        },
        {
            path: "bw/index.html",
            title: "Vocabulary for business wallets",
            short_name: "vc-bw",
        },
        {
            path: "ucr/index.html",
            title: "Vocabulary use cases and requirements",
            short_name: "vc-dpp-bw-ucr",
        },
    ],
};

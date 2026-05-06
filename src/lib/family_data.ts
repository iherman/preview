/**
 * This is what links the generic solution for families to a specific one.
 * At this moment, epub is the only existing family.
 */
// import type { Family }       from "./multiple_type.ts";
// export type { Family, Part } from "./multiple_type.ts";

export interface Part {
    // Path within the repository
    path: string;

    // Title, to be displayed on the preview page
    title: string;

    // W3C short name, to be used to locate the latest
    // TR document; this is used to create the URL for the 'diff'
    short_name: string;
}

export interface Family {
    // Identification of the family; it is used to locate the family
    // to be displayed. If missing, the `family` is used.
    // Search is done in case independent manner.
    id?: string;

    // This is the identification string of the family; it is
    // used as a title in the preview page
    family: string;

    // The usual strings identifying a GitHub repository...
    repo_owner: string;
    repo_name: string;

    // The document references themselves.
    parts: Part[];
}

// Defining a new family involves adding an import and adding the imported
// value to the array of available families.
import epub from "./families/epub_data.json" with { type: "json" };
import dbw  from "./families/dbw_data.json"  with { type: "json" }

const families: Family[] = [ epub, dbw ];

/* ************************************************************************** */
/**
 * Find the family of specification identified by `id`
 *
 * @param id
 * @returns
 */
export function findFamily(id: string): Family {
    const output: Family | undefined = families.find((f: Family): boolean => {
        if (f.id) {
            return f.id.toLowerCase() === id.toLowerCase();
        } else {
            return f.family.toLowerCase() === id.toLowerCase();
        }
    });
    if (output === undefined) {
        throw new Error(`Unknown family of specification: ${id}`);
    } else {
        return output as Family;
    }
}


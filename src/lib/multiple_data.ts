/**
 * This is what links the generic solution for families to a specific one.
 * At this moment, epub is the only existing family.
 */
import type { Family } from "./multiple_type.ts";
export type { Family, Part } from "./multiple_type.ts";



// Defining a new family involves adding an import and adding the imported
// value to the array of available families.
import { epub }              from "./epub_data.ts";

const families: Family[] = [ epub ];


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


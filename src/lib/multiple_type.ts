export interface Part {
    // Path within the repository
    path       : string;

    // Title, to be displayed on the preview page
    title      : string;

    // W3C short name, to be used to locate the latest
    // TR document; this is used to create the URL for the 'diff'
    short_name : string;
}

export interface Family {
    // Identification of the family; it is used to locate the family
    // to be displayed. If missing, the `family` is used. 
    // Search is done in case independent manner.
    id        ?: string;

    // This is the identification string of the family; it is
    // used as a title in the preview page
    family     : string;
 
    // The usual strings identifying a GitHub repository...
    repo_owner : string;
    repo_name  : string;

    // The document references themselves.
    parts      : Part[];
}

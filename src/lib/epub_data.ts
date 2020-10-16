export interface Part {
    path       :string;
    title      :string;
    short_name :string;
};

export const repo_name = `publ-epub-revision`;

export const parts: Part[] = [
    {
        path       : 'epub33/overview/index.html',
        title      : 'EPUB 3 Overview',
        short_name : 'overview'
    },
    {
        path       : 'epub33/core/index.html',
        title      : 'EPUB 3.3',
        short_name : 'core'
    },
    {
        path       : 'epub33/rs/index.html',
        title      : 'EPUB 3.3 Reading Systems',
        short_name : 'rs'
    },
    {
        path       : 'epub33/a11/index.html',
        title      : 'EPUB Accessibility 1.1',
        short_name : 'a11y'
    }
];
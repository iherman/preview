import { Part } from "./multiple_type.ts";

export const family: string = 'EPUB 3';
export const repo_name: string  = 'epub-specs';
export const repo_owner: string = 'w3c';

export const parts: Part[] = [
    {
        path       : 'epub34/overview/index.html',
        title      : 'EPUB 3 Overview',
        short_name : 'overview',
    },
    {
        path       : 'epub34/authoring/index.html',
        title      : 'EPUB 3.4',
        short_name : 'core',
    },
    {
        path       : 'epub34/rs/index.html',
        title      : 'EPUB 3.4 Reading Systems',
        short_name : 'rs',
    },
    {
        path       : 'epub34/multi-rend/index.html',
        title      : 'EPUB Multiple-Rendition Publications 1.1',
        short_name : 'multi-rend',
    },
    {
        path       : 'epub34/tts/index.html',
        title      : 'EPUB 3 Text-to-Speech Enhancements',
        short_name : 'tts',
    },
    {
        path       : 'epub34/a11y/index.html',
        title      : 'EPUB Accessibility 1.2',
        short_name : 'a11y',
    },
    {
        path       : 'epub34/a11y-tech/index.html',
        title      : 'EPUB Accessibility Techniques',
        short_name : 'a11y-tech',
    },
    {
        path       : 'epub34/epub-a11y-eaa-mapping/index.html',
        title      : 'EPUB Accessibility - EU Accessibility Act Mapping',
        short_name : 'epub-a11y-eaa-mapping',
    },
    {
        path       : 'epub34/a11y-exemption/index.html',
        title      : 'The EPUB Accessibility exemption property',
        short_name : 'a11y-exemption',
    },
    {
        path       : 'epub34/fxl-a11y/index.html',
        title      : 'EPUB Fixed Layout Accessibility',
        short_name : 'fxl-a11y',
    },
    {
        path       : 'epub34/fxl-a11y-tech/index.html',
        title      : 'EPUB Fixed Layout Accessibility Techniques',
        short_name : 'fxl-a11y-tech',
    },
];

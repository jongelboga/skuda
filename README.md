# skuda
[![Build Status](https://travis-ci.org/jongelboga/skuda.svg?branch=master)](https://travis-ci.org/jongelboga/skuda)
[![Coverage Status](https://coveralls.io/repos/github/jongelboga/skuda/badge.svg?branch=master)](https://coveralls.io/github/jongelboga/skuda?branch=master)
[![dependencies Status](https://david-dm.org/jongelboga/skuda/status.svg)](https://david-dm.org/jongelboga/skuda)
[![Known Vulnerabilities](https://snyk.io/test/github/jongelboga/skuda/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jongelboga/skuda?targetFile=package.json)
[![NSP Status](https://nodesecurity.io/orgs/jongelboga/projects/908e9fee-29bd-48b0-891b-5161b2184b48/badge)](https://nodesecurity.io/orgs/jongelboga/projects/908e9fee-29bd-48b0-891b-5161b2184b48)
----

A static site generator

This is early alpha alpha alpha!!! Do not use yet!

### Installation

* Clone repo
* Make sure you have TypeScript: ```npm i -g typescript```
* Make sure you have Yarn: ```npm i -g yarn```
* Run ```npm i``` in the project folder
* For now, the only way of running the code, is by running the tests: ```yarn test```

# How it works

Write your pages as Markdown files, let the parser translate and build your HTML site.

The site generator works woth two main folders:

- site: The source where your Markdown files are located. Can be a folder hierarchy.
- dest: The destination where the HTML files ends up..

Each markdown document is divided into sections. Each section is rendered separately and can have a separate template. We do this make it possible to have different types of content blocks on one page (just as Squarespace or many other modern CMS'es).

You can for example start the page with an image section, having a large image with text on top, followed by a text section, which is markdown rendered to "normal html". In the Markdown document, you separate sections by inserting the markdown code "----" (separator).

To be able to give parameters to the parser, you can add them by starting the line with a colon like this:

```
:key=value
```

## An example page:

Markdown code in "site/index.md":

```markdown
:page = frontpage
:title = Wonderful Plants Inc
:description = We make the best plants in the world

:template=image
:filename=cosy_plant.jpg

Get a plant today

----
:template=text

# What we believe in

We at Wonderful Plants Inc believe that plants improve the life quality of human beings

```

This will be rendered to something like this (simplified) to "dest/index.html":

```html
<html>
    <head>
        <title>Wonderful Plants Inc</title>
        <description>We make the best plants in the world</description>
    </head>
    <body class="template-frontpage">
        <header>
            <navbar /> <!-- navigation system not implemented yet -->
        </header>
        <main>
            <section class="template-image">
                <img src="cosy_plant.jpg" title="Get a plant today">
                <caption>Get a plant today</caption>
            </section>
            <section class="template-text">
                <h1>What we believe in</h1>
                <p>We at Wonderful Plants Inc believe that plant improve the life quality of human beings</p>
            </section>
    </body>
</html>
```

## The flow of the program:

The main structure of the parser program:

```
reader.ts                 generator.ts              page_generator.ts           section_generator.ts             Filesystem
    |                          |                            |                            |                           |
    | <- Reads file hierarchy--|----------------------------|----------------------------|---------------------------|
    |                          |                            |                            |                           |
    | --- Folder tree -------->|                            |                            |                           |
    |                          |For each page:              |                            |                           |
    |                          |------ Page object--------->|                            |                           |
    |                          |                            | For each section:          |                           |
    |                          |                            | --- raw section text ----->|                           |
    |                          |                            |                            |                           |
    |                          |                            |<--------Section object --- |                           |
    |                          |                            |                            |                           |
    |                          |<----RenderedPage object ---|                            |                           |
    |                          |                            |                            |                           |
    |                          |--- Writes file hierarcy ---|----------------------------|-------------------------->|
    |                          |                            |                            |                           |
    |                          |                            |                            |                           |
```

* reader.ts reads the whole file hierarchy and returns a file structure
* generator.ts recursively iterates the file structure and and calls page_generator for each page.
* page_generator.ts generates one page. It will:
    * Split it into sections (by divider ----)
    * Call section_generator.ts fr each section. The section generator will render the Markdown and the HTML template.
    * page_generator will then render the complete page and save it to disk.
* writer.ts writes a page to disk.

To make yourself familiar with the code, read the source files in the following order:
- [index.ts](src/index.ts)
- [reader.ts](src/reader.ts)
- [generator.ts](src/generator.ts)
- [page_generator.ts](src/page_generator.ts)
- [section_generator.ts](src/section_generator.ts)
- [writer.ts](src/writer.ts)

Shared functionality can be found in [utils.ts](src/utils.ts).

# Todo

* Generate files in proper document structure
* Handle media files
    * Rescale images
    * Reformat videos
    * Write them to destination.
* Make a navigation system
* Make a default layout/css
* Make more page and section templates
* Make a "init" system for building a new site strucutre
* Make Node compile a single binary file for easy installation ```</sarcasm>```


# skuda · [![Build Status](https://travis-ci.org/jongelboga/skuda.svg?branch=master)](https://travis-ci.org/jongelboga/skuda) [![dependencies Status](https://david-dm.org/jongelboga/skuda/status.svg)](https://david-dm.org/jongelboga/skuda) [![NSP Status](https://nodesecurity.io/orgs/jongelboga/projects/908e9fee-29bd-48b0-891b-5161b2184b48/badge)](https://nodesecurity.io/orgs/jongelboga/projects/908e9fee-29bd-48b0-891b-5161b2184b48)

A static site generator

This is early alpha alpha alpha!!! Do not use yet!

# How it works

The site generator works woth two main folders:

- site: The source. It is a hierarcical file tree of folders containing markdown files.
- dest: The files, rendered into HTML files ends up here.

Each markdown document is divided into sections, which are renderes separately. We do this, to be able to have different kinds of content on one page (think Squarespace or many modern wiki/document systems). You can for example start the page with an image section, with a large image with text on top, followed by a text section, which is markdown rendered to "normal html". Sections are divided by the markdown code "----" (separator).

To be able to give parameters to the parser, you can add parameters to each section by starting the line with a colon on this format:

```
:key=value
```

## An example page:

Markdown code saved in "site/index.md":

```markdown
:page = frontpage
:title = Wonderful Plants Inc
:description = We make the best plants in the world
----
:template=image
:filename=cosy_plant.jpg

Get a plant today

----
:template=text

# What we believe in

We at Wonderful Plants Inc believe that plant improve the life quality of human beings

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
            <navbar />
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

The main structure of the program:

```
reader.ts              page_generator.ts           section_generator.tx             Filesystem
    |                          |                            |                           |
    | <- Reads file hierarchy--|----------------------------|---------------------------|
    |                          |                            |                           |
    | --- Folder tree -------->|                            |                           |
    |                          | --- raw section text ----->|                           |
    |                          |                            |                           |
    |                          |                            |                           |
    |                          |<--------Section object --- |                           |
    |                          |                            |                           |
    |                          | -- Writes file hierarcy ---|-------------------------->|
    |                          |                            |                           |
    |                          |                            |                           |


                                
```
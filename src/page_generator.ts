import * as fs from 'fs'
import * as path from 'path'
import { Folder, Page } from './reader'
import { mkDir, getTemplate, Properties} from './utils'
import {ParsedSection, generateSection} from './section_generator'

/**
 * Structure describing a parsed page, ready for rendering and then saving.
 * @type {Object}
 */

type ParsedPage = {
	name: string
	properties: Properties
	rendered?: string
	sections: ParsedSection[]
	footer?: string
	footer_rendered?: string
	description?: string
	navbar?: [
		{
			name: string
			uri: string
		}
	]
}

/**
 * Main function to generate a output folder based on a Folder structure.
 * @param {string} outDir Destination folder
 * @param {Folder} folder Folder object.
 */
export function generate(outDir: string, folder: Folder): void {
	const ogFolder = folder

	// Recursive function for traversing the Folder tree structure and
	// generate files.
	function recursiveGen({ pages, folders }: Folder) {

		// Generate each individual page
		const parsedPages: ParsedPage[] = pages.map(page => generatePage(page, ogFolder));

		// Write the pages to disk
		parsedPages.forEach(parsedPage => {
			console.log("WRITE: ", parsedPage.name, parsedPage.rendered)
			fs.writeFileSync(path.join(outDir, `${parsedPage.name}.html`), parsedPage.rendered)
		})

		folders.map(recursiveGen)
	}

	mkDir(outDir)
	recursiveGen(folder)
}

/**
 * Generate and render a page.
 * @param page The page to generate
 * @param folder The folder the page belongs to
 */
function generatePage(page: Page, folder: Folder): ParsedPage {

	console.log("PARSE: ", page.name);

	// Make a result object where we fill in all generated data
	const parsedPage: ParsedPage = <ParsedPage>{
		name: page.name
	}
	parsedPage.properties = {};

	// Split content into sections (we use ---- as section delimiter)
	// and parse+render each section
	const sections = page.rawContent.split('----');
	parsedPage.sections = sections.map(rawSection => generateSection(rawSection) as ParsedSection);

	// The Page Properties are set inside a section. 
	// We need to iterate all of them and move page properties from the section
	// to the page.
	parsedPage.sections.forEach(section => findPageProperties(section.properties, parsedPage.properties));

	// Set the page's template name. User can set it with the parameter "page". If not set, we use a default.
	parsedPage.properties.template = parsedPage.properties.page || 'page';
	
	// Now we have alle the individual parts of the page and can render it.
	parsedPage.rendered = renderPage(parsedPage);

	console.log("PARSED: ", parsedPage.name);
	
	return parsedPage;
}

/**
 * This function will find page properties in section properties object and
 * add them to the page properties object.
 * @param sectionProperties The properties found in  a section
 * @param pageProperties The properties object for the page
 */
function findPageProperties(sectionProperties: Properties, pageProperties: Properties): void {

	// Iterating the properties object (the old fasioned way, since the type restrict usage)
	for(const key in sectionProperties){
		const val = sectionProperties[key];
		switch (key) {
			case 'page':
			case 'description':
				pageProperties[key] = val;
		}
	}
}

/**
 * Render the page's Handlebars template
 * @param params 
 */
function renderPage(parsedPage: ParsedPage): string {
	let template = getTemplate(parsedPage.properties.template);
	return template(parsedPage);
}

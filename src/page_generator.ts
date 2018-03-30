import * as fs from 'fs'
import * as handlebars from 'handlebars'
import * as path from 'path'
import { Folder, Page } from './reader'
import { mkDir } from './utils'
import * as Markdown from 'markdown-it'

/**
 * Markdown parser and renderer.
 */
const md = new Markdown()

/**
 * Structure given to the Template Rendering engine.
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

type ParsedSection = {
	content: String
	properties: Properties,
	rendered?: string
}

type Properties = Map<string, string>;

type TemplateCache = Map<string, Function>;

const templateCache: TemplateCache = new Map();

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
		parsedPages.forEach(page => {
			fs.writeFileSync(path.join(outDir, `${page.name}.html`), page.rendered)
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

	// Make a result object where we fill in all generated data
	const parsedPage: ParsedPage = <ParsedPage>{}
	parsedPage.properties = new Map();

	// Split content into sections (we use ---- as section delimiter)
	// and parse+render each section
	const sections = page.content.split('----');
	parsedPage.sections = sections.map(rawSection => parseSection(rawSection) as ParsedSection);

	// The Page Properties are set inside a section. 
	// We need to iterate all of them and move page properties from the section
	// to the page.
	parsedPage.sections.forEach(section => findPageProperties(section.properties, parsedPage.properties));

	// Now we have alle the individual parts of the page and can render it.
	parsedPage.rendered = getTemplate('page')(parsedPage),

	return parsedPage;
}

/**
 * Translate a section from raw text to a ParsedSection object and
 * render the MD source code with the template defined in the source.
 * @param rawSection Raw text representation fo a section
 */
 function parseSection(rawSection: string): ParsedSection {

	const contentLines: String[] = []
	const sectionProperties: Properties = new Map();
	const lines = rawSection.split(/[\r?\n]/);

	// Split lines into properties and content lines
	lines.forEach(line => {

		// Is it a property line?
		if (parseProperty(line, sectionProperties)) return;

		// Not a property, it is content
		contentLines.push(line);
	})

	return {
		content: contentLines.join("\n"),
		properties: sectionProperties
	}
}

/**
 * Parses a property on the format ":key = value" and add it to the provided properties object.
 * @param line The line to parse
 * @param properties The properties object to add the property to, if existing
 * @returns true if property found, false if not found
 */
function parseProperty(line: string, properties: Properties): boolean {
	if (!line.startsWith(":")) return false;
	if (line.indexOf("=") === -1) return false;

	const tokens: String[] = line.substring(1).split("=");
	if (tokens.length != 2) return false;

	// Set properties to property table
	const key: string = tokens[0].trim();
	const val: string = tokens[1].trim();
	properties.set(key, val);
	return true;
}

/**
 * This function will pick out page properties for a section properties object and
 * add them to the page properties object.
 * @param sectionProperties The properties found in  a section
 * @param pageProperties The properties object for the page
 */
function findPageProperties(sectionProperties: Properties, pageProperties: Properties): void {

	sectionProperties.forEach((key, val) => {
		switch (key) {
			case 'page':
			case 'description':
				pageProperties.set(key, val);
				sectionProperties.delete(key);

		}
	})

}

function renderPage(templateName: string, params: TemplateParameters): string {
	let template = getTemplate(templateName);
	return template(params);

}

function getTemplate(templateName: string): Function {

	// Check if we already have the template loaded from disk
	let template = templateCache.get(templateName);
	if (template) return template;

	// Reading and compiling the main HTML template used to generate pages
	const filepath = path.resolve(__dirname, `../${templateName}.handlebars`)
	const file = fs.readFileSync(filepath).toString();

	// Compile template to a function and store it in cache
	template = handlebars.compile<TemplateParameters>(file);
	templateCache.set(templateName, template);

	return template;
}


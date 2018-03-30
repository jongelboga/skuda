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
type TemplateParameters = {
	name: string
	sections: [
		{
			content: string,
			rendered? : string,
			template?: string
		}
	]
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

type Properties = Map<string, string>;

type TemplateCache = Map<string, Function>;

type ParsedPage = {
	content: string
	properties: Properties,
}

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
		pages
			.map(page => generatePage(page, ogFolder))
			.forEach(page => {
				fs.writeFileSync(path.join(outDir, `${page.name}.html`), page.template)
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
function generatePage(page: Page, folder: Folder) {

	// Split content into sections (we use ---- as section delimiter)
	const sections = page.content.split('----')
	const parsedSections: ParsedPage[] = []
	const pageProperties: Properties = new Map()

	console.log("PAGE: %s consists of %d sections", page.name, sections.length)

	// Split each section into content and properties
	sections.forEach(section => {
	
	
		const contentLines: String[] = []
		const sectionProperties: Properties = new Map();
		const lines = section.split(/[\r?\n]/);

		// Split lines into properties and content lines
		lines.forEach(line => {

			// Is it a property line?
			if(parseProperty(line, sectionProperties)) return;

			// Not a property, it is content
			contentLines.push(line);
		})

		findPageProperties(sectionProperties, pageProperties)
		parsedSections.push({
			content: contentLines.join("\n"),
			properties: sectionProperties
		})
	})

	// Render each section
	return {
		...page,
		sections: parsedSections.map(parseSection)
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
function findPageProperties(sectionProperties: Properties, pageProperties: Properties): void{

	sectionProperties.forEach((key, val) => {
		switch(key){
			case 'page':
			case 'description':
				pageProperties.set(key, val);
				sectionProperties.delete(key);

		}
	})

}

function renderPage(templateName: string, params: TemplateParameters): string{
	let template = getTemplate(templateName);
	return template(params);

}

function getTemplate(templateName: string): Function{

	// Check if we already have the template loaded from disk
	let template = templateCache.get(templateName);
	if(template) return template;

	// Reading and compiling the main HTML template used to generate pages
	const filepath = path.resolve(__dirname, `../${templateName}.handlebars`)
	const file = fs.readFileSync(filepath).toString();

	// Compile template to a function and store it in cache
	template = handlebars.compile<TemplateParameters>(file);
	templateCache.set(templateName, template);

	return template;
}


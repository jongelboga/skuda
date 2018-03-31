/**
 * This file is the main parser and renderer.
 *
 * It takes a Folder structure, returned from 'reader.ts' and
 * iterates it recursively. For each document, it will split it into
 * sections, call the section_generator.ts, which will render each separate
 * part of the page. When the section generator is done, it
 * will render the complete page and save it.
 *
 * TODO: move out file saving and make that into a separate system just
 * like file reading.
 */
import * as fs from 'fs'
import * as path from 'path'
import { Folder, Page } from './reader'
import { generateSection, RenderedSection } from './section_generator'
import { getTemplate, mkDir, Properties } from './utils'

/**
 * Structure describing a parsed page, ready for rendering and then saving.
 * @type {Object}
 */

type ParsedPage = {
	name: string
	properties: Properties
	sections: RenderedSection[]
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

type RenderedPage = ParsedPage & {
	rendered: string
}

/**
 * Main function to generate a output folder based on a Folder structure.
 * @param {string} outDir Destination folder
 * @param {Folder} folder Folder object.
 */
export function generate (outDir: string, folder: Folder): void {
	const ogFolder = folder

	// Recursive function for traversing the Folder tree structure and
	// generate files.
	function recursiveGen ({ pages, folders }: Folder) {

		// Generate each individual page
		const renderedPages: RenderedPage[] = pages.map (page => generatePage (page, ogFolder))

		// Write the pages to disk
		renderedPages.forEach (renderedPage => {
			fs.writeFileSync (path.join (outDir, `${renderedPage.name}.html`), renderedPage.rendered)
		})

		// Recuresively generate all sub folders
		folders.map (recursiveGen)
	}

	mkDir (outDir)
	recursiveGen (folder)
}

/**
 * Generate and render a page.
 * @param page The page to generate
 * @param folder The folder the page belongs to
 */
function generatePage (page: Page, folder: Folder): RenderedPage {

	// Make a result object where we fill in all generated data
	const parsedPage: ParsedPage = {name: page.name} as ParsedPage
	parsedPage.properties = {}

	// Split content into sections (we use ---- as section delimiter)
	// and parse+render each section
	const sections = page.rawContent.split ('----')
	parsedPage.sections = sections.map (rawSection => generateSection (rawSection) as RenderedSection)

	// The Page Properties are set inside a section.
	// We need to iterate all of them and move page properties from the section
	// to the page.
	parsedPage.sections.forEach (section => findPageProperties (section.properties, parsedPage.properties))

	// Set the page's template name. User can set it with the parameter 'page'. If not set, we use a default.
	parsedPage.properties.template = parsedPage.properties.page || 'page'

	// Now we have alle the individual parts of the page and can render it.
	const renderedPage: RenderedPage = renderPage (parsedPage)

	return renderedPage
}

/**
 * This function will find page properties in section properties object and
 * add them to the page properties object.
 * @param sectionProperties The properties found in  a section
 * @param pageProperties The properties object for the page
 */
function findPageProperties (sectionProperties: Properties, pageProperties: Properties): void {

	// Iterating the properties object (the old fasioned way, since the type restrict usage)
	for (const key in sectionProperties) {
		if (!key) continue
		const val = sectionProperties[key]
		if (!val) continue

		switch ( key ) {
			case 'page':
			case 'description':
				pageProperties[key] = val
		}
	}
}

/**
 * Render the page's Handlebars template
 * @param params
 */
function renderPage (parsedPage: ParsedPage): RenderedPage {
	const template = getTemplate (parsedPage.properties.template)
	return {
		...parsedPage,
		rendered: template (parsedPage)
	}
}

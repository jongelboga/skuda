/**
 * This file is the main page parser.
 *
 * It takes in a raw page and creates a ParsedPage object. It will split it into
 * sections, call the section_generator.ts, which will render each separate
 * part of the page. When the section generator is done, it
 * will render the complete page and save it.
 *
 * TODO: move out file saving and make that into a separate system just
 * like file reading.
 */
import * as fs from 'fs-extra'
import { File, Folder } from './reader'
import { generateSection, RenderedSection } from './section_generator'
import { addProperty, getTemplate, Properties } from './utils'

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
	],
	folder: Folder
}

export type RenderedPage = ParsedPage & {
	rendered: string
}

/**
 * Generate and render a page.
 * @param page The page to generate
 * @param folder The folder the page belongs to
 */
export async function generatePage (page: File, folder: Folder): Promise<RenderedPage> {
	const rawContent = await fs.readFile(page.path)
	// Split content into sections (we use ---- as section delimiter)
	// and parse+render each section
	const sections = rawContent.toString().split('----')

	// Make a result object where we fill in all generated data
	const parsedPage: ParsedPage = {
		name: page.name,
		properties: {
			template: 'page'
		},
		sections: sections.map(rawSection => generateSection(rawSection)),
		folder
	}

	// The Page Properties are set inside a section.
	// We need to iterate all of them and move page properties from the section
	// to the page.
	parsedPage.sections = parsedPage.sections.map(section => ({
		...section,
		properties: findPageProperties(section.properties, parsedPage.properties)
	}))

	// Set the page's template name, if set in properties
	parsedPage.properties.template = parsedPage.properties.page || parsedPage.properties.template

	// Now we have all the individual parts of the page and can render it.
	return renderPage(parsedPage)
}

/**
 * This function will find page properties in section properties object and
 * add them to the page properties object.
 * @param sectionProperties The properties found in  a section
 * @param pageProperties The properties object for the page
 */
export function findPageProperties (sectionProperties: Properties, pageProperties: Properties): Properties {
	const validKeys = ['page', 'description']
	return Object
		.entries(sectionProperties)
		.filter(([key, value]) => validKeys.includes(key) && value)
		.reduce(
			(a, [key, value]) => addProperty(a, key, value),
			{ ...pageProperties }
		)
}

/**
 * Render the page's Handlebars template
 * @param params
 */
function renderPage (parsedPage: ParsedPage): RenderedPage {
	const template = getTemplate(parsedPage.properties.template)
	return {
		...parsedPage,
		rendered: template(parsedPage)
	}
}

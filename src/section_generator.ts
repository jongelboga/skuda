import { getTemplate, md, Properties } from './utils'

/**
 * Type describing each section of the page.
 */
export type ParsedSection = {
	content: string
	properties: Properties,
	rendered?: string,
	template: string,
	html: string
}

export type RenderedSection = ParsedSection & {
	rendered: string
}

/**
 * Translate a section from raw text to a ParsedSection object and
 * render the MD source code with the template defined in the source.
 * @param rawSection Raw text representation fo a section
 */
export function generateSection (rawSection: string): RenderedSection {

	const contentLines: string[] = []
	const sectionProperties: Properties = {}
	const lines = rawSection.split (/[\r?\n]/)

	// Split lines into properties and content lines
	lines.forEach (line => {

		// Is it a property line?
		if (parseProperty (line, sectionProperties)) return

		// No, it is not a property. Then it must be content.
		contentLines.push (line)
	})

	// Join MD content and render to HTML
	const content = contentLines.join ('\n')
	const html = md.render(content);

	// Build a ParsedSection object
	const parsedSection: ParsedSection =  {
		content: content,
		properties: sectionProperties,
		template: sectionProperties.template || 'text',
		html: html
	}

	// Render template and return a RenderedSection
	return {
		...parsedSection,
		rendered: getTemplate(parsedSection.template)(parsedSection)
	}
}

/**
 * Parses a property on the format ':key = value' and add it to the provided properties object.
 * @param line The line to parse
 * @param properties The properties object to add the property to, if existing
 * @returns true if property found, false if not found
 */
function parseProperty (line: string, properties: Properties): boolean {

	// Check if the line is a property
	if (!line.startsWith (':')) return false
	if (line.indexOf ('=') === -1) return false

	// Split the property into key and value
	const tokens: string[] = line.substring (1).split ('=')
	if (tokens.length !== 2) return false
	const key: string = tokens[0].trim ()
	const val: string = tokens[1].trim ()

	// Set properties to property table
	properties[key] = val
	return true
}

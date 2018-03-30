import * as fs from 'fs'
import * as handlebars from 'handlebars'
import * as Markdown from 'markdown-it'
import * as path from 'path'

type TemplateCache = Map<string, HandlebarsTemplateDelegate>

export type Properties = {[s: string]: string}

// Internal storage
const templateCache: TemplateCache = new Map ()


/**
 * Markdown parser and renderer.
 */
export const md = new Markdown ()


// Helper function to make output folder
// TODO: check existanse instead of relying on catching error.
export function mkDir (p: string) {
	try {
		fs.mkdirSync (p)
	} catch (err) {
		const error: NodeJS.ErrnoException = err
		if (error.code === 'EEXIST') {
			// TODO: Remove directory
		}
		else {
			throw error
		}
	}
}

export function getTemplate (templateName: string): HandlebarsTemplateDelegate {

	// Check if we already have the template loaded from disk
	if (templateCache.has (templateName) ) {
		return templateCache.get (templateName)
	}

	// Reading and compiling the main HTML template used to generate pages
	const filepath = path.resolve (__dirname, `../${templateName}.handlebars`)
	const template = fs.readFileSync (filepath).toString ()

	console.log ('LOADED TEMPLATE %s: \n %s', templateName, template)

	// Compile template to a function and store it in cache
	const compiled = handlebars.compile (template)
	templateCache.set (templateName, compiled)

	return compiled
}

/**
 * Get the main name of a file. Example:
 * "/home/marius/Cool presentation.pages" will return "Cool presentation"
 * @param name Filename (can include full path)
 */
export function sanitizeName (name: string): string {
   const result = nameFromPath.exec (name)
   if (!result) return name
   return result[1]
}

// Precompiled Regex
const nameFromPath = / ([^./]+)[.]*[\\d\\D]*$/

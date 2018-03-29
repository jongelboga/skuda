import * as fs from 'fs'
import * as handlebars from 'handlebars'
import * as path from 'path'
import { Folder, Page } from './reader'
import {mkDir} from './utils'
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
	rendered: string
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

// Reading and compiling the main HTML template used to generate pages
const filepath = path.resolve(__dirname, '../template.handlebars')
const file = fs.readFileSync(filepath).toString()
const template = handlebars.compile<TemplateParameters>(file)


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

function generatePage (page: Page, folder: Folder) {
	return {
		...page,
		template: template({
			name: page.name,
			rendered: md.render(page.content),

		})
	}
}

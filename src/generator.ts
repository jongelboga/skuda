import * as fs from 'fs'
import * as handlebars from 'handlebars'
import * as path from 'path'
import { Folder, Page } from './utils'

/**
 * Structure given to the Template Rendering engine
 * @type {Object}
 */
type TemplateParameters = {
	name: string
	rendered: string
}

// Reading and compiling the main HTML template used to generate pages
const filepath = path.resolve(__dirname, '../template.handlebars')
const file = fs.readFileSync(filepath).toString()
const template = handlebars.compile<TemplateParameters>(file)

// Helper function to make output folder
// TODO: check existanse instead of relying on catching error.
function mkDir (p: string) {
	try {
		fs.mkdirSync(p)
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

/**
 * Main function to generate a output folder based on a Folder structure.
 * Called recursively.
 * @param {string} outDir Destination folder
 * @param {Folder} folder Folder object.
 */
export function generate (outDir: string, folder: Folder): void {
	const ogFolder = folder
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
			rendered: page.rendered
		})
	}
}

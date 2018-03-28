import * as fs from 'fs'
import * as handlebars from 'handlebars'
import * as path from 'path'
import { Folder, Page } from './utils'

type TemplateParameters = {
	name: string
	rendered: string
}

const filepath = path.resolve(__dirname, '../template.handlebars')
const file = fs.readFileSync(filepath).toString()
const template = handlebars.compile<TemplateParameters>(file)

const outDir = path.resolve(__dirname, '../dist/')


export function generate (folder: Folder, originalFolder?: Folder): void {
	const ogFolder = originalFolder || folder
	folder.pages
		.map(page => generatePage(page, ogFolder))
		.forEach(page => {
			fs.writeFileSync(path.join(outDir, `${page.name}.html`), page.template)
		})
	folder.folders.map(f => generate(f, ogFolder))
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

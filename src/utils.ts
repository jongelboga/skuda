import * as fs from 'fs'
import * as Markdown from 'markdown-it'
import * as path from 'path'

type File = {
	name: string
	path: string
}

export type Page = File & {
	content: string
	rendered: string
}

export type Folder = File & {
	pages: Page[]
	folders: Folder[]
}


const md = new Markdown()

export function readDir (dir: string, name?: string): Folder {
	const isDir = (p: string) => fs.lstatSync(p).isDirectory()

	const paths = fs.readdirSync(dir).map<File>(p => ({
		name: p,
		path: path.join(dir, p) }
	))
	const folders = paths.filter(p => isDir(p.path))
	const pages = paths.filter(p => !isDir(p.path))

	return {
		name: name || dir.split('/').pop() as string,
		path: dir,
		pages: pages
			.map(f => ({ ...f, content: fs.readFileSync(f.path).toString() }))
			.map(f => ({ ...f, rendered: md.render(f.content) })),
		folders: folders.map(folder => readDir(folder.path, folder.name))
	}
}

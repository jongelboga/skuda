import * as fs from 'fs'
import * as Markdown from 'markdown-it'
import * as path from 'path'

/**
 * All files are of type File
 */
type File = {
	name: string
	path: string
}

/**
 * Files that are going to be rendered as web pages, are of type Page.
 */
export type Page = File & {
	content: string
	rendered: string
}

/**
 * Media files. When generating the structure, the generator may need
 * to rescale and convert files to different formats.
 */
export type Media = File & {
	absolutePath: string
	contentType: string
}


/**
 * Files that are sub folders, containing pages, are of type Folder.
 * @type {[type]}
 */
export type Folder = File & {
	pages: Page[]
	folders: Folder[]
}

/**
 * Markdown parser and renderer.
 */
const md = new Markdown()

/**
 * Read a directory including subdirectories and building a three object
 * containing all pages and subdirectories. The function is recursive.
 * TODO:
 * - Add support for media (images, video, etc)
 * - Beautify file names (remove ending, like .md, etc, convert _ to space, etc)
 * -
 * @param  {string} dir  The directory to parse
 * @param  {string} name The name of the file "dir" is ponting to
 * @return {Folder}      Return a Folder object containing pages and sub folders
 */
export function readDir (dir: string, name?: string): Folder {
	const isDir = (p: string) => fs.lstatSync(p).isDirectory()

	// Read all files in the directory
	const paths = fs.readdirSync(dir).map<File>(p => ({
		name: p,
		path: path.join(dir, p) }
	))

	// Filter out folders and pages
	const folders = paths.filter(p => isDir(p.path))
	const pages = paths.filter(p => !isDir(p.path))

	// Construct and return the Folder object.
	// - Page files are read and rendered from MD to HTML.
	// - Folders are recursively calling this function to make the sub structure.
	return {
		name: name || dir.split('/').pop() as string,
		path: dir,
		pages: pages
			.map(f => ({ ...f, content: fs.readFileSync(f.path).toString() }))
			.map(f => ({ ...f, rendered: md.render(f.content) })),
		folders: folders.map(folder => readDir(folder.path, folder.name))
	}
}

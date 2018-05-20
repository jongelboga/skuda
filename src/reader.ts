/**
 * This file read the source file structure and makes an hierarchical
 * structure based on the File, Folder and Page types defined under.
 *
 * Since this system is a static site generator, run by the author/admin,
 * not when the user is requesting the page, all file operations are done
 * in sync.
 *
 * Main function is generate(folderName). It will start read files from
 * the given folder.
 *
 */
import * as fs from 'fs-extra'
import * as path from 'path'
import { sanitizeName } from './utils'


/**
 * All files are of type File
 */
export interface File {
	name: string
	path: string
	uri: string
}

/**
 * Media files. When generating the structure, the generator may need
 * to rescale and convert files to different formats.
 */
export interface Media extends File {
	absolutePath: string
	contentType: string
}

/**
 * Files that are sub folders, containing pages, are of type Folder.
 */
export interface Folder extends File {
	pages: File[]
	folders: Folder[]
}

export interface SimpleFile {
	path: string
}
export interface SimpleFolder extends SimpleFile {
	files: string[]
	folders: SimpleFolder[]
}

const isDir = (p: string) => fs.lstatSync(p).isDirectory()

export async function getPaths (directory: string): Promise<SimpleFolder> {
	const paths = (await fs
		.readdir(directory))
		.map(p => path.join(directory, p))

	return {
		path: directory,
		files: paths.filter(p => !isDir(p)),
		folders: await Promise.all(paths
			.filter(isDir)
			.map(getPaths))
	}
}

/**
 * Read a directory including subdirectories and building a three object
 * containing all pages and subdirectories. The function is recursive.
 * TODO:
 * - Add support for media (images, video, etc)
 * - Beautify file names (remove ending, like .md, etc, convert _ to space, etc)
 * -
 * @param  {string} directory  The directory to parse
 * @return {Folder}      Return a Folder object containing pages and sub folders
 */
export function parseDir (rootFolder: SimpleFolder): Folder {
	function _parseDir (folder: SimpleFolder): Folder {
		return {
			name: sanitizeName(folder.path),
			path: folder.path,
			uri: path.relative(rootFolder.path, folder.path),
			pages: folder.files
				.filter(file => path.extname(file) === '.md')
				.map(file => ({
					name: sanitizeName(file),
					path: file,
					uri: path.relative(rootFolder.path, file)
				})),
			folders: folder.folders.map(_parseDir)
		}
	}

	return _parseDir(rootFolder)
}

/**
 * Read a directory including subdirectories and building a three object
 * containing all pages and subdirectories. The function is recursive.
 * TODO:
 * - Add support for media (images, video, etc)
 * - Beautify file names (remove ending, like .md, etc, convert _ to space, etc)
 * -
 * @param  {string} directory  The directory to parse
 * @param  {string} sitename   The name of the website. If omitted It will use the name of the folder
 * @return {Folder}      Return a Folder object containing pages and sub folders
 */
export async function readDir (directory: string, sitename?: string): Promise<Folder> {
	const paths = await getPaths(directory)
	const folder = parseDir(paths)
	if (sitename)
		folder.name = sitename
	return folder
}

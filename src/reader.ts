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
export interface Folder extends File  {
	pages: File[]
	folders: Folder[]
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
	async function _readDir (dir: string, name?: string): Promise<Folder> {
		const isDir = (p: string) => fs.lstatSync(p).isDirectory()

		// Read all files in the directory
		const paths = (await fs.readdir(dir)).map(p => ({
			name: sanitizeName(p),
			path: path.join(dir, p),
			uri: path.join(path.relative(directory, dir), p)
		}))

		// Construct and return the Folder object.
		// - Folders are recursively calling this function to make the sub structure.
		return {
			name: name || sanitizeName(dir),
			path: dir,
			uri:  path.relative(directory, dir),
			pages: paths.filter(p => !isDir(p.path)),
			folders: await Promise.all(paths
				.filter(p => isDir(p.path))
				.map(folder => _readDir(folder.path, folder.name)))
		}
	}

	return _readDir(directory, sitename)
}

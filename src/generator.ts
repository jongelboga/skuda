/**
 * This file is the main parser and renderer.
 *
 * It takes a Folder structure, returned from 'reader.ts' and
 * iterates it recursively. For each document, it will call
 * page_generator.ts
 *
 * TODO: move out file saving and make that into a separate system just
 * like file reading.
 */
import { generatePage, RenderedPage } from './page_generator'
import { Folder } from './reader'
import writer from './writer'

/**
 * Main function to generate a output folder based on a Folder structure.
 * @param {string} outDir Destination folder
 * @param {Folder} folder Folder object.
 */
export async function generate (outDir: string, rootFolder: Folder): Promise<void> {

	const writePage = writer(outDir)

	// Recursive function for traversing the Folder tree structure and
	// generate files.
	async function recursiveGen (folder: Folder) {

		const pages = folder.pages
		const folders = folder.folders

		// Generate each individual page
		const renderedPages: RenderedPage[] = await Promise.all(pages.map(page => generatePage(page, folder, rootFolder)))

		// Write the pages to disk
		renderedPages.forEach(writePage)

		// Recuresively generate all sub folders
		folders.map(recursiveGen)
	}

	recursiveGen(rootFolder)
}

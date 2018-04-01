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
import {generatePage, ParsedPage, RenderedPage} from './page_generator'
import { Folder, Page } from './reader'
import writer from './writer'

/**
 * Main function to generate a output folder based on a Folder structure.
 * @param {string} outDir Destination folder
 * @param {Folder} folder Folder object.
 */
export function generate (outDir: string, folder: Folder): void {

	const writePage = writer(outDir)
	const ogFolder = folder

	// Recursive function for traversing the Folder tree structure and
	// generate files.
	function recursiveGen ({ pages, folders }: Folder) {

		// Generate each individual page
		const renderedPages: RenderedPage[] = pages.map (page => generatePage (page, ogFolder))

		// Write the pages to disk
		renderedPages.forEach (writePage)

		// Recuresively generate all sub folders
		folders.map (recursiveGen)
	}

	recursiveGen (folder)
}

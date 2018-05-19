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
import { Folder, readDir } from './reader'
import writer, { Writer } from './writer'

export default async function generate (srcPath: string, outDir: string) {
	const folder = await readDir(srcPath)
	const writePage = writer(outDir)
	recursiveGen(folder, writePage)
}

// Recursive function for traversing the Folder tree structure and
// generate files.
async function recursiveGen (f: Folder, writePage: Writer) {

	// Generate each individual page
	const renderedPages: RenderedPage[] = await Promise.all(f.pages.map(page => generatePage(page, f)))
	// Write the pages to disk
	renderedPages.forEach(writePage)

	// Recuresively generate all sub folders
	f.folders.forEach(folder => recursiveGen(folder, writePage))
}

/**
 * This file handles writing to disk.
 *
 * For now it is very simple...
 */
import * as fs from 'fs'
import * as path from 'path'
import { RenderedPage } from './page_generator'
import { mkDir } from './utils'

/**
 * Make a new writer
 * @param  {[type]} out: string        [description]
 * @return {[type]}      [description]
 */
export default function writer (rootDir: string) {

	mkDir(rootDir)

	/*
     * Write a rendered page to disk.
     *
     * @param  {[type]} renderedPage RenderedPage  Page to write
     */
	function writePage (renderedPage: RenderedPage): void {
		console.log('WRITE PAGE: ', renderedPage.name)
		// TODO: outdir should be rootDir + current dir
		const outDir = rootDir
		const fileName = `${renderedPage.name}.html`
		// const filePath = path.join(outDir, fileName)

		// console.log(outDir, fileName, filePath)

		fs.writeFileSync(fileName, renderedPage.rendered)
	}

	return writePage
}

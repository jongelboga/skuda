/**
 * This file handles writing to disk.
 *
 * For now it is very simple...
 */
import * as fs from 'fs'
import * as path from 'path'
import {RenderedPage} from './page_generator'
import {mkDir} from './utils'

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

		// TODO: outdir should be rootDir + current dir
		const outDir = rootDir

		fs.writeFileSync(path.join(outDir, `${renderedPage.name}.html`), renderedPage.rendered)
	}

	return writePage
}

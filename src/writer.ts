/**
 * This file handles writing to disk.
 *
 * For now it is very simple...
 */
import { ensureDirSync, writeFileSync } from 'fs-extra'
import * as path from 'path'
import { RenderedPage } from './page_generator'

/**
 * Make a new writer
 * @param  {[type]} out: string        [description]
 * @return {[type]}      [description]
 */
export default function writer (rootDir: string) {
	ensureDirSync(rootDir)

	/*
     * Write a rendered page to disk.
     *
     * @param  {[type]} renderedPage RenderedPage  Page to write
     */
	function writePage (renderedPage: RenderedPage): void {
		const outDir = path.join(rootDir, renderedPage.folder.uri)
		ensureDirSync(outDir)
		writeFileSync(path.join(outDir, `${renderedPage.name}.html`), renderedPage.rendered)
	}

	return writePage
}

/**
 * This file handles writing to disk.
 *
 * For now it is very simple...
 */
import { ensureDirSync, readFileSync, writeFileSync } from 'fs-extra'
import * as path from 'path'
import { RenderedPage } from './page_generator'
import { Media } from './reader'

export type Writer = {
	writePage: (page: RenderedPage) => void
	writeMedia: (media: Media) => void
}

/**
 * Make a new writer
 * @param  {[type]} out: string        [description]
 * @return {[type]}      [description]
 */
export default function writer (rootDir: string): Writer {
	ensureDirSync(rootDir)

	/*
     * Write a rendered page to disk.
     *
     * @param  {[type]} renderedPage RenderedPage  Page to write
     */
	function writePage (renderedPage: RenderedPage) {
		const outDir = path.join(rootDir, renderedPage.folder.uri)
		ensureDirSync(outDir)
		writeFileSync(path.join(outDir, `${renderedPage.name}.html`), renderedPage.rendered)
	}

	function writeMedia (media: Media) {
		const outPath = path.join(rootDir, media.uri)
		ensureDirSync(path.dirname(outPath))
		writeFileSync(outPath, readFileSync(media.path))
	}

	return {
		writePage,
		writeMedia
	}
}

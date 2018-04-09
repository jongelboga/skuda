import * as fs from 'fs-extra'
import * as fsMock from 'mock-fs'
import * as path from 'path'
import { getPaths, SimpleFolder } from '../../src/reader'
import { addProperty } from '../../src/utils'
import { ROOT_DIR } from '../constants'

function parseFolder (folder: SimpleFolder, obj = {}): fsMock.Config {
	const folderObj = {}
	folder.files.forEach(f => addProperty(folderObj, path.relative(folder.path, f), fs.readFileSync(f)))
	folder.folders.forEach(f => addProperty(folderObj, path.relative(folder.path, f.path), parseFolder(f)))
	return folderObj
}

export async function mockFs () {
	const folder = await getPaths(ROOT_DIR)
	const templates = await getPaths(path.resolve(__dirname, '../../templates'))
	const mockObj = addProperty({}, folder.path, parseFolder(folder))
	addProperty(mockObj, templates.path, parseFolder(templates))
	fsMock(mockObj)
}

export const restoreFs = fsMock.restore

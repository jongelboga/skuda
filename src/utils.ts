import * as fs from 'fs'
import * as path from 'path'

export type Folder = {
	name: string
	pages: string[]
	folders: Folder[]
}

export function readDir (dir: string): Folder {
	const isDir = (p: string) => fs.lstatSync(p).isDirectory()

	const paths = fs.readdirSync(dir).map(p => path.join(dir, p));
	const folders = paths.filter(isDir)
	const pages =  paths.filter(p => !isDir(p))

	return {
		name: dir,
		pages,
		folders: folders.map(readDir)
	}
}

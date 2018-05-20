import { SimpleFolder } from '../../src/reader'

type Predicate = (f: SimpleFolder) => boolean

export function findFolder (folder: SimpleFolder, predictate: Predicate): SimpleFolder | undefined {
	return predictate(folder)
		? folder
		: folder.folders
			.map(f => findFolder(f, predictate))
			.find(f => f !== undefined)
}

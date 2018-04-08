import * as path from 'path'
import { File, Folder, getPaths, parseDir, readDir, SimpleFile, SimpleFolder } from '../src/reader'
import { sanitizeName } from '../src/utils'
import { ROOT_DIR } from './constants'

const expectedFolder: Folder = {
	name: 'Content',
	path: ROOT_DIR,
	uri: '',
	pages: [
		  {
			name: 'About',
			path: path.join(ROOT_DIR, 'About.md'),
			uri: 'About.md'
		}
	],
	folders: [
		{
			name: 'Projects',
			path: path.join(ROOT_DIR, 'Projects'),
			uri: 'Projects',
			pages: [
				{
					name: '01',
					path: path.join(ROOT_DIR, 'Projects', '01.md'),
					uri: path.join('Projects', '01.md')
				},
				{
					name: '02',
					path: path.join(ROOT_DIR, 'Projects', '02.md'),
					uri: path.join('Projects', '02.md')
				}
			],
			folders: []
		}
	]
}

describe(readDir, () => {
	it('reads and parses folder', async () => {
		const result = await readDir(ROOT_DIR)
		expect(result).toEqual(expectedFolder)
	})

	it('sets name to sitename if provided', async () => {
		const sitename = 'My Site'
		const result = await readDir(ROOT_DIR, sitename)
		expect(result.name).toEqual(sitename)
	})

	it('fallbacks to pretty version of folder name if sitename is not provided', async () => {
		const result = await readDir(ROOT_DIR)
		const sitename = sanitizeName(ROOT_DIR)
		expect(result.name).toEqual(sitename)
	})
})

describe(parseDir, () => {
	it('parses folder', async () => {
		const paths = await getPaths(ROOT_DIR)
		const result = parseDir(paths)

		expect(result).toEqual(expectedFolder)
	})
})


describe(getPaths, () => {
	it('reads folder', async () => {
		const result = await getPaths(ROOT_DIR)

		const expected: SimpleFolder = {
			path: ROOT_DIR,
			files: [path.join(ROOT_DIR, 'About.md')],
			folders: [
				{
					path: path.join(ROOT_DIR, 'Projects'),
					files: [
						path.join(ROOT_DIR, 'Projects', '01.md'),
						path.join(ROOT_DIR, 'Projects', '02.md')
					],
					folders: []
				}
			]
		}

		expect(result).toEqual(expected)
	})
})


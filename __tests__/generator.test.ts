import * as path from 'path'
import { generate } from '../src/generator'
import { getPaths, readDir, SimpleFolder } from '../src/reader'
import { ROOT_DIR } from './constants'

it('writes to folder', async () => {
	const folder = await readDir(ROOT_DIR)
	const out = path.join(__dirname, 'dist')
	await generate(out, folder)
})

it('writes to folder with correct structure', async () => {
	const folder = await readDir(ROOT_DIR)
	const out = path.join(__dirname, 'dist')

	await generate(out, folder)

	const result = await getPaths(out)
	const expected: SimpleFolder = {
		path: out,
		files: [path.join(out, 'About.html')],
		folders: [
			{
				path: path.join(out, 'Projects'),
				files: [
					path.join(out, 'Projects', '01.html'),
					path.join(out, 'Projects', '02.html')
				],
				folders: []
			}
		]
	}
	expect(result).toEqual(expected)
})

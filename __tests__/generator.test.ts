import * as path from 'path'
import generate from '../src/generator'
import { getPaths, SimpleFolder } from '../src/reader'
import { ROOT_DIR } from './constants'
import { mockFs, restoreFs } from './utils'
import { findFolder } from './utils'

beforeEach(mockFs)
afterEach(restoreFs)

describe(generate, () => {

	it('writes to folder with correct structure', async () => {
		const out = path.join(__dirname, 'dist')

		await generate(ROOT_DIR, out)

		const paths = await getPaths(path.resolve('/'))
		const result = findFolder(paths, f => f.path === out)

		const expected: SimpleFolder = {
			path: out,
			files: [path.join(out, 'About.html')],
			folders: [
				{
					path: path.join(out, 'Projects'),
					files: [
				  		path.join(out, 'Projects', '01.html'),
				  		path.join(out, 'Projects', '02.html'),
				  		path.join(out, 'Projects', 'house.jpg')
					],
					folders: []
			  	}
			]
		}

		expect(result).toEqual(expected)
	})

})

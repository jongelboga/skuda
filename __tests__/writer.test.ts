import * as mockFs from 'mock-fs'
import * as path from 'path'
import { RenderedPage } from '../src/page_generator'
import { getPaths } from '../src/reader'
import writer from '../src/writer'

beforeEach(() => mockFs())
afterEach(mockFs.restore)

describe(writer, () => {

	it('writes file', async () => {
		const out = path.join(__dirname, 'dist')
		const page: RenderedPage = {
			name: 'My Page',
			folder: {
				name: 'Folder',
				pages: [],
				path: path.join(out, 'Folder'),
				uri: 'Folder',
				folders: []
			},
			rendered: '<html><body>Hello</body></html>',
			sections: [],
			properties: {}
		}

		const write = writer(out)
		write(page)

		const result = await getPaths(out)
		const expected = {
			files:  [],
			folders: [
				{
					files: [
						path.join(page.folder.path, `${page.name}.html`)
					],
					folders: [],
					path: page.folder.path
				}
			],
			path: out
		}

		expect(result).toEqual(expected)
	})

})


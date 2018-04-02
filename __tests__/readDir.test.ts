import * as path from 'path'
import { File, Folder, readDir } from '../src/reader'
import { ROOT_DIR } from './constants'

it('parses folder', async () => {
	const result = await readDir(ROOT_DIR)

	const expected: Folder = {
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

	expect(result).toEqual(expected)
})

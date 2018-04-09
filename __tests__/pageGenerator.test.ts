import * as path from 'path'
import { findPageProperties, generatePage, RenderedPage } from '../src/page_generator'
import { Folder } from '../src/reader'
import { ROOT_DIR } from './constants'
import { mockFs, restoreFs } from './utils'

beforeEach(mockFs)
afterEach(restoreFs)

describe(findPageProperties, () => {
	it('should add section props to page props', () => {
		const sectionProperties = { description: 'descValue', page: 'pageValue'}
		const pageProperties = { prop1: 'value1'}
		const result = findPageProperties(sectionProperties, pageProperties)

		expect(result).toEqual({ ...sectionProperties, ...pageProperties })
	})
})

describe(generatePage, () => {
	it('should generate correct properties and folder', async () => {
		const page = {
			name: '01',
			path: path.join(ROOT_DIR, 'Projects', '01.md'),
			uri: path.join('Projects', '01.md')
		}

		const folder: Folder =  {
			name: 'Projects',
			path: path.join(ROOT_DIR, 'Projects'),
			uri: 'Projects',
			pages: [page],
			folders: []
		}

		const result = await generatePage(page, folder)

		const expected: RenderedPage = {
			name: page.name,
			properties: {
				template: 'page'
			},
			sections: result.sections,
			folder,
			rendered: result.rendered
		}

		expect(result).toEqual(expected)
	})
})

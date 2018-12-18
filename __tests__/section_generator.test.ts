import * as fs from 'fs-extra'
import * as path from 'path'
import { generateSection, RenderedSection } from '../src/section_generator'
import { ROOT_DIR } from './constants'
import { mockFs, restoreFs } from './utils'

beforeEach(mockFs)
afterEach(restoreFs)

describe(generateSection, () => {
	it('should add section props to page props', async () => {
		const file = await fs.readFile(path.join(ROOT_DIR, 'Projects/01.md'))

		const result = generateSection(file.toString())

		const expected: RenderedSection = {
			...result,
			template: 'image',
			properties: {
				page: 'page',
				description: 'This is the cool test page',
				template: 'image',
				filename: 'house.jpg'
			}
		}
		expect(result).toEqual(expected)
	})
})

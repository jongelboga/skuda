import * as fs from 'fs-extra'
import * as fsMock from 'mock-fs'
import * as path from 'path'
import { restoreFs } from './utils'

beforeEach(() => fsMock())
afterEach(restoreFs)

describe('mockfs', () => {

	it('writes to folder with correct structure', () => {
		fs.mkdirpSync('hello')
		fs.writeFileSync(path.join('hello', 'world.txt'), 'i am a file')
		const dir = fs.readdirSync('hello')
		expect(dir).toEqual([ 'world.txt' ])
	})

})

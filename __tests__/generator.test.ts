import * as path from 'path'
import { generate } from '../src/page_generator'
import { readDir } from '../src/reader'
import { ROOT_DIR } from './constants'

it('writes to folder', () => {
	const folder = readDir(ROOT_DIR)
	const out = path.join(__dirname, 'dist')
	generate(out, folder)
})

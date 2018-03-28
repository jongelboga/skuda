import * as path from 'path'
import { generate } from '../src/generator'
import { readDir } from '../src/utils'
import { ROOT_DIR } from './constants'

it('writes to folder', () => {
	const folder = readDir(ROOT_DIR)
	const out = path.join(__dirname, 'dist')
	generate(out, folder)
})

import * as path from 'path'
import { generate } from '../src/generator'
import { readDir } from '../src/reader'
import { ROOT_DIR } from './constants'

it('writes to folder', async () => {
	const folder = await readDir(ROOT_DIR)
	const out = path.join(__dirname, 'dist')
	await generate(out, folder)
})

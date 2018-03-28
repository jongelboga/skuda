import * as path from 'path'
import { generate } from '../src/generator'
import { readDir } from '../src/utils'

const rootPath = '../../website/content'
const rootDir = path.resolve(__dirname, rootPath)

it('writes to folder', () => {
	const folder = readDir(rootDir)
	generate(folder)
})

import * as path from 'path'
import { readDir } from '../src/utils'

it('parses folder', () => {
	const rootDir = path.resolve(__dirname, '../../website/content')
	console.log(readDir(rootDir))
})

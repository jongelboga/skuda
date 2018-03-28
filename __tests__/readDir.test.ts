import * as path from 'path'
import { readDir } from '../src/utils'
import { ROOT_DIR } from './constants'

it('parses folder', () => {
	console.log(readDir(ROOT_DIR))
})

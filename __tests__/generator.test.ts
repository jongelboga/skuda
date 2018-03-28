import * as path from 'path'
import { readDir } from '../src/utils';
import { generate } from '../src/generator';

const rootPath = '../../website/content'
const rootDir = path.resolve(__dirname, rootPath);

it('writes to folder', () => {
	const rootDir = path.resolve(__dirname, '../../website/content');
	const folder = readDir(rootDir)
	generate(folder)
})

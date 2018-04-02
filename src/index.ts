/**
 * This is going to be the main runnable file. Don't do much yet... use "yarn test" instead.
 */

import * as path from 'path'
import { generate } from './generator'
import { readDir } from './reader'

// TODO:
// Check for command line parameters
// Check for default folders site and dist
// Not use test system files as defaults

// Read folders and get a Folder hierarchy
const source = path.resolve(__dirname, '../__tests__/testfiles/website')

readDir(source).then(folder => generate(
	path.resolve(__dirname, '../__tests__/dist'),
	folder
))

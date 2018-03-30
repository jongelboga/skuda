import * as path from 'path'
import { generate } from './src/page_generator'
import { readDir } from './src/reader'

// TODO:
// Check for command line parameters
// Check for default folders site and dist
// Not use test system files as defaults

// Read folders and get a Folder hierarchy
const folder = readDir(path.resolve(__dirname, '__tests__/testfiles')

// Generate pages and save to output path
generate(path.join(__dirname, '__tests_/dist') as string, folder)


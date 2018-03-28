import * as Markdown from 'markdown-it'
import * as fs from 'fs'
import * as path from 'path'

type Folder = {
	name: string
	pages: string[]
	folders: Folder[]
}

const md = new Markdown();

const rootDir = path.resolve(__dirname, '../../webiste/content');

md.render()


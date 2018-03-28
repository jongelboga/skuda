import * as fs from 'fs'
import * as Markdown from 'markdown-it'
import * as path from 'path'
import { Folder, readDir } from './utils'

const rootPath = '../../website/content'

const rootDir = path.resolve(__dirname, rootPath)

const tree: Folder = readDir(rootDir)

const md = new Markdown()


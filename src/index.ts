import * as Markdown from 'markdown-it'
import * as fs from 'fs'
import * as path from 'path'
import { readDir, Folder } from './utils';

const rootPath = '../../website/content'

const rootDir = path.resolve(__dirname, rootPath);

const tree: Folder = readDir(rootDir)

const md = new Markdown();


md.render()


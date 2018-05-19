/**
 * This is going to be the main runnable file. Don't do much yet... use "yarn test" instead.
 */
import * as path from 'path'
import args from './args'
import generate from './generator'
import { sanitizeName } from './utils'

// TODO:
// Only turn on logging when verbose option is enabled
// Not use test system files as defaults

const outPath = path.resolve(process.cwd(), args.out)
const srcPath = path.resolve(process.cwd(), args.src)

console.info(`Generating ${args.name || sanitizeName(srcPath)}`)
console.info(`Scanning ${srcPath}`)

generate(srcPath, outPath)

async function run () {
	try {
		await generate(srcPath, outPath)

		console.info(`Site generated at ${outPath}`)
		process.exit(0)
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

run()

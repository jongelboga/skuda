import * as commandLineArgs from 'command-line-args'

export type Options = {
	verbose: boolean
	src: string
	out: string
	name?: string
}

const optionDefinitions: commandLineArgs.OptionDefinition[] = [
	{ name: 'verbose', alias: 'v', type: Boolean },
	{ name: 'src', type: String, defaultOption: true },
	{ name: 'out', alias: 'o', type: String, defaultValue: 'out' },
	{ name: 'name', type: String }
]

const options: Options = commandLineArgs(optionDefinitions)

export default options

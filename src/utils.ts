import * as fs from 'fs'
import * as path from 'path'


// Helper function to make output folder
// TODO: check existanse instead of relying on catching error.
export function mkDir (p: string) {
	try {
		fs.mkdirSync(p)
	} catch (err) {
		const error: NodeJS.ErrnoException = err
		if (error.code === 'EEXIST') {
			// TODO: Remove directory
		}
		else {
			throw error
		}
	}
}

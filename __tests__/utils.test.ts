import * as path from 'path'
import { sanitizeName } from '../src/utils'

describe(sanitizeName.name, () => {
	it('returns name', () => {
		const result = sanitizeName(`/home/documents/Cool presentation.pages`)
		expect(result).toEqual('Cool Presentation')
	})

	it('handles windows paths', () => {
		const result = sanitizeName(`D:\\home\\documents\\Cool presentation.pages`)
		expect(result).toEqual('Cool Presentation')
	})
})

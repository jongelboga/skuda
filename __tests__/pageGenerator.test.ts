import { findPageProperties, generatePage } from '../src/page_generator'

describe(findPageProperties, () => {
	it('should behave...', () => {
		const sectionProperties = { description: 'descValue', page: 'pageValue'}
		const pageProperties = { prop1: 'value1'}
		const result = findPageProperties(sectionProperties, pageProperties)

		expect(result).toEqual({ ...sectionProperties, ...pageProperties })
	})
})

describe(generatePage, () => {
	it('should behave...', () => {

	});
});
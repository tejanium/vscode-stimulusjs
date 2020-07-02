import { completionItems } from '../../helper';
import assert = require('assert');

suite('HTML attribute completion target', () => {
	test(`not in the target context`, async () => {
		const text = `<div data-foo="|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`before '`, async () => {
		const text = `<div data-target=|'`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`before "`, async () => {
		const text = `<div data-target=|"`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`after ' suggests controller`, async () => {
		const text = `<div data-target='|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after " suggests controller`, async () => {
		const text = `<div data-target="|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after ""`, async () => {
		const text = `<div data-target=""|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`in between "" suggests controller`, async () => {
		const text = `<div data-target="|"`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after empty space suggests controller`, async () => {
		const text = `<div data-target=" |`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after another character suggests controller`, async () => {
		const text = `<div data-target="c-du|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`in between word suggests controller`, async () => {
		const text = `<div data-target="c-du|mmy`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after word suggests controller`, async () => {
		const text = `<div data-target="c-dummy|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after word and space suggests controller`, async () => {
		const text = `<div data-target="c-dummy |`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after controller and #`, async () => {
		const text = `<div data-target="c-dummy#|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`after controller and .`, async () => {
		const text = `<div data-target="c-dummy.|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['t_dummy']);
	});

	test(`after controller and # and space suggests controller`, async () => {
		const text = `<div data-target="c-dummy# |`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`in between word`, async () => {
		const text = `<div data-target="c-dummy.m_du|mmy`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['t_dummy']);
	});

	test(`after incomplete word`, async () => {
		const text = `<div data-target="c-dummy.m_du|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['t_dummy']);
	});

	test(`after word`, async () => {
		const text = `<div data-target="c-dummy.m_dummy|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['t_dummy']);
	});

	test(`multiple targets`, async () => {
		const text = `<div data-target="subdir--c-subdummy.t_subdummy c-dummy.|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['t_dummy']);
	});
});

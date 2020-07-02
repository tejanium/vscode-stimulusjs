import { completionItems } from '../../helper';
import assert = require('assert');

suite('HTML attribute completion controller', () => {
	test(`not in the controller context`, async () => {
		const text = `<div data-foo="|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`before '`, async () => {
		const text = `<div data-controller=|'`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`before "`, async () => {
		const text = `<div data-controller=|"`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`after '`, async () => {
		const text = `<div data-controller='|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after "`, async () => {
		const text = `<div data-controller="|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after ""`, async () => {
		const text = `<div data-controller=""|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`in between ""`, async () => {
		const text = `<div data-controller="|"`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after empty space`, async () => {
		const text = `<div data-controller=" |`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after another character`, async () => {
		const text = `<div data-controller="c-du|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});


	test(`in between word`, async () => {
		const text = `<div data-controller="c-du|mmy`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after incomplete word`, async () => {
		const text = `<div data-controller="c-du|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after word`, async () => {
		const text = `<div data-controller="c-dummy|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after word and space`, async () => {
		const text = `<div data-controller="c-dummy |`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});
});

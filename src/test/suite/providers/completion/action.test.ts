import { completionItems, EVENT_SUGGESTIONS } from '../../helper';
import assert = require('assert');

suite('HTML attribute completion action', () => {
	test(`not in the action context`, async () => {
		const text = `<div data-foo="|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`before '`, async () => {
		const text = `<div data-action=|'`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`before "`, async () => {
		const text = `<div data-action=|"`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`after ' suggests events`, async () => {
		const text = `<div data-action='|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, EVENT_SUGGESTIONS);
	});

	test(`after " suggests events`, async () => {
		const text = `<div data-action="|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, EVENT_SUGGESTIONS);
	});

	test(`after ""`, async () => {
		const text = `<div data-action=""|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`in between "" suggests events`, async () => {
		const text = `<div data-action="|"`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, EVENT_SUGGESTIONS);
	});

	test(`after empty space suggests events`, async () => {
		const text = `<div data-action=" |`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, EVENT_SUGGESTIONS);
	});

	test(`after another character suggests events`, async () => {
		const text = `<div data-action="cl|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, EVENT_SUGGESTIONS);
	});

	test(`in between word suggests events`, async () => {
		const text = `<div data-action="cl|ick`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, EVENT_SUGGESTIONS);
	});

	test(`after word suggests events`, async () => {
		const text = `<div data-action="click|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, EVENT_SUGGESTIONS);
	});

	test(`after word and space suggests events`, async () => {
		const text = `<div data-action="foo |`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, EVENT_SUGGESTIONS);
	});

	test(`after controller and #`, async () => {
		const text = `<div data-action="c-dummy#|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['m_dummy']);
	});

	test(`after controller and .`, async () => {
		const text = `<div data-action="c-dummy.|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});

	test(`after controller and # and space suggests events`, async () => {
		const text = `<div data-action="c-dummy# |`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, EVENT_SUGGESTIONS);
	});

	test(`in between word`, async () => {
		const text = `<div data-action="c-dummy#m_du|mmy`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['m_dummy']);
	});

	test(`after incomplete word`, async () => {
		const text = `<div data-action="c-dummy#m_du|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['m_dummy']);
	});

	test(`after word`, async () => {
		const text = `<div data-action="c-dummy#m_dummy|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['m_dummy']);
	});

	test(`after event suggest controller`, async () => {
		const text = `<div data-action="click->|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after word after event suggest controller`, async () => {
		const text = `<div data-action="click->c-du|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`in between word after event suggest controller`, async () => {
		const text = `<div data-action="click->c-du|mmy`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});

	test(`after # after event suggest action`, async () => {
		const text = `<div data-action="click->c-dummy#|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['m_dummy']);
	});

	test(`after # after event:type suggest action`, async () => {
		const text = `<div data-action="ajax:success->c-dummy#|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['m_dummy']);
	});

	test (`multiple actions`, async () => {
		const text = `<div data-action="subdir--c-subdummy#m_subdummy c-dummy#|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['m_dummy']);
	});

	test(`with @ in action`, async () => {
		const text = `<div data-action="click@document->c-dum|my`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['c-dummy', 'subdir--c-subdummy']);
	});
});

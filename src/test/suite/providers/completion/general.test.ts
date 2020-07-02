import { completionItems } from '../../helper';
import assert = require('assert');

suite('HTML attribute completion smoke', () => {
	test(`after . with presence of controller`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-dummy.|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['t_dummy']);
  });

  test(`after # with presence of controller`, async () => {
		const text = `<div data-controller="c-dummy" data-action="c-dummy#|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['m_dummy']);
  });

  test(`after # with presence of controller`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-dummy.t_dummy" data-action="c-dummy#|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['m_dummy']);
	});

	test(`outside value`, async () => {
		const text = `<div data-controller="c-dummy" | data-target="c-dummy.t_dummy" data-action="c-dummy#m_dummy">`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});
});

suite('Ruby method completion provider sanity check', () => {
	test(`after . with presence of controller`, async () => {
		const text = `<%= foo data: { controller: "c-dummy", target: "c-dummy.|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['t_dummy']);
  });

  test(`after # with presence of controller`, async () => {
		const text = `<%= foo data: { controller: "c-dummy", action: "c-dummy#|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['m_dummy']);
  });

  test(`after # with presence of controller`, async () => {
		const text = `<%= foo data: { controller: "c-dummy", target: "c-dummy.t_dummy", action: "c-dummy#|`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, ['m_dummy']);
	});

	test(`outside value`, async () => {
		const text = `<%= foo data: { controller: |"c-dummy", target: "c-dummy.t_dummy", action: "c-dummy#m_dummy" } %>`;
		const items = await completionItems(text);

		assert.deepStrictEqual(items, undefined);
	});
});

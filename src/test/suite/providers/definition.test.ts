import assert = require('assert');
import { definitionItems, DUMMY_CONTROLLER, DUMMY_CONTROLLER_RANGE, DUMMY_TARGET_RANGE, DUMMY_ACTION_RANGE, DUMMY_SUBDIR_CONTROLLER } from '../helper';

suite('HTML attribute definition provider', () => {
	test(`locate controller`, async () => {
		const text = `<div data-controller="c-dumm|y" data-target="c-dummy.t_dummy" data-action="c-dummy#m_dummy">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_CONTROLLER_RANGE);
	});

	test(`locate controller on multiple controllers`, async () => {
		const text = `<div data-controller="subdir--c-subdummy c-dumm|y">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_CONTROLLER_RANGE);
	});

	test(`locate subdir controller`, async () => {
		const text = `<div data-controller="subdir--c-subdumm|y" data-target="c-dummy.t_dummy" data-action="c-dummy#m_dummy">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_SUBDIR_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_CONTROLLER_RANGE);
	});

	test(`locate controller on target`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-du|mmy.t_dummy" data-action="c-dummy#m_dummy">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_CONTROLLER_RANGE);
	});

	test(`locate controller on action`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-dummy.t_dummy" data-action="c-dum|my#m_dummy">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_CONTROLLER_RANGE);
	});

	test(`locate target on target`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-dummy.t_d|ummy" data-action="c-dummy#m_dummy">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_TARGET_RANGE);
	});

	test(`locate target on multiple targets`, async () => {
		const text = `<div data-target="subdir--c-subdummy.t_subdummy c-dummy.t_d|ummy">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_TARGET_RANGE);
	});

	test(`locate action on action`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-dummy.t_dummy" data-action="c-dummy#m_d|ummy">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_ACTION_RANGE);
	});

	test(`locate action on multiple actions`, async () => {
		const text = `<div data-action="subdir--c-subdummy#m_subdummy c-dummy#m_d|ummy">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_ACTION_RANGE);
	});

	test(`locate undefined controller`, async () => {
		const text = `<div data-controller="c-dumm|y_undefined" data-target="c-dummy.t_dummy_undefined" data-action="c-dummy#m_dummy">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location, undefined);
	});

	test(`locate undefined target`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-dummy.t_d|ummy_undefined" data-action="c-dummy#m_dummy">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location, undefined);
	});

	test(`locate undefined action`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-dummy.t_dummy" data-action="c-dummy#m_d|ummy_undefined">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location, undefined);
	});

	test(`locate event`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-dummy.t_dummy" data-action="clic|k->c-dummy#m_dummy">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location, undefined);
	});

	test(`locate controller after event`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-dummy.t_dummy" data-action="click->c-d|ummy#m_dummy">`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_CONTROLLER_RANGE);
	});
});

suite('Ruby method definition provider sanity check', () => {
	test(`locate controller`, async () => {
		const text = `<%= foo data: { controller: "subdir--c-subdummy c-dumm|y" } %>`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_CONTROLLER_RANGE);
	});

	test(`locate controller on target`, async () => {
		const text = `<%= foo data: { controller: "c-dummy", target: "c-du|mmy.t_dummy", action: "c-dummy#m_dummy" } %>`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_CONTROLLER_RANGE);
	});

	test(`locate controller on action`, async () => {
		const text = `<%= foo data: { controller: "c-dummy", target: "c-dummy.t_dummy", action: "c-dum|my#m_dummy" } %>`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_CONTROLLER_RANGE);
	});

	test(`locate target on target`, async () => {
		const text = `<%= foo data: { controller: "c-dummy", target: "c-dummy.t_d|ummy", action: "c-dummy#m_dummy" } %>`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_TARGET_RANGE);
	});

	test(`locate action on action`, async () => {
		const text = `<%= foo data: { controller: "c-dummy", target: "c-dummy.t_dummy", action: "c-dummy#m_d|ummy" } %>`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location?.uri.fsPath, DUMMY_CONTROLLER);
		assert.deepStrictEqual(location?.range, DUMMY_ACTION_RANGE);
	});

	test(`locate event`, async () => {
		const text = `<%= foo data: { controller: "c-dummy", target: "c-dummy.t_dummy", action: "clic|k->c-dummy#m_dummy" } %>`;
		const location = await definitionItems(text);

		assert.deepStrictEqual(location, undefined);
	});
});

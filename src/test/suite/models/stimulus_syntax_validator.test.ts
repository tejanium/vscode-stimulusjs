import assert = require('assert');
import { validateContent } from '../helper';
import { Range, Position, DiagnosticSeverity } from 'vscode';

function curryRange(start: number): (end: number) => Range | Function {
	return function(end: number) {
			return new Range(new Position(0, start), new Position(0, end));
	};
}

function calculateRanges(fullText: string): Range[] {
	var range: Range | Function | undefined;

	return fullText.split('').reduce((ranges: Range[], char: string, index: number) => {
		const multiplier = ranges.length * 2;

		if (char === '[') {
			range = curryRange(index - multiplier);
		}

		if (char === ']') {
			ranges.push((<Function>range)(index - multiplier - 1));
		}

		return ranges;
	}, []);
}

suite('Syntax validator for diagnostic', () => {
	test(`return no offenses`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-dummy.t_dummy" data-action="c-dummy#m_dummy">`;
		const offenses = await validateContent(text);

		assert.deepStrictEqual(offenses, []);
	});

	test(`return no offenses for empty controller`, async () => {
		const text = `<div data-controller="">`;
		const offenses = await validateContent(text);

		assert.deepStrictEqual(offenses, []);
	});

	test(`return offenses if controller is missing`, async () => {
		const text = `<div data-controller="[c-missing]" data-target="c-dummy.t_dummy" data-action="c-dummy#m_dummy">`;
		const offenses = await validateContent(text);
		const [range] = calculateRanges(text);
		const [offense] = offenses;

		assert.deepStrictEqual(offense.message, 'Unknown stimulus controller');
		assert.deepStrictEqual(offense.range, range);
		assert.deepStrictEqual(offense.severity, DiagnosticSeverity.Error);
	});

	test(`return offenses if controller is missing in target`, async () => {
		const text = `<div data-controller="[c-missing]" data-target="[c-missing].t_dummy" data-action="c-dummy#m_dummy">`;
		const offenses = await validateContent(text);
		const [range1, range2] = calculateRanges(text);
		const [offense1, offense2] = offenses;

		assert.deepStrictEqual(offense1.message, 'Unknown stimulus controller');
		assert.deepStrictEqual(offense1.range, range1);
		assert.deepStrictEqual(offense1.severity, DiagnosticSeverity.Error);

		assert.deepStrictEqual(offense2.message, 'Unknown stimulus controller');
		assert.deepStrictEqual(offense2.range, range2);
		assert.deepStrictEqual(offense2.severity, DiagnosticSeverity.Error);
	});

	test(`return offenses if controller is missing in action`, async () => {
		const text = `<div data-controller="[c-missing]" data-target="[c-missing].t_dummy" data-action="[c-missing]#m_dummy">`;
		const offenses = await validateContent(text);
		const [range1, range2, range3] = calculateRanges(text);
		const [offense1, offense2, offense3] = offenses;

		assert.deepStrictEqual(offense1.message, 'Unknown stimulus controller');
		assert.deepStrictEqual(offense1.range, range1);
		assert.deepStrictEqual(offense1.severity, DiagnosticSeverity.Error);

		assert.deepStrictEqual(offense2.message, 'Unknown stimulus controller');
		assert.deepStrictEqual(offense2.range, range2);
		assert.deepStrictEqual(offense2.severity, DiagnosticSeverity.Error);

		assert.deepStrictEqual(offense3.message, 'Unknown stimulus controller');
		assert.deepStrictEqual(offense3.range, range3);
		assert.deepStrictEqual(offense3.severity, DiagnosticSeverity.Error);
	});

	test(`return offenses if target is missing`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-dummy.[t_missing]" data-action="c-dummy#m_dummy">`;
		const offenses = await validateContent(text);
		const [range] = calculateRanges(text);
		const [offense] = offenses;

		assert.deepStrictEqual(offense.message, 'Unknown stimulus target');
		assert.deepStrictEqual(offense.range, range);
		assert.deepStrictEqual(offense.severity, DiagnosticSeverity.Error);
	});

	test(`return offenses if action is missing`, async () => {
		const text = `<div data-controller="c-dummy" data-target="c-dummy.t_dummy" data-action="c-dummy#[m_missing]">`;
		const offenses = await validateContent(text);
		const [range] = calculateRanges(text);
		const [offense] = offenses;

		assert.deepStrictEqual(offense.message, 'Unknown stimulus action');
		assert.deepStrictEqual(offense.range, range);
		assert.deepStrictEqual(offense.severity, DiagnosticSeverity.Error);
	});
});

suite('Ruby method syntax validator sanity check', () => {
	test('general', async () => {
		const text = `<%= foo data: { controller="[c-missing]", target="c-dummy.[t_missing]", action="c-dummy#[m_missing]" } %>`;
		const offenses = await validateContent(text);
		const [range1, range2, range3] = calculateRanges(text);
		const [offense1, offense2, offense3] = offenses;

		assert.deepStrictEqual(offense1.message, 'Unknown stimulus controller');
		assert.deepStrictEqual(offense1.range, range1);
		assert.deepStrictEqual(offense1.severity, DiagnosticSeverity.Error);

		assert.deepStrictEqual(offense2.message, 'Unknown stimulus target');
		assert.deepStrictEqual(offense2.range, range2);
		assert.deepStrictEqual(offense2.severity, DiagnosticSeverity.Error);

		assert.deepStrictEqual(offense3.message, 'Unknown stimulus action');
		assert.deepStrictEqual(offense3.range, range3);
		assert.deepStrictEqual(offense3.severity, DiagnosticSeverity.Error);
	});
});

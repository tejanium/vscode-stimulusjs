import path = require('path');
import { workspace, Position, TextDocument, Location, Range, Diagnostic } from 'vscode';
import { StimulusController } from '../../models/stimulus_controller';
import { Stimulus } from '../../models/stimulus';
import { EVENTS } from '../../models/events';
import StimulusCompletionProvider from '../../providers/completion';
import StimulusDefinitionProvider from '../../providers/definition';
import { StimulusSyntaxValidator } from '../../models/stimulus_syntax_validator';

const FIXTURE_PATH = path.resolve(__dirname, '../../../src/test/fixture/controllers');
export const DUMMY_CONTROLLER = path.resolve(FIXTURE_PATH, 'c_dummy_controller.js');
export const DUMMY_SUBDIR_CONTROLLER = path.resolve(FIXTURE_PATH, 'subdir/c_subdummy_controller.js');
export const DUMMY_CONTROLLER_RANGE = new Range(new Position(0, 0), new Position(0, 0));
export const DUMMY_TARGET_RANGE = new Range(new Position(1, 20), new Position(1, 29));
export const DUMMY_ACTION_RANGE = new Range(new Position(3, 2), new Position(3, 15));
export const DUMMY2_ACTION_RANGE = new Range(new Position(4, 2), new Position(4, 16));
export const EVENT_SUGGESTIONS = Object.keys(EVENTS);

function textAndCursorOffset(input: string): {text: string, offset: number} {
	const offset = Math.max(input.indexOf('|'), 0);
	const text = input.replace('|', '').replace(/[\[\]]/g, '');

	return { text, offset };
}

async function createStimulus(): Promise<Stimulus> {
	const js = await workspace.openTextDocument(DUMMY_CONTROLLER);
	const jsSubdir = await workspace.openTextDocument(DUMMY_SUBDIR_CONTROLLER);

	return new Stimulus([
		await StimulusController.parse(js.uri),
		await StimulusController.parse(jsSubdir.uri)
	]);
}

async function createDocument(content: string): Promise<{document: TextDocument, position: Position}> {
	const { text, offset } = textAndCursorOffset(content);

	const document = await workspace.openTextDocument({ language: 'html', content: text });
	const position = new Position(0, offset);

	return { document, position };
}

export async function completionItems(content: string): Promise<string[] | undefined> {
	const stimulus = await createStimulus();
	const { document, position } = await createDocument(content);

	const provider = new StimulusCompletionProvider(stimulus);
	const items = await provider.provideCompletionItems(document, position);

	return items?.map(item => item.label);
}

export async function definitionItems(content: string): Promise<Location | undefined> {
	const stimulus = await createStimulus();
	const { document, position } = await createDocument(content);

	const provider = new StimulusDefinitionProvider(stimulus);
	const location = await provider.provideDefinition(document, position);

	return location;
}

export async function validateContent(content: string): Promise<Diagnostic[]> {
	const stimulus = await createStimulus();
	const { document } = await createDocument(content);
	const validator = new StimulusSyntaxValidator(document, stimulus);

	return validator.offenses;
}

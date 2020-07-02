import { DefinitionProvider, TextDocument, Position } from 'vscode';
import { StimulusSyntaxDetector } from '../models/stimulus_syntax_detector';
import { Stimulus } from '../models/stimulus';

export default class StimulusDefinitionProvider implements DefinitionProvider {
	constructor(private stimulus: Stimulus) { }

	public async provideDefinition(document: TextDocument, position: Position) {
		const detector = new StimulusSyntaxDetector(document, position);

		if (!detector.isDetected || !detector.controller) {
			return;
		}

		const controller = this.stimulus.get(detector.controller);

		if (!controller) {
			return;
		}

		if (detector.isCursorAtAction && detector.action) {
			return controller.methodLocation(detector.action);
		}

		if (detector.isCursorAtTarget && detector.target) {
			return controller.targetLocation(detector.target);
		}

		if (detector.isCursorAtController) {
			return controller.location;
		}
	}
}

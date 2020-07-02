import { CompletionItemProvider, TextDocument, Position, CompletionItem, CompletionItemKind } from 'vscode';
import { StimulusSyntaxDetector } from '../models/stimulus_syntax_detector';
import { Stimulus } from '../models/stimulus';
import { EVENTS } from '../models/events';

export default class StimulusCompletionProvider implements CompletionItemProvider {
	constructor(private stimulus: Stimulus) { }

	public async provideCompletionItems(document: TextDocument, position: Position) {
		const detector = new StimulusSyntaxDetector(document, position);

		if (!detector.isDetected || !detector.isInsideQuote) {
			return;
		}

		const controllerName = detector.controller;

		if (detector.isActionContext) {
			if (detector.isAfterActionSeparator && controllerName) {
				return this.actionCompletions(controllerName);
			}

			if (detector.isAfterEventSeparator) {
				return this.controllerCompletions();
			}

			if (!detector.isAfterTargetSeparator) {
				return this.eventCompletions();
			}
		}

		if (detector.isTargetContext) {
			if (detector.isAfterTargetSeparator && controllerName) {
				return this.targetCompletions(controllerName);
			}

			if (!detector.isAfterActionSeparator) {
				return this.controllerCompletions();
			}
		}

		if (detector.isControllerContext) {
			return this.controllerCompletions();
		}
	}

	private eventCompletions(): CompletionItem[] {
		return Object.keys(EVENTS).map(event => {
			const completion = new CompletionItem(event, CompletionItemKind.Class);
			completion.documentation = EVENTS[event];

			return completion;
		});
	}

	private targetCompletions(controllerName: string): CompletionItem[] | undefined {
		const targets = this.stimulus.targetNames(controllerName);

		return targets.map(target => new CompletionItem(target, CompletionItemKind.EnumMember));
	}

	private actionCompletions(controllerName: string): CompletionItem[] | undefined {
		const actions = this.stimulus.actionNames(controllerName);

		return actions.map(action => new CompletionItem(action, CompletionItemKind.Method));
	}

	private controllerCompletions(): CompletionItem[] {
		const controllers = this.stimulus.index;

		return Object.keys(controllers).map(name => {
			const controller = controllers[name];
			const completion = new CompletionItem(name, CompletionItemKind.Class);
			completion.documentation = controller.fileName;

			return completion;
		});
	}
}

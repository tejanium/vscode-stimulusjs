import { TextDocument, Position } from 'vscode';
import { CursorScanner } from './cursor_scanner';
import { StimulusSyntax, SYNTAX_REGEXP, ACTION_SEPARATOR, TARGET_SEPARATOR, EVENT_SEPARATOR } from './stimulus_syntax';

const WORD_REGEXP = /[a-zA-Z0-9_\-@]+/;
const VALUE_REGEXP = /[a-zA-Z0-9_\-\.>#:@]+/;

export class StimulusSyntaxDetector {
	readonly controller: string | undefined;
	readonly action: string | undefined;
	readonly target: string | undefined;
	readonly type: string | undefined;

	private syntaxUntilCursor: string | undefined;
	private wordAtCursor: string | undefined;
	private charBeforeCursor: string | undefined;
	private charBeforeWordAtCursor: string | undefined;

	constructor(document: TextDocument, position: Position) {
		const cursorScanner = new CursorScanner(document, position);
		const syntaxAtCursor = cursorScanner.getWord(SYNTAX_REGEXP);

		if (syntaxAtCursor) {
			const syntax = new StimulusSyntax(syntaxAtCursor);

			const valueAtCursor = cursorScanner.getWord(VALUE_REGEXP);
			const property = syntax.properties.find(property => property.rawValue === valueAtCursor);

			this.type = syntax.type;

			if (property) {
				this.controller = property.controller;
				this.target = property.target;
				this.action = property.action;
			}

			this.syntaxUntilCursor = cursorScanner.getWordUntilCursor(SYNTAX_REGEXP);
			this.wordAtCursor = cursorScanner.getWord(WORD_REGEXP);
			this.charBeforeCursor = cursorScanner.charBefore;
			this.charBeforeWordAtCursor = cursorScanner.charBeforeWord(WORD_REGEXP);
		}
	}

	get isDetected(): boolean {
		return !!this.type;
	}

	get isInsideQuote(): boolean {
		return this.syntaxUntilCursor?.match(/["']/g)?.length === 1;
	}

	get isActionContext(): boolean {
		return this.type === 'action';
	}

	get isTargetContext(): boolean {
		return this.type === 'target';
	}

	get isControllerContext(): boolean {
		return this.type === 'controller';
	}

	get isCursorAtAction(): boolean {
		return this.wordAtCursor === this.action;
	}

	get isCursorAtTarget(): boolean {
		return this.wordAtCursor === this.target;
	}

	get isCursorAtController(): boolean {
		return this.wordAtCursor === this.controller;
	}

	get isAfterActionSeparator(): boolean {
		return this.isAfterSeparator(ACTION_SEPARATOR);
	}

	get isAfterTargetSeparator(): boolean {
		return this.isAfterSeparator(TARGET_SEPARATOR);
	}

	get isAfterEventSeparator(): boolean {
		return this.isAfterSeparator(EVENT_SEPARATOR[1]);
	}

	private isAfterSeparator(symbol: string): boolean {
		return [this.charBeforeCursor, this.charBeforeWordAtCursor].includes(symbol);
	}
}

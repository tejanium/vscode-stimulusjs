import { TextDocument, Diagnostic, Range, DiagnosticSeverity } from 'vscode';
import { SYNTAX_REGEXP, StimulusSyntax } from './stimulus_syntax';
import { Stimulus } from './stimulus';

const GLOBAL_SYNTAX_REGEXP = new RegExp(SYNTAX_REGEXP, 'g');

export class StimulusSyntaxValidator {
	private text: string;
	readonly offenses: Diagnostic[] = [];

	constructor(private document: TextDocument, private stimulus: Stimulus) {
		this.text = document.getText();

		const rawSyntaxes = this.text.match(GLOBAL_SYNTAX_REGEXP) || [];

		rawSyntaxes.forEach(rawSyntax => this.validate(rawSyntax));
	}

	private validate(rawSyntax: string): void {
		const syntax = new StimulusSyntax(rawSyntax);
		const syntaxOffset = this.text.indexOf(rawSyntax);

		syntax.properties.forEach(property => {
			if (property.controller) {
				const controller = this.stimulus.get(property.controller);

				if (!controller) {
					const range = this.calculateRange(syntaxOffset, rawSyntax, property.controller);

					this.addOffense(range, 'Unknown stimulus controller');
				} else {
					if (property.action && !controller.methodLocation(property.action)) {
						const range = this.calculateRange(syntaxOffset, rawSyntax, property.action);

						this.addOffense(range, 'Unknown stimulus action');
					}

					if (property.target && !controller.targetLocation(property.target)) {
						const range = this.calculateRange(syntaxOffset, rawSyntax, property.target);

						this.addOffense(range, 'Unknown stimulus target');
					}
				}
			}
		});
	}

	private addOffense(range: Range, message: string): void {
		this.offenses.push({
			message: message,
			range: range,
			severity: DiagnosticSeverity.Error
		});
	}

	private calculateRange(offset: number, fullText: string, text: string): Range {
		const relativeOffset = offset + fullText.indexOf(text);
		const start = this.document.positionAt(relativeOffset);
		const end = this.document.positionAt(relativeOffset + text.length);

		return new Range(start, end);
	}
}

export const SYNTAX_REGEXP = /(controller|target|action)\s*[:=]\s*["']([a-zA-Z_\-\.>#:@ ]*)["']?/;

export const EVENT_SEPARATOR = '->';
export const ACTION_SEPARATOR = '#';
export const TARGET_SEPARATOR = '.';

interface Property {
	rawValue: string,
	controller: string,
	action: string | undefined,
	target: string | undefined,
	event: string | undefined,
}

export class StimulusSyntax {
	readonly type: string;
	readonly properties: Property[];

	constructor(readonly rawSyntax: string) {
		const match = rawSyntax.match(SYNTAX_REGEXP) || [];
		const key = match[1];
		const values = match[2].split(' ');

		this.type = key;
		this.properties = values.map(rawValue => this.parseValue(rawValue));
	}

	private parseValue(rawValue: string): Property {
		let controller, event, target, action;

		if (rawValue.indexOf(EVENT_SEPARATOR) > 0) {
			[event, controller] = rawValue.split(EVENT_SEPARATOR);
		} else {
			controller = rawValue;
		}

		if (this.type === 'target') {
			[controller, target] = controller.split(TARGET_SEPARATOR);
		}

		if (this.type === 'action') {
			[controller, action] = controller.split(ACTION_SEPARATOR);
		}

		return { rawValue: rawValue, controller, target, action, event };
	}
}

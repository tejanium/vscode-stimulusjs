import { Uri, Location, Position, Range } from 'vscode';
import { basename, dirname, sep } from 'path';
import { JavascriptParser, JsNode } from './javascript_parser';
import { readFile } from 'fs';
import { promisify } from 'util';
import { SourceLocation, Position as AcornPosition } from 'acorn';

const readFileAsync = promisify(readFile);

interface MemberLocations {
	[key: string]: Location | undefined;
}

export class StimulusController {
	readonly location: Location;
	readonly targetLocations: MemberLocations;
	readonly methodLocations: MemberLocations;

	constructor(private uri: Uri, content: string) {
		const parser = new JavascriptParser(content);

		this.location = new Location(this.uri, new Position(0, 0));
		this.targetLocations = {};
		this.methodLocations = {};

		parser.nodes.forEach(node => {
			if (node.type === 'FieldDefinition' && node.key.name === 'targets') {
				parser.getElements(node).forEach((element: JsNode) => {
					this.targetLocations[parser.getValue(element)] = this.calculateLocation(element);
				});
			}

			if (node.type === 'MethodDefinition') {
				this.methodLocations[node.key.name] = this.calculateLocation(node);
			}
		});
	}

	static async parse(uri: Uri): Promise<StimulusController> {
		const content = await readFileAsync(uri.fsPath);

		return new StimulusController(uri, content.toString());
	}

	static parseFileName(uri: Uri): string {
		const name = basename(uri.fsPath);
		const paths = dirname(uri.fsPath).split(sep);
		const stimulusName = paths.slice(paths.indexOf('controllers') + 1, paths.length).concat([name]);

		return stimulusName.join('--');
	}

	static parseName(fileName: string): string {
		return fileName.replace('_controller.js', '').replace(/_/g, '-');;
	}

	get targetNames(): string[] {
		return Object.keys(this.targetLocations);
	}

	get methodNames(): string[] {
		return Object.keys(this.methodLocations);
	}

	methodLocation(name: string): Location | undefined {
		return this.methodLocations[name];
	}

	targetLocation(name: string): Location | undefined {
		return this.targetLocations[name];
	}

	get fileName(): string{
		return StimulusController.parseFileName(this.uri);
	}

	get name(): string {
		return StimulusController.parseName(this.fileName);
	}

	private calculateLocation(node: JsNode): Location | undefined {
		if (node.loc) {
			return this.acornLocationToLocation(node.loc);
		}
	}

	private acornLocationToLocation(sourceLocation: SourceLocation): Location {
		const start = this.acornPositionToPosition(sourceLocation.start);
		const end = this.acornPositionToPosition(sourceLocation.end);

		return new Location(this.uri, new Range(start, end));
	}

	private acornPositionToPosition(position: AcornPosition): Position {
		return new Position(position.line - 1, position.column);
	}
}

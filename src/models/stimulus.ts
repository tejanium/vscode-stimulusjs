import { workspace, Uri } from 'vscode';
import { StimulusController } from './stimulus_controller';

export const STIMULUS_CONTROLLER_GLOB = `**/**/*_controller.js`;

interface Index {
	[key: string]: StimulusController
}

export class Stimulus {
	readonly index: Index;

	constructor(controllers: StimulusController[]) {
		this.index = {};

		controllers.forEach(controller => this.updateIndex(controller));
	}

	static async createInstance(): Promise<Stimulus> {
		const uris = await workspace.findFiles(STIMULUS_CONTROLLER_GLOB);
		const promises = uris.map(uri => StimulusController.parse(uri));
		const controllers = await Promise.all(promises);

		return new Stimulus(controllers);
	}

	async updateIndexByUri(uri: Uri): Promise<void> {
		this.updateIndex(await StimulusController.parse(uri));
	}

	get(controllerName: string): StimulusController | undefined {
		return this.index[controllerName];
	}

	targetNames(controllerName: string): string[] {
		return this.get(controllerName)?.targetNames || [];
	}

	actionNames(controllerName: string): string[] {
		return this.get(controllerName)?.methodNames || [];
	}

	private updateIndex(controller: StimulusController): Index {
		this.index[controller.name] = controller;

		return this.index;
	}
}

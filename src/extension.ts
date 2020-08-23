import { ExtensionContext, languages, workspace, DiagnosticCollection, window, TextDocument, Uri } from 'vscode';
import { Stimulus, STIMULUS_CONTROLLER_GLOB } from './models/stimulus';
import StimulusDefinitionProvider from './providers/definition';
import StimulusCompletionProvider from './providers/completion';
import { StimulusSyntaxValidator } from './models/stimulus_syntax_validator';

const LANGUAGES = ['html', 'erb'];
const TRIGGER_CHARS = `abcdefghijklmnopqrstuvwxyz._#->'" `.split('');

export async function activate(context: ExtensionContext) {
	const stimulus = await Stimulus.createInstance();
	const watcher = workspace.createFileSystemWatcher(STIMULUS_CONTROLLER_GLOB);
	const diagnosticCollection = languages.createDiagnosticCollection('stimulus');

	context.subscriptions.push(
		languages.registerDefinitionProvider(LANGUAGES, new StimulusDefinitionProvider(stimulus)),
		languages.registerCompletionItemProvider(LANGUAGES, new StimulusCompletionProvider(stimulus), ...TRIGGER_CHARS),
		window.onDidChangeActiveTextEditor(editor => diagnose(editor?.document, diagnosticCollection, stimulus)),
		workspace.onDidChangeTextDocument(event => diagnose(event.document, diagnosticCollection, stimulus))
	);

	const runDiagnostic = () => {
		if (window.activeTextEditor) {
			diagnose(window.activeTextEditor.document, diagnosticCollection, stimulus);
		}
	};

	const updateAndRunDiagnostic = async (uri: Uri) => {
		await stimulus.updateIndexByUri(uri);

		runDiagnostic();
	};

	watcher.onDidChange(updateAndRunDiagnostic);
	watcher.onDidCreate(updateAndRunDiagnostic);
	watcher.onDidDelete(async uri => {
		await stimulus.removeIndexByUri(uri);

		runDiagnostic();
	});

	runDiagnostic();
}

export function deactivate() { }

function diagnose(document: TextDocument | undefined, collection: DiagnosticCollection, stimulus: Stimulus): void {
	if (document && LANGUAGES.includes(document.languageId)) {
		const validator = new StimulusSyntaxValidator(document, stimulus);

		collection.set(document.uri, validator.offenses);
	}
}

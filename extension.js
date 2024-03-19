// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ht-test-runner" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ht-test-runner.runtest', function () {
		// docker-compose exec test rails test test/jobs/cancel_all_whitelabel_companies_job_test.rb:15
		let cmd = `docker-compose exec test rails test ${activeEditorFilePath()}`

		let activeTextEditor = vscode.window.activeTextEditor;
		let selected = activeTextEditor?.selection;

		if (!selected?.isEmpty) {
			const line = activeTextEditor?.document.lineAt(selected.start.line);
			cmd = cmd + `:${line.lineNumber + 1}`;
		}

		runCmd(cmd);
	});


	const activeEditorFilePath = () => {
		return vscode.workspace.asRelativePath(vscode.window.activeTextEditor?.document.uri.fsPath);
	}

	const runCmd = (cmd) => {
		let activeTerm = vscode.window.activeTerminal
		if (activeTerm === undefined) {
			activeTerm = vscode.window.createTerminal();
		}
		activeTerm.show(false);
		activeTerm.sendText(cmd)
	}

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

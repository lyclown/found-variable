import * as vscode from 'vscode';
import { checkVariableAndTranslate } from './translate'
export function activate(context: vscode.ExtensionContext) {
	let config = vscode.workspace.getConfiguration('translate');
	if (!config.has('enabled')) {
		config.update('enabled', false, true);
	}
	if (!config.has('openaiKey')) {
		config.update('openaiKey', '', true);
	}
	// 注册命令
	let disposable = vscode.commands.registerCommand('variableTranslate.toggle', toggleTranslate);
	async function toggleTranslate() {
		let enabled = vscode.workspace.getConfiguration('translate').get('enabled');
		if (!enabled) {
			const key = await vscode.window.showInputBox({
				placeHolder: '请输入OpenAI Key'
			});
			if (key) {
				vscode.workspace.getConfiguration('translate').update('openaiKey', key);
				vscode.workspace.getConfiguration().update('translate.enabled', true);
				vscode.window.showInformationMessage('变量翻译功能已启用')
				// 开启翻译功能
				startTranslate();
			} else {
				vscode.window.showInformationMessage('变量翻译功能需要使用到openai的api，需要传入key')
			}
		} else {
			vscode.window.showInformationMessage('变量翻译功能已关闭')
			vscode.workspace.getConfiguration().update('translate.enabled', false);
			stopTranslate()
		}
	}
	context.subscriptions.push(disposable);
}
function startTranslate() {
	vscode.workspace.onDidChangeTextDocument((event) => {
		const text = event.contentChanges[0].text;
		// 获取活动编辑器
		const editor = vscode.window.activeTextEditor;

		if (editor) {

			const doc = editor.document;

			// 获取变化范围
			const changeRange = event.contentChanges[0].range;

			// 获取变化范围的起始位置
			const changePos = changeRange.start;

			if (text === ' ') {
				// 获取当前光标所在行号
				const cursorLine = changePos.line;

				// 定义仅当前行的范围 
				const lineRange = new vscode.Range(cursorLine, 0, cursorLine, changePos.character);

				// 在行范围内获取文本
				const lineText = doc.getText(lineRange);
				const varReg = /\b(const|let|var|function)\s+(.*)\s*=/;
				const matches = lineText.match(varReg);
				if (matches) {
					const variable = matches[2];
					checkVariableAndTranslate(cursorLine, lineText, variable);
				}
			}
		}
	})
}
function stopTranslate() {
	// 清除文档变化监听
	vscode.workspace.onDidChangeTextDocument(() => { });
}

// This method is called when your extension is deactivated
export function deactivate() { }

import * as vscode from 'vscode';
import axios from 'axios';
// 正则匹配
const varRegex = /const\s*(\w+)\s*=\s*.+/;
const varNameReg = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export async function checkVariableAndTranslate(cursorLine: number, lineText: string, text: string) {
    console.log(11111111)
    const translated = await translate(text);
    replaceText(cursorLine, lineText, text, translated)
}
// 获取key方法  
async function getOpenAiKey() {
    let openaiKey = vscode.workspace.getConfiguration('translate').get('openaiKey');
    console.log(openaiKey)
    if (!openaiKey) {
        openaiKey = await vscode.window.showInputBox({
            placeHolder: '请传入OpenAI Key'
        });
    }
    return openaiKey;
}
// 翻译
async function translate(text: string) {
    console.log('输入：' + text)
    const openaiKey = await getOpenAiKey()
    console.log(openaiKey)
    const result = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
            Authorization: `Bearer ${openaiKey}`,
        },
        data: {
            model: 'gpt-4',
            "temperature": 0.42,
            "max_tokens": 256,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            messages: [
                {
                    "role": "system",
                    "content": "请帮我用户输入的中文文本翻译成英文，并且使用小驼峰的形式输出。 \n      "
                },
                {
                    "role": "user",
                    "content": text
                },
            ],
        },
    });
    console.log('输出：' + result.data.choices[0].message.content)
    return result.data.choices[0].message.content
}
function replaceText(cursorLine: number, lineText: string, cnName: string, enName: string) {

    // 获取活动编辑器
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    // 获取编辑器文档  
    const doc = editor.document;

    // 查找中文名位置 
    const nameRange = getNameRange(cursorLine, lineText, cnName);

    // 创建文本编辑
    const edit = vscode.TextEdit.replace(nameRange, enName);
    // 提交编辑 
    editor.edit(editBuilder => {
        editBuilder.replace(edit.range, edit.newText);
    });

}

function getNameRange(cursorLine: number, lineText: string, cnName: string) {

    const namePos = lineText.indexOf(cnName);
    // 转换为文档绝对位置
    const startPos = new vscode.Position(cursorLine, namePos);
    const endPos = new vscode.Position(cursorLine, namePos + cnName.length);

    return new vscode.Range(startPos, endPos);
}
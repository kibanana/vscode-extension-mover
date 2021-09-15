import * as vscode from 'vscode';
import * as path from 'path';
import fsSync from '../modules/fsSync';
import { SaveParam } from '../ts/IParam';

export default async (param: SaveParam): Promise<boolean | undefined> => {
  try {
    const { commands } = param;

    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    
    const filename = await vscode.window.showInputBox({
      value: `extension-mover-${currentDate.getDate()}-${String(month).length === 1 && '0'}${month}-${currentDate.getFullYear()}`,
      placeHolder: 'Please enter a new text file name!',
      validateInput: function (input: string): null | string {
        return (/^[A-z0-9_.@()-]+/i).test(input) ? null : 'Invalid text file name rule!';
      },
      ignoreFocusOut: true,
    });
  
    if (!filename) {
      return false;
    }
  
    const saveDirOption: vscode.OpenDialogOptions = {
      openLabel: 'Save file to this directory',
      canSelectFiles: false,
      canSelectFolders: true
    };
  
    const fileUri = await vscode.window.showOpenDialog(saveDirOption);
    if (fileUri && fileUri[0]) {
      await fsSync.WriteFileSync(path.resolve(fileUri[0].fsPath || fileUri[0].path, `${filename}.txt`), commands, 'UTF-8');
      return true;
    } else {
      return false;
    }
  }
  catch (err) {
    return false;
  }
};

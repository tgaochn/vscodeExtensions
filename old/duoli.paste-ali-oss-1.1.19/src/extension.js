"use strict";
const vscode = require("vscode");
const path = require("path");
const dayjs = require("dayjs");
const fs = require("fs");
const { spawn } = require("child_process");
const aliyunUpload = require("./upload");
var uploadStatus = 0;
exports.activate = (context) => {
	console.info("paste-ali-oss is active!");
	const disposable = vscode.commands.registerCommand("extension.paste.ali.oss", () => {
		vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: "Progress",
				cancellable: false,
			},
			(progress) => {
				return new Promise((resolve) => {
					uploadStatus = 0;
					start(progress);
					var intervalObj = setInterval(() => {
						if (uploadStatus === 1) {
							setTimeout(() => {
								clearInterval(intervalObj);
								resolve();
							}, 1000);
						}
					}, 1000);
				});
			}
		);
	});
	context.subscriptions.push(disposable);
};
// this method is called when your extension is deactivated
exports.deactivate = () => {};
function start(progress) {
	// 获取当前编辑文件
	let editor = vscode.window.activeTextEditor;
	if (!editor) return;
	let fileUri = editor.document.uri;
	if (!fileUri) return;
	if (fileUri.scheme === "untitled") {
		progress.report({ increment: 100, message: "Before paste image, you need to save current edit file first." });
		return;
	}
	let selection = editor.selection;
	let selectText = editor.document.getText(selection);
	if (selectText && !/^[\w\-.]+$/.test(selectText)) {
		progress.report({ increment: 100, message: "Your selection is not a valid file name!" });
		return;
	}
	let config = vscode.workspace.getConfiguration("paste-ali-oss");
	// let localPath = "/tmp/.paste-ali-oss";

    let today = new Date().toISOString().slice(0, 10);
    let localPath = "D:\\softwareData\\aliyun markdown image local temp\\" + today;

	if (localPath && localPath.length !== localPath.trim().length) {
		progress.report({ increment: 100, message: `The specified path is invalid. ${localPath}` });
		return;
	}
	let filePath = fileUri.fsPath;
	let imagePath = getImagePath(filePath, selectText, localPath);
	progress.report({ increment: 10, message: "Uploading..." });
	createImageDirWithImagePath(imagePath)
		.then((imagePath) => {
			progress.report({ increment: 20, message: "Uploading..." });
			saveClipboardImageToFileAndGetPath(imagePath, (imagePath) => {
				if (!imagePath) return;
				if (imagePath === "no image") {
					progress.report({ increment: 100, message: "There is not a image in clipboard." });
					return;
				}
				progress.report({ increment: 50, message: "Uploading..." });
				aliyunUpload(config, imagePath)
					.then(({ url }) => {
						progress.report({ increment: 80, message: "Uploading..." });
						if (config.domain) {
							url = url.replace(`http://${config.bucket}.${config.region}.aliyuncs.com`, config.domain);
						}
						const img = `![](${url})\n`;
						editor.edit((textEditorEdit) => {
							textEditorEdit.insert(editor.selection.active, img);
						});
						progress.report({ increment: 30, message: "Uploaded" });
						uploadStatus = 1;
					})
					.catch((err) => {
						progress.report({ increment: 100, message: "Upload error." + err.message });
						return;
					});
			});
		})
		.catch(() => {
			progress.report({ increment: 100, message: "Failed make folder." });
			return;
		});
}
function getImagePath(filePath, selectText, localPath) {
	// 图片名称
	let imageFileName = "";
	if (!selectText) {
		imageFileName = dayjs().format("YMMDDHHmmss") + ".png";
	} else {
		imageFileName = selectText + ".png";
	}
	// 图片本地保存路径
	let folderPath = path.dirname(filePath);
	let imagePath = "";
	if (path.isAbsolute(localPath)) {
		imagePath = path.join(localPath, imageFileName);
	} else {
		imagePath = path.join(folderPath, localPath, imageFileName);
	}
	return imagePath;
}
function createImageDirWithImagePath(imagePath) {
	return new Promise((resolve, reject) => {
		let imageDir = path.dirname(imagePath);
		fs.exists(imageDir, (exists) => {
			if (exists) {
				resolve(imagePath);
				return;
			}
			fs.mkdir(imageDir, (err) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(imagePath);
			});
		});
	});
}
function saveClipboardImageToFileAndGetPath(imagePath, cb) {
	if (!imagePath) return;
	let platform = process.platform;
	if (platform === "win32") {
		// Windows
		const scriptPath = path.join(__dirname, "./pc.ps1");
		const powershell = spawn("powershell", [
			"-noprofile",
			"-noninteractive",
			"-nologo",
			"-sta",
			"-executionpolicy",
			"unrestricted",
			"-windowstyle",
			"hidden",
			"-file",
			scriptPath,
			imagePath,
		]);
		powershell.on("exit", function (code, signal) {});
		powershell.stdout.on("data", function (data) {
			cb(data.toString().trim());
		});
	} else if (platform === "darwin") {
		// Mac
		let scriptPath = path.join(__dirname, "./mac.applescript");
		let ascript = spawn("osascript", [scriptPath, imagePath]);
		ascript.on("exit", function (code, signal) {});
		ascript.stdout.on("data", function (data) {
			cb(data.toString().trim());
		});
	} else {
		// Linux
		let scriptPath = path.join(__dirname, "./linux.sh");
		let ascript = spawn("sh", [scriptPath, imagePath]);
		ascript.on("exit", function (code, signal) {});
		ascript.stdout.on("data", function (data) {
			let result = data.toString().trim();
			if (result == "no xclip") {
				vscode.window.showInformationMessage("You need to install xclip command first.");
				return;
			}
			cb(result);
		});
	}
}

const File = require("./File.js");

/**
 * 
 * @param {string} filename 
 */
const addHeader = function(filename) {
	const build_date = new Date();
	const header = [];
	header.push("/*!");
	header.push(" * jptext.js");
	header.push(" * https://github.com/natade-jp/jptext");
	header.push(" * Copyright 2013-" + build_date.getFullYear() + " natade < https://github.com/natade-jp >");
	header.push(" *");
	header.push(" * The MIT license.");
	header.push(" * https://opensource.org/licenses/MIT");
	header.push(" */");
	header.push("");
	const header_string = header.join("\n");
	const text = File.loadTextFile(filename);
	File.saveTextFile(filename, header_string + text);
};

// rollup
File.exec("npx rollup -c \"./scripts/rollup.config.js\"");

// 先頭に著作権表記をするターゲット
const target_file = [
	"./build/Senko.umd.js",
	"./build/Senko.module.mjs",
	"./build/SenkoS3.umd.js",
	"./build/SenkoS3.module.mjs"
];

// ヘッダ追加
for(const key in target_file) {
	addHeader(target_file[key]);
}

// サンプルファイルはbuild内のデータと関連付ける
File.saveTextFile(
	"./examples/libs/Senko.mjs",
	"import Senko from \"../../build/Senko.module.mjs\";export default Senko;"
);
File.saveTextFile(
	"./examples/libs/SenkoS3.mjs",
	"import SenkoS3 from \"../../build/SenkoS3.module.mjs\";export default SenkoS3;"
);

// その他のファイルをコピー
File.copy("./src/gui/SComponent.css", "./build/SComponent.css");
File.copy("./src/s3/gl/S3GL.fs", "./build/S3GL.fs");
File.copy("./src/s3/gl/S3GL.vs", "./build/S3GL.vs");

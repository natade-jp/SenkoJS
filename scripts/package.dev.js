const File = require("./File.js");

// サンプルファイルは直接関連付ける
File.saveTextFile(
	"./examples/libs/Senko.mjs",
	"import Senko from \"../../src/Senko.js\";export default Senko;"
);
File.saveTextFile(
	"./examples/libs/SenkoS3.mjs",
	"import SenkoS3 from \"../../src/SenkoS3.js\";export default SenkoS3;"
);

// その他のファイルをコピー
File.copy("./src/gui/SComponent.css", "./build/SComponent.css");
File.copy("./src/s3/gl/S3GL.fs", "./build/S3GL.fs");
File.copy("./src/s3/gl/S3GL.vs", "./build/S3GL.vs");

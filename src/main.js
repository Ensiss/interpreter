var fs = require("fs");
var util = require("util");

var lexer = require("./lexer");
var parser = require("./parser");
var interpreter = require("./interpreter");

"use strict";

function main() {
    if (process.argv.length < 3) {
	console.log("Usage: node " + process.argv[1] + " file");
	process.exit();
    }

    var content = fs.readFileSync(process.argv[2], "utf8");
    var lexemes = lexer(content);
    console.log("Lexemes:")
    console.log(lexemes);
    var ast = parser(lexemes);
    console.log("\nAST:");
    console.log(util.inspect(ast, false, null));

    console.log("\nResult: " + interpreter(ast));
}

main();

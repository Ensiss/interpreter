var lexer = require("./src/lexer");
var parser = require("./src/parser");
var interpreter = require("./src/interpreter");

"use strict";

function test(title, expr, res) {
    process.stdout.write("Testing " + title + "...");
    var calc = interpreter(parser(lexer(expr)));
    if (res === undefined)
	var res = eval(expr);

    if (res == calc)
	console.log(" ok");
    else {
	console.log(" ko: " + expr + " returned '" + calc + "' instead of '" + res + "'");
    }
}

function doTests() {
    test("plus operator", "1 + 1;");
    test("minus operator", "10 - 1;");
    test("multiplication operator", "3 * 5;");
    test("division operator", "15 / 3;");
    test("modulo operator", "15 % 3;");
    test("power operator", "3 ** 2;", Math.pow(3, 2));
    test("complex expressions", "1+4/5*4+51+(4*(945+94/748)+44+2)+56;");
    test("operator predecence", "1 + 2 * 5;");
    test("negative numbers", "-5;");
    test("parenthesis", "-(1 + 2) * 5;");

    test("blocks", "{1 + 2; 2 * 3;}");
    test("variables", "{a = 5 + 2; a;}");
    test("scopes", "{ {a = 5;} a;}", null);
}

doTests();

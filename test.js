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
	console.log(" [32mok[0m");
    else {
	console.log(" [31mko[0m: " + expr + " returned '" + calc + "' instead of '" + res + "'");
    }
}

function doTests() {
    console.log("Mathematical expressions:");
    test("plus operator", "1 + 1;");
    test("minus operator", "10 - 1;");
    test("multiplication operator", "3 * 5;");
    test("division operator", "15 / 3;");
    test("modulo operator", "15 % 3;");
    test("power operator", "3 ** 2;", Math.pow(3, 2));
    test("operator predecence", "1 + 2 * 5;");
    test("negative numbers", "-5;");
    test("parenthesis", "-(1 + 2) * 5;");

    console.log("\nBlocks and variables");
    test("blocks", "{1 + 2; 2 * 3;}");
    test("variables", "{a = 5 + 2; a;}");
    test("scopes", "{ {a = 5;} a;}", null);
    test("increment", "{a = 5; --a; a;}");
    test("increment", "{a = 5; --a;}");
    test("decrement", "{a = 5; ++a; a;}");
    test("decrement", "{a = 5; ++a;}");

    console.log("\nLogical operators");
    test("logical and", "0 && 5;");
    test("logical and", "5 && 0;");
    test("logical and", "0 && 0;");
    test("logical and", "5 && 7;");
    test("logical or", "0 || 5;");
    test("logical or", "5 || 0;");
    test("logical or", "0 || 0;");
    test("logical or", "5 || 7;");
    test("logical not", "!5;");
    test("logical not", "!0;");

    console.log("\nBitwise operators");
    test("bitwise and", "65421 & 255;");
    test("bitwise or", "65421 | 255;");
    test("bitwise xor", "65421 ^ 255;");
    test("bitwise not", "~65421;");
    test("bitwise left shift", "21 << 1;");
    test("bitwise right shift", "42 >> 2;");

    console.log("\nComparison");
    test("equality", "1 == 1;");
    test("equality", "1 == 5;");
    test("inequality", "1 != 1;");
    test("inequality", "1 != 5;");
    test("inferiority", "1 < 5;");
    test("inferiority", "1 < -5;");
    test("superiority", "1 > 5;");
    test("superiority", "1 > -5;");
    test("inferior or equality", "1 <= 5;");
    test("inferior or equality", "1 <= -5;");
    test("inferior or equality", "1 <= 1;");
    test("superior or equality", "1 >= 5;");
    test("superior or equality", "1 >= -5;");
    test("superior or equality", "1 >= 1;");

    console.log("\nMixed expressions");
    test("complex expressions", "1+4/5*4+51+(4*(945+94/748)+44+2)+56;");
    test("complex logical", "0 || 45-54/9 && 564 + 485 * 4 || 45 / 6;");
}

doTests();

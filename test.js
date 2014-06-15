var lexer = require("./src/lexer");
var parser = require("./src/parser");
var interpreter = require("./src/interpreter");

"use strict";

function test(title, expr, res) {
    process.stdout.write("\tTesting " + title + "...");
    var calc = interpreter(parser(lexer(expr)));
    if (res === undefined)
	var res = eval(expr);

    if (res == calc) {
	console.log(" [32mok[0m");
	return (0);
    } else
	console.log(" [31mko[0m: " + expr + " returned '" + calc + "' instead of '" + res + "'");
    return (1);
}

function doTests() {
    var fail = 0;

    console.log("Mathematical expressions:");
    fail += test("plus operator", "1 + 1;");
    fail += test("minus operator", "10 - 1;");
    fail += test("multiplication operator", "3 * 5;");
    fail += test("division operator", "15 / 3;");
    fail += test("modulo operator", "15 % 3;");
    fail += test("power operator", "3 ** 2;", Math.pow(3, 2));
    fail += test("operator predecence", "1 + 2 * 5;");
    fail += test("negative numbers", "-5;");
    fail += test("parenthesis", "-(1 + 2) * 5;");

    console.log("\nBlocks and functions");
    fail += test("blocks", "{1 + 2; 2 * 3;}");
    fail += test("scopes", "{ {a = 5;} a;}", null);
    fail += test("functions", "{ square = function(x) { x*x; }; square(5); }", 25);

    console.log("\nVariable assignation");
    fail += test("assign", "{a = 5 + 2; a;}");
    fail += test("increment", "{a = 5; --a;}");
    fail += test("decrement", "{a = 5; ++a;}");
    fail += test("add and assign", "{a = 5 + 2; a += 2;}");
    fail += test("subtract and assign", "{a = 5 + 2; a -= 2;}");
    fail += test("multiply and assign", "{a = 5 + 2; a *= 2;}");
    fail += test("divide and assign", "{a = 5 + 2; a /= 2;}");
    fail += test("modulo and assign", "{a = 5 + 2; a %= 2;}");
    fail += test("bitwise and and assign", "{a = 5 + 2; a &= 2;}");
    fail += test("bitwise or and assign", "{a = 5 + 2; a |= 2;}");
    fail += test("bitwise xor and assign", "{a = 5 + 2; a ^= 2;}");
    fail += test("left shift and assign", "{a = 5 + 2; a <<= 2;}");
    fail += test("right shift and assign", "{a = 5 + 5; a >>= 2;}");

    console.log("\nConditions");
    fail += test("success if", "{a = 5; if(a == 5) a = 6; a;}");
    fail += test("failure if", "{a = 5; if(a != 5) a = 6; a;}");
    fail += test("success if else", "{a = 5; if(a == 5) a = 6; else a = 7; a;}");
    fail += test("failure if else", "{a = 5; if(a != 5) a = 6; else a = 7; a;}");

    console.log("\nLoops");
    fail += test("while", "{a = 10; while (a < 20) ++a; a;}");
    fail += test("while", "{a = 10; while (a > 20) ++a; a;}");
    fail += test("for", "{a = -10; for (a = 0; a < 10; ++a) 0; a;}");
    fail += test("for scope", "{for (a = 0; a < 20; ++a) 0; a;}", null);
    fail += test("do while", "{a = 5; do ++a; while (a < 10);}");

    console.log("\nLogical operators");
    fail += test("logical and", "0 && 5;");
    fail += test("logical and", "5 && 0;");
    fail += test("logical and", "0 && 0;");
    fail += test("logical and", "5 && 7;");
    fail += test("logical or", "0 || 5;");
    fail += test("logical or", "5 || 0;");
    fail += test("logical or", "0 || 0;");
    fail += test("logical or", "5 || 7;");
    fail += test("logical not", "!5;");
    fail += test("logical not", "!0;");

    console.log("\nBitwise operators");
    fail += test("bitwise and", "65421 & 255;");
    fail += test("bitwise or", "65421 | 255;");
    fail += test("bitwise xor", "65421 ^ 255;");
    fail += test("bitwise not", "~65421;");
    fail += test("bitwise left shift", "21 << 1;");
    fail += test("bitwise right shift", "42 >> 2;");

    console.log("\nComparison");
    fail += test("equality", "1 == 1;");
    fail += test("equality", "1 == 5;");
    fail += test("inequality", "1 != 1;");
    fail += test("inequality", "1 != 5;");
    fail += test("inferiority", "1 < 5;");
    fail += test("inferiority", "1 < -5;");
    fail += test("superiority", "1 > 5;");
    fail += test("superiority", "1 > -5;");
    fail += test("inferior or equality", "1 <= 5;");
    fail += test("inferior or equality", "1 <= -5;");
    fail += test("inferior or equality", "1 <= 1;");
    fail += test("superior or equality", "1 >= 5;");
    fail += test("superior or equality", "1 >= -5;");
    fail += test("superior or equality", "1 >= 1;");

    console.log("\nMixed expressions");
    fail += test("complex expressions", "1+4/5*4+51+(4*(945+94/748)+44+2)+56;");
    fail += test("complex logical", "0 || 45-54/9 && 564 + 485 * 4 || 45 / 6;");

    console.log("\n" + fail + " test" + (fail == 1 ? "" : "s") + " failed.");
}

doTests();

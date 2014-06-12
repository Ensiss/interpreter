"use strict";

var interpreter = (function () {
    var funcs = {LX_PLUS: function(c) { return (interpreter(c[0]) + interpreter(c[1])); },
		 LX_MINUS: function(c) { return (interpreter(c[0]) - interpreter(c[1])); },
		 LX_POW: function(c) { return (Math.pow(interpreter(c[0]), interpreter(c[1]))); },
		 LX_MULT: function(c) { return (interpreter(c[0]) * interpreter(c[1])); },
		 LX_DIV: function(c) { return (interpreter(c[0]) / interpreter(c[1])); },
		 LX_MODULO: function(c) { return (interpreter(c[0]) % interpreter(c[1])); }
		}

    function interpreter(ast) {
	if (!ast)
	    return (null);
	return (interpretExpr(ast));
    }

    function interpretExpr(ast) {
	if (ast.name == "LX_NUMBER")
	    return (ast.val);
	if (funcs[ast.name])
	    return (funcs[ast.name](ast.children));
	return (null);
    }

    return (interpreter);
} ());

module.exports = interpreter;

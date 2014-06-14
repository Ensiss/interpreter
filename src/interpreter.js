"use strict";

var interpreter = (function () {
    var _scopeStack = [];
    var _this;
    var _super;
    var _funcs = {LX_PLUS: function(c) { return (interpretExpr(c[0]) + interpretExpr(c[1])); },
		  LX_MINUS: function(c) { return (interpretExpr(c[0]) - interpretExpr(c[1])); },
		  LX_POW: function(c) { return (Math.pow(interpretExpr(c[0]), interpretExpr(c[1]))); },
		  LX_MULT: function(c) { return (interpretExpr(c[0]) * interpretExpr(c[1])); },
		  LX_DIV: function(c) { return (interpretExpr(c[0]) / interpretExpr(c[1])); },
		  LX_MODULO: function(c) { return (interpretExpr(c[0]) % interpretExpr(c[1])); },
		  LX_INC: function(c) { return (setValue(c[0].val, getValue(c[0].val) + 1)); },
		  LX_DEC: function(c) { return (setValue(c[0].val, getValue(c[0].val) - 1)); },

		  LX_OR: function(c) { return (interpretExpr(c[0]) | interpretExpr(c[1])); },
		  LX_XOR: function(c) { return (interpretExpr(c[0]) ^ interpretExpr(c[1])); },
		  LX_AND: function(c) { return (interpretExpr(c[0]) & interpretExpr(c[1])); },
		  LX_NOT: function(c) { return (~interpretExpr(c[0])); },
		  LX_LSHIFT: function(c) { return (interpretExpr(c[0]) << interpretExpr(c[1])); },
		  LX_RSHIFT: function(c) { return (interpretExpr(c[0]) >> interpretExpr(c[1])); },

		  LX_EQ: function(c) { return (interpretExpr(c[0]) == interpretExpr(c[1])); },
		  LX_NEQ: function(c) { return (interpretExpr(c[0]) != interpretExpr(c[1])); },
		  LX_LT: function(c) { return (interpretExpr(c[0]) < interpretExpr(c[1])); },
		  LX_LE: function(c) { return (interpretExpr(c[0]) <= interpretExpr(c[1])); },
		  LX_GT: function(c) { return (interpretExpr(c[0]) > interpretExpr(c[1])); },
		  LX_GE: function(c) { return (interpretExpr(c[0]) >= interpretExpr(c[1])); },

		  LX_ASSIGN: function(c) { return (setValue(c[0].val, interpretExpr(c[1]))); },
		  LX_PLUSSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) + interpretExpr(c[1]))); },
		  LX_MINUSSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) - interpretExpr(c[1]))); },
		  LX_MULTSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) * interpretExpr(c[1]))); },
		  LX_DIVSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) / interpretExpr(c[1]))); },
		  LX_MODULOSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) % interpretExpr(c[1]))); },
		  LX_ANDSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) & interpretExpr(c[1]))); },
		  LX_ORSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) | interpretExpr(c[1]))); },
		  LX_XORSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) ^ interpretExpr(c[1]))); },
		  LX_LSHIFTSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) << interpretExpr(c[1]))); },
		  LX_RSHIFTSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) >> interpretExpr(c[1]))); },

		  LX_LNOT: function(c) { return (interpretExpr(c[0]) ? 0 : 1); },
		  LX_LOR: function(c) {
		      var val = interpretExpr(c[0]);
		      return (val ? val : interpretExpr(c[1]));
		  },
		  LX_LAND: function(c) {
		      var val = interpretExpr(c[0]);
		      return (!val ? val : interpretExpr(c[1]));
		  },

		  LX_BLOCK: function(c) {
		      var val;
		      pushScope();
		      for (var i in c)
			  val = interpretExpr(c[i]);
		      popScope();
		      return (val);
		  }
		 }

    function interpreter(ast) {
	if (!ast)
	    return (null);
	pushScope();
	return (interpretExpr(ast));
    }

    function interpretExpr(ast) {
	if (ast.name == "LX_NUMBER")
	    return (ast.val);
	if (ast.name == "LX_ID")
	    return (getValue(ast.val));
	if (_funcs[ast.name])
	    return (_funcs[ast.name](ast.children));
	return (null);
    }

    function setValue(name, val) {
	for (var i = _scopeStack.length - 1; i >= 0; i--) {
	    if (_scopeStack[i][name] != undefined) {
		_scopeStack[i][name] = val;
		return (val);
	    }
	}
	_this[name] = val;
	return (val);
    }

    function getValue(name) {
	for (var i = _scopeStack.length - 1; i >= 0; i--) {
	    if (_scopeStack[i][name] != undefined)
		return (_scopeStack[i][name]);
	}
	return (undefined);
    }

    function pushScope() {
	_scopeStack.push({});
	_this = _scopeStack[_scopeStack.length - 1];
	_super = _scopeStack[_scopeStack.length - 2];
    }

    function popScope() {
	_scopeStack.pop();
	_this = _super;
	_super = _scopeStack[_scopeStack.length - 2];
    }

    return (interpreter);
} ());

module.exports = interpreter;

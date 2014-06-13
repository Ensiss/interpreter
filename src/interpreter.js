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
		  LX_BLOCK: function(c) {
		      pushScope();
		      for (var i in c)
			  interpretExpr(c[i]);
		      popScope();
		  },
		  LX_ASSIGN: function(c) {
		      var val = interpretExpr(c[1]);
		      setValue(c[0].val, val);
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
		return;
	    }
	}
	_this[name] = val;
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

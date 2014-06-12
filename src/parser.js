"use strict";

var parser = (function () {
    var _err;
    var _lex;
    var _curr;
    var _ast;

    function parser(lexemes) {
	_err = false;
	_lex = lexemes;
	shift();
	_ast = ruleExpression();
	if (_curr)
	    error("Unexpected symbol at the end of expression: " + _curr.name);
	return (_err ? null : _ast);
    }

    /* factor: number
             | "(" expression ")"
     */
    function ruleFactor() {
	var node;

	if (accept("LX_NUMBER")) {
	    node = {name:_curr.name, val:parseFloat(_curr.val)};
	    shift();
	}
	else if (accept("LX_LPAREN")) {
	    shift();
	    node = ruleExpression();
	    if (expect("LX_RPAREN"))
		shift();
	} else
	    error("Can't make rule \"factor\"");
	return (node);
    }

    /* expression: ("-"|"+")? term (("-"|"+") term)*
     */
    function ruleExpression() {
	var parent;
	var node;

	if (accept("LX_MINUS")) {
	    node = {name:_curr.name, children:[]};
	    node.children.push({name:"LX_NUMBER", val:0});
	    shift();
	    node.children.push(ruleTerm());
	} else {
	    if (accept("LX_PLUS"))
		shift();
	    node = ruleTerm();
	}
	while (accept(["LX_PLUS", "LX_MINUS"])) {
	    parent = {name:_curr.name, children:[node]};
	    shift();
	    parent.children.push(ruleTerm());
	    node = parent;
	}
	return (node);
    }

    /* term: factor (("*"|"/"|"%") factor)*
     */
    function ruleTerm() {
	var node;
	var parent;

	node = ruleFactor();
	while (accept(["LX_MULT", "LX_DIV", "LX_MODULO"])) {
	    parent = {name:_curr.name, children:[node]};
	    shift();
	    parent.children.push(ruleFactor());
	    node = parent;
	}
	return (node);
    }

    function accept(lx) {
	if (!_curr)
	    return (false);
	if (typeof lx == "string") {
	    if (_curr.name == lx)
		return (true);
	} else {
	    for (var i in lx) {
		if (_curr.name == lx[i])
		    return (true);
	    }
	}
	return (false);
    }

    function expect(lx) {
	if (accept(lx))
	    return (true);
	error("Expected symbol \"" + lx + "\" but got \"" + _curr.name + "\"");
	return (false);
    }

    function shift() {
	do
	    _curr = _lex.shift();
	while (_curr && _curr.name == "LX_NEWLINE");
    }

    function error(msg) {
	if (_curr)
	    console.error("Error at line " + _curr.line + ": " + msg);
	else
	    console.error("Error: " + msg);
	_err = true;
    }

    return (parser);
} ());

module.exports = parser;

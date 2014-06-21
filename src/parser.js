"use strict";

var parser = (function () {
    var _err;
    var _lex;
    var _curr;
    var _ast;
    var _precedence = [{lx:"LX_LOR"},
		       {lx:"LX_LAND"},
		       {lx:"LX_OR"},
		       {lx:"LX_XOR"},
		       {lx:"LX_AND"},
		       {lx:["LX_EQ", "LX_NEQ"]},
		       {lx:["LX_LE", "LX_LT", "LX_GE", "LX_GT"]},
		       {lx:["LX_LSHIFT", "LX_RSHIFT"]},
		       {lx:["LX_PLUS", "LX_MINUS"]},
		       {lx:["LX_MULT", "LX_DIV", "LX_MODULO"]},
		       {lx:"LX_POW", func:ruleUnary}];

    function parser(lexemes) {
	var tmp;

	_err = false;
	_lex = lexemes;
	shift();
	_ast = {name:"LX_BLOCK", children:[]};
	while ((tmp = ruleBlock()))
	    _ast.children.push(tmp);
	if (_curr)
	    error("Unexpected symbol at the end of expression: " + _curr.name);
	return (_err ? null : _ast);
    }

    /* block: "{" instruction+ "}"
     */
    function ruleBlock() {
	var node;

	if (accept("LX_LCURLY")) {
	    shift();
	    node = {name:"LX_BLOCK", children:[]};
	    do {
		node.children.push(ruleBlock());
	    } while (!accept("LX_RCURLY") && !_err);
	    shift();
	}
	else
	    node = ruleIf() || ruleWhile() || ruleDoWhile() || ruleFor() || ruleInstruction();
	return (node);
    }

    /* for: "for" "(" assign; assign; assign ")" block
     */
    function ruleFor() {
	var node = false;
	var def = {name:"LX_NUMBER", val:1};

	if (accept("LX_FOR")) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    if (!expect("LX_LPAREN"))
		return (false);
	    shift();
	    node.children.push(ruleAssign() || def);
	    if (!expect("LX_SEMICOLON"))
		return (false);
	    shift();
	    node.children.push(ruleAssign() || def);
	    if (!expect("LX_SEMICOLON"))
		return (false);
	    shift();
	    node.children.push(ruleAssign() || def);
	    if (!expect("LX_RPAREN"))
		return (false);
	    shift();
	    node.children.push(ruleBlock());
	}
	return (node);
    }

    /* dowhile: "do" block "while" "(" assign ")";
     */
    function ruleDoWhile() {
	var node = false;

	if (accept("LX_DO")) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    node.children.push(ruleBlock());
	    if (!expect("LX_WHILE") || !shift() || !expect("LX_LPAREN") || !shift())
		return (false);
	    node.children.push(ruleAssign());
	    if (!expect("LX_RPAREN") || !shift() || !expect("LX_SEMICOLON") || !shift())
		return (false);
	}
	return (node);
    }

    /* while: "while" "(" assign ")" block
     */
    function ruleWhile() {
	var node = false;

	if (accept("LX_WHILE")) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    if (!expect("LX_LPAREN"))
		return (false);
	    shift();
	    node.children.push(ruleAssign());
	    if (!expect("LX_RPAREN"))
		return (false);
	    shift();
	    node.children.push(ruleBlock());
	}
	return (node);
    }

    /* if: "if" "(" assign ")" block ("else" block)?
     */
    function ruleIf() {
	var node = false;

	if (accept("LX_IF")) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    if (!expect("LX_LPAREN"))
		return (false);
	    shift();
	    node.children.push(ruleAssign());
	    if (!expect("LX_RPAREN"))
		return (false);
	    shift();
	    node.children.push(ruleBlock());
	    if (accept("LX_ELSE")) {
		shift();
		node.children.push(ruleBlock());
	    }
	}
	return (node);
    }

    /* instruction: assign ";"
     */
    function ruleInstruction() {
	var node = ruleAssign();

	if (!node || !expect("LX_SEMICOLON"))
	    return (false);
	shift();
	return (node);
    }

    /* assign: (id "=")? plusMinus
     */
    function ruleAssign() {
	var parent;
	var node;
	var tmp;

	if (accept("LX_ID") &&
	    ["ASSIGN", "PLUSSET", "MINUSSET", "MULTSET", "DIVSET", "MODULOSET", "ANDSET",
	     "ORSET", "XORSET", "LSHIFTSET", "RSHIFTSET"].indexOf(_lex[0].name.substr(3)) >= 0) {
	    node = {name:_lex[0].name, children:[]};
	    node.children.push({name:_curr.name, val:_curr.val});
	    shift();
	    shift();
	    if (!(tmp = operatorPipeline(0)))
		return (false);
	    node.children.push(tmp);
	} else if (!(node = operatorPipeline(0)))
	    return (false);
	return (node);
    }

    /* Operator pipeline that handles operator precedence
       via multiple recursions with changing arguments
     */
    function operatorPipeline(id) {
	var state = _precedence[id]
	var node;
	var parent;
	var tmp;

	node = state.func ? state.func() : operatorPipeline(id + 1);
	while (accept(state.lx)) {
	    parent = {name:_curr.name, children:[node]};
	    shift();
	    if (!(tmp = (state.func ? state.func() : operatorPipeline(id + 1))))
		return (false);
	    parent.children.push(tmp);
	    node = parent;
	}
	return (node);
    }

    /* unary: [+-!] base
            | (--|++) id
     */
    function ruleUnary() {
	var node;
	var tmp;

	if (accept("LX_MINUS")) {
	    node = {name:_curr.name, children:[]};
	    node.children.push({name:"LX_NUMBER", val:0});
	    shift();
	    if (!(tmp = ruleBase()))
		return (false);
	    node.children.push(tmp);
	} else if (accept(["LX_LNOT", "LX_NOT"])) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    if (!(tmp = ruleBase()))
		return (false);
	    node.children.push(tmp);
	} else if (accept(["LX_INC", "LX_DEC"])) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    if (!expect("LX_ID"))
		return (false);
	    node.children.push({name:_curr.name, val:_curr.val});
	    shift();
	} else {
	    if (accept("LX_PLUS"))
		shift();
	    if (!(node = ruleBase()))
		return (false);
	}
	return (node);
    }

    /* base: number
           | id
           | "(" expression ")"
     */
    function ruleBase() {
	var node = false;
	var tmp;

	if ((tmp = ruleFuncCall()) || (tmp = ruleFunc()))
	    node = tmp;
	else if (accept("LX_STRING")) {
	    node = {name:_curr.name, val:_curr.val.substr(1, _curr.val.length - 2)};
	    shift();
	}
	else if (accept("LX_NUMBER")) {
	    node = {name:_curr.name, val:parseFloat(_curr.val)};
	    shift();
	} else if (accept("LX_ID")) {
	    node = {name:_curr.name, val:_curr.val};
	    shift();
	} else if (accept("LX_LPAREN")) {
	    shift();
	    node = ruleAssign();
	    if (expect("LX_RPAREN"))
		shift();
	} else
	    return (false);
	return (node);
    }

    /* func: "function" "(" id? (, id)* ")" block
     */
    function ruleFunc() {
	var node = false;
	var args = {name:"LX_ARGS", children:[]};

	if (accept("LX_FUNC")) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    if (!expect("LX_LPAREN") || !shift())
		return (false);
	    if (expect("LX_ID")) {
		args.children.push({name:_curr.name, val:_curr.val});
		shift();
		while (accept("LX_COMMA") && shift()) {
		    if (!expect("LX_ID"))
			return (false);
		    args.children.push({name:_curr.name, val:_curr.val});
		    shift();
		}
	    }
	    node.children.push(args);
	    if (!expect("LX_RPAREN") || !shift())
		return (false);
	    node.children.push(ruleBlock());
	}
	return (node);
    }

    /* funcCall: id "(" assign? ("," assign ")") ")"
     */
    function ruleFuncCall() {
	var node = null;
	var tmp;

	if (accept("LX_ID") && _lex[0].name == "LX_LPAREN") {
	    node = {name:"LX_FUNCALL", children:[{name:_curr.name, val:_curr.val}]};
	    shift();
	    shift();
	    if ((tmp = ruleAssign())) {
		node.children.push(tmp);
		while (accept("LX_COMMA") && shift()) {
		    if (!(tmp = ruleAssign()))
			return (false);
		    node.children.push(tmp);
		}
	    }
	    if (!expect("LX_RPAREN") || !shift())
		return (false);
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
	if (_curr)
	    error("Expected symbol \"" + lx + "\" but got \"" + _curr.name + "\"");
	else
	    error("Expected symbol \"" + lx + "\"");
	return (false);
    }

    function shift() {
	do
	    _curr = _lex.shift();
	while (_curr && _curr.name == "LX_NEWLINE");
	return (true);
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

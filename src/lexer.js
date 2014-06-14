"use strict";

var lexeme_list = [
    // Keywords
    {name:"LX_IF", rx:'if(?![a-zA-Z0-9_])'},
    {name:"LX_ELSE", rx:'else(?![a-zA-Z0-9_])'},
    {name:"LX_WHILE", rx:'while(?![a-zA-Z0-9_])'},
    {name:"LX_FOR", rx:'for(?![a-zA-Z0-9_])'},
    {name:"LX_FUNC", rx:'function(?![a-zA-Z0-9_])'},
    {name:"LX_VAR", rx:'var(?![a-zA-Z0-9_])'},
    {name:"LX_RETURN", rx:'return(?![a-zA-Z0-9_])'},

    // Constants
    {name:"LX_ID", rx:'[a-zA-Z_][a-zA-Z0-9_]*'},
    {name:"LX_NUMBER", rx:'[0-9]+(\\.[0-9]*)?'},
    {name:"LX_STRING", rx:'"(\\\\"|[^"])*"|' + "'(\\\\'|[^'])*'"},

    // Punctuation
    {name:"LX_LPAREN", rx:'\\('},
    {name:"LX_RPAREN", rx:'\\)'},
    {name:"LX_LCURLY", rx:'\\{'},
    {name:"LX_RCURLY", rx:'\\}'},
    {name:"LX_LBRACKET", rx:'\\['},
    {name:"LX_RBRACKET", rx:'\\]'},
    {name:"LX_SEMICOLON", rx:';'},
    {name:"LX_COLON", rx:':'},
    {name:"LX_COMMA", rx:','},
    {name:"LX_DOT", rx:'\\.'},

    // Logical
    {name:"LX_LAND", rx:'&&'},
    {name:"LX_LOR", rx:'\\|\\|'},

    // Binary
    {name:"LX_AND", rx:'&'},
    {name:"LX_OR", rx:'\\|'},
    {name:"LX_XOR", rx:'\\^'},
    {name:"LX_NOT", rx:'~'},
    {name:"LX_LSHIFT", rx:'<<'},
    {name:"LX_RSHIFT", rx:'>>'},

    // Comparison
    {name:"LX_EQ", rx:'=='},
    {name:"LX_NEQ", rx:'!='},
    {name:"LX_LE", rx:'<='},
    {name:"LX_GE", rx:'>='},
    {name:"LX_LT", rx:'<'},
    {name:"LX_GT", rx:'>'},

    // Logical not
    {name:"LX_LNOT", rx:'!'},

    // Assignment
    {name:"LX_ASSIGN", rx:'='},

    // Operators
    {name:"LX_INC", rx:'\\+\\+'},
    {name:"LX_DEC", rx:'--'},
    {name:"LX_POW", rx:'\\*\\*'},
    {name:"LX_PLUS", rx:'\\+'},
    {name:"LX_MINUS", rx:'-'},
    {name:"LX_MULT", rx:'\\*'},
    {name:"LX_DIV", rx:'/'},
    {name:"LX_MODULO", rx:'%'}
];

function lexer(stream) {
    var lexemes = [];
    var line = 0;

    while (stream) {
	var match = null;
	if ((match = stream.match(/^[ \t\v\f]+/))) {
	} else if ((match = stream.match(/^[\r\n]+/))) {
	    lexemes.push({name:"LX_NEWLINE", line:line});
	    line += match[0].length;
	}
	for (var i = 0; !match && i < lexeme_list.length; i++) {
	    if ((match = stream.match(RegExp("^(" + lexeme_list[i].rx + ")"))))
		lexemes.push({name:lexeme_list[i].name, val:match[0], line:line});
	}
	if (match)
	    stream = stream.substring(match[0].length);
	else if ((match = stream.match(/^\S+/))) {
	    console.error("Unknown lexeme: " + match[0]);
	    stream = stream.substring(match[0].length);
	} else
	    break;
    }
    return (lexemes);
}

module.exports = lexer;

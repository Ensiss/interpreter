"use strict";

var lexeme_list = [{name:"LX_LPAREN", rx:'\\('},
		   {name:"LX_RPAREN", rx:'\\)'},
		   {name:"LX_NUMBER", rx:'[0-9]+(\\.[0-9]*)?'},
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

(mnemonic) @function
(ascii (ascii_string) @string) @function.builtin
(data) @tag
(ascii_string (ascii_char_escaped) @string.special)
(expression ((expression) (add) @operator (expression)))
(expression ((expression) (sub) @operator (expression)))
(expression ((expression) (mul) @operator (expression)))
(expression ((expression) (div) @operator (expression)))
(comment) @comment
(label (identifier) @constant) @punctuation.delimiter
(instruction (mnemonic) @keyword)
(sep) @punctuation.delimiter
(expression (number)) @number
(expression (identifier)) @constant
(parenthesized ((lparen) @punctuation.bracket (expression) (rparen) @punctuation.bracket))
(parameter (immediate (expression)) @attribute)
(parameter (relative (expression)) @attribute)

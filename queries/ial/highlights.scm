(ascii_string) @string
(ascii_char_literal) @number
(ascii_char_escaped) @string.special
"DATA" @keyword
"ASCII" @keyword

(unary_op (_) (expression (number))) @number
(add) @operator
(sub) @operator
(mul) @operator
(div) @operator
(comment) @comment
(label) @punctuation.delimiter
(sep) @punctuation.delimiter
(expression) @expression

(unary_op (sub) (expression (number))) @number
(mnemonic) @keyword
(number) @number
(identifier) @variable
(lparen) @punctuation.bracket
(rparen) @punctuation.bracket

(parameter (immediate "#" @attribute (expression)))
(parameter (relative "@" @attribute (expression)))

(MISSING) @missing-node
(ERROR) @error-node

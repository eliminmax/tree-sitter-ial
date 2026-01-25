(comment) @comment
(ascii_string) @string
(ascii_char_literal) @number
(ascii_char_escaped) @string.special
"DATA" @keyword
"ASCII" @keyword

(add) @operator
(sub) @operator
(mul) @operator
(div) @operator
(label (identifier) @variable) @punctuation.delimiter
(sep) @punctuation.delimiter
(expression) @expression
(unary_op (sub) (expression (number))) @number
(instruction _ @function.builtin)
(number) @number
(identifier) @variable
(lparen) @punctuation.bracket
(rparen) @punctuation.bracket
(parameter (immediate "#" @attribute (expression)))
(parameter (relative "@" @attribute (expression)))

(MISSING) @missing-node
(ERROR) @error-node

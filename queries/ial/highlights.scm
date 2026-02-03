(comment) @comment
(ascii_string) @string
(ascii_char_literal) @number
(ascii_char_escaped) @string.escape
"DATA" @keyword
"ASCII" @keyword

(add) @operator
(sub) @operator
(mul) @operator
(div) @operator
(label(_) ":" @punctuation.special)
(sep) @punctuation.delimiter
(expression) @expression
((unary_op (sub).(expression (number))) @number (#set! priority 105))
(instruction . _ @function.builtin _*)
(number) @number
(identifier) @label
(lparen) @punctuation.bracket
(rparen) @punctuation.bracket
(parameter (immediate "#" @attribute _*))
(parameter (relative "@" @attribute _*))

(MISSING) @missing-node
(ERROR) @error-node

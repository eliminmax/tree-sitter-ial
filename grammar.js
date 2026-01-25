/**
 * @file Intcode Assembly Language
 * @author Eli Array Minkoff <eli@planetminkoff.com>
 * @license 0BSD
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// convert pattern into a case-insensive RustRegex, using 'canon' as its valid form
const kw = (pattern, canon) => alias(new RustRegex("((?i)" + pattern + ")"), canon);

export default grammar({
  name: 'ial',

  word: $ => $.identifier,

  extras: ($) => [
    /[ \t]/,
  ],
  rules: {
    start: $ => repeat($._line),
    _line: $ => seq(
      repeat($.label),
      optional($._directive),
      optional($.comment),
      /\r?\n/,
    ),
    comment: $ => /;.*/,
    identifier: $ => new RustRegex("[\\p{ID_Start}_][\\p{ID_Continue}]*"),
    label: $ => seq($.identifier, token.immediate(':')),
    number: $ => /[0-9]+/,

    _directive: $ => choice(
      $.instruction,
      $.data,
      $.ascii,
    ),

    parenthesized: $ => seq($.lparen, $.expression, $.rparen),
    add: $ => '+',
    sub: $ => '-',
    mul: $ => '*',
    div: $ => '/',
    unary_op: $ => seq(choice($.add, $.sub), $.expression),
    lparen: $ => '(',
    rparen: $ => ')',

    expression: $ => choice(
      prec(5, $.parenthesized),
      prec.left(4, $.parenthesized),
      prec.left(3, seq($.expression, choice($.mul, $.div), $.expression)),
      prec.left(2, seq($.expression, choice($.add, $.sub), $.expression)),
      prec(1, $.unary_op),
      prec(0, choice( $.number, $.identifier, $.ascii_char_literal)),
    ),

    positional: $ => $.expression,
    immediate: $ => seq('#', $.expression),
    relative: $ => seq('@', $.expression),
    

    parameter: $ => choice(
      $.positional,
      $.immediate,
      $.relative,
    ),

    _params: $ => seq($.parameter, optional(seq($.sep, $._params))),

    mnemonic: $ => token(prec(1, new RustRegex("((?i)ADD|MUL|IN|OUT|JNZ|JZ|S?LT|S?EQ|(RBO|INCB)|HALT)"))),

    instruction: $ => seq(
      $.mnemonic,
      optional($._params)
    ),

    sep: $ => ',',

    data: $ => seq(
      alias(new RustRegex("((?i)DATA)[ \\t]"),  "DATA"),
      repeat(seq($.expression, $.sep)),
      $.expression
    ),
    ascii_char_escaped: $ => token.immediate(/\\([\\'"ntre]|3?[0-7]{1,2}|x[0-9a-fA-F]{2})/),
    ascii_char_literal: $ => seq("'", choice(token.immediate(/[^'\\]/), $.ascii_char_escaped), "'"),
    ascii_string: $ => seq('"', repeat(choice(token.immediate(/[^"\\]/), $.ascii_char_escaped)), token.immediate('"')),
    ascii: $ => seq(
      alias(new RustRegex("((?i)ASCII)[ \\t]"), "ASCII"), 
      $.ascii_string,
    ),
  }
});

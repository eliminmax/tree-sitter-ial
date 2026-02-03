/**
 * @file Intcode Assembly Language
 * @author Eli Array Minkoff <eli@planetminkoff.com>
 * @license 0BSD
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// convert pattern into a case-insensive RustRegex, using 'canon' as its valid form
const kw = (pattern, canon = pattern) => alias(token(prec(2, new RustRegex("((?i)" + pattern + ")"))), canon);

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
    label: $ => seq($.identifier, token.immediate(':')),


    identifier: $ => new RustRegex("[\\p{ID_Start}_][\\p{ID_Continue}]*"),
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
      prec(4, $.parenthesized),
      prec.left(3, seq($.expression, choice($.mul, $.div), $.expression)),
      prec.left(2, seq($.expression, choice($.add, $.sub), $.expression)),
      prec(1, $.unary_op),
      prec(0, choice( $.number, $.identifier, $.ascii_char_literal)),
    ),

    _op3: $ => seq(
        choice(kw("ADD"), kw("MUL"), kw("S?LT", "LT"), kw("S?EQ", "EQ")),
        $.parameter, $.sep, $.parameter, $.sep, $.parameter
    ),
    _op2: $ => seq(
        choice(kw("JNZ"), kw("JZ")),
        $.parameter, $.sep, $.parameter
    ),
    _op1: $ => seq(
        choice(kw("IN"), kw("OUT"), kw("RBO|INCB", "RBO")),
        $.parameter
    ),
    _op0: $ => kw("HALT"),

    positional: $ => seq(optional($.label), $.expression),
    immediate: $ => seq('#', optional($.label), $.expression),
    relative: $ => seq('@', optional($.label), $.expression),

    parameter: $ => choice(
      $.positional,
      $.immediate,
      $.relative,
    ),

    instruction: $ => choice($._op0, $._op1, $._op2, $._op3),

    sep: $ => ',',

    data: $ => seq(
      alias(new RustRegex("((?i)DATA)[ \\t]"),  "DATA"),
      repeat(seq($.expression, $.sep)),
      $.expression
    ),
    ascii_char_escaped: $ => token.immediate(/\\([\\'"ntre]|[0-3]?[0-7]{1,2}|x[0-9a-fA-F]{2})/),
    ascii_char_literal: $ => seq("'", choice(token.immediate(/[^'\\]/), $.ascii_char_escaped), "'"),
    ascii_string: $ => seq('"', repeat(choice(token.immediate(/[^"\\]/), $.ascii_char_escaped)), token.immediate('"')),
    ascii: $ => seq(
      alias(new RustRegex("((?i)ASCII)[ \\t]"), "ASCII"), 
      $.ascii_string,
    ),
  }
});

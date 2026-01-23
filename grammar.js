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
    source_file: $ => repeat($.line),
    line: $ => seq(
      repeat($.label),
      optional($.directive),
      optional($.comment),
      /\r?\n/,
    ),
    comment: $ => /;.*/,
    identifier: $ => new RustRegex("[\\p{ID_Start}_][\\p{ID_Continue}]*"),
    label: $ => seq($.identifier, token.immediate(':')),
    number: $ => /[0-9]+/,

    directive: $ => choice(
      $.instruction,
      $.data_directive,
      $.ascii_directive,
    ),

    expression: $ => choice(
      $.number,
      $.identifier,
      prec(2, seq('(', $.expression, ')')),
      prec.left(2, seq($.expression, /[*/]/, $.expression)),
      prec.left(1, seq($.expression, /[+-]/, $.expression)),
      prec.right(0, seq(/[+-]/, $.expression)),
    ),

    positional: $ => $.expression,
    immediate: $ => seq('#', $.expression),
    relative: $ => seq('@', $.expression),
    

    parameter: $ => choice(
      $.positional,
      $.immediate,
      $.relative,
    ),

    _params: $ => seq($.parameter, optional(seq(',', $._params))),
    _param_3: $ => seq($.parameter, ',', $.parameter, ',', $.parameter),
    _param_2: $ => seq($.parameter, ',', $.parameter),

    mismatched_instrunction: $ => seq(
      new RustRegex("((?i)ADD|MUL|IN|OUT|JNZ|JZ|S?LT|S?EQ|(RBO|INCB)|HALT)"),
      / \t/,
      $._params
    ),

    mnemonic: $ => token(prec(1, new RustRegex("((?i)ADD|MUL|IN|OUT|JNZ|JZ|S?LT|S?EQ|(RBO|INCB)|HALT)"))),

    _op3: $ => seq(
      choice(
        kw("ADD", 'ADD'),
        kw("MUL", 'MUL'),
        kw("S?LT", 'LT'),
        kw("S?EQ", 'EQ'),
      ),
      / \t/, $._param_3
    ),
    _op2: $ => seq(
      choice(kw("JZ", 'JZ'), kw("JNZ", "JNZ")), 
      / \t/, $._param_2
    ),
    _op1: $ => seq(
      choice(
        kw("IN", 'IN'),
        kw("OUT", 'OUT'),
        kw("RBO|INCB", 'RBO'),
      ),
      / \t/, $.parameter
    ),
    _op0: $ => kw("HALT", 'HALT'),

    instruction: $ => seq(
      $.mnemonic,
      optional($._params)
    ),



    data_directive: $ => seq(
      new RustRegex("((?i)DATA)[ \\t]"), 
      repeat(seq($.expression, ',')),
      $.expression
    ),
    ascii_string: $ => /"([^"\\]|(\\([\\'"ntre]|3?[0-7]{1,2}|x[0-9a-fA-F]{2})))*"/,
    ascii_directive: $ => seq(
      new RustRegex("((?i)ASCII)[ \\t]"), 
      $.ascii_string,
    ),
  }
});

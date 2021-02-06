# Coding Style


All the code in this repository is subject to the following style guide. Anything outside of this is not required to follow but it is recommended for new code to follow it. The most important thing is to have code consistency formatted within a particular project, subsystem or module.

## Indents and Control Statements

For all source files, the soft and hard tab widths are set at 4 spaces; if possible, use tabs instead of spaces for alignment of code blocks.

Control statements requiring curly brace blocks should have the opening brace on the same line as the statement, separated from the statement with a single space:

```js
statement {
	... code ...
}

function(arg, arg2) {
	... code ...
}
```

Control statements with parenthesis-enclosed statements, such as if, should have a space between the statement and the opening parenthesis:

```js
statement (expr) {
	... code ...
}
```

Else statements should be on the same line with the closing brace of the previous if statement:

```js
if (expr) {
	... code ...
} else {
	... code ...
}
```

Else statements may have if statements immediately following them forming a sort of "else if" statement on a single line:

```js
if (expr) {
	... code ...
} else if (expr) {
	... code ...
} else {
	... code ...
}
```

Statements that can use curly-brace enclosed blocks should use them, even if there is only a single statement in the block, unless that statement is a return statement for a single value, which may be inlined:

```js
// bad
if (expr) statement;

// good
if (expr) {
	statement;
}

// acceptable
if (expr) return value;

// very wrong
if (expr) return (long expr);
```

## Expressions

All binary arithmetic, comparison, and assignment operators other than ++ and -- must be spaced from their operands by a single space. The operands, however, do not have to be spaced from parentheses. Unary operators, such as !, do not have to be spaced:

```js
// bad
x-=(1+2)!0;

// good
x -= (1 + 2) * !0;

// good
x++;

// bad
if (!(x==(y+1))) {
}

// bad
if ( ! ( x == ( y + 1 ) ) ) {
}

// good
if (!(x == (y + 1))) {
}
```

## Names and Type Names

Function and global variable names should be in lower case, using underscores to separate parts of names. Static functions and static global variables are recommended to have a single underscore at the beginning of their name, especially if the name could conflict with another in the future. 

When a single structure is the central part of a subsystem, it is recommended to name that structure similarly to the subsystem. In addition, functions that operate upon that structure should then be prefixed with the name of the structure followed by an underscore. This essentially makes a namespace for the subsystem.

## Functions

Called functions and function declarations must not have a space between the function name and the opening parenthesis; arguments must be spaced, but not spaced from the enclosing parentheses.

```js
// bad
function (arg,arg2) {
}

// good
function(arg, arg2) {
}
```

Functions should declare all variables in a contiguous block at the top of the function body that is separated from any further code by a single empty line:

```js
function() {
	var var1 = 1;
	var var2 = [];

	... code ...
}
```

If no variables are declared in a function, there may still be a space between the function prototype line and the remaining code:

```js
// ok
function() {
	... code ...
}

// good
function() {

	... code ...
}
```

## Commenting and Blocks

When commenting inside functions, place single-line comments at the beginning of blocks. If an individual line needs to be commented, make it its own block before doing so. Do not put comments on the same line as code:

```js
// wrong
function() {

	line1; // this is an awesome line
	// this is a cool line
	line2;
}

// right
function() {

	// this is an awesome line
	line1;

	// this is a cool line
	line2;
}
```

Single line comments can be either C++ or C style (i.e., they can start with // or be delimited by /* and */); multiple line comments, however, must be C++ style. This is because it is impossible to comment out multiple lines with C style comments if those lines contain other C style comments.

Multiple-line comments inside functions may be of the following form:

```js
/*
 * This is a multi-line comment.
 * Please make it multiple lines.
 */
```

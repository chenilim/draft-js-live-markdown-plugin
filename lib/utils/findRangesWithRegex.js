"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

// Returns an array of arrays containing start and end indices for ranges of text
// that match the supplied regex
var findRangesWithRegex = function findRangesWithRegex(text, regex) {
  var ranges = [];
  var matches;

  do {
    matches = regex.exec(text);

    if (matches) {
      ranges.push([matches.index, matches.index + matches[0].length - 1]);
    }
  } while (matches);

  return ranges;
};

var _default = findRangesWithRegex;
exports["default"] = _default;
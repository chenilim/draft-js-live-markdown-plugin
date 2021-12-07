"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _findRangesWithRegex = _interopRequireDefault(require("../utils/findRangesWithRegex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createStrikethroughStyleStrategy = function createStrikethroughStyleStrategy() {
  var strikethroughRegex = /(~~)(.+?)(~~)/g;
  var strikethroughDelimiterRegex = /^(~~)|(~~)$/g;
  return {
    style: 'STRIKETHROUGH',
    delimiterStyle: 'STRIKETHROUGH-DELIMITER',
    findStyleRanges: function findStyleRanges(block) {
      // Return an array of arrays containing start and end indices for ranges of
      // text that should be crossed out
      // e.g. [[0,6], [10,20]]
      var text = block.getText();
      var strikethroughRanges = (0, _findRangesWithRegex["default"])(text, strikethroughRegex);
      return strikethroughRanges;
    },
    findDelimiterRanges: function findDelimiterRanges(block, styleRanges) {
      // Find ranges for delimiters at the beginning/end of styled text ranges
      // Returns an array of arrays containing start and end indices for delimiters
      var text = block.getText();
      var strikethroughDelimiterRanges = [];
      styleRanges.forEach(function (styleRange) {
        var delimiterRange = (0, _findRangesWithRegex["default"])(text.substring(styleRange[0], styleRange[1] + 1), strikethroughDelimiterRegex).map(function (indices) {
          return indices.map(function (x) {
            return x + styleRange[0];
          });
        });
        strikethroughDelimiterRanges = strikethroughDelimiterRanges.concat(delimiterRange);
      });
      return strikethroughDelimiterRanges;
    },
    styles: {
      textDecoration: 'line-through'
    },
    delimiterStyles: {
      opacity: 0.4,
      textDecoration: 'none'
    }
  };
};

var _default = createStrikethroughStyleStrategy;
exports["default"] = _default;
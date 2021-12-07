"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _findRangesWithRegex = _interopRequireDefault(require("../utils/findRangesWithRegex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Bold can be delimited by: **, __, ***, and ___
var createBoldStyleStrategy = function createBoldStyleStrategy() {
  var asteriskDelimitedRegex = '(\\*\\*\\*)(.+?)(\\*\\*\\*)|(\\*\\*)(.+?)(\\*\\*)(?!\\*)';
  var underscoreDelimitedRegex = '(___)(.+?)(___)|(__)(.+?)(__)(?!_)';
  var boldRegex = new RegExp("".concat(asteriskDelimitedRegex, "|").concat(underscoreDelimitedRegex), 'g');
  var boldDelimiterRegex = /^(\*\*\*|\*\*|___|__)|(\*\*\*|\*\*|___|__)$/g;
  return {
    style: 'BOLD',
    delimiterStyle: 'BOLD-DELIMITER',
    findStyleRanges: function findStyleRanges(block) {
      // Return an array of arrays containing start and end indices for ranges of
      // text that should be bolded
      // e.g. [[0,6], [10,20]]
      var text = block.getText();
      var boldRanges = (0, _findRangesWithRegex["default"])(text, boldRegex);
      return boldRanges;
    },
    findDelimiterRanges: function findDelimiterRanges(block, styleRanges) {
      // Find ranges for delimiters at the beginning/end of styled text ranges
      // Returns an array of arrays containing start and end indices for delimiters
      var text = block.getText();
      var boldDelimiterRanges = [];
      styleRanges.forEach(function (styleRange) {
        var delimiterRange = (0, _findRangesWithRegex["default"])(text.substring(styleRange[0], styleRange[1] + 1), boldDelimiterRegex).map(function (indices) {
          return indices.map(function (x) {
            return x + styleRange[0];
          });
        });
        boldDelimiterRanges = boldDelimiterRanges.concat(delimiterRange);
      });
      return boldDelimiterRanges;
    },
    delimiterStyles: {
      opacity: 0.4
    }
  };
};

var _default = createBoldStyleStrategy;
exports["default"] = _default;
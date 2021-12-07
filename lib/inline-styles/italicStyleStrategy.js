"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _findRangesWithRegex = _interopRequireDefault(require("../utils/findRangesWithRegex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createItalicStyleStrategy = function createItalicStyleStrategy() {
  var asteriskDelimitedRegex = '(?<!\\*)(\\*)(?!\\*)(.+?)(?<!\\*)\\*(?!\\*)'; // *italic*

  var underscoreDelimitedRegex = '(?<!_)(_)(?!_)(.+?)(?<!_)_(?!_)'; // _italic_

  var strongEmphasisRegex = '(\\*\\*\\*|___)(.+?)(\\*\\*\\*|___)'; // ***bolditalic*** ___bolditalic___

  var boldWrappedAsteriskRegex = '(?<=\\*\\*)(\\*)(?!\\*)(.*?[^\\*]+)(?<!\\*)\\*(?![^\\*]\\*)|(?<!\\*)(\\*)(?!\\*)(.*?[^\\*]+)(?<!\\*)\\*(?=\\*\\*)'; // ***italic* and bold** **bold and *italic***

  var boldWrappedUnderscoreRegex = '(?<=__)(_)(?!_)(.*?[^_]+)(?<!_)_(?![^_]_)|(?<!_)(_)(?!_)(.*?[^_]+)(?<!_)_(?=__)'; // ___italic_ and bold__ __bold and _italic___

  var italicRegex = new RegExp("".concat(asteriskDelimitedRegex, "|").concat(underscoreDelimitedRegex, "|").concat(strongEmphasisRegex, "|").concat(boldWrappedAsteriskRegex, "|").concat(boldWrappedUnderscoreRegex), 'g');
  var italicDelimiterRegex = /^(\*\*\*|\*|___|_)|(\*\*\*|\*|___|_)$/g;
  return {
    style: 'ITALIC',
    delimiterStyle: 'ITALIC-DELIMITER',
    findStyleRanges: function findStyleRanges(block) {
      // Return an array of arrays containing start and end indices for ranges of
      // text that should be italicized
      // e.g. [[0,6], [10,20]]
      var text = block.getText();
      var italicRanges = (0, _findRangesWithRegex["default"])(text, italicRegex);
      return italicRanges;
    },
    findDelimiterRanges: function findDelimiterRanges(block, styleRanges) {
      // Find ranges for delimiters at the beginning/end of styled text ranges
      // Returns an array of arrays containing start and end indices for delimiters
      var text = block.getText();
      var italicDelimiterRanges = [];
      styleRanges.forEach(function (styleRange) {
        var delimiterRange = (0, _findRangesWithRegex["default"])(text.substring(styleRange[0], styleRange[1] + 1), italicDelimiterRegex).map(function (indices) {
          return indices.map(function (x) {
            return x + styleRange[0];
          });
        });
        italicDelimiterRanges = italicDelimiterRanges.concat(delimiterRange);
      });
      return italicDelimiterRanges;
    },
    delimiterStyles: {
      opacity: 0.4
    }
  };
};

var _default = createItalicStyleStrategy;
exports["default"] = _default;
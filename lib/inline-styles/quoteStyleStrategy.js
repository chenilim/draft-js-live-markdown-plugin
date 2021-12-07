"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _findRangesWithRegex = _interopRequireDefault(require("../utils/findRangesWithRegex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Unordered List item delimiter
var createQuoteStyleStrategy = function createQuoteStyleStrategy() {
  var quoteRegex = /^> (.*)/g;
  var quoteDelimiterRegex = /^> /g;
  return {
    style: 'QUOTE',
    delimiterStyle: 'QUOTE-DELIMITER',
    findStyleRanges: function findStyleRanges(block) {
      var text = block.getText();
      var quoteRanges = (0, _findRangesWithRegex["default"])(text, quoteRegex);
      return quoteRanges;
    },
    findDelimiterRanges: function findDelimiterRanges(block, styleRanges) {
      var text = block.getText();
      var quoteDelimiterRanges = [];
      styleRanges.forEach(function (styleRange) {
        var delimiterRange = (0, _findRangesWithRegex["default"])(text.substring(styleRange[0], styleRange[1] + 1), quoteDelimiterRegex).map(function (indices) {
          return indices.map(function (x) {
            return x + styleRange[0];
          });
        });
        quoteDelimiterRanges = quoteDelimiterRanges.concat(delimiterRange);
      });
      return quoteDelimiterRanges;
    },
    styles: {
      opacity: 0.75,
      fontFamily: '"PT Serif", serif',
      fontSize: '1.1em'
    },
    delimiterStyles: {
      opacity: 0.4,
      position: 'absolute',
      transform: 'translateX(calc(-100%))'
    }
  };
};

var _default = createQuoteStyleStrategy;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _findRangesWithRegex = _interopRequireDefault(require("../utils/findRangesWithRegex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createHeadingDelimiterStyleStrategy = function createHeadingDelimiterStyleStrategy() {
  var headingDelimiterRegex = /(^#{1,6})\s/g;
  return {
    style: 'HEADING-DELIMITER',
    findStyleRanges: function findStyleRanges(block) {
      // Skip the text search if the block isn't a header block
      if (block.getType().indexOf('header') < 0) return [];
      var text = block.getText();
      var headingDelimiterRanges = (0, _findRangesWithRegex["default"])(text, headingDelimiterRegex);
      return headingDelimiterRanges;
    },
    styles: {
      opacity: 0.4
    }
  };
};

var _default = createHeadingDelimiterStyleStrategy;
exports["default"] = _default;
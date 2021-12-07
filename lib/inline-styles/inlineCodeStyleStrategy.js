"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _findRangesWithRegex = _interopRequireDefault(require("../utils/findRangesWithRegex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createInlineCodeStyleStrategy = function createInlineCodeStyleStrategy() {
  var codeRegex = /(`)([^\n\r`]+?)(`)/g;
  return {
    style: 'INLINE-CODE',
    findStyleRanges: function findStyleRanges(block) {
      // Don't allow inline code inside of code blocks
      if (block.getType() === 'code-block') return [];
      var text = block.getText();
      var codeRanges = (0, _findRangesWithRegex["default"])(text, codeRegex);
      return codeRanges;
    },
    styles: {
      fontFamily: '"PT Mono", monospace',
      border: '1px solid #ddd',
      borderRadius: '3px',
      padding: '2px'
    }
  };
};

var _default = createInlineCodeStyleStrategy;
exports["default"] = _default;
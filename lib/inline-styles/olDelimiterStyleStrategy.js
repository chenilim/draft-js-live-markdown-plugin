"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _findRangesWithRegex = _interopRequireDefault(require("../utils/findRangesWithRegex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Ordered List item delimiter
var createOLDelimiterStyleStrategy = function createOLDelimiterStyleStrategy() {
  var olDelimiterRegex = /^\d{1,3}\. /g;
  return {
    style: 'OL-DELIMITER',
    findStyleRanges: function findStyleRanges(block) {
      var text = block.getText();
      var olDelimiterRanges = (0, _findRangesWithRegex["default"])(text, olDelimiterRegex);
      return olDelimiterRanges;
    },
    styles: {
      position: 'absolute',
      transform: 'translateX(12px)'
    }
  };
};

var _default = createOLDelimiterStyleStrategy;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _findRangesWithRegex = _interopRequireDefault(require("../utils/findRangesWithRegex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Unordered List item delimiter
var createULDelimiterStyleStrategy = function createULDelimiterStyleStrategy() {
  var ulDelimiterRegex = /^\* /g;
  return {
    style: 'UL-DELIMITER',
    findStyleRanges: function findStyleRanges(block) {
      var text = block.getText();
      var ulDelimiterRanges = (0, _findRangesWithRegex["default"])(text, ulDelimiterRegex);
      return ulDelimiterRanges;
    },
    styles: {
      fontWeight: 'bold'
    }
  };
};

var _default = createULDelimiterStyleStrategy;
exports["default"] = _default;
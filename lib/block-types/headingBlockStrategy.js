"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _draftJs = require("draft-js");

var _findRangesWithRegex = _interopRequireDefault(require("../utils/findRangesWithRegex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createHeadingBlockStrategy = function createHeadingBlockStrategy() {
  var HEADING_REGEX = /(^#{1,6})\s(.*)/gm;
  var HEADING_LEVELS = ['header-one', 'header-two', 'header-three', 'header-four', 'header-five', 'header-six'];
  return {
    type: 'heading',
    className: 'heading-block',
    mapBlockType: function mapBlockType(contentState) {
      // Takes a ContentState and returns a ContentState with heading content block
      // type applied
      var blockMap = contentState.getBlockMap();
      var newContentState = contentState; // Find all heading blocks

      blockMap.forEach(function (block, blockKey) {
        var text = block.getText();
        var headingBlockDelimiterRanges = (0, _findRangesWithRegex["default"])(text, HEADING_REGEX);
        var headingLevel; // Determine what heading level it should be

        if (headingBlockDelimiterRanges.length > 0) headingLevel = (text.match(/#/g) || []).length; // Apply the corresponding heading block type

        if (headingBlockDelimiterRanges.length > 0) {
          newContentState = _draftJs.Modifier.setBlockType(newContentState, _draftJs.SelectionState.createEmpty(blockKey), HEADING_LEVELS[headingLevel - 1]);
        } else {
          // Remove any existing heading block type if there shouldn't be one
          if (HEADING_LEVELS.includes(newContentState.getBlockForKey(blockKey).getType())) newContentState = _draftJs.Modifier.setBlockType(newContentState, _draftJs.SelectionState.createEmpty(blockKey), 'unstyled');
        }
      });
      return newContentState;
    }
  };
};

var _default = createHeadingBlockStrategy;
exports["default"] = _default;
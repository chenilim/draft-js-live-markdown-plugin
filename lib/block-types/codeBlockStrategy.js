"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _draftJs = require("draft-js");

var _findRangesWithRegex = _interopRequireDefault(require("../utils/findRangesWithRegex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createCodeBlockStrategy = function createCodeBlockStrategy() {
  var blockType = 'code-block';
  var CODE_BLOCK_REGEX = /^```/g;
  return {
    type: blockType,
    className: 'code-block',
    mapBlockType: function mapBlockType(contentState) {
      // Takes a ContentState and returns a ContentState with code block content
      // block type applied
      var blockMap = contentState.getBlockMap();
      var newContentState = contentState;
      var codeBlockKeys = [];
      var notCodeBlockKeys = [];
      var tempKeys = [];
      var language; // Find all code blocks

      blockMap.forEach(function (block, blockKey) {
        var text = block.getText();
        var codeBlockDelimiterRanges = (0, _findRangesWithRegex["default"])(text, CODE_BLOCK_REGEX);
        var precededByDelimiter = tempKeys.length > 0; // Parse out the language specified after the delimiter for use with the
        // draft-js-prism-plugin for syntax highlighting

        if (codeBlockDelimiterRanges.length > 0 && !precededByDelimiter) language = (text.match(/\w+/g) || [])[0] || 'javascript'; // If we find the opening code block delimiter we must maintain an array
        // of all keys for content blocks that might need to be code blocks if we
        // later find a closing code block delimiter

        if (codeBlockDelimiterRanges.length > 0 || precededByDelimiter) {
          tempKeys.push(blockKey);
        } else {
          notCodeBlockKeys.push(blockKey);
        } // If we find the closing code block delimiter ``` then store the keys for
        // the sandwiched content blocks


        if (codeBlockDelimiterRanges.length > 0 && precededByDelimiter) {
          codeBlockKeys = codeBlockKeys.concat(tempKeys);
          tempKeys = [];
        }
      }); // Loop through keys for blocks that should not have code block type and remove
      // code block type if necessary

      notCodeBlockKeys = notCodeBlockKeys.concat(tempKeys);
      notCodeBlockKeys.forEach(function (blockKey) {
        if (newContentState.getBlockForKey(blockKey).getType() === blockType) newContentState = _draftJs.Modifier.setBlockType(newContentState, _draftJs.SelectionState.createEmpty(blockKey), 'unstyled');
      }); // Loop through found code block keys and apply the block style and language
      // metadata to the block

      codeBlockKeys.forEach(function (blockKey, i) {
        // Apply language metadata to block (ignore delimiter blocks)
        var isDelimiterBlock = i === 0 || i === codeBlockKeys.length - 1;
        var block = newContentState.getBlockForKey(blockKey);
        var blockMap = newContentState.getBlockMap();
        var data = block.getData().merge({
          language: isDelimiterBlock ? undefined : language
        });
        var newBlock = block.merge({
          data: data
        });
        newContentState = newContentState.merge({
          blockMap: blockMap.set(blockKey, newBlock)
        }); // Apply block type to block

        newContentState = _draftJs.Modifier.setBlockType(newContentState, _draftJs.SelectionState.createEmpty(blockKey), blockType);
      });
      return newContentState;
    }
  };
};

var _default = createCodeBlockStrategy;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _draftJs = require("draft-js");

var _immutable = require("immutable");

var _boldStyleStrategy = _interopRequireDefault(require("./inline-styles/boldStyleStrategy"));

var _italicStyleStrategy = _interopRequireDefault(require("./inline-styles/italicStyleStrategy"));

var _strikethroughStyleStrategy = _interopRequireDefault(require("./inline-styles/strikethroughStyleStrategy"));

var _headingDelimiterStyleStrategy = _interopRequireDefault(require("./inline-styles/headingDelimiterStyleStrategy"));

var _ulDelimiterStyleStrategy = _interopRequireDefault(require("./inline-styles/ulDelimiterStyleStrategy"));

var _olDelimiterStyleStrategy = _interopRequireDefault(require("./inline-styles/olDelimiterStyleStrategy"));

var _quoteStyleStrategy = _interopRequireDefault(require("./inline-styles/quoteStyleStrategy"));

var _inlineCodeStyleStrategy = _interopRequireDefault(require("./inline-styles/inlineCodeStyleStrategy"));

var _codeBlockStrategy = _interopRequireDefault(require("./block-types/codeBlockStrategy"));

var _headingBlockStrategy = _interopRequireDefault(require("./block-types/headingBlockStrategy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Inline style handlers
// Block type handlers
var createLiveMarkdownPlugin = function createLiveMarkdownPlugin() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _config$inlineStyleSt = config.inlineStyleStrategies,
      inlineStyleStrategies = _config$inlineStyleSt === void 0 ? [(0, _boldStyleStrategy["default"])(), (0, _italicStyleStrategy["default"])(), (0, _strikethroughStyleStrategy["default"])(), (0, _headingDelimiterStyleStrategy["default"])(), (0, _ulDelimiterStyleStrategy["default"])(), (0, _olDelimiterStyleStrategy["default"])(), (0, _quoteStyleStrategy["default"])(), (0, _inlineCodeStyleStrategy["default"])()] : _config$inlineStyleSt,
      _config$blockTypeStra = config.blockTypeStrategies,
      blockTypeStrategies = _config$blockTypeStra === void 0 ? [(0, _codeBlockStrategy["default"])(), (0, _headingBlockStrategy["default"])()] : _config$blockTypeStra; // Construct the editor style map from our inline style strategies

  var customStyleMap = {};
  inlineStyleStrategies.forEach(function (styleStrategy) {
    if (styleStrategy.style && styleStrategy.styles) customStyleMap[styleStrategy.style] = styleStrategy.styles;
    if (styleStrategy.delimiterStyle && styleStrategy.delimiterStyles) customStyleMap[styleStrategy.delimiterStyle] = styleStrategy.delimiterStyles;
  }); // Construct the block style fn

  var blockStyleMap = blockTypeStrategies.reduce(function (map, blockStrategy) {
    map[blockStrategy.type] = blockStrategy.className;
    return map;
  }, {});

  var blockStyleFn = function blockStyleFn(block) {
    var blockType = block.getType();
    return blockStyleMap[blockType];
  };

  return {
    // We must handle the maintenance of block types and inline styles on changes.
    // To make sure the code is efficient we only perform maintenance on content
    // blocks that have been changed. We only perform maintenance for change types
    // that result in actual text changes (ignore cursing through text, etc).
    onChange: function onChange(editorState) {
      // if (editorState.getLastChangeType() === 'insert-fragment')
      //   return maintainWholeEditorState();
      return maintainEditorState(editorState, {
        blockTypeStrategies: blockTypeStrategies,
        inlineStyleStrategies: inlineStyleStrategies
      });
    },
    customStyleMap: customStyleMap,
    blockStyleFn: blockStyleFn,
    stripPastedStyles: true
  };
}; // Takes an EditorState and returns a ContentState updated with block types and
// inline styles according to the provided strategies
// Takes a targeted approach that only updates the modified block/blocks


var maintainEditorState = function maintainEditorState(editorState, _ref) {
  var blockTypeStrategies = _ref.blockTypeStrategies,
      inlineStyleStrategies = _ref.inlineStyleStrategies;
  // Bypass maintenance if text was not changed
  var lastChangeType = editorState.getLastChangeType();
  var bypassOnChangeTypes = ['adjust-depth', 'apply-entity', 'change-block-data', 'change-block-type', 'change-inline-style', 'maintain-markdown'];
  if (bypassOnChangeTypes.includes(lastChangeType)) return editorState; // Maintain block types then inline styles
  // Order is important bc we want the inline style strategies to be able to
  // look at block type to avoid unnecessary regex searching when possible

  var contentState = editorState.getCurrentContent();
  var newContentState = maintainBlockTypes(contentState, blockTypeStrategies);
  newContentState = maintainInlineStyles(newContentState, editorState, inlineStyleStrategies); // Apply the updated content state

  var newEditorState = editorState;
  if (contentState !== newContentState) newEditorState = _draftJs.EditorState.push(editorState, newContentState, 'maintain-markdown');
  newEditorState = _draftJs.EditorState.forceSelection(newEditorState, editorState.getSelection());
  return newEditorState;
}; // Takes a ContentState and returns a ContentState with block types and inline styles
// applied or removed as necessary


var maintainBlockTypes = function maintainBlockTypes(contentState, blockTypeStrategies) {
  return blockTypeStrategies.reduce(function (cs, blockTypeStrategy) {
    return blockTypeStrategy.mapBlockType(cs);
  }, contentState);
}; // Takes a ContentState (and EditorState for getting the selection and change type)
// and returns a ContentState with inline styles applied or removed as necessary


var maintainInlineStyles = function maintainInlineStyles(contentState, editorState, inlineStyleStrategies) {
  var lastChangeType = editorState.getLastChangeType();
  var selection = editorState.getSelection();
  var blockKey = selection.getStartKey();
  var block = contentState.getBlockForKey(blockKey);
  var blockMap = contentState.getBlockMap();
  var newBlockMap = blockMap; // If text has been pasted (potentially modifying/creating multiple blocks) or
  // the editor is new we must maintain the styles for all content blocks

  if (lastChangeType === 'insert-fragment' || !lastChangeType) {
    blockMap.forEach(function (block, blockKey) {
      var newBlock = mapInlineStyles(block, inlineStyleStrategies);
      newBlockMap = newBlockMap.set(blockKey, newBlock);
    });
  } else {
    var newBlock = mapInlineStyles(block, inlineStyleStrategies);
    newBlockMap = newBlockMap.set(blockKey, newBlock);
  } // If enter was pressed (or the block was otherwise split) we must maintain
  // styles in the previous block as well


  if (lastChangeType === 'split-block') {
    var newPrevBlock = mapInlineStyles(contentState.getBlockBefore(blockKey), inlineStyleStrategies);
    newBlockMap = newBlockMap.set(contentState.getKeyBefore(blockKey), newPrevBlock);
  }

  var newContentState = contentState.merge({
    blockMap: newBlockMap
  });
  return newContentState;
}; // Maps inline styles to the provided ContentBlock's CharacterMetadata list based
// on the plugin's inline style strategies


var mapInlineStyles = function mapInlineStyles(block, strategies) {
  // This will be called upon any change that has the potential to effect the styles
  // of a content block.
  // Find all of the ranges that should have styles applied to them (i.e. all bold,
  // italic, or strikethrough delimited ranges of the block).
  var blockText = block.getText(); // Create a list of empty CharacterMetadata to map styles to

  var characterMetadataList = (0, _immutable.List)((0, _immutable.Repeat)(_draftJs.CharacterMetadata.create(), blockText.length)); // Evaluate block text with each style strategy and apply styles to matching
  // ranges of text and delimiters

  strategies.forEach(function (strategy) {
    var styleRanges = strategy.findStyleRanges(block);
    var delimiterRanges = strategy.findDelimiterRanges ? strategy.findDelimiterRanges(block, styleRanges) : [];
    characterMetadataList = applyStyleRangesToCharacterMetadata(strategy.style, styleRanges, characterMetadataList);
    characterMetadataList = applyStyleRangesToCharacterMetadata(strategy.delimiterStyle, delimiterRanges, characterMetadataList);
  }); // Apply the list of CharacterMetadata to the content block

  return block.set('characterList', characterMetadataList);
}; // Applies the provided style to the corresponding ranges of the character metadata


var applyStyleRangesToCharacterMetadata = function applyStyleRangesToCharacterMetadata(style, ranges, characterMetadataList) {
  var styledCharacterMetadataList = characterMetadataList;
  ranges.forEach(function (range) {
    for (var i = range[0]; i <= range[1]; i++) {
      var styled = _draftJs.CharacterMetadata.applyStyle(characterMetadataList.get(i), style);

      styledCharacterMetadataList = styledCharacterMetadataList.set(i, styled);
    }
  });
  return styledCharacterMetadataList;
};

var _default = createLiveMarkdownPlugin;
exports["default"] = _default;
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, TextFormatType } from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode } from '@lexical/rich-text';
import { FORMAT_ELEMENT_COMMAND } from 'lexical';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState<string>("paragraph");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsHighlight(selection.hasFormat('highlight'));

      // Get selected block type
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElement();
      const elementKey = element?.getKey();
      const elementDOM = elementKey ? editor.getElementByKey(elementKey) : null;

      if (elementDOM !== null) {
        if (elementDOM?.nodeName === 'P') setSelectedBlockType('paragraph');
        else if (elementDOM?.nodeName === 'H1') setSelectedBlockType('h1');
        else if (elementDOM?.nodeName === 'H2') setSelectedBlockType('h2');
        else if (elementDOM?.nodeName === 'H3') setSelectedBlockType('h3');
        else if (elementDOM?.nodeName === 'UL') setSelectedBlockType('ul');
        else if (elementDOM?.nodeName === 'OL') setSelectedBlockType('ol');
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatHeading = (headingSize: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatText = (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'subscript' | 'superscript' | 'code' | 'highlight') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  return (
    <div className="toolbar flex flex-wrap gap-2 mb-2 p-2 border-b border-stroke dark:border-form-strokedark">
      <div className="flex gap-2 items-center border-r border-stroke dark:border-form-strokedark pr-2">
        <select 
          className="bg-transparent dark:text-white"
          value={selectedBlockType}
          onChange={(e) => {
            const type = e.target.value;
            if (type.startsWith('h')) formatHeading(type as 'h1' | 'h2' | 'h3');
          }}
        >
          <option value="paragraph">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
      </div>

      <div className="flex gap-2 items-center border-r border-stroke dark:border-form-strokedark pr-2">
        <button
          onClick={() => formatText('bold')}
          className={`px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isBold ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => formatText('italic')}
          className={`px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isItalic ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
          title="Italic"
        >
          I
        </button>
        <button
          onClick={() => formatText('underline')}
          className={`px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isUnderline ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
          title="Underline"
        >
          U
        </button>
        <button
          onClick={() => formatText('strikethrough')}
          className={`px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isStrikethrough ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
          title="Strikethrough"
        >
          S
        </button>
      </div>

      <div className="flex gap-2 items-center border-r border-stroke dark:border-form-strokedark pr-2">
        <button
          onClick={() => formatText('subscript')}
          className={`px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isSubscript ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
          title="Subscript"
        >
          X₂
        </button>
        <button
          onClick={() => formatText('superscript')}
          className={`px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isSuperscript ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
          title="Superscript"
        >
          X²
        </button>
        <button
          onClick={() => formatText('highlight')}
          className={`px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isHighlight ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
          title="Highlight"
        >
          <span role="img" aria-label="highlight">🖍️</span>
        </button>
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={() => formatAlignment('left')}
          className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Align Left"
        >
          ⬅️
        </button>
        <button
          onClick={() => formatAlignment('center')}
          className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Align Center"
        >
          ⬆️
        </button>
        <button
          onClick={() => formatAlignment('right')}
          className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Align Right"
        >
          ➡️
        </button>
        <button
          onClick={() => formatAlignment('justify')}
          className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Justify"
        >
          ↔️
        </button>
      </div>
    </div>
  );
}

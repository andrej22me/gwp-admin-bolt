import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode, EditorState } from 'lexical';
import { useEffect } from 'react';
import editorTheme from './editorTheme';
import './editor.css';
import ToolbarPlugin from './plugins/ToolbarPlugin';

function onError(error: Error) {
  console.error(error);
}

type Props = {
  content?: string;
  onChange: (content: string) => void;
  placeholder?: string;
};

function InitialValuePlugin({ content }: { content?: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!content) return;

    editor.update(() => {
      const root = $getRoot();
      if (root.getTextContent() === '') {
        const paragraph = $createParagraphNode();
        const text = $createTextNode(content);
        paragraph.append(text);
        root.append(paragraph);
      }
    });
  }, [content, editor]);

  return null;
}

function LexicalErrorBoundary({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default function LexicalEditor({ content, onChange, placeholder = 'Enter some text...' }: Props) {
  const initialConfig = {
    namespace: 'MyEditor',
    theme: editorTheme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode
    ]
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container relative rounded border-[1.5px] border-stroke bg-transparent font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="editor-input h-full min-h-[200px] resize-none py-3 px-5 outline-none"
            />
          }
          placeholder={
            <div className="editor-placeholder absolute top-[52px] left-[20px] text-body">
              {placeholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(editorState: EditorState) => {
            editorState.read(() => {
              const root = $getRoot();
              const text = root.getTextContent();
              onChange(text);
            });
          }}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <InitialValuePlugin content={content} />
      </div>
    </LexicalComposer>
  );
}

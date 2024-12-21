"use client";

import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlighte from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useStorage } from "@liveblocks/react";
import { useEditorStore } from "@/store/use-editor-store";
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { Ruler } from "./ruler";
import { Threads } from "./threads";

interface EditorProps {
  initialContent?: string | undefined;
}

export const Editor = ({ initialContent }: EditorProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leftMargin = useStorage((root: any) => root.leftMargin);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rightMargin = useStorage((root: any) => root.rightMargin);
  const liveblocks = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental: true,
  });
  const { setEditor } = useEditorStore();

  const editor = useEditor({
    immediatelyRender: false,
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        style: `padding-left: ${leftMargin ?? 56}px; padding-right: ${rightMargin ?? 56}px`,
        class:
          "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[960px] w-[816px] pt-10 pr-14 pb-10 ",
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        // The Liveblocks extension comes with its own history handling
        history: false,
      }),
      LineHeightExtension.configure({
        types: ["heading", "paragraph"],
        defaultLineHeight: "normal",
      }),
      FontSizeExtension,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
      Highlighte.configure({ multicolor: true }),
      FontFamily,
      Document,
      Paragraph,
      Text,
      TextStyle,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Dropcursor,
      Image,
      ImageResize,
    ],
    content: ``,
  });

  return (
    <div className="size-full overflow-x-auto bg-[#FAFBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
      <Ruler />
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
        <Threads editor={editor} />
      </div>
    </div>
  );
};

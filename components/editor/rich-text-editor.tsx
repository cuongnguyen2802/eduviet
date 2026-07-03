"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import UnderlineExtension from "@tiptap/extension-underline";
import PlaceholderExtension from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImageIcon,
  Undo2,
  Redo2,
  Heading2,
  Heading3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaPickerDialog } from "@/components/editor/media-picker-dialog";

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded hover:bg-accent disabled:opacity-40 disabled:pointer-events-none",
        active && "bg-accent text-primary"
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, onOpenPicker }: { editor: Editor; onOpenPicker: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b p-1.5">
      <ToolbarButton label="Đậm" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Nghiêng" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Gạch chân" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Gạch ngang" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton
        label="Tiêu đề 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Tiêu đề 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton label="Danh sách" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Danh sách số"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Trích dẫn" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton
        label="Chèn link"
        active={editor.isActive("link")}
        onClick={() => {
          const url = window.prompt("Nhập URL:", editor.getAttributes("link").href ?? "https://");
          if (url === null) return;
          if (url === "") editor.chain().focus().unsetLink().run();
          else editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        <Link2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Chèn ảnh từ thư viện" onClick={onOpenPicker}>
        <ImageIcon className="h-4 w-4" />
      </ToolbarButton>
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton label="Hoàn tác" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Làm lại" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  name,
  defaultValue,
  placeholder,
}: {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer nofollow" } }),
      ImageExtension,
      PlaceholderExtension.configure({ placeholder: placeholder ?? "Viết nội dung..." }),
    ],
    content: defaultValue || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none min-h-[240px] px-3 py-3 focus:outline-none",
      },
    },
  });

  return (
    <div className="rounded-md border">
      <input type="hidden" name={name} value={html} />
      {editor && (
        <>
          <Toolbar editor={editor} onOpenPicker={() => setPickerOpen(true)} />
          <MediaPickerDialog
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            onSelect={(url) => editor.chain().focus().setImage({ src: url }).run()}
          />
        </>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}

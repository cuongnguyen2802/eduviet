"use client";

import { RichTextEditor } from "@/components/editor/rich-text-editor";
import type { RichTextBlockProps } from "@/lib/blocks";

export function RichTextForm({
  props,
  onChange,
}: {
  props: RichTextBlockProps;
  onChange: (props: RichTextBlockProps) => void;
}) {
  return <RichTextEditor defaultValue={props.html} onChange={(html) => onChange({ ...props, html })} />;
}

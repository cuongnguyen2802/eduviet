"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FEATURE_ICON_NAMES, type FeaturesBlockProps, type FeatureItem } from "@/lib/blocks";
import { resolveFeatureIcon } from "@/lib/feature-icons";

function emptyItem(): FeatureItem {
  return { icon: "CheckCircle", title: "", description: "" };
}

export function FeaturesForm({
  props,
  onChange,
}: {
  props: FeaturesBlockProps;
  onChange: (props: FeaturesBlockProps) => void;
}) {
  function updateItem(index: number, item: FeatureItem) {
    const items = [...props.items];
    items[index] = item;
    onChange({ ...props, items });
  }

  function removeItem(index: number) {
    onChange({ ...props, items: props.items.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tiêu đề khối (tùy chọn)</Label>
        <Input value={props.title ?? ""} onChange={(e) => onChange({ ...props, title: e.target.value })} />
      </div>

      <div className="space-y-3">
        {props.items.map((item, i) => {
          const Icon = resolveFeatureIcon(item.icon);
          return (
            <div key={i} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Select value={item.icon} onValueChange={(v) => updateItem(i, { ...item, icon: v })}>
                  <SelectTrigger className="w-32 shrink-0">
                    <SelectValue>
                      <Icon className="h-4 w-4" />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {FEATURE_ICON_NAMES.map((name) => {
                      const OptionIcon = resolveFeatureIcon(name);
                      return (
                        <SelectItem key={name} value={name}>
                          <span className="flex items-center gap-2">
                            <OptionIcon className="h-4 w-4" /> {name}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Tiêu đề"
                  value={item.title}
                  onChange={(e) => updateItem(i, { ...item, title: e.target.value })}
                />
                <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => removeItem(i)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <Input
                placeholder="Mô tả ngắn"
                value={item.description}
                onChange={(e) => updateItem(i, { ...item, description: e.target.value })}
              />
            </div>
          );
        })}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={() => onChange({ ...props, items: [...props.items, emptyItem()] })}>
        <Plus className="mr-1 h-4 w-4" /> Thêm mục
      </Button>
    </div>
  );
}

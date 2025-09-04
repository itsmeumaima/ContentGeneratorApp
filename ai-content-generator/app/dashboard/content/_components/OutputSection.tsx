import React, { useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import dynamic from "next/dynamic";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Editor as EditorClass } from "@toast-ui/react-editor";

// Properly type the dynamic import
const Editor = dynamic<any>(
  () =>
    import("@toast-ui/react-editor").then((mod) => {
      return mod.Editor as any;
    }),
  { ssr: false }
);

function OutputSection() {
  const editorRef = useRef<EditorClass | null>(null);
  return (
    <div className="bg-white shadow-lg border rounded-lg">
      <div className="flex justify-between items-center p-5">
        <h2 className="font-medium text-lg">Your Result</h2>
        <Button className="flex gap-2"><Copy className="w-4 h-4"/>Copy</Button>
      </div>
      <Editor
        ref={editorRef}
        initialValue="Your result will appear here"
        initialEditType="wysiwyg"
        height="600px"
        useCommandShortcut={true}
        onChange={()=>console.log(editorRef.current?.getInstance().getMarkdown())}
      />
    </div>
  );
}

export default OutputSection;

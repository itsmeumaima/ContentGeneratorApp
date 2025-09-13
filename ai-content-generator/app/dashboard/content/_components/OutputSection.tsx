import React, { useEffect, useRef } from "react";
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
interface props{
  aiOutput: string;
}
function OutputSection({ aiOutput }: props) {
  const editorRef = useRef<EditorClass | null>(null);
  
  // useEffect(()=>{
  //   const editorInstance=editorRef.current?.getInstance();
  //   editorInstance.setMarkdown(aiOutput);

  // },[aiOutput])

  useEffect(() => {
  const editorInstance = editorRef.current?.getInstance();
  if (editorInstance && aiOutput) {
    editorInstance.setMarkdown(aiOutput);
  }
}, [aiOutput]);

  return (
    <div className="bg-white shadow-lg border rounded-lg">
      <div className="flex justify-between items-center p-5">
        <h2 className="font-medium text-lg">Your Result</h2>
        <Button className="flex gap-2"
        onClick={()=>navigator.clipboard.writeText(aiOutput)}
        ><Copy className="w-4 h-4"/>Copy</Button>
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

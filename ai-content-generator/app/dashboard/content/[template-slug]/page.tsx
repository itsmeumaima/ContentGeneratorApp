"use client";
import React from "react";
import FormSection from "../_components/FormSection";
import OutputSection from "../_components/OutputSection";
import Templates from "@/app/(data)/Templates";
import { TEMPLATE } from "../../_components/TemplateListSection";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { chatSession } from "@/utils/AiModal";
import { useState } from "react";
import { AIOutput } from "@/utils/schema";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
interface PROPS {
  params: Promise<{
    "template-slug": string;
  }>;
}

export default function CreateNewContent({ params }: PROPS) {
  const unwrappedParams = React.use(params); // ✅ unwrap the promise
  const slug = unwrappedParams["template-slug"];

  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug === slug
  );
  const { user } = useUser();
  const [loading,setLoading]=useState(false);
  const [aiOutput,setAiOutput]=useState<string>('');

  const GenerateAIContent = async (formData: any) => {
  setLoading(true);

  const SelectedPrompt = selectedTemplate?.aiPrompt;
  const FinalAIPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;

  const res = await fetch("/api/generate", {
    method: "POST",
    body: JSON.stringify({ prompt: FinalAIPrompt }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  // console.log(data.output[0].content); // contains text
  setAiOutput(data.output[0].content);
  await SaveInDb(formData,selectedTemplate?.slug,data.output[0].content);
  setLoading(false);
};

  const SaveInDb=async(formData:any,slug:any,aiResp:string)=>{
    const result=await db.insert(AIOutput).values({
      formData:formData,
      templateSlug:slug,
      aiResponse:aiResp,
      createdBy: user?.primaryEmailAddress?.emailAddress ?? "",
      createdAt:moment().format('DD/MM/yyyy'),
    })
    console.log("Saved in db",result);
  }

  return (
    <div className="p-10">
      <Link href="/dashboard">
        <Button>
          <ArrowLeft />
          Back
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
        <FormSection
          selectedTemplate={selectedTemplate}
          userFormInput={(v: any) => GenerateAIContent(v)}
          loading={loading}
        />
        <div className="col-span-2">
          <OutputSection aiOutput={aiOutput}/>
        </div>
      </div>
    </div>
  );
}

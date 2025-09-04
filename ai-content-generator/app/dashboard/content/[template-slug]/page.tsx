"use client";
import React from "react";
import FormSection from "../_components/FormSection";
import OutputSection from "../_components/OutputSection";
import Templates from "@/app/(data)/Templates";
import { TEMPLATE } from "../../_components/TemplateListSection";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  const GenerateAIContent = (formData: any) => {
    console.log("Form Data:", formData);
  };

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
        />
        <div className="col-span-2">
          <OutputSection />
        </div>
      </div>
    </div>
  );
}

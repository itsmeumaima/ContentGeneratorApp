"use client";
import React, { useContext, useState } from "react";
import FormSection from "../_components/FormSection";
import OutputSection from "../_components/OutputSection";
import Templates from "@/app/(data)/Templates";
import { TEMPLATE } from "../../_components/TemplateListSection";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AIOutput } from "@/utils/schema";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PROPS {
  params: {
    "template-slug": string;
  };
}

export default function CreateNewContent({ params }: PROPS) {
  
  const slug = params["template-slug"];
  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug === slug
  );

  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>("");
  const router = useRouter();
  const { totalUsage } = useContext(TotalUsageContext);
  const [showDialog, setShowDialog] = useState(false);

  const GenerateAIContent = async (formData: any) => {
    if (totalUsage >= 10000) {
      setShowDialog(true); // ✅ show dialog instead of redirecting immediately
      return;
    }
    setLoading(true);

    const SelectedPrompt = selectedTemplate?.aiPrompt;
    const FinalAIPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: FinalAIPrompt }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setAiOutput(data.output[0].content);
    await SaveInDb(formData, selectedTemplate?.slug, data.output[0].content);
    setLoading(false);
  };

  const SaveInDb = async (formData: any, slug: any, aiResp: string) => {
    const result = await db.insert(AIOutput).values({
      formData: formData,
      templateSlug: slug,
      aiResponse: aiResp,
      createdBy: user?.primaryEmailAddress?.emailAddress ?? "unknown",
      createdAt: moment().format("DD/MM/yyyy"),
    });
    console.log("Saved in db", result);
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
          loading={loading}
        />
        <div className="col-span-2">
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>

      {/* ✅ Alert Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade Required</AlertDialogTitle>
            <AlertDialogDescription>
              You’ve reached the free usage limit. Please upgrade to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/dashboard/billing")}>
              Upgrade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

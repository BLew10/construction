import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageCircle, History } from "lucide-react";
import { Document, DocumentComment } from "@/store/documentsStore";
import { DocumentViewer } from "./document-viewer";
import { DocumentComments } from "./document-comments";
import { DocumentVersionHistory } from "./document-version-history";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DocumentTabsProps {
  document: Document;
  comments: DocumentComment[];
}

export function DocumentTabs({ document, comments }: DocumentTabsProps) {
  const [activeTab, setActiveTab] = useState("preview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger 
          value="preview" 
          className="data-[state=active]:border-primary/50"
        >
          <FileText className="h-4 w-4 mr-2" />
          Preview
        </TabsTrigger>
        <TabsTrigger 
          value="comments"
          className="data-[state=active]:border-primary/50"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Comments ({comments.length})
        </TabsTrigger>
        <TabsTrigger 
          value="versions"
          className="data-[state=active]:border-primary/50"
        >
          <History className="h-4 w-4 mr-2" />
          Versions
        </TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="mt-0">
        <DocumentViewer document={document} />
      </TabsContent>
      <TabsContent value="comments" className="mt-0">
        <DocumentComments document={document} comments={comments} />
      </TabsContent>
      <TabsContent value="versions" className="mt-0">
        <DocumentVersionHistory document={document} />
      </TabsContent>
    </Tabs>
  );
} 
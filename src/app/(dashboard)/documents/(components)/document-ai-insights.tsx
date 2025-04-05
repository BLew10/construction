import { Document } from "@/store/documentsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu } from "lucide-react";

interface DocumentAIInsightsProps {
  document: Document;
}

export function DocumentAIInsights({ document }: DocumentAIInsightsProps) {
  if (!document.aiProcessed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Cpu className="h-5 w-5" /> AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            AI analysis has not been run on this document yet.
          </p>
          {/* Optionally add a button here to trigger analysis */}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Cpu className="h-5 w-5" /> AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h4 className="font-medium mb-1">Summary</h4>
          <p className="text-muted-foreground">
            {document.aiSummary || "No summary available."}
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-1">Keywords</h4>
          {document.aiKeywords && document.aiKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {document.aiKeywords.map((kw) => (
                <Badge key={kw} variant="secondary">
                  {kw}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No keywords extracted.
            </p>
          )}
        </div>
        <div>
          <h4 className="font-medium mb-1">Categories</h4>
          {document.aiCategories && document.aiCategories.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {document.aiCategories.map((cat) => (
                <Badge key={cat} variant="outline" className="capitalize">
                  {cat}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No categories identified.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp, PiggyBank, FileWarning, CheckCircle, FolderKanban } from "lucide-react";

interface BudgetOverviewSummaryCardsProps {
    totalOriginalBudget: number;
    totalContingency: number;
    totalApprovedChanges: number;
    totalRevisedBudget: number;
    totalActualSpent: number;
    totalRemainingBudget: number;
    projectCount: number;
}

const formatCurrency = (amount: number) => {
    // Handle potential NaN/Infinity during initial load or calculation issues
    if (!isFinite(amount)) return '$--';
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
};

export function BudgetOverviewSummaryCards({
    totalOriginalBudget,
    totalContingency,
    totalApprovedChanges,
    totalRevisedBudget,
    totalActualSpent,
    totalRemainingBudget,
    projectCount
}: BudgetOverviewSummaryCardsProps) {
    const overallVariance = totalRevisedBudget - totalActualSpent;
    const variancePercentage = totalRevisedBudget !== 0 ? (overallVariance / totalRevisedBudget * 100) : 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{projectCount}</div>
                    <p className="text-xs text-muted-foreground">Active projects with budgets</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revised Budget</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalRevisedBudget)}</div>
                    <p className="text-xs text-muted-foreground">Across all projects</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Actual Spent</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalActualSpent)}</div>
                    <p className="text-xs text-muted-foreground">Total costs incurred</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overall Variance</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <div className={`text-2xl font-bold ${overallVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(overallVariance)}
                    </div>
                    <p className={`text-xs ${overallVariance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {variancePercentage.toFixed(1)}% {overallVariance >= 0 ? 'Under' : 'Over'} Budget
                    </p>
                </CardContent>
            </Card>
            {/* Optionally add cards for total original, contingency, changes if needed */}
        </div>
    );
} 
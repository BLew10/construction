import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp, PiggyBank, FileWarning, CheckCircle } from "lucide-react";

interface BudgetSummaryCardsProps {
    originalBudget: number;
    contingency: number;
    approvedChanges: number;
    revisedBudget: number;
    actualSpent: number;
    remainingBudget: number;
}

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export function BudgetSummaryCards({
    originalBudget,
    contingency,
    approvedChanges,
    revisedBudget,
    actualSpent,
    remainingBudget
}: BudgetSummaryCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Original Budget</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(originalBudget)}</div>
                    <p className="text-xs text-muted-foreground">Initial contract value</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Contingency</CardTitle>
                    <PiggyBank className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(contingency)}</div>
                     <p className="text-xs text-muted-foreground">{(contingency / originalBudget * 100).toFixed(1)}% of original</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Changes</CardTitle>
                    <FileWarning className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${approvedChanges >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        {approvedChanges >= 0 ? '+' : ''}{formatCurrency(approvedChanges)}
                    </div>
                     <p className="text-xs text-muted-foreground">Net cost impact</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revised Budget</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(revisedBudget)}</div>
                    <p className="text-xs text-muted-foreground">Original + Changes</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Actual Spent</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(actualSpent)}</div>
                    <p className="text-xs text-muted-foreground">Total costs incurred</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(remainingBudget)}
                    </div>
                    <p className="text-xs text-muted-foreground">Revised - Spent</p>
                </CardContent>
            </Card>
        </div>
    );
} 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { CostItem } from "@/types/budget";

interface CostBreakdownTableProps {
	costItems: CostItem[];
	onEdit: (item: CostItem) => void;
	onDelete: (itemId: string) => void;
}

const formatCurrency = (amount: number) => {
	return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export function CostBreakdownTable({ costItems, onEdit, onDelete }: CostBreakdownTableProps) {
	const totalBudgeted = costItems.reduce((sum, item) => sum + item.budgeted, 0);
	const totalActual = costItems.reduce((sum, item) => sum + item.actual, 0);
	const totalVariance = totalActual - totalBudgeted;

	// Mobile row renderer - responsive approach for smaller screens
	const renderMobileRow = (item: CostItem) => (
		<div key={item.id} className="py-3 border-b last:border-0 sm:hidden">
			<div className="flex justify-between items-start mb-2">
				<Badge variant="secondary" className="mb-1">{item.category}</Badge>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => onEdit(item)}>
							<Pencil className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onDelete(item.id!)} className="text-red-600 focus:text-red-600">
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="font-medium text-sm mb-1">{item.description}</div>
			<div className="grid grid-cols-2 gap-2 text-sm">
				<div>
					<span className="text-muted-foreground">Budgeted:</span> 
					<span className="font-medium ml-1">{formatCurrency(item.budgeted)}</span>
				</div>
				<div>
					<span className="text-muted-foreground">Actual:</span> 
					<span className="font-medium ml-1">{formatCurrency(item.actual ?? 0)}</span>
				</div>
				<div className="col-span-2">
					<span className="text-muted-foreground">Variance:</span> 
					<span className={cn(
						"font-medium ml-1",
						item.variance && item.variance > 0 ? "text-red-600" : item.variance && item.variance < 0 ? "text-green-600" : "text-muted-foreground"
					)}>
						{item.variance && item.variance > 0 ? '+' : ''}{formatCurrency(item.variance ?? 0)}
					</span>
				</div>
			</div>
		</div>
	);

	return (
		<div>
			{/* Mobile view for cost items */}
			{costItems.length === 0 && (
				<div className="py-6 text-center text-muted-foreground text-sm sm:hidden">
					No cost items added yet. Click 'Add Cost Item' to start.
				</div>
			)}
			<div className="sm:hidden">
				{costItems.map(renderMobileRow)}
				{costItems.length > 0 && (
					<div className="mt-4 pt-3 border-t">
						<div className="grid grid-cols-2 gap-2 font-semibold">
							<div>
								<span className="text-muted-foreground">Total Budgeted:</span> 
								<div>{formatCurrency(totalBudgeted)}</div>
							</div>
							<div>
								<span className="text-muted-foreground">Total Actual:</span> 
								<div>{formatCurrency(totalActual)}</div>
							</div>
							<div className="col-span-2 mt-1">
								<span className="text-muted-foreground">Total Variance:</span> 
								<div className={cn(
									totalVariance > 0 ? "text-red-600" : totalVariance < 0 ? "text-green-600" : "text-muted-foreground"
								)}>
									{totalVariance > 0 ? '+' : ''}{formatCurrency(totalVariance)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Desktop view for cost items */}
			<div className="hidden sm:block overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Category</TableHead>
							<TableHead>Description</TableHead>
							<TableHead className="text-right">Budgeted</TableHead>
							<TableHead className="text-right">Actual</TableHead>
							<TableHead className="text-right">Variance</TableHead>
							<TableHead className="w-[50px]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{costItems.length === 0 && (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center">
									No cost items added yet. Click 'Add Cost Item' to start.
								</TableCell>
							</TableRow>
						)}
						{costItems.map((item) => (
							<TableRow key={item.id}>
								<TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
								<TableCell className="font-medium">{item.description}</TableCell>
								<TableCell className="text-right">{formatCurrency(item.budgeted)}</TableCell>
								<TableCell className="text-right">{formatCurrency(item.actual ?? 0)}</TableCell>
								<TableCell className={cn(
									"text-right font-medium",
									item.variance && item.variance > 0 ? "text-red-600" : item.variance && item.variance < 0 ? "text-green-600" : "text-muted-foreground"
								)}>
									{item.variance && item.variance > 0 ? '+' : ''}{formatCurrency(item.variance ?? 0)}
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<span className="sr-only">Open menu</span>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => onEdit(item)}>
												<Pencil className="mr-2 h-4 w-4" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => onDelete(item.id!)} className="text-red-600 focus:text-red-600">
												<Trash2 className="mr-2 h-4 w-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={2} className="font-bold">Totals</TableCell>
							<TableCell className="text-right font-bold">{formatCurrency(totalBudgeted)}</TableCell>
							<TableCell className="text-right font-bold">{formatCurrency(totalActual)}</TableCell>
							<TableCell className={cn(
								"text-right font-bold",
								totalVariance > 0 ? "text-red-600" : totalVariance < 0 ? "text-green-600" : "text-muted-foreground"
							)}>
								{totalVariance > 0 ? '+' : ''}{formatCurrency(totalVariance)}
							</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</div>
		</div>
	);
} 
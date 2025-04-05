import { ChangeOrder } from "@/types/budget";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface ChangeOrdersTableProps {
    changeOrders: ChangeOrder[];
    onEdit: (order: ChangeOrder) => void;
    onDelete: (orderId: string) => void;
}

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export function ChangeOrdersTable({ changeOrders, onEdit, onDelete }: ChangeOrdersTableProps) {
    const totalApprovedImpact = changeOrders
        .filter(co => co.status === 'Approved')
        .reduce((sum, co) => sum + co.costImpact, 0);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Approved</TableHead>
                    <TableHead className="text-right">Cost Impact</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {changeOrders.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No change orders added yet. Click 'Add Change Order' to start.
                        </TableCell>
                    </TableRow>
                )}
                {changeOrders.map((co) => (
                    <TableRow key={co.id}>
                        <TableCell className="font-medium">{co.name}</TableCell>
                        <TableCell>
                            <Badge variant={
                                co.status === 'Approved' ? 'success' :
                                co.status === 'Rejected' ? 'destructive' : 'outline'
                            }>{co.status}</Badge>
                        </TableCell>
                        <TableCell>
                            {co.dateApproved ? format(co.dateApproved, "MMM d, yyyy") : 'N/A'}
                        </TableCell>
                        <TableCell className={cn(
                            "text-right font-medium",
                            co.costImpact > 0 ? "text-orange-600" : co.costImpact < 0 ? "text-green-600" : "text-muted-foreground"
                        )}>
                            {co.costImpact >= 0 ? '+' : ''}{formatCurrency(co.costImpact)}
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
                                    <DropdownMenuItem onClick={() => onEdit(co)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onDelete(co.id!)} className="text-red-600 focus:text-red-600">
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
                    <TableCell colSpan={3} className="font-bold">Total Approved Impact</TableCell>
                    <TableCell className={cn(
                        "text-right font-bold",
                        totalApprovedImpact >= 0 ? "text-orange-600" : "text-green-600"
                    )}>
                        {totalApprovedImpact >= 0 ? '+' : ''}{formatCurrency(totalApprovedImpact)}
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
} 
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProjectsStore } from "@/store/projectsStore";
import { useBudgetStore } from "@/store/budgetStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, TrendingUp, FileWarning, Loader2 } from "lucide-react";
import { BudgetSummaryCards } from "./(components)/budget-summary-cards";
import { CostBreakdownTable } from "./(components)/cost-breakdown-table";
import { ChangeOrdersTable } from "./(components)/change-orders-table";
import { CostItemForm } from "./(components)/cost-item-form";
import { ChangeOrderForm } from "./(components)/change-order-form";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { CostItem, ChangeOrder } from "@/types/budget";

export default function ProjectBudgetPage() {
  const params = useParams();
  const projectId = params.id as string;
  const {
    currentProject,
    fetchProjects,
    setCurrentProject,
    isLoading: projectLoading,
  } = useProjectsStore();
  const {
    costItems,
    changeOrders,
    fetchBudgetData,
    deleteCostItem,
    deleteChangeOrder,
    isLoading: budgetLoading,
    error: budgetError,
  } = useBudgetStore();

  const [isCostItemFormOpen, setIsCostItemFormOpen] = useState(false);
  const [editingCostItem, setEditingCostItem] = useState<CostItem | null>(null);
  const [isChangeOrderFormOpen, setIsChangeOrderFormOpen] = useState(false);
  const [editingChangeOrder, setEditingChangeOrder] =
    useState<ChangeOrder | null>(null);

  const [isDeleteCostItemConfirmOpen, setIsDeleteCostItemConfirmOpen] = useState(false);
  const [costItemIdToDelete, setCostItemIdToDelete] = useState<string | null>(null);
  const [isDeleteChangeOrderConfirmOpen, setIsDeleteChangeOrderConfirmOpen] = useState(false);
  const [changeOrderIdToDelete, setChangeOrderIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!currentProject || currentProject.id !== projectId) {
      fetchProjects().then(() => {
        setCurrentProject(projectId);
      });
    }
  }, [projectId, currentProject, fetchProjects, setCurrentProject]);

  useEffect(() => {
    if (projectId) {
      fetchBudgetData(projectId);
    }
    setIsCostItemFormOpen(false);
    setEditingCostItem(null);
    setIsChangeOrderFormOpen(false);
    setEditingChangeOrder(null);
    setIsDeleteCostItemConfirmOpen(false);
    setCostItemIdToDelete(null);
    setIsDeleteChangeOrderConfirmOpen(false);
    setChangeOrderIdToDelete(null);
  }, [projectId, fetchBudgetData]);

  const handleAddCostItem = () => {
    setEditingCostItem(null);
    setIsCostItemFormOpen(true);
  };

  const handleEditCostItem = (item: CostItem) => {
    setEditingCostItem(item);
    setIsCostItemFormOpen(true);
  };

  const handleDeleteCostItem = (itemId: string) => {
    setCostItemIdToDelete(itemId);
    setIsDeleteCostItemConfirmOpen(true);
  };

  const confirmDeleteCostItem = async () => {
    if (costItemIdToDelete) {
      await deleteCostItem(costItemIdToDelete);
      setCostItemIdToDelete(null);
      setIsDeleteCostItemConfirmOpen(false);
    }
  };

  const handleAddChangeOrder = () => {
    setEditingChangeOrder(null);
    setIsChangeOrderFormOpen(true);
  };

  const handleEditChangeOrder = (order: ChangeOrder) => {
    setEditingChangeOrder(order);
    setIsChangeOrderFormOpen(true);
  };

  const handleDeleteChangeOrder = (orderId: string) => {
    setChangeOrderIdToDelete(orderId);
    setIsDeleteChangeOrderConfirmOpen(true);
  };

  const confirmDeleteChangeOrder = async () => {
    if (changeOrderIdToDelete) {
      await deleteChangeOrder(changeOrderIdToDelete);
      setChangeOrderIdToDelete(null);
      setIsDeleteChangeOrderConfirmOpen(false);
    }
  };

  if (
    projectLoading ||
    (budgetLoading && costItems.length === 0 && changeOrders.length === 0)
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2">Loading budget details...</span>
      </div>
    );
  }

  if (!currentProject) {
    return <div className="text-center text-red-600">Project not found.</div>;
  }

  if (budgetError) {
    return (
      <div className="text-center text-red-600">
        Error loading budget data: {budgetError}
      </div>
    );
  }

  const originalBudget = currentProject.budget || 0;
  const contingency = currentProject.contingencyBudget || 0;

  const totalBudgetedCostItems = costItems.reduce((sum, item) => sum + item.budgeted, 0);
  const totalActual = costItems.reduce(
    (sum, item) => sum + (item.actual ?? 0),
    0
  );
  const approvedChangeOrdersCost = changeOrders
    .filter((co) => co.status === "Approved")
    .reduce((sum, co) => sum + co.costImpact, 0);

  const revisedBudget = originalBudget + approvedChangeOrdersCost;
  const remainingBudget = revisedBudget - totalActual;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Budget</h1>
          <p className="text-muted-foreground mt-2">
            Track costs, compare against budget, and manage change orders.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddCostItem} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Cost Item
          </Button>
          <Button onClick={handleAddChangeOrder} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Change Order
          </Button>
        </div>
      </div>

      <BudgetSummaryCards
        originalBudget={originalBudget}
        contingency={contingency}
        approvedChanges={approvedChangeOrdersCost}
        revisedBudget={revisedBudget}
        actualSpent={totalActual}
        remainingBudget={remainingBudget}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CostBreakdownTable
            costItems={costItems}
            onEdit={handleEditCostItem}
            onDelete={handleDeleteCostItem}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileWarning className="h-5 w-5" />
            Change Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChangeOrdersTable
            changeOrders={changeOrders}
            onEdit={handleEditChangeOrder}
            onDelete={handleDeleteChangeOrder}
          />
        </CardContent>
      </Card>

      <CostItemForm
        projectId={projectId}
        isOpen={isCostItemFormOpen}
        onClose={() => setIsCostItemFormOpen(false)}
        initialData={editingCostItem}
      />

      <ChangeOrderForm
        projectId={projectId}
        isOpen={isChangeOrderFormOpen}
        onClose={() => setIsChangeOrderFormOpen(false)}
        initialData={editingChangeOrder}
      />

      <ConfirmationDialog
        isOpen={isDeleteCostItemConfirmOpen}
        onClose={() => setIsDeleteCostItemConfirmOpen(false)}
        onConfirm={confirmDeleteCostItem}
        title="Delete Cost Item?"
        description="This action cannot be undone. Are you sure you want to permanently delete this cost item?"
        confirmText="Delete"
      />

      <ConfirmationDialog
        isOpen={isDeleteChangeOrderConfirmOpen}
        onClose={() => setIsDeleteChangeOrderConfirmOpen(false)}
        onConfirm={confirmDeleteChangeOrder}
        title="Delete Change Order?"
        description="This action cannot be undone. Are you sure you want to permanently delete this change order?"
        confirmText="Delete"
      />
    </div>
  );
}

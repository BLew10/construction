// Project and task status color mapping
export const STATUS_COLORS = {
  // Project statuses
  completed: {
    background: "bg-green-500/30",
    border: "border-green-600",
    text: "text-green-800 dark:text-green-100"
  },
  "in progress": {
    background: "bg-blue-500/30",
    border: "border-blue-600",
    text: "text-blue-800 dark:text-blue-100"
  },
  "at risk": {
    background: "bg-amber-500/30",
    border: "border-amber-600",
    text: "text-amber-800 dark:text-amber-100"
  },
  delayed: {
    background: "bg-orange-500/30",
    border: "border-orange-600",
    text: "text-orange-800 dark:text-orange-100"
  },
  cancelled: {
    background: "bg-red-500/30",
    border: "border-red-600",
    text: "text-red-800 dark:text-red-100"
  },
  planned: {
    background: "bg-slate-500/30",
    border: "border-slate-600",
    text: "text-slate-800 dark:text-slate-100"
  },
  "not started": {
    background: "bg-slate-500/30",
    border: "border-slate-600",
    text: "text-slate-800 dark:text-slate-100"
  },
  default: {
    background: "bg-primary/30",
    border: "border-primary",
    text: "text-primary-foreground"
  }
}; 
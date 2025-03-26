"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
	useDocumentsStore,
	DocumentType,
	DocumentStatus,
} from "@/store/documentsStore";
import { useAuthStore } from "../../../../../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { FileIcon, SearchIcon, UploadIcon } from "lucide-react";
import DocumentUploader from "@/components/documents/document-uploader";

export default function DocumentsPage() {
	const params = useParams();
	const projectId = params.id as string;
	const { documents, fetchDocuments, isLoading, error } = useDocumentsStore();
	const { user } = useAuthStore();

	const [showUploader, setShowUploader] = useState(false);
	const [filters, setFilters] = useState({
		type: "all" as "all" | DocumentType,
		status: "all" as "all" | DocumentStatus,
		search: "",
	});

	useEffect(() => {
		fetchDocuments(projectId);
	}, [fetchDocuments, projectId]);

	// Apply filters
	const filteredDocuments = documents.filter((doc) => {
		return (
			doc.projectId === projectId &&
			(filters.type === "all" ? true : doc.type === filters.type) &&
			(filters.status === "all" ? true : doc.status === filters.status) &&
			(filters.search
				? doc.name.toLowerCase().includes(filters.search.toLowerCase()) ||
					(doc.description
						?.toLowerCase()
						.includes(filters.search.toLowerCase()) ??
						false)
				: true)
		);
	});

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
		return (bytes / 1048576).toFixed(1) + " MB";
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Project Documents</h1>
				<Button onClick={() => setShowUploader(true)}>
					<UploadIcon className="mr-2 h-4 w-4" /> Upload Document
				</Button>
			</div>

			{error && (
				<div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
					{error}
				</div>
			)}

			<Card>
				<CardHeader className="pb-3">
					<CardTitle>Document Library</CardTitle>
					<CardDescription>
						Manage and view all project documents in one place.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search documents..."
								className="pl-8"
								value={filters.search}
								onChange={(e) =>
									setFilters({ ...filters, search: e.target.value })
								}
							/>
						</div>

						<div className="flex flex-col md:flex-row gap-4 md:w-2/3">
							<Select
								value={filters.type}
								onValueChange={(value) =>
									setFilters({
										...filters,
										type: value as "all" | DocumentType,
									})
								}
							>
								<SelectTrigger className="w-full md:w-[180px]">
									<SelectValue placeholder="Document Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Types</SelectItem>
									<SelectItem value="plan">Plans</SelectItem>
									<SelectItem value="submittal">Submittals</SelectItem>
									<SelectItem value="contract">Contracts</SelectItem>
									<SelectItem value="permit">Permits</SelectItem>
									<SelectItem value="rfi">RFIs</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>

							<Select
								value={filters.status}
								onValueChange={(value) =>
									setFilters({
										...filters,
										status: value as "all" | DocumentStatus,
									})
								}
							>
								<SelectTrigger className="w-full md:w-[180px]">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Statuses</SelectItem>
									<SelectItem value="draft">Draft</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="approved">Approved</SelectItem>
									<SelectItem value="rejected">Rejected</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{isLoading ? (
						<div className="flex justify-center py-8">
							<p>Loading documents...</p>
						</div>
					) : filteredDocuments.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No documents found. Upload a document to get started.
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Document</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Version</TableHead>
									<TableHead>Uploaded</TableHead>
									<TableHead>Size</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredDocuments.map((document) => (
									<TableRow
										key={document.id}
										className="cursor-pointer hover:bg-muted/50"
									>
										<TableCell>
											<div className="flex items-center space-x-3">
												<FileIcon className="h-5 w-5 text-muted-foreground" />
												<div>
													<div className="font-medium">{document.name}</div>
													{document.description && (
														<div className="text-sm text-muted-foreground truncate max-w-[300px]">
															{document.description}
														</div>
													)}
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="outline" className="capitalize">
												{document.type}
											</Badge>
										</TableCell>
										<TableCell>
											<DocumentStatusBadge status={document.status} />
										</TableCell>
										<TableCell>v{document.version}</TableCell>
										<TableCell>
											<div className="text-sm">
												{format(new Date(document.uploadedAt), "MMM d, yyyy")}
											</div>
										</TableCell>
										<TableCell>{formatFileSize(document.fileSize)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{showUploader && (
				<DocumentUploader
					projectId={projectId}
					onClose={() => setShowUploader(false)}
					userId={user?.id || ""}
				/>
			)}
		</div>
	);
}

function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
	const statusConfig = {
		draft: { label: "Draft", variant: "outline" as const },
		pending: { label: "Pending", variant: "secondary" as const },
		approved: { label: "Approved", variant: "default" as const },
		rejected: { label: "Rejected", variant: "destructive" as const },
	};

	const config = statusConfig[status];

	return <Badge variant={config.variant}>{config.label}</Badge>;
}

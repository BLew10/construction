"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  useDocumentsStore,
  Document,
  DocumentComment,
} from "@/store/documentsStore";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Reply, TrashIcon, Pencil, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentCommentsProps {
  document: Document;
  comments: DocumentComment[];
}

const sampleComments: DocumentComment[] = [
  {
    id: "comment-1",
    documentId: "doc-abc",
    userId: "user-123",
    userName: "Alice Wonderland",
    userAvatar: "https://example.com/avatar-alice.png",
    content: "This looks great! Just one question about the second paragraph.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    resolved: false,
  },
  {
    id: "comment-2",
    documentId: "doc-abc",
    userId: "user-456",
    userName: "Bob The Builder",
    userAvatar: "https://example.com/avatar-bob.png",
    content:
      "Good point, Alice. I think we should clarify the terminology used there.",
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(), // 55 minutes ago
    parentId: "comment-1", // Reply to Alice's comment
    resolved: false,
  },
  {
    id: "comment-3",
    documentId: "doc-abc",
    userId: "user-123",
    userName: "Alice Wonderland",
    userAvatar: "https://example.com/avatar-alice.png",
    content: "Okay, I've updated the wording based on Bob's suggestion.",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    parentId: "comment-1", // Another reply to Alice's original comment
    resolved: false,
  },
  {
    id: "comment-4",
    documentId: "doc-abc",
    userId: "user-789",
    userName: "Charlie Chaplin",
    userAvatar: "https://example.com/avatar-charlie.png",
    content: "Typo on page 3, third line.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    resolved: true, // This comment is resolved
  },
  {
    id: "comment-5",
    documentId: "doc-abc",
    userId: "user-456",
    userName: "Bob The Builder",
    userAvatar: "https://example.com/avatar-bob.png",
    content:
      "I initially suggested we remove the intro section, but now I think it's fine.", // Edited content
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Edited 30 minutes ago
    resolved: false,
  },
];

export function DocumentComments({
  document,
  comments = sampleComments,
}: DocumentCommentsProps) {
  const { user } = useAuthStore();
  const { addComment, deleteComment, resolveComment, updateComment } =
    useDocumentsStore();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(
    null
  );

  // TODO: Remove this once we have a user
  // make user. -> user. via a CTRL+F
  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please log in to view and add comments.
      </div>
    );
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment({
      documentId: document.id,
      userId: user.id,
      userName: user.name || user.email, // Use name or email
      userAvatar: user.avatarUrl,
      content: newComment,
      resolved: false,
    });
    setNewComment("");
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    await addComment({
      documentId: document.id,
      userId: user.id,
      userName: user.name || user.email,
      userAvatar: user.avatarUrl,
      content: replyContent,
      parentId: parentId,
      resolved: false,
    });
    setReplyContent("");
    setReplyingTo(null);
  };

  const handleDeleteComment = async (commentId: string) => {
    setCommentToDeleteId(commentId);
  };

  const confirmDeleteComment = async () => {
    if (commentToDeleteId) {
      await deleteComment(commentToDeleteId);
      setCommentToDeleteId(null);
    }
  };

  const handleResolveComment = async (commentId: string, resolved: boolean) => {
    await resolveComment(commentId, resolved);
  };

  const handleEditComment = (comment: DocumentComment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId || !editingContent.trim()) return;
    await updateComment(editingCommentId, editingContent);
    setEditingCommentId(null);
    setEditingContent("");
  };

  const renderComment = (comment: DocumentComment, isReply = false) => {
    const isEditing = editingCommentId === comment.id;
    const isCurrentUser = comment.userId === user.id;
    const replies = comments.filter((c) => c.parentId === comment.id);

    return (
      <div key={comment.id} className={`${isReply ? "ml-6 sm:ml-10 mt-3" : "mt-4"}`}>
        <div className={`p-3 sm:p-4 rounded-lg ${comment.resolved ? "bg-muted/50" : "bg-card"} border`}>
          <div className="flex items-start justify-between gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={comment.userAvatar} alt={comment.userName} />
              <AvatarFallback>
                {comment.userName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-1 mb-1">
                <div>
                  <span className="font-medium text-sm">
                    {comment.userName}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                
                {/* Mobile action button */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isCurrentUser && (
                        <>
                          <DropdownMenuItem onClick={() => handleEditComment(comment)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCommentToDeleteId(comment.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => setReplyingTo(comment.id)}>
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleResolveComment(comment.id, !comment.resolved)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {comment.resolved ? "Unresolve" : "Resolve"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Desktop action buttons */}
                <div className="hidden sm:flex sm:space-x-1">
                  {isCurrentUser && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEditComment(comment)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => setCommentToDeleteId(comment.id)}
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    <Reply className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 ${
                      comment.resolved ? "text-green-500" : ""
                    }`}
                    onClick={() => handleResolveComment(comment.id, !comment.resolved)}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCommentId(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleUpdateComment}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={`text-sm ${comment.resolved ? "text-muted-foreground" : ""}`}>
                  {comment.content}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Show any replies */}
        {replies.length > 0 && (
          <div className="space-y-3 mt-3">
            {replies.map((reply) => renderComment(reply, true))}
          </div>
        )}

        {/* Reply form if user is replying to this comment */}
        {replyingTo === comment.id && (
          <div className="ml-6 sm:ml-10 mt-3 p-3 bg-muted/30 border rounded-lg">
            <div className="flex items-start space-x-3">
              <Avatar className="h-7 w-7">
                <AvatarImage 
                  src={user.avatarUrl} 
                  alt={user.name || user.email} 
                />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder={`Reply to ${comment.userName}...`}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const topLevelComments = comments.filter((comment) => !comment.parentId);

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No comments yet. Be the first to add one!
        </div>
      ) : (
        <div className="space-y-4">
          {topLevelComments.map((comment) => renderComment(comment))}
        </div>
      )}

      {/* New comment form */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-medium mb-2">Add a comment</h3>
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8 hidden sm:block">
            <AvatarImage
              src={user.avatarUrl}
              alt={user.name || user.email}
            />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Write your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!commentToDeleteId}
        onOpenChange={(open) => !open && setCommentToDeleteId(null)}
      >
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCommentToDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteComment}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

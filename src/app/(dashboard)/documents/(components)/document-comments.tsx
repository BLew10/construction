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
import { CheckCircle, Reply, TrashIcon, Pencil } from "lucide-react";

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
  // make user?. -> user. via a CTRL+F
  if (false && !user) {
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
      userId: user?.id,
      userName: user?.name || user?.email, // Use name or email
      userAvatar: user?.avatarUrl,
      content: newComment,
      resolved: false,
    });
    setNewComment("");
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    await addComment({
      documentId: document.id,
      userId: user?.id,
      userName: user?.name || user?.email,
      userAvatar: user?.avatarUrl,
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

  const renderComment = (comment: DocumentComment, isReply = false) => (
    <div
      key={comment.id}
      className={`flex space-x-3 ${isReply ? "ml-8 mt-3" : "mt-4"}`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.userAvatar} alt={comment.userName} />
        <AvatarFallback>
          {comment.userName?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.userName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
            {comment.updatedAt && comment.createdAt !== comment.updatedAt && (
              <span className="text-xs text-muted-foreground italic">
                (edited)
              </span>
            )}
          </div>
          {/* Actions: Resolve, Reply, Edit, Delete */}
          <div className="flex items-center space-x-1">
            {/* Resolve Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${
                comment.resolved
                  ? "text-green-600 hover:text-green-700"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() =>
                handleResolveComment(comment.id, !comment.resolved)
              }
              title={
                comment.resolved ? "Mark as unresolved" : "Mark as resolved"
              }
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            {!isReply && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
                title="Reply"
              >
                <Reply className="h-4 w-4" />
              </Button>
            )}
            {comment.userId === user?.id && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => handleEditComment(comment)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive/80"
                  onClick={() => handleDeleteComment(comment.id)}
                  title="Delete"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {editingCommentId === comment.id ? (
          <div className="space-y-2">
            <Textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="min-h-[60px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingCommentId(null)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleUpdateComment}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <p
            className={`text-sm ${
              comment.resolved ? "text-muted-foreground line-through" : ""
            }`}
          >
            {comment.content}
          </p>
        )}

        {/* Reply Input */}
        {replyingTo === comment.id && !isReply && (
          <div className="mt-3 pt-3 border-t border-dashed">
            <h4 className="text-xs font-medium mb-1">
              Reply to {comment.userName}
            </h4>
            <div className="flex items-start space-x-3">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={user?.avatarUrl}
                  alt={user?.name || user?.email}
                />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px]"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddReply(comment.id)}
                    disabled={!replyContent.trim()}
                  >
                    Post Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Replies */}
        {comments
          .filter((reply) => reply.parentId === comment.id)
          .map((reply) => renderComment(reply, true))}
      </div>
    </div>
  );

  const topLevelComments = comments.filter((comment) => !comment.parentId);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Comments ({comments.length})</h3>

      {/* List existing comments */}
      {topLevelComments.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No comments yet.
        </p>
      ) : (
        <div className="space-y-4">
          {topLevelComments.map((comment) => renderComment(comment))}
        </div>
      )}

      {/* New comment form */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-medium mb-2">Add a comment</h3>
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.avatarUrl}
              alt={user?.name || user?.email}
            />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() || "U"}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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

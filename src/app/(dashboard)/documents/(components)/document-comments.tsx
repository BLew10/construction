"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDocumentsStore, Document, DocumentComment } from "@/store/documentsStore";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, MessageCircle, Reply, TrashIcon, CheckIcon, XIcon } from "lucide-react";

interface DocumentCommentsProps {
  document: Document;
  comments: DocumentComment[];
}

export function DocumentComments({ document, comments }: DocumentCommentsProps) {
  const { user } = useAuthStore();
  const { addComment, deleteComment, resolveComment, updateComment } = useDocumentsStore();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

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
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await deleteComment(commentId);
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
    <div key={comment.id} className={`flex space-x-3 ${isReply ? "ml-8 mt-3" : "mt-4"}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.userAvatar} alt={comment.userName} />
        <AvatarFallback>{comment.userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.userName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            {comment.updatedAt && comment.createdAt !== comment.updatedAt && (
              <span className="text-xs text-muted-foreground italic">(edited)</span>
            )}
          </div>
          {/* Actions: Resolve, Reply, Edit, Delete */}
          <div className="flex items-center space-x-1">
             {/* Resolve Toggle */}
             <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${comment.resolved ? 'text-green-600 hover:text-green-700' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => handleResolveComment(comment.id, !comment.resolved)}
                title={comment.resolved ? "Mark as unresolved" : "Mark as resolved"}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
             {!isReply && (
               <Button
                 variant="ghost"
                 size="icon"
                 className="h-7 w-7 text-muted-foreground hover:text-foreground"
                 onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                 title="Reply"
               >
                 <Reply className="h-4 w-4" />
               </Button>
             )}
             {comment.userId === user.id && (
               <>
                 <Button
                   variant="ghost"
                   size="icon"
                   className="h-7 w-7 text-muted-foreground hover:text-foreground"
                   onClick={() => handleEditComment(comment)}
                   title="Edit"
                 >
                   <MessageCircle className="h-4 w-4" /> {/* Using MessageCircle for edit */}
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
              <Button variant="ghost" size="sm" onClick={() => setEditingCommentId(null)}>Cancel</Button>
              <Button size="sm" onClick={handleUpdateComment}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <p className={`text-sm ${comment.resolved ? 'text-muted-foreground line-through' : ''}`}>
            {comment.content}
          </p>
        )}

        {/* Reply Input */}
        {replyingTo === comment.id && !isReply && (
          <div className="mt-3 pt-3 border-t border-dashed">
             <h4 className="text-xs font-medium mb-1">Reply to {comment.userName}</h4>
             <div className="flex items-start space-x-3">
                <Avatar className="h-6 w-6">
                   <AvatarImage src={user.avatarUrl} alt={user.name || user.email} />
                   <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                   <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
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
        {comments.filter(reply => reply.parentId === comment.id).map(reply => renderComment(reply, true))}
      </div>
    </div>
  );

  const topLevelComments = comments.filter(comment => !comment.parentId);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Comments ({comments.length})</h3>

      {/* List existing comments */}
      {topLevelComments.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {topLevelComments.map(comment => renderComment(comment))}
        </div>
      )}

      {/* New comment form */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-medium mb-2">Add a comment</h3>
        <div className="flex items-start space-x-3">
           <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.name || user.email} />
              <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
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
    </div>
  );
} 
import React from "react";
import PostCard from "./PostCard";
import "./Post.css";

const PostList = ({ posts, onEdit, onDelete }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default PostList;

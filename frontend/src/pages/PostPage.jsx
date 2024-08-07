import React, { useState, useEffect, useContext } from "react";
import PostList from "../components/Post/PostList";
import AddPostForm from "../components/Post/AddPostForm";
import UpdatePostForm from "../components/Post/UpdatePostForm";
import "../components/Post/Post.css";
import axios from "axios";
import { UserContext, ROLES } from "../UserContext";
import BaseURL from "../config";
import ConfirmModal from "../components/ConfirmModal.jsx";

const PostPage = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const fetchAndSetPosts = async () => {
    const postsData = user ? await fetchPostsbyRole() : await fetchPostsForNonMember();
    setPosts(postsData);
    fetchRoles();
  };

  useEffect(() => {
    fetchAndSetPosts();
  }, [user]);

  // Retrive all the posts from the database
  const fetchPostsForNonMember = async () => {
    try {
      const response = await axios.get(`${BaseURL}/api/post/getPostsForNonMember`);
      //console.log("Posts:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  //Retrive post only for the user role
  const fetchPostsbyRole = async () => {
    try {
      const response = await axios.post(`${BaseURL}/api/post/getPostByRole`, { roles: user.roles });
      //console.log("Posts:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const fetchRoles = async () => {
    // console.log("fetchRoles function called");
    try {
      const response = await axios.get(`${BaseURL}/api/role/getAllRoles`);
      // console.log("Roles fetched successfully:", response.data);
      setRoleOptions(response.data.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const showAddPostModal = () => {
    setCurrentPost(null);
    setShowModal(true);
  };

  const showEditPostModal = (post) => {
    setCurrentPost(post);
    setShowModal(true);
  };

  const showDeletePostConfirmModal = (id) => {
    setPostToDelete(id);
    setConfirmModalOpen(true);
  };

  const closePostModal = () => {
    setShowModal(false);
    setCurrentPost(null);
  };

  const handleSavePost = async (post) => {
    try {
      const response = await axios.post(`${BaseURL}/api/post/addPost`, post);
      console.log("Post saved successfully");
      setPosts([...posts, response.data]);
      fetchAndSetPosts(); // After adding a post, fetch the list of posts again
      closePostModal();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleUpdatePost = async (updatedPost) => {
    try {
      const updateUrl = `${BaseURL}/api/post/updatePost/${currentPost._id}`;
      await axios.patch(updateUrl, updatedPost);
      setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
      closePostModal();
      console.log("post updated");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const confirmDeletePost = async () => {
    try {
      await axios.delete(`${BaseURL}/api/post/deletePost/${postToDelete}`);
      console.log("post deleted", postToDelete);
      setPosts(posts.filter((p) => p._id !== postToDelete));
      setConfirmModalOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const upcomingPosts = posts
    .filter((post) => post.updated) // Ensure the post has an updated field
    .sort((a, b) => new Date(b.updated) - new Date(a.updated)); // Sort by updated field in descending order

  return (
    <div className="post-page">
      {user?.roles.includes(ROLES.ADMIN) && (
        <button className="add-post-button" onClick={showAddPostModal}>
          Add News
        </button>
      )}
      <section>
        <h2>Lastest News</h2>
        <PostList
          posts={upcomingPosts.map((post) => ({ ...post }))}
          onEdit={showEditPostModal}
          onDelete={showDeletePostConfirmModal}
          user={user}
        />
      </section>
      {showModal && (
        <div className="add_edit_post_modal" onClick={closePostModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closePostModal}>
              &times;
            </span>
            {currentPost ? (
              <UpdatePostForm
                post={currentPost}
                open={showEditPostModal}
                onSave={handleUpdatePost}
                onCancel={closePostModal}
                roleOptions={roleOptions}
              />
            ) : (
              <AddPostForm
                open={showAddPostModal}
                onSave={handleSavePost}
                onCancel={closePostModal}
                roleOptions={roleOptions}
              />
            )}
          </div>
        </div>
      )}
      <ConfirmModal
        title="Confirm Delete"
        text="Are you sure you want to delete this news? Please type 'DELETE' to confirm."
        open={confirmModalOpen}
        onConfirm={confirmDeletePost}
        onClose={() => setConfirmModalOpen(false)}
        confirmWord="DELETE"
      />
    </div>
  );
};

export default PostPage;

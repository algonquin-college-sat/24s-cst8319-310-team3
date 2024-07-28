import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import BaseURL from "../../config";
import Editor from "./Editor";
import axios from "axios";
import {
  TextField,
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
} from "@mui/material";

const AddPostForm = ({ open, onCancel, roleOptions }) => {
  const [subject, setSubject] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [emailList, setEmailList] = useState("");
  const [loading, setLoading] = useState(false);
  const [newsBodyError, setNewsBodyError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [emailListError, setEmailListError] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  const isInvalidBody = () => {
    const trimmedText = newsBody.trim();
    const containsOnlyHtmlTags = /^(<p>(<br>|<br\/>|<br\s\/>|\s+|)<\/p>)*$/gm.test(trimmedText);
    return !trimmedText || containsOnlyHtmlTags;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    // Reset all error states
    setSubjectError("");
    setNewsBodyError("");
    setEmailListError("");

    if (!emailList.trim()) {
      setEmailListError("Email list is required");
      hasError = true;
    }

    if (!subject.trim()) {
      setSubjectError("Subject is required");
      hasError = true;
    }

    if (!newsBody.trim() || isInvalidBody()) {
      setNewsBodyError("News body is required");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    const emailArray = emailList
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    const apiUrl = `${BaseURL}/api/post/addPost`;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const formData = new FormData();
    formData.append("content", newsBody);
    formData.append("subject", subject);
    formData.append("roles", selectedRoles);
    formData.append("emails", emailArray);
    // console.log("Roles:", selectedRoles);
    // console.log("formData:", formData);

    try {
      const response = await axios.post(apiUrl, formData, { headers });
      if (response.status === 200) {
        toast.success("News published successfully");
      } else {
        const errorMessage = response.data;
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to publish news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    const roleIds = e.target.value;
    setSelectedRoles(roleIds);
    console.log("Selected Roles:", roleIds);

    if (roleIds.length > 0) {
      try {
        const emailPromises = roleIds.map((roleId) =>
          axios.get(`http://localhost:3000/api/user/getUsersByRoleId/${roleId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        );

        const responses = await Promise.all(emailPromises);
        const memberEmails = responses
          //.flatMap((response) => response.data.data.members.map((member) => member.email))
          .flatMap((response) => {
            if (response.data && response.data.data && response.data.data.users) {
              return response.data.data.users.map((member) => member.email);
            }
            return [];
          })
          .filter((email, index, self) => self.indexOf(email) === index) // Remove duplicates
          .join(", ");

        setEmailList(memberEmails);
        setEmailListError("");

        console.log("Member Emails:", memberEmails);
      } catch (error) {
        console.error("Error fetching member emails:", error);
        toast.error("Failed to fetch emails");
      }
    } else {
      setEmailList("");
    }

    // Fetch members' emails for the selected event
    // if (roleIds) {
    //   try {
    //     const response = await axios.get(`http://localhost:3000/api/volunteer/getMembersByRoleId/${e.target.value}`, {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
    //       },
    //     });
    //     // Fetch the emails and remove duplicates
    //     const memberEmails = [...new Set(response.data.data.members.map((member) => member.email))].join(", ");
    //     setEmailList(memberEmails);
    //     setEmailListError("");
    //   } catch (error) {
    //     console.error("Error fetching member emails:", error);
    //     toast.error("Failed to fetch emails");
    //   }
    // } else {
    //   setEmailList("");
    // }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="notify-volunteers-dialog"
      sx={{ minHeight: "100vh", maxHeight: "80vh" }}
    >
      <DialogTitle>Publish News</DialogTitle>
      <DialogContent sx={{ minHeight: "40vh" }}>
        <Grid container spacing={1}>
          <Grid item xs={12} mt={1}>
            <FormControl fullWidth>
              {/* error={!!eventError} */}
              <InputLabel id="demo-simple-select-required-label">Roles</InputLabel>
              <Select
                abelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                label="Roles"
                multiple
                value={selectedRoles}
                onChange={handleChange}
                renderValue={(selected) =>
                  selected
                    .map((roleId) => {
                      const role = roleOptions.find((role) => role._id === roleId);
                      return role ? role.name : "";
                    })
                    .join(", ")
                }
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {selectedRoles.length > 0 && (
            <Grid item xs={12} mt={1}>
              <TextField
                required
                id="to"
                label="To"
                name="to"
                value={emailList}
                onChange={(e) => setEmailList(e.target.value)}
                fullWidth
                error={!!emailListError}
                helperText={emailListError}
              />
            </Grid>
          )}
          <Grid item xs={12} mb={1} mt={1}>
            <TextField
              required
              id="subject"
              label="Subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              error={!!subjectError}
              helperText={subjectError}
            />
          </Grid>
          <Grid item xs={12}>
            <Editor
              value={newsBody}
              onEditorChange={(value) => {
                setNewsBody(value);
              }}
              placeholder="Enter description"
            />
            {newsBodyError && (
              <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                {newsBodyError}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center", mb: 2, p: 0 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#e88a1d", color: "#ffffff", "&:hover": { backgroundColor: "#e88a1d" } }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Post"}
        </Button>
        <Button
          onClick={onCancel}
          variant="contained"
          sx={{ backgroundColor: "#e88a1d", color: "#ffffff", "&:hover": { backgroundColor: "#e88a1d" } }}
        >
          Cancel
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default AddPostForm;

import React, { useState } from "react";
import "./Event.css";
import Alert from "@mui/material/Alert";
import axios from "axios";

const AddEditEventForm = ({ event, onSave, onCancel }) => {
  const [failMessage, setFailMessage] = useState("");
  const [formData, setFormData] = useState(
    event || {
      name: "",
      description: "",
      time: "",
      place: "",
      pricePublic: "",
      priceMember: "",
      isMemberOnly: false,
      imageUrl: "",
      purchaseURL: "",
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateURL = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  };

  const handleSubmit = (e) => {
    console.log("Saving Data in AddEditEventForm", formData);
    e.preventDefault();

    // Validate and update purchaseURL
    const updatedPurchaseURL = validateURL(formData.purchaseURL);

    setFormData((prevFormData) => ({
      ...prevFormData,
      purchaseURL: updatedPurchaseURL,
    }));

    onSave({ ...formData, purchaseURL: updatedPurchaseURL });
  };

  // Step 1: Add a new state for the file
  const [selectedFile, setSelectedFile] = useState(null);

  // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // // Function to upload the file to the server
  const uploadFile = async () => {
    if (!selectedFile) return;

    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:3000/api/uploads/uploadImage", uploadFormData);

      if (response.data.status === "success") {
        setFailMessage("");
      } else {
        setFailMessage(response.data.message);
      }
      if (response.data.imageUrl) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          imageUrl: response.data.imageUrl,
        }));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFailMessage(error.response.data.message);
      } else {
        setFailMessage("An error occurred while uploading the file.");
      }
    }
  };

  return (
    <form className="add-edit-event-form" onSubmit={handleSubmit}>
      <h2>{event ? "Edit Event" : "Add Event"}</h2>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Description:
        <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
      </label>
      <label>
        Time:
        <input type="datetime-local" name="time" value={formData.time} onChange={handleChange} required />
      </label>
      <label>
        Place:
        <input type="text" name="place" value={formData.place} onChange={handleChange} required />
      </label>
      <label>
        Price (Public):
        <input type="text" name="pricePublic" value={formData.pricePublic} onChange={handleChange} required />
      </label>
      <label>
        Price (Members Only):
        <input type="text" name="priceMember" value={formData.priceMember} onChange={handleChange} />
      </label>
      <label>
        Member Only:
        <input type="checkbox" name="isMemberOnly" checked={formData.isMemberOnly} onChange={handleChange} />
      </label>
      <label>
        Image URL:
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
      </label>
      <label>
        Upload Image:
        <input type="file" onChange={handleFileChange} />
        {failMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {failMessage}
          </Alert>
        )}
        <button type="button" onClick={uploadFile}>
          Upload
        </button>
      </label>
      <label>
        Purchase URL:
        <input type="text" name="purchaseURL" value={formData.purchaseURL} onChange={handleChange} required />
      </label>
      <div className="form-actions">
        <button type="submit" className="action-button">
          {event ? "Save Changes" : "Add Event"}
        </button>
        <button type="button" className="action-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddEditEventForm;

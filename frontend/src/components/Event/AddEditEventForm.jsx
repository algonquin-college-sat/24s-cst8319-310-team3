import React, { useState } from 'react';
import './Event.css'; 

const AddEditEventForm = ({ event, onSave, onCancel }) => {
    const [formData, setFormData] = useState( event || {
        id: '',
        name: '',
        description: '',
        time: '',
        place: '',
        pricePublic: '',
        priceMember: '',
        isMemberOnly: false,
        imageUrl: ''
    });

    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleSelectImage = async () => {
        try {
            console.log('Fetching images...');
            console.log("Calling select image in frontend" + __dirname)
            const response = await fetch('http://localhost:3001/api/event/selectImage');
            const images = await response.json();
            setImages(images);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const handleImageClick = (imageName) => {
        setSelectedImage(imageName);
        // Optionally, update formData here if you want to immediately reflect the selection
        // setFormData({...formData, imageUrl: imageName});
    };

    return (
        <form className="add-edit-event-form" onSubmit={handleSubmit}>
            <h2>{event ? 'Edit Event' : 'Add Event'}</h2>
            <label>
                ID:
                <input type="text" name="id" value={formData.id} onChange={handleChange} disabled={!!event} required />
            </label>
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
                <button type="button" className="action-button" onClick={handleSelectImage}>Select Image</button>
                {/* <div className="image-selection">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={`http://localhost:3001/image/EventImage/${image}`}
                            alt={image}
                            onClick={() => handleImageClick(image)}
                            style={{ border: selectedImage === image ? '2px solid blue' : 'none', cursor: 'pointer' }}
                            width="100"
                        />
                    ))}
                </div> */}
            </label>
            <div className="form-actions">
                <button type="submit" className="action-button">{event ? 'Save Changes' : 'Add Event'}</button>
                <button type="button" className="action-button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default AddEditEventForm;

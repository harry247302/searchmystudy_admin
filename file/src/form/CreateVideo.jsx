import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Button,
  Form,
} from 'react-bootstrap';
import { app } from "../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createVideo, updateVideo } from "../slice/VideoSlice";

const CreateVideo = ({ele, handleClose}) => {
  const storage = getStorage(app);
  const dispatch = useDispatch();
const [form,setForm] = useState({
    name:ele?.name || "",
    videoURL: ele?.videoURL || "",
    thumbnailURL: ele?.thumbnailURL || "",
})
const [errors, setErrors] = useState({});
const [thumbnailPreview, setThumbnailPreview] = useState(ele && ele._id ? ele?.thumbnailURL : null);

const uploadImage = async (file) => {
    const storageRef = ref(storage, `provinces/${Date.now()}-${file.name}`);
    await uploadBytesResumable(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  console.log(ele?.thumbnailURL);
  
  const handleChange = async (event) => {
    const { name, value, type, files } = event.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {

          if (name === 'thumbnailURL') {
            // await validateImageDimensions(file, { width: 1500, height: 500 });
            const previewURL = URL.createObjectURL(file);
            setThumbnailPreview(previewURL);
            const imageURL = await uploadImage(file);
            setForm(prev => ({ ...prev, thumbnailURL: imageURL }));
          }     
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (ele && ele._id) {
        // Update existing country


        const res = await dispatch(updateVideo({ id: ele._id, data: form }));
        if (updateVideo.fulfilled.match(res)) {
          toast.success("✅ Video updated successfully!");
          handleClose();
        }
        else if (updateVideo.rejected.match(res)) {
          // Failure case with detailed error
          const errorMsg =
            res.payload?.message || res.error?.message || "Unknown error occurred.";
          toast.error("❌ Failed to update video: " + errorMsg);
        }
      } else {
        // Create new country
        // console.log(form, "+++++++++++++++++++++-----------");

        const res = await dispatch(createVideo(form));
        if (createVideo.fulfilled.match(res)) {
          toast.success("✅ video created successfully!");
          handleClose();
        } else if (createVideo.rejected.match(res)) {
          // Failure case with detailed error
          const errorMsg =
            res.payload?.message || res.error?.message || "Unknown error occurred.";
          toast.error("❌ Failed to create video: " + errorMsg);
        }
      }
    } catch (error) {
      console.error("Failed to create Video:", error);
      toast.error("Failed to create Video");
    }
  }

  return (
    <Modal show={open} onHide={handleClose} size="lg" centered scrollable>
    <Modal.Header closeButton className="text-black">
      <Modal.Title>Add University</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Thumbnail</Form.Label>
          <Form.Control
            type="file"
            name="thumbnailURL"
            onChange={(e) => {
              handleChange(e, "thumbnail")
            }}
            isInvalid={!!errors.thumbnailURL}
          />
          {thumbnailPreview && <img src={thumbnailPreview} alt="thumbnail" className="mt-2 img-fluid rounded" />}
        </Form.Group>
    
        <Form.Group>
          <Form.Label>Video URL</Form.Label>
          <Form.Control
            type="text"
            name="videoURL"
            value={form.videoURL}
            onChange={handleChange}
            isInvalid={!!errors.videoURL}
          />
          <Form.Control.Feedback type="invalid">{errors.videoURL}</Form.Control.Feedback>
        </Form.Group>


      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      <Button variant="primary" onClick={handleSubmit}>
        {ele && ele._id ? "Update" : "Submit"}
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default CreateVideo
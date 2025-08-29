import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useDispatch } from "react-redux";
import { createTestemonial, fetchTestemonial  , updateTestemonial } from "../slice/testemonialsManagementSlice";
import { app } from "../firebase";
import {  ToastContainer } from "react-toastify";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const storage = getStorage(app);

const Createtestemonial = ({ ele, handleClose, loadCounsellors }) => {
 
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: ele?.title || "",
    description: ele?.description || "",
    rating: ele?.rating || 5,
    imageURL: ele?.imageURL || "",
    imageFile: null, // File object
  });

  const [uploads, setUploads] = useState({
    image: { progress: 0, preview: null, loading: false },
  });

  const [imageValid, setImageValid] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle file selection
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageFile: file, imageUrl: "" }));
    setUploads((prev) => ({ ...prev, image: { ...prev.image, preview: previewURL, progress: 0, loading: false } }));
    validateImage(file); // validate dimensions
    setErrors((prev) => ({ ...prev, [field]: "" }));
    // console.log(form);

  };

  // Validate image dimensions (example: 1200x600 px)
  const validateImage = (file) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      if (img.width === 1200 && img.height === 600) {
        setImageValid(true);
        toast.success("Valid image uploaded!");
      } else {
        setImageValid(false);
        toast.error("Image dimensions must be 1200x600 pixels.");
      }
    };

    img.onerror = () => {
      setImageValid(false);
      toast.error("Invalid image file.");
    };

    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.imageFile && !form.imageURL) newErrors.imageURL = "Image is required";
    if (form.rating < 1 || form.rating > 5) newErrors.rating = "Rating must be between 1 and 5";
    if (!imageValid && form.imageFile) newErrors.imageURL = "Image dimensions are invalid";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `counsellors/${file?.name}`);

      const metadata = {
        contentType: file?.type,          // sets correct MIME type
        contentDisposition: "inline",    // ensures browser opens in new tab
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      setUploads((prev) => ({ ...prev, image: { ...prev.image, loading: true } }));

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploads((prev) => ({ ...prev, image: { ...prev.image, progress } }));
        },
        (error) => {
          setUploads((prev) => ({ ...prev, image: { ...prev.image, loading: false, progress: 0 } }));
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setUploads((prev) => ({ ...prev, image: { ...prev.image, loading: false, progress: 100 } }));
          resolve(url);
        }
      );
    });
  };


  //   const handleSubmit = async () => {
  //     console.log("Form Data:", form);
  //     console.log(form.imageURL);
  //     let formData = {}
  //     console.log(ele);

  //     try {
  // if(form.imageURL){
  //             const imageUrl = await uploadImage(form.imageFile);
  //             formData = {
  //               name: form.name,
  //               course: form.course,
  //               experience: form.experience,
  //               imageURL: imageUrl,
  //             }
  //         } else{
  //             alert("Please upload an image")
  //         }

  //          if (ele && ele._id) {
  //               console.log("FORM DATA", formData);

  //               // Update existing webinar
  //               const res = await dispatch(updateCounsellor({id:ele._id,data:formData}));
  //               console.log(res);


  //               if (updateCounsellor.fulfilled.match(res)) {
  //                 alert("Counsellor updated successfully!");
  //                 handleClose();
  //               } else if (updateCounsellor.rejected.match(res)) {
  //                 alert("Failed to update Counsellor: " + (res.payload?.message || res.error.message || "Unknown error"));
  //               }
  //             } else {
  //                if (!validateForm()) {
  //       toast.error("Please fill in all required fields with valid image.");
  //       return;
  //     }
  //               // Create new counsellor
  //               const res = await dispatch(createCounsellor(formData));
  //             handleClose();

  //               if (createCounsellor.fulfilled.match(res)) {
  //                 alert("Counsellor created successfully!");
  //                 handleClose();
  //               } else if (createCounsellor.rejected.match(res)) {
  //                 alert("Failed to create Counsellor: " + (res.payload?.message || res.error.message || "Unknown error"));
  //               }
  //             }
  //     }
  //      catch (error) {
  //       toast.error("Unexpected error: " + error.message);
  //     }
  //   };


  const handleSubmit = async () => {
    console.log(form);
    console.log("budhau");
    console.log(ele);

    let formData = {};
    if (form?.imageFile) {
      const imageUrl = await uploadImage(form.imageFile);
      formData = {
        title: form?.title,
        description: form?.description,
        rating: Number(form?.rating),
        imageURL: imageUrl,
      };
    } else if (form?.imageURL) {
      formData = {
        title: form?.title,
        description: form?.description,
        rating: Number(form?.rating),
        imageURL: form?.imageURL,
      };
    } else {
      toast.error("Please upload an image");
      return;
    }
    
    try {
      if (ele && ele._id) {
        // update existing testimonial
        const res = await dispatch(updateTestemonial({ id: ele._id, data: formData }));
        // console.log("Update response:", res);
        
        if (updateTestemonial.fulfilled.match(res)) {
          toast.success("Counsellor updated successfully!");
          dispatch(fetchTestemonial());
          handleClose();
          loadCounsellors();
        } else if (updateTestemonial.rejected.match(res)) {
          toast.error("Failed to update Counsellor: " + (res.payload?.message || res.error?.message || "Unknown error"));
        }
      } else {
        console.log("budhau2");

        // create new testimonial
        if (!validateForm()) {
          toast.error("Please fill in all required fields with valid image.");
          return;
        }
        const res = await dispatch(createTestemonial(formData));
        console.log("Create response:", res, "|||||||||||||||||||");

        if (createTestemonial.fulfilled.match(res)) {
          toast.success("Counsellor created successfully!");
          loadCounsellors();
          handleClose();
        } else if (createTestemonial.rejected.match(res)) {
          toast.error("Failed to create Counsellor: " + (res.payload?.message || res.error?.message || "Unknown error"));
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error: " + error.message);
    }
  }
  return (
    <>
      <ToastContainer />
      <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog" style={{ maxWidth: "800px" }}>
          <div className="modal-content p-4">
            <div className="modal-header">
              <h5 className="modal-title">Add Counsellors</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  placeholder="Enter title"
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="form-control"
                  placeholder="Enter description (optional)"
                  rows="3"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Rating *</label>
                <p className="text-sm text-gray-500">It should be between 1 and 5</p>
                <input
                  type="number"
                  max={5}
                  min={1}
                  value={form.rating}
                  onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}
                  className={`form-control ${errors.rating ? "is-invalid" : ""}`}
                  placeholder="Enter rating"
                />
                {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Image *</label>
                <p className="text-[10px]">Image size should be 300x250 px</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "imageURL")}
                  className={`form-control ${errors.imageURL ? "is-invalid" : ""}`}
                />
                {uploads.image.preview && (
                  <div className="mt-2">
                    <p className="text-red-500 text-sm mt-1">Image should be 1200x600 px</p>
                    <img src={uploads.image.preview} alt="preview" style={{ width: "150px" }} />
                    {/* <div>Upload Progress: {Math.round(uploads.image.progress)}%</div> */}
                  </div>
                )}
                {errors.imageURL && <div className="invalid-feedback">{errors.imageURL}</div>}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {ele && ele._id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Createtestemonial;

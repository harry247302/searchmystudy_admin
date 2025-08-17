import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDispatch } from "react-redux";
import { createCounsellor, updateCounsellor } from "../slice/counsellorSlice";
import { app } from "../firebase";

const storage = getStorage(app)

const CreateCounsellor = ({ ele ,handleClose }) => {
  const [form, setForm] = useState({
    name: ele?.name || "",
    course:ele?.course || "",
    experience:ele?.experience || "",
    imageURL:ele?.imageURL || "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const handleFileChange = (e,field) => {
    const file = e.target.files[0];
    if(!file) return;

    setForm((prev)=>({
        ...prev,
        [field]:file.name,
    }));

    // clear error for this field when user selects a file
    setErrors((prev)=>({...prev,[field]:""}));
  };

  const handleContentChange = (value) => {
    setForm((prev) => ({ ...prev, content: value }));
    setErrors((prev) => ({ ...prev, content: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.course.trim()) newErrors.course = "Course is required";
    if (!form.experience.trim()) newErrors.experience = "Experience is required";
    if (!form.imageURL.trim()) newErrors.imageURL = "Image is required";
    
    setErrors(newErrors);

    // If no errors, return true
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `counsellors/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    return url;
  };

  const handleSubmit = async ()=>{
    if(!validateForm()) {
        alert("Please fill in all required fields.");
        return;
    }
    try {
        console.log("Form Data:", form);
        if(form.imageURL){
            const imageUrl = await uploadImage(form.imageURL);
            
            const formData = {
                name: form.name,
                course: form.course,
                experience: form.experience,
                imageURL:imageUrl,  
            }
            if (ele && ele._id) {
              console.log("Hello");
              
              // Update existing webinar
              const res = await dispatch(updateCounsellor({id:ele._id,data:form}));
              console.log(res);
              
              
              if (updateCounsellor.fulfilled.match(res)) {
                alert("Counsellor updated successfully!");
                handleClose();
              } else if (updateCounsellor.rejected.match(res)) {
                alert("Failed to update Counsellor: " + (res.payload?.message || res.error.message || "Unknown error"));
              }
            } else {
              // Create new counsellor
              const res = await dispatch(createCounsellor(formData));
            handleClose();
              
              if (createCounsellor.fulfilled.match(res)) {
                alert("Counsellor created successfully!");
                handleClose();
              } else if (createCounsellor.rejected.match(res)) {
                alert("Failed to create Counsellor: " + (res.payload?.message || res.error.message || "Unknown error"));
              }
            }
        } else{
            alert("Please upload an image")
        }
        
    } catch (error) {
        alert("Unexpected error: "+ error.message);
    }
  }

  return(
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog" style={{ maxWidth: "800px" }}>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Counsellor</h5>
          <button type="button" className="btn-close" onClick={handleClose}></button>
        </div>

        <div className="p-12">
          <div className="col-12">
            <label className="form-label">Name</label>
            <input
              onChange={(e) => {
                setForm((prev) => ({ ...prev,name: e.target.value }));
                setErrors((prev) => ({ ...prev,name: "" }));
              }}
              type="text"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter name here"
              value={form.name}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Course</label>
            <input
              onChange={(e) => {
                setForm((prev) => ({ ...prev, course: e.target.value }));
                setErrors((prev) => ({ ...prev, course: "" }));
              }}
              type="text"
              name="course"
              className={`form-control ${errors.course ? "is-invalid" : ""}`}
              placeholder="Enter course here"
              value={form.course}
            />
            {errors.course && <div className="invalid-feedback">{errors.course}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Experience</label>
            <input
              onChange={(e) => {
                setForm((prev) => ({ ...prev,experience: e.target.value }));
                setErrors((prev) => ({ ...prev,experience: "" }));
              }}
              type="text"
              name="experience"
              className={`form-control ${errors.experience ? "is-invalid" : ""}`}
              placeholder="Enter experience here"
              value={form.experience}
            />
            {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
          </div>
          <div className="col-12 mt-20">
            <label className="form-label">Image</label>
            <input
              className={`form-control form-control-lg ${errors.imageURL ? "is-invalid" : ""}`}
              name="imageURL"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "imageURL")}
            />
            <p style={{ color: "red" }}>Image Size should be 1200x600 px</p>
            {form.imageURL && <p>Selected file: {form.imageURL}</p>}
            {errors.imageURL && <div className="invalid-feedback">{errors.imageURL}</div>}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            {ele && ele._id? "Update Counsellor" :"Create counsellor"}
          </button>
        </div>
      </div>
    </div>
  </div>
    )
};

export default CreateCounsellor;

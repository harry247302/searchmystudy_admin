import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createWebinar } from "../slice/webinarSlice";

const CreateWebinar = ({ handleClose }) => {
  const [form, setForm] = useState({
    trainer_name: "",
    trainer_profession:'',
    title:'',
    weekday:'',
    date:'',
    imageURL:''
  });
  const [errors, setErrors] = useState({});     // To store validation errors

  const dispatch = useDispatch();

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      [field]: file.name,
    }));

    // Clear error for this field when user selects a file
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleContentChange = (value) => {
    setForm((prev) => ({ ...prev, content: value }));
    setErrors((prev) => ({ ...prev, content: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.trainer_name.trim()) newErrors.trainer_name = "Trainer Name is required";
    if (!form.trainer_profession.trim()) newErrors.trainer_profession = "Trainer Profession is required";
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.weekday.trim()) newErrors.weekday = "Weekday is required";
    if (!form.date.trim()) newErrors.date = "Date is required";
    if (!form.imageURL.trim()) newErrors.imageURL = "Image is required";
    
    setErrors(newErrors);

    // If no errors, return true
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      console.log("Form Data:", form);
      const res = await dispatch(createWebinar(form));

      if (createWebinar.fulfilled.match(res)) {
        alert("Webinar created successfully!");
        // Optionally reset form or close modal here
      } else if (createWebinar.rejected.match(res)) {
        alert("Failed to create Webinar: " + (res.payload?.message || res.error.message || "Unknown error"));
      }
    } catch (error) {
      alert("Unexpected error: " + error.message);
    }
  };

  return(
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog" style={{ maxWidth: "800px" }}>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Webinar</h5>
          <button type="button" className="btn-close" onClick={handleClose}></button>
        </div>

        <div className="p-12">
          <div className="col-12">
            <label className="form-label">Trainer Name</label>
            <input
              onChange={(e) => {
                setForm((prev) => ({ ...prev, trainer_name: e.target.value }));
                setErrors((prev) => ({ ...prev, trainer_name: "" }));
              }}
              type="text"
              name="trainer_name"
              className={`form-control ${errors.trainer_name ? "is-invalid" : ""}`}
              placeholder="Enter trainer name here"
              value={form.trainer_name}
            />
            {errors.trainer_name && <div className="invalid-feedback">{errors.trainer_name}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Trainer Profession</label>
            <input
              onChange={(e) => {
                setForm((prev) => ({ ...prev, trainer_profession: e.target.value }));
                setErrors((prev) => ({ ...prev, trainer_profession: "" }));
              }}
              type="text"
              name="trainer_profession"
              className={`form-control ${errors.trainer_profession ? "is-invalid" : ""}`}
              placeholder="Enter trainer profession here"
              value={form.trainer_profession}
            />
            {errors.trainer_profession && <div className="invalid-feedback">{errors.trainer_profession}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Title</label>
            <input
              onChange={(e) => {
                setForm((prev) => ({ ...prev, title: e.target.value }));
                setErrors((prev) => ({ ...prev, title: "" }));
              }}
              type="text"
              name="title"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              placeholder="Enter title here"
              value={form.title}
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Weekday</label>
            <input
              onChange={(e) => {
                setForm((prev) => ({ ...prev, weekday: e.target.value }));
                setErrors((prev) => ({ ...prev, weekday: "" }));
              }}
              type="text"
              name="weekday"
              className={`form-control ${errors.weekday ? "is-invalid" : ""}`}
              placeholder="Enter weekday here"
              value={form.weekday}
            />
            {errors.weekday && <div className="invalid-feedback">{errors.weekday}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Select Date</label>
            <input
              className={`form-control form-control-lg ${errors.date ? "is-invalid" : ""}`}
              name="date"
              type="date"
              value={form.date}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, date: e.target.value }));
                setErrors((prev) => ({ ...prev, date: "" }));
              }}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
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
            Create Webinar
          </button>
        </div>
      </div>
    </div>
  </div>
    )
};

export default CreateWebinar;

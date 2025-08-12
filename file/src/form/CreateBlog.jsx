import { useState } from "react";
import TextEditor from "./TextEditor";
import { createBlogThunk } from "../slice/blogSlice";
import { useDispatch } from "react-redux";

export default function CreateBlog({ handleClose }) {
  const [form, setForm] = useState({
    title: "",
    bannerURL: "",       // will store banner file name only
    date: "",
    content: "",
    thumbnailURL: "",    // will store thumbnail file name only
  });

  const [errors, setErrors] = useState({}); // To store validation errors

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

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.bannerURL.trim()) newErrors.bannerURL = "Banner image is required";
    if (!form.date.trim()) newErrors.date = "Date is required";
    if (!form.content.trim()) newErrors.content = "Content is required";
    if (!form.thumbnailURL.trim()) newErrors.thumbnailURL = "Thumbnail image is required";

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
      const res = await dispatch(createBlogThunk(form));

      if (createBlogThunk.fulfilled.match(res)) {
        alert("Blog created successfully!");
        // Optionally reset form or close modal here
      } else if (createBlogThunk.rejected.match(res)) {
        alert("Failed to create blog: " + (res.payload?.message || res.error.message || "Unknown error"));
      }
    } catch (error) {
      alert("Unexpected error: " + error.message);
    }
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog" style={{ maxWidth: "800px" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Blog</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="p-12">
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

            <div className="col-12 mt-20">
              <label className="form-label">Upload banner</label>
              <input
                className={`form-control form-control-lg ${errors.bannerURL ? "is-invalid" : ""}`}
                name="banner"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "bannerURL")}
              />
              <p style={{ color: "red" }}>Banner Size should be 1200x600 px</p>
              {form.bannerURL && <p>Selected file: {form.bannerURL}</p>}
              {errors.bannerURL && <div className="invalid-feedback">{errors.bannerURL}</div>}
            </div>

            <div className="col-12 mt-20">
              <label className="form-label">Upload thumbnail</label>
              <input
                className={`form-control form-control-lg ${errors.thumbnailURL ? "is-invalid" : ""}`}
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "thumbnailURL")}
              />
              <p style={{ color: "red" }}>Thumbnail Size should be 500x250 px</p>
              {form.thumbnailURL && <p>Selected file: {form.thumbnailURL}</p>}
              {errors.thumbnailURL && <div className="invalid-feedback">{errors.thumbnailURL}</div>}
            </div>

            <div className="col-12 mt-20">
              <label className="form-label">Content</label>
              <TextEditor content={form.content} setContent={handleContentChange} />
              {errors.content && <div style={{ color: "red", marginTop: "5px" }}>{errors.content}</div>}
            </div>

            <div className="col-12 mt-20">
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
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              Save Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

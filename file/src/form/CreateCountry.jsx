import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAbroadStudyThunk, updateAbroadStudy } from "../slice/AbroadSlice";

const storage = getStorage(app);

const CreateCountry = ({ ele, handleClose }) => {
  const [sectionPreviews, setSectionPreviews] = useState([]);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: ele?.name || "",
    bannerURL:ele?.bannerURL || "",
    bullet: ele?.bullet || "",
    mbbsAbroad: ele?.mbbsAbroad || false,
    flagURL: ele?.flagURL || "",
    description:ele?.description || "",
    sectionExpanded: true ,
    sections: ele?.sections || [{ title: "", description: "", url: "", }],
    eligiblity:ele?.eligibility || ["", "", "", "", "", "", ""],
    faq: ele?.faq || [{ question: "", answer: "" }],
  });

    const [uploads, setUploads] = useState({
    banner: { progress: 0, preview: null, name: "", loading: false },
    thumbnail: { progress: 0, preview: null, name: "", loading: false },
  });

  const [errors, setErrors] = useState({});

    const handleFileChange = async (event, type) => {
      const file = event.target.files[0];
      if (!file) return;
  
      setUploads((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: true, name: file.name },
      }));
  
      try {
        const previewURL = URL.createObjectURL(file);
  
        const progressInterval = setInterval(() => {
          setUploads((prev) => ({
            ...prev,
            [type]: {
              ...prev[type],
              progress: Math.min(prev[type].progress + 10, 90),
            },
          }));
        }, 200);
  
        const storageRef = ref(storage, `${type}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
  
        clearInterval(progressInterval);
  
        setForm((prev) => ({ ...prev, [`${type}URL`]: url }));
        setUploads((prev) => ({
          ...prev,
          [type]: { progress: 100, preview: previewURL, name: file.name, loading: false },
        }));
  
        toast.success(`${type} uploaded successfully!`);
      } catch (error) {
        console.error(`Failed to upload ${type}:`, error);
        setUploads((prev) => ({
          ...prev,
          [type]: { progress: 0, preview: null, name: "", loading: false },
        }));
        toast.error(`Failed to upload ${type}`);
      }
    };

    const handleContentChange = (value) => {
    setForm((prev) => ({ ...prev, content: value }));
    setErrors((prev) => ({ ...prev, content: "" }));
  };

    const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.bannerURL.trim()) newErrors.bannerURL = "Banner image is required";
    if (!form.bullet.trim()) newErrors.bullet = "Bullet is required";
    if (!form.flagURL.trim()) newErrors.flagURL = "Flag image is required";
    if (!form.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
        if(ele && ele._id) {
            // Update existing country
            const res = await dispatch(updateAbroadStudy({ id: ele._id, data: form }));
            if (updateAbroadStudy.fulfilled.match(res)) {
                toast.success("✅ Country updated successfully!");
                handleClose();
            }
            else if (updateAbroadStudy.rejected.match(res)) {
                  // Failure case with detailed error
                  const errorMsg =
                    res.payload?.message || res.error?.message || "Unknown error occurred.";
                  toast.error("❌ Failed to update country: " + errorMsg);
                }
        }else{
            // Create new country
            const res = await dispatch(createAbroadStudyThunk(form));
            if (createAbroadStudyThunk.fulfilled.match(res)) {
                toast.success("✅ Country created successfully!");
                handleClose();
            } else if (createAbroadStudyThunk.rejected.match(res)) {
                // Failure case with detailed error
                const errorMsg =
                    res.payload?.message || res.error?.message || "Unknown error occurred.";
                toast.error("❌ Failed to create country: " + errorMsg);
            }
        }
    } catch (error) {
        console.error("Failed to create country:", error);
        toast.error("Failed to create country");
    }
  }
  return(
     <>
     <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog" style={{ maxWidth: "800px" }}>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Country</h5>
          <button type="button" className="btn-close" onClick={handleClose}></button>
        </div>

        <div className="p-12">
          <div className="col-12">
            <label className="form-label">Name</label>
            <input
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              type="text"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter title here"
              value={form.name}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="col-12 mt-20">
            <label className="form-label">Upload banner</label>
            <input
              className={`form-control form-control-lg ${errors.bannerURL ? "is-invalid" : ""}`}
              name="bannerURL"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "banner")}
            />
            <p style={{ color: "red" }}>Banner Size should be 1200x600 px</p>
            {form.bannerURL && <p>Selected file: {form.bannerURL}</p>}
            {errors.bannerURL && <div className="invalid-feedback">{errors.bannerURL}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Bullet</label>
            <input
              onChange={(e) => {
                setForm((prev) => ({ ...prev, bullet: e.target.value }));
                setErrors((prev) => ({ ...prev, bullet: "" }));
              }}
              type="text"
              name="bullet"
              className={`form-control ${errors.bullet ? "is-invalid" : ""}`}
              placeholder="Enter Bullet here"
              value={form.bullet}
            />
            {errors.bullet && <div className="invalid-feedback">{errors.bullet}</div>}
          </div>

          <div className="col-12 mt-20">
            <label className="form-label">Upload Flag</label>
            <input
              className={`form-control form-control-lg ${errors.flagURL ? "is-invalid" : ""}`}
              name="flagURL"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "flag")}
            />
            <p style={{ color: "red" }}>Banner Size should be 1200x600 px</p>
            {form.flagURL && <p>Selected file: {form.flagURL}</p>}
            {errors.flagURL && <div className="invalid-feedback">{errors.flagURL}</div>}
          </div>

          {/* Card Section */}
          
            { form.sectionExpanded && (
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label className="form-label">Card Title</label>
                      <input
                        onChange={(e) => {
                    const newSections = [...form.sections];
                    newSections[index].title = e.target.value;
                    setForm((prev) => ({ ...prev, sections: newSections }));
                    setErrors((prev) => ({ ...prev, sections: "" }));
                    }}
                        type="text"
                        name="cardTitle"
                        className={`form-control ${errors.sections?.title ? "is-invalid" : ""}`}
                        placeholder="Enter card title here"
                        value={form.card.title}
                      />
                      {errors.card?.title && <div className="invalid-feedback">{errors.card.title}</div>}
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">Card Image</label>
                      <input
                        className={`form-control form-control-lg ${errors.card?.cardImage ? "is-invalid" : ""}`}
                        name="cardImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          
                          setForm((prev) => ({
                            ...prev,
                            card: { ...prev.card, cardImage: file.name }
                          }));
                          setErrors((prev) => ({ 
                            ...prev, 
                            card: { ...prev.card, cardImage: "" }
                          }));
                        }}
                      />
                      <p style={{ color: "red" }}>Card Image Size should be 400x300 px</p>
                      {form.card.cardImage && <p>Selected file: {form.card.cardImage}</p>}
                      {errors.card?.cardImage && <div className="invalid-feedback">{errors.card.cardImage}</div>}
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">Card Short Description</label>
                      <textarea
                        onChange={(e) => {
                    const newSections = [...form.sections];
                    newSections[index].description = e.target.value;
                    setForm((prev) => ({ ...prev, sections: newSections }));
                    setErrors((prev) => ({ ...prev, sections: "" }));
                    }}
                        name="description"
                        className={`form-control ${errors.sections?.description ? "is-invalid" : ""}`}
                        placeholder="Enter section short description here"
                        value={form.sections.description}
                        rows="3"
                      />
                      {errors.sections?.description && <div className="invalid-feedback">{errors.sections.description}</div>}
                    </div>
                  </div>
                </div>
            )}  
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          { ele && ele._id ? "Update Service" : "Create Service"}
          </button>
        </div>
      </div>
    </div>
  </div>
     </>
    );
};

export default CreateCountry;

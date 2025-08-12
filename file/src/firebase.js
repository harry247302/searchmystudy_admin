import { useState } from "react";
import TextEditor from "./TextEditor";

// Firebase imports
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { useDispatch } from "react-redux";

export default function CreateBlog({ handleClose }) {
  const [form, setForm] = useState({
    title: "",
    bannerURL: "",       // will store uploaded banner image URL
    date: "",
    content: "",
    thumbnailURL: "",    // will store uploaded thumbnail image URL
  });
  const dispatch = useDispatch()
  const [uploading, setUploading] = useState({
    banner: false,
    thumbnail: false,
  });


  // Upload file to Firebase Storage and set URL to form state
  const uploadFile = (file, field) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `blogs/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading((prev) => ({ ...prev, [field]: true }));

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: you can add progress here
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done for ${field}`);
        },
        (error) => {
          setUploading((prev) => ({ ...prev, [field]: false }));
          console.error("Upload failed:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setForm((prev) => ({
              ...prev,
              [field + "URL"]: downloadURL,
            }));
            setUploading((prev) => ({ ...prev, [field]: false }));
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Handle banner upload
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadFile(file, "banner");
  };

  // Handle thumbnail upload
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadFile(file, "thumbnail");
    console.log(file);
    
  };

  const handleContentChange = (value) => {
    setForm((prev) => ({ ...prev, content: value }));
  };

  const handleSubmit = () => {
    try {
    //   console.log("Form Data:", form);
      
    } catch (error) {
      console.log(error);
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
              <label className="form-label">Input with Placeholder</label>
              <input
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                type="text"
                name="title"
                className="form-control"
                placeholder="Enter title here"
                value={form.title}
              />
            </div>

            <div className="col-12 mt-20">
              <label className="form-label">Upload banner</label>
              <input
                className="form-control form-control-lg"
                name="banner"
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                disabled={uploading.banner}
              />
              <p style={{ color: "red" }}>Banner Size should be 1200x600 px</p>
              {uploading.banner && <p>Uploading banner...</p>}
              {form.bannerURL && (
                <img
                  src={form.bannerURL}
                  alt="banner preview"
                  style={{ maxWidth: "100%", marginTop: 10 }}
                />
              )}
            </div>

            <div className="col-12 mt-20">
              <label className="form-label">Upload thumbnail</label>
              <input
                className="form-control form-control-lg"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                disabled={uploading.thumbnail}
              />
              <p style={{ color: "red" }}>Thumbnail Size should be 500x250 px</p>
              {uploading.thumbnail && <p>Uploading thumbnail...</p>}
              {form.thumbnailURL && (
                <img
                  src={form.thumbnailURL}
                  alt="thumbnail preview"
                  style={{ maxWidth: "100%", marginTop: 10 }}
                />
              )}
            </div>

            <TextEditor content={form.content} setContent={handleContentChange} />

            <div className="col-12 mt-20">
              <label className="form-label">Select Date</label>
              <input
                className="form-control form-control-lg"
                name="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={uploading.banner || uploading.thumbnail}
            >
              Save Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

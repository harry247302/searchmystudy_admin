import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Button,
  Form,
  Accordion,
  Card,
  Row,
  Col
} from 'react-bootstrap';
import { app } from "../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAbroadProvince, updateAbroadProvince } from "../slice/AbroadProvinceSlice.js";
import TextEditor from "./TextEditor";

const storage = getStorage(app);

const CreateAbroadProvince = ({ ele, handleClose }) => {
  const [sectionPreviews, setSectionPreviews] = useState([]);
  const dispatch = useDispatch();
  const {studyAbroad } = useSelector((state)=>state.abroadStudy)
  console.log(studyAbroad,"))))))))))))))))");
  
  

  const [form, setForm] = useState({
    name: ele?.name || '',
    bannerURL: ele?.bannerURL || '',
    heroURL: ele?.heroURL || '',
    description: ele?.description || '',
    sections: ele?.sections || [{ title: '', description: '', url: '' }],
    Country: ele?.Country || '',
  });

  console.log(form,"Y^^^^^^^^");
  
  const [bannerPreview, setBannerPreview] = useState(null);
  const [flagPreview, setFlagPreview] = useState(null);

    const [uploads, setUploads] = useState({
    banner: { progress: 0, preview: null, name: "", loading: false },
    thumbnail: { progress: 0, preview: null, name: "", loading: false },
  });

  const [errors, setErrors] = useState({});

  const handleChange = async (event) => {
    const { name, value, type, files } = event.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        try {
          if (name === 'bannerURL') {
            await validateImageDimensions(file, { width: 1500, height: 500 });
            const previewURL = URL.createObjectURL(file);
            setBannerPreview(previewURL);
            const imageURL = await uploadImage(file);
            setForm(prev => ({ ...prev, bannerURL: imageURL }));
          } 
          else if (name === 'heroURL') {
            await validateImageDimensions(file, { width: 350, height: 400 });
            const previewURL = URL.createObjectURL(file);
            setHeroPreview(previewURL);
            const imageURL = await uploadImage(file);
            setForm(prev => ({ ...prev, heroURL: imageURL }));
          }
          else if (name.startsWith('sectionImage')) {
            const sectionIndex = parseInt(name.split('-')[1]);
            const previewURL = URL.createObjectURL(file);
            setSectionPreviews(prev => {
              const newPreviews = [...prev];
              newPreviews[sectionIndex] = previewURL;
              return newPreviews;
            });
            const imageURL = await uploadImage(file);
            setForm(prev => {
              const newSections = [...prev.sections];
              newSections[sectionIndex] = {
                ...newSections[sectionIndex],
                url: imageURL
              };
              return { ...prev, sections: newSections };
            });
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    } else if (name.startsWith('section-')) {
      const [, index, field] = name.split('-');
      setForm(prev => {
        const newSections = [...prev.sections];
        newSections[parseInt(index)] = {
          ...newSections[parseInt(index)],
          [field]: value
        };
        return { ...prev, sections: newSections };
      });
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

    // const handleFileChange = async (event, type) => {
    //   const file = event.target.files[0];
    //   if (!file) return;
  
    //   setUploads((prev) => ({
    //     ...prev,
    //     [type]: { ...prev[type], loading: true, name: file.name },
    //   }));
  
    //   try {
    //     const previewURL = URL.createObjectURL(file);
  
    //     const progressInterval = setInterval(() => {
    //       setUploads((prev) => ({
    //         ...prev,
    //         [type]: {
    //           ...prev[type],
    //           progress: Math.min(prev[type].progress + 10, 90),
    //         },
    //       }));
    //     }, 200);
  
    //     const storageRef = ref(storage, `${type}/${file.name}`);
    //     await uploadBytesResumable(storageRef, file);
    //     const url = await getDownloadURL(storageRef);
  
    //     clearInterval(progressInterval);
  
    //     setForm((prev) => ({ ...prev, [`${type}URL`]: url }));
    //     setUploads((prev) => ({
    //       ...prev,
    //       [type]: { progress: 100, preview: previewURL, name: file.name, loading: false },
    //     }));
  
    //     toast.success(`${type} uploaded successfully!`);
    //   } catch (error) {
    //     console.error(`Failed to upload ${type}:`, error);
    //     setUploads((prev) => ({
    //       ...prev,
    //       [type]: { progress: 0, preview: null, name: "", loading: false },
    //     }));
    //     toast.error(`Failed to upload ${type}`);
    //   }
    // };

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

  const addSection = () => {
    setForm((prevValues) => ({
      ...prevValues,
      sections: [...prevValues.sections, { title: '', description: '', url: '' }],
    }));
    setSectionPreviews([...sectionPreviews, '']);
  };

  const removeSection = (index) => {
    setForm((prevValues) => ({
      ...prevValues,
      sections: prevValues.sections.filter((_, i) => i !== index),
    }));
    setSectionPreviews(sectionPreviews.filter((_, i) => i !== index));
  };


  const handleSubmit = async () => {
    try {
        if(ele && ele._id) {
            // Update existing country
            console.log("form",form);
            
            const res = await dispatch(updateAbroadProvince({ id: ele._id, data: form }));
            if (updateAbroadProvince.fulfilled.match(res)) {
                toast.success("✅ Province updated successfully!");
                handleClose();
            }
            else if (updateAbroadProvince.rejected.match(res)) {
                  // Failure case with detailed error
                  const errorMsg =
                    res.payload?.message || res.error?.message || "Unknown error occurred.";
                  toast.error("❌ Failed to update Province: " + errorMsg);
                }
        }else{
            // Create new country
            console.log(form,"+++++++++++++++++++++");
            
            const res = await dispatch(createAbroadProvince(form));
            if (CreateAbroadProvince.fulfilled.match(res)) {
                toast.success("✅ Province created successfully!");
                handleClose();
            } else if (CreateAbroadProvince.rejected.match(res)) {
                // Failure case with detailed error
                const errorMsg =
                    res.payload?.message || res.error?.message || "Unknown error occurred.";
                toast.error("❌ Failed to create Province: " + errorMsg);
            }
        }
    } catch (error) {
        console.error("Failed to create Province:", error);
        toast.error("Failed to create Province");
    }
  }
  return(
    <Modal show={open} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton className="text-black">
        <Modal.Title>Add Country</Modal.Title>
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
            <Form.Label>Banner Image (1500x500)</Form.Label>
            <Form.Control
              type="file"
              name="bannerURL"
              onChange={(e)=>{
                handleChange(e,"banner")
              }}
              isInvalid={!!errors.bannerURL}
            />
            {bannerPreview && <img src={bannerPreview} alt="Banner" className="mt-2 img-fluid rounded" />}
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label> Image (200x200)</Form.Label>
            <Form.Control
              type="file"
              name="heroURL"
              onChange={(e)=>{
                handleChange(e,"image")
              }}
              isInvalid={!!errors.heroURL}
            />
            {flagPreview && <img src={flagPreview} alt="Flag" className="mt-2 rounded-circle" width="100" />}
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Description</Form.Label>
            <TextEditor name="description" value={form.description} onChange={handleChange} />
          </Form.Group>

          {/* Sections */}
          <Accordion className="mt-4">
            {form.sections.map((section, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>Section {index + 1}</Accordion.Header>
                <Accordion.Body>
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name={`sections.${index}.title`}
                      value={section.title}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Description (max 100 words)</Form.Label>
                    <TextEditor
                      name={`sections.${index}.description`}
                      value={section.description}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Section Image (300x300)</Form.Label>
                    <Form.Control
                      type="file"
                      name={`sections.${index}.url`}
                      onChange={handleChange}
                    />
                    {sectionPreviews[index] && (
                      <img src={sectionPreviews[index]} alt="Preview" className="mt-2 img-fluid rounded" />
                    )}
                  </Form.Group>

                  <Button variant="danger" className="mt-3" onClick={() => removeSection(index)}>
                    Remove Section
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
          <Button className="mt-3" variant="outline-primary" onClick={addSection}>
            Add Section
          </Button>
            <Form.Group className="mt-3">
            <Form.Label>Country</Form.Label>
            <select name="Country" value={form?.Country?.name} onChange={handleChange} id="">
              <option value="Select" defaultValue='Select' disabled>Select</option>
              {studyAbroad?.map((country)=>(
                <option key={country._id} value={country._id}>
                  {country?.name}
                </option>
              ))}
            </select>
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
  );
};

export default CreateAbroadProvince;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { createCourse, updateCourse } from "../slice/CourseSlice.js";
// import { fetchUniversities } from "../slice/UniversitySlice.js";
import { fetchMbbsUniversity } from "../slice/mbbsUniversity.js";
import { fetchMbbsStudy } from "../slice/MbbsSlice.js";
import { createMbbsCourse, fetchMbbsCourse, updateMbbsCourse } from "../slice/MbbsCourse.js";
import TextEditor from "./TextEditor.jsx";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { app } from "../firebase";


const categories = [
  "Arts",
  "Accounts",
  "Finance",
  "Marketing",
  "Science",
  "Medical",
  "Computers",
  "Engineering",
  "Law",
  "Education",
  "Social Sciences",
  "Business Administration",
  "Psychology",
  "Economics",
  "Architecture",
  "Environmental Science",
  "Nursing",
  "Hospitality Management",
  "Media and Communication",
  "Information Technology",
  "Pharmacy",
  "Agriculture",
  "Design",
  "Public Health",
  "Mathematics",
  "Data Science",
  "Artificial Intelligence",
];

const level = [
  "High School",
  "UG Diploma/Cerificate/Associate Degree",
  "UG",
  "PG Diploma",
  "PG",
  "UG+PG(Accelerated)Degree",
  "PhD",
  "Foundation",
  "Short Term Program",
  "Pathway Program",
  "Twiming Program(UG)",
  "Twiming Program(PG)",
  "Online Programe/Distance Learning",
];

const CreateMbbsCourse = ({ ele, handleClose, loadCourse }) => {
  const dispatch = useDispatch();
const storage = getStorage(app);
  const { studyMbbs } = useSelector((state) => state.mbbsStudy);
  const { mbbsUniversity } = useSelector((state) => state.mbbsUniversity);
  const [broucherPreview, setBroucherPreview] = useState({});
  const [university, setUniversity] = useState();
  const [loading, setLoading] = useState(false);
  // const [form, setForm] = useState({
  //   ProgramName: ele?.ProgramName || "",
  //   University: ele?.University || "",
  //   Country: ele?.Country || "",
  //   Eligibility: ele?.Eligibility || "",
  //   WebsiteURL: ele?.WebsiteURL || "",
  //   Location: ele?.Location || "",
  //   Duration: ele?.Duration || "",
  //   Category: ele?.Category || "",
  //   Fees: ele?.Fees || 0,
  //   Intake: ele?.Intake || [{ status: true, date: "", expiresAt: "" }],
  //   Scholarships:
  //     typeof ele?.Scholarships === "boolean" ? ele.Scholarships : true,
  //   ProgramLevel: ele?.ProgramLevel || "",
  //   languageRequire: ele?.languageRequire || {
  //     english: "",
  //     no_any_preference: "",
  //     motherTongue: "",
  //   },
  //   broucherURL: ele?.broucherURL || "",
  // });

  const [form, setForm] = useState({
  ProgramName: ele?.ProgramName || "",
  University: typeof ele?.University === "object" ? ele.University._id : ele?.University || "",
  Country: typeof ele?.Country === "object" ? ele.Country._id : ele?.Country || "",
  Eligibility: ele?.Eligibility || "",
  WebsiteURL: ele?.WebsiteURL || "",
  Location: ele?.Location || "",
  Duration: ele?.Duration || "",
  Category: ele?.Category || "",
  Fees: ele?.Fees || "",
  Intake: ele?.Intake || [{ status: true, date: "", expiresAt: "" }],
  Scholarships: typeof ele?.Scholarships === "boolean" ? ele.Scholarships : true,
  ProgramLevel: ele?.ProgramLevel || "",
  languageRequire: ele?.languageRequire || {
    english: "",
    no_any_preference: "",
    motherTongue: "",
  },
  motherTongue: ele?.motherTongue || "",
  broucherURL: ele?.broucherURL || "",
});
  console.log(ele,"++++++++++");

    const uploadImage = async (file) => {
      const storageRef = ref(storage, `provinces/${Date.now()}-${file.name}`);
      await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    };

  const handleChange = async (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file'){
        const file = files[0];
        if (file) {
            if (name === 'broucherURL') {
            // await validateImageDimensions(file, { width: 1500, height: 500 });
            const previewURL = URL.createObjectURL(file);
            setBroucherPreview(previewURL);
            const imageURL = await uploadImage(file);
            setForm(prev => ({ ...prev, broucherURL: imageURL }));
          }
        }
    }

    // Intake status select (inside Intake array)
    if (name === "status") {
      // Find the first intake with matching status and update it
      setForm((prev) => {
        const newIntake = prev.Intake.map((intake, idx) =>
          idx === 0 ? { ...intake, status: value === "active" } : intake
        );
        return { ...prev, Intake: newIntake };
      });
      return;
    }

    // Language Requirement text fields
    if (["english", "no_any_preference", "motherTongue"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        languageRequire: { ...prev.languageRequire, [name]: value },
      }));
      return;
    }

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      if (files && files.length > 0) {
        setForm((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

      const handleContentChange = (value) => {
        setForm(prev => ({ ...prev, Eligibility: value }));
        // setErrors(prev => ({ ...prev, Eligibility: "" }));
    };

  const handleIntakeChange = (idx, field, value) => {
    const newIntakes = [...form.Intake];
    newIntakes[idx][field] = value;
    setForm({ ...form, Intake: newIntakes });
  };

  const addIntake = () => {
    setForm((prev) => ({
      ...prev,
      Intake: [...prev.Intake, { status: true, date: "", expiresAt: "" }],
    }));
  };

  const removeIntake = (idx) => {
    setForm((prev) => ({
      ...prev,
      Intake: prev.Intake.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async () => {
    try {
      // ✅ Check required fields before submit
      if (!form.ProgramName || !form.University || !form.WebsiteURL) {
        toast.error("⚠️ Please fill required fields!");
        return;
      }

      let res;

      if (ele && ele._id) {
        // ✅ Update course
        const res = await dispatch(
          updateMbbsCourse({ id: ele._id, data: form })
        );
        console.log(res, "==================");
          toast.success("✅ Course updated!");
          await dispatch(fetchMbbsCourse())
          // handleClose();
      } else {
        // ✅ Create course
        console.log(form, "{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{[");
        const res = await dispatch(createMbbsCourse(form));
        console.log(res);

        if (createMbbsCourse.fulfilled.match(res)) {
          toast.success("✅ Course created!");
          dispatch(fetchMbbsCourse())
        }
        else {
          toast.error(
            res.payload?.message ||
            res.error?.message ||
            "Failed to create course"
          );
        }
      }
      handleClose();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong!");
    }
  };

  const loadUniversity = async (selectedCountries) => {
    setLoading(true);
    try {
      console.log(selectedCountries, "------------------");
      const res = await dispatch(fetchMbbsUniversity());
      const filtered = (res.payload || []).filter(
        (u) => u.Country._id === selectedCountries
      );
      console.log(filtered);
      setUniversity(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = async () => {
      await dispatch(fetchMbbsStudy());
      await dispatch(fetchMbbsUniversity());
    };
    data();
  }, [dispatch]);

  return (
    <Modal show={true} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{ele?._id ? "Update Course" : "Add Course"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Program Name</Form.Label>
            <Form.Control
              type="text"
              name="ProgramName"
              value={form.ProgramName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Country</Form.Label>
            <Form.Select
              name="Country"
              value={form?.Country}
              onChange={(e) => {
                console.log(e.target.value);
                // stores the selected country ID
                handleChange(e); // updates form.Country
                loadUniversity(e.target.value); // load universities for selected country
              }}
              required
            >
              <option value="">Select Country</option>
              {studyMbbs?.map((u) => (
                <option key={u.name} value={u._id}>
                  {u.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>University</Form.Label>
            <Form.Select
              name="University"
              value={form?.University}
              onChange={handleChange}
              required
            >
              <option value="">Select University</option>
              {university?.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Website URL</Form.Label>
            <Form.Control
              type="text"
              name="WebsiteURL"
              value={form.WebsiteURL}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="Location"
              value={form.Location}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              name="Duration"
              value={form.Duration}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Broucher URL</Form.Label>
            <Form.Control
              type="file"
              name="broucherURL"
              // value={form.broucherURL}
              onChange={(e) => {
                handleChange(e, "banner")
              }}
            />
            {broucherPreview && <img src={broucherPreview} alt="broucher" className="mt-2 img-fluid rounded" />}
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Category</Form.Label>
            {/* <Form.Control
              type="text"
              name="Category"
              value={form.Category}
              onChange={handleChange}
              required
            /> */}
            <Form.Select
              name="Category"
              value={form.Category}
              onChange={handleChange}
              required
            >
                <option value={""} disabled>Select</option>
              {categories?.map((ele) => {
                return (
                  <option key={ele} value={ele}>
                    {ele}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>

          {/* Intake Section */}
          <div className="mt-3">
            <Form.Label className="fw-bold">Intakes</Form.Label>
            {form.Intake.map((intake, idx) => (
              <div
                key={idx}
                className="d-flex flex-column gap-2 border rounded p-2 mb-2 bg-light"
              >
                {/* Active Checkbox */}
                {/* <Form.Check
                                    type="checkbox"
                                    label="Active"
                                    checked={intake.status}
                                    onChange={(e) => handleIntakeChange(idx, "status", e.target.checked)}
                                    className="mb-0"
                                /> */}

                <Form.Select
                  name="status"
                  value={form?.status}
                  onChange={handleChange}
                  required
                >
                  <option value={ele?.status || ""} disabled>
                    Select Status
                  </option>
                  <option value="active">Active</option>
                  <option value="notActive">Not Active</option>
                </Form.Select>
                {/* Intake Date */}
                <Form.Control
                  type="date"
                  value={intake.date}
                  onChange={(e) =>
                    handleIntakeChange(idx, "date", e.target.value)
                  }
                  className="w-auto"
                />

                {/* Expiry Date */}
                <Form.Control
                  type="date"
                  value={intake.expiresAt}
                  onChange={(e) =>
                    handleIntakeChange(idx, "expiresAt", e.target.value)
                  }
                  className="w-auto"
                />

                {/* Action Buttons */}
                <div className="ms-auto d-flex gap-2">
                  <Button
                    variant="danger"
                    size="md"
                    className="px-2 py-0"
                    style={{ fontSize: "12px", lineHeight: "1" }}
                    onClick={() => removeIntake(idx)}
                  >
                    ×
                  </Button>
                  <Button
                    variant="success"
                    size="md"
                    className="px-2 py-0"
                    style={{ fontSize: "12px", lineHeight: "1" }}
                    onClick={() => addIntake(idx)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Form.Group className="mt-3 d-flex align-items-center gap-2">
            <Form.Check
              type="checkbox"
              id="scholarships"
              checked={form.Scholarships}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, Scholarships: e.target.checked }))
              }
            />
            <Form.Label htmlFor="scholarships" className="mb-0 fw-semibold">
              Scholarships Available
            </Form.Label>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Program Level</Form.Label>
            <Form.Select
              name="ProgramLevel"
              value={form.ProgramLevel}
              onChange={handleChange}
              required
            >
              <option value={""} disabled>
                Select
              </option>
              {level?.map((ele) => {
                return (
                  <option key={ele} value={ele}>
                    {ele}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>

          <div className="mt-3 p-3 border rounded bg-light">
            <Form.Label className="fw-bold d-block mb-2">
              Language Requirement
            </Form.Label>
            <div className="d-flex flex-column gap-2">
              {/* <Form.Check
                                type="checkbox"
                                label="English Required"
                                name="english"
                                checked={form.languageRequire.english}
                                onChange={handleChange}
                            /> */}
              <Form.Group className="mt-3">
                <Form.Label>English Required</Form.Label>
                <Form.Control
                  type="text"
                  name="english"
                  value={form.languageRequire.english}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {/* <Form.Check
                                type="checkbox"
                                label="No Preference"
                                name="no_any_preference"
                                checked={form.languageRequire.no_any_preference}
                                onChange={handleChange}
                            /> */}
              <Form.Group className="mt-3">
                <Form.Label>No Preference</Form.Label>
                <Form.Control
                  type="text"
                  name="no_any_preference"
                  value={form.languageRequire.no_any_preference}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {/*        <Form.Check
                                type="checkbox"
                                label="Mother Tongue"
                                name="motherTongue"
                                checked={form.languageRequire.motherTongue}
                                onChange={handleChange}
                            /> */}
              <Form.Group className="mt-3">
                <Form.Label>Mother Tongue</Form.Label>
                <Form.Control
                  type="text"
                  name="motherTongue"
                  value={form.languageRequire.motherTongue}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>

          {/* <Form.Group className="mt-3">
                        <Form.Label>Eligibility</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="Eligibility"
                            value={form.Eligibility}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group> */}

          {/* <Form.Group className="mt-3">
                        <Form.Label>Description</Form.Label>
                        <TextEditor content={form.Eligibility} setContent={handleContentChange} />
                    </Form.Group> */}

                    <Form.Group className="mt-3">
                                            <Form.Label>Eligibility</Form.Label>
                                            <TextEditor content={form.Eligibility} setContent={handleContentChange} />
                                        </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Fees</Form.Label>
            <Form.Control
              type="number"
              name="Fees"
              value={form.Fees}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {ele?._id ? "Update Course" : "Create Course"}
        </Button>
      </Modal.Footer>
      <ToastContainer position="top-right" theme="colored" />
    </Modal>
  );
};

export default CreateMbbsCourse;

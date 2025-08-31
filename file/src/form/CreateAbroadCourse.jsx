import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, Row, Col  } from 'react-bootstrap';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { createCourse, updateCourse } from "../slice/CourseSlice.js";
// import { fetchUniversities } from "../slice/UniversitySlice.js";
import {  updateStudyCourse } from "../slice/AbroadCourseSlice.js";
import { fetchAbroadUniversity } from "../slice/AbroadUniversitySlice.js";
import TextEditor from "./TextEditor.jsx";
import { fetchAbroadStudy } from "../slice/AbroadSlice.js";
import { fetchAbroadProvince } from "../slice/AbroadProvinceSlice.js";
import { createMbbsCourse } from "../slice/MbbsCourse.js";
const categories = [
    'Arts',
    'Accounts',
    'Finance',
    'Marketing',
    'Science',
    'Medical',
    'Computers',
    'Engineering',
    'Law',
    'Education',
    'Social Sciences',
    'Business Administration',
    'Psychology',
    'Economics',
    'Architecture',
    'Environmental Science',
    'Nursing',
    'Hospitality Management',
    'Media and Communication',
    'Information Technology',
    'Pharmacy',
    'Agriculture',
    'Design',
    'Public Health',
    'Mathematics',
    'Data Science',
    'Artificial Intelligence'
]
const level = ['High School', 'UG Diploma/Cerificate/Associate Degree', 'UG', 'PG Diploma', 'PG', 'UG+PG(Accelerated)Degree', 'PhD', 'Foundation', 'Short Term Program', 'Pathway Program', 'Twiming Program(UG)', 'Twiming Program(PG)', 'Online Programe/Distance Learning']
const mode = ["Yearly", "Quaterly", "Semester"];

const CreateAbroadCourse = ({ ele, handleClose, loadCourse }) => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [selectedCountries, setSelectedCountries] = useState();
    const [university, setUniversity] = useState()
    const [country, setCountry] = useState() // Assuming abroad slice has abroadStudy array
    const [province, setProvince] = useState()
    const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          const codes = Object.keys(data.rates);
          setCurrencies(codes);
        }
      })
      .catch((err) => console.error("Error fetching currencies:", err));
  }, []);
    const [form, setForm] = useState({

        ProgramName: ele?.ProgramName || "",
        Country: ele?.University?.Country || "",
        University: ele?.University._id || "",
        Province: ele?.Province ? ele.province._id : null,
        WebsiteURL: ele?.WebsiteURL || "",
        Location: ele?.Location || "",
        Duration: ele?.Duration || "",
        broucherURL: ele?.broucherURL || "",
        Category: ele?.Category || "",
        Intake: ele?.Intake || [{ status: true, date: "", end_date: "" }],
        Scholarships: ele?.Scholarships ?? false,
        ProgramLevel: ele?.ProgramLevel || "",
        languageRequire: ele?.languageRequire || { english: false, motherTongue: false, },
        Eligibility: ele?.Eligibility || "",
        Fees: {
            amount: ele?.Fees?.amount || "",
            currency: ele?.Fees?.currency || "",
            mode: ele?.Fees?.mode || "",
        },
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            // for Scholarships + languageRequire
            if (["english", "no_any_preference", "motherTongue"].includes(name)) {
                setForm(prev => ({
                    ...prev,
                    languageRequire: { ...prev.languageRequire, [name]: checked },
                }));
            } else {
                setForm(prev => ({ ...prev, [name]: checked }));
            }
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleContentChange = (value) => {
        setForm(prev => ({ ...prev, Eligibility: value }));
        setErrors(prev => ({ ...prev, Eligibility: "" }));
    };
    const handleIntakeChange = (idx, field, value) => {
        const newIntakes = [...form.Intake];
        newIntakes[idx][field] = value;
        setForm({ ...form, Intake: newIntakes });
    };

    const addIntake = () => {
        setForm(prev => ({
            ...prev,
            Intake: [...prev.Intake, { status: true, date: "", end_date: "" }],
        }));
    };

    const removeIntake = (idx) => {
        setForm(prev => ({
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
                const res = await dispatch(updateStudyCourse({ id: ele._id, data: form }));

                if (res?.meta?.requestStatus === "fulfilled") {
                    toast.success("✅ Course updated!");
                    handleClose();
                    loadCourse();
                } else {
                    toast.error(res.payload?.message || res.error?.message || "Failed to update course");
                }
            } else {
                // ✅ Create course
                // console.log(form, "{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{[");
                const res = await dispatch(createMbbsCourse(form));
                console.log(res);

                if (res?.meta?.requestStatus === "fulfilled") {
                    toast.success("✅ Course created!");
                    handleClose();
                    loadCourse();
                } 
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            toast.error("Something went wrong!");
        }
    };

    const [loading, setLoading] = useState(false);

    const loadUniversity = async (selectedCountries) => {
        setLoading(true);
        try {
            console.log(selectedCountries, "------------------");
            const res = await dispatch(fetchAbroadUniversity());
            // 6894707bfee3784d9ab93f6e
            if (res?.meta?.requestStatus === "fulfilled") {
                const filtered = res.payload?.filter((u) => u.Country._id === selectedCountries);
                setUniversity(filtered);
                console.log(filtered);
            }
        } finally {
            setLoading(false);
        }
    };

    const loadCountry = async () => {
        setLoading(true);
        try {
            // country fetch
            const res = await dispatch(fetchAbroadStudy());
            // console.log(res,"------------------");
            if (res?.meta?.requestStatus === "fulfilled") {
                setCountry(res.payload);
            }
        } catch {
            console.log("error");
        }
    }


    const loadProvince = async (id) => {
        setLoading(true);
        try {
            // country fetch
            const res = await dispatch(fetchAbroadProvince());
            // console.log(res,"------------------");

            if (res?.meta?.requestStatus === "fulfilled") {
                const filtered = res.payload?.filter((u) => u.Country._id === id);
                setProvince(filtered);
                // console.log(filtered);
            }
        } catch {
            console.log("error");
        }
    }

    useEffect(() => {
        loadUniversity();
        loadCountry()
        loadProvince()
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
                                // setSelectedCountries(e.target.value); // stores the selected country ID
                                handleChange(e); // updates form.Country
                                loadUniversity(e.target.value); // load universities for selected country
                                loadProvince(e.target.value); // load provinces for selected country
                            }}
                            required
                        >
                            <option value="">Select Country</option>
                            {country?.map((u) => (
                                <option key={u.name} value={u._id}>{u.name}</option>
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
                            {university?.map(u => (
                                <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>


                    <Form.Group className="mt-3">
                        <Form.Label>Province</Form.Label>
                        <Form.Select
                            name="Province"
                            value={form?.Province}
                            onChange={handleChange}
                        // required
                        >
                            <option value="">Select Province</option>
                            {province?.map(u => (
                                <option key={u._id} value={u._id}>{u.name}</option>
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
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            name="Category"
                            value={form.Category}
                            onChange={handleChange}
                            required
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}

                        </Form.Select>
                    </Form.Group>

                    {/* Intake Section */}
                    <div className="mt-3">
                        <Form.Label className="fw-bold">Intakes</Form.Label>
                        {form.Intake.map((intake, idx) => (
                            <div
                                key={idx}
                                style={{justifyContent:"space-around"}}
                                className="d-flex align-items-center  gap-2 border rounded p-3  "
                            >
                                {/* Active Checkbox */}
                                <Form.Check
                                    type="checkbox"
                                    label="Active"
                                    checked={intake.status}
                                    onChange={(e) => handleIntakeChange(idx, "status", e.target.checked)}
                                    className="mb-0"
                                />

                                {/* Intake Date */}
                                <Form.Control
                                    type="text"
                                    value={intake.date}
                                    onChange={(e) => handleIntakeChange(idx, "date", e.target.value)}
                                    className="w-auto"
                                />

                                {/* Expiry Date */}
                                <Form.Control
                                    type="date"
                                    value={intake.end_date}
                                    onChange={(e) => handleIntakeChange(idx, "end_date", e.target.value)}
                                    className="w-auto"
                                />

                                {/* Action Buttons */}
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="px-2 py-0"
                                        style={{ fontSize: "12px", lineHeight: "1" }}
                                        onClick={() => removeIntake(idx)}
                                    >
                                        ×
                                    </Button>
                                    <Button
                                        variant="success"
                                        size="sm"
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
                            {level?.map((ele) => {
                                return (
                                    <option key={ele} value={ele}>{ele}</option>
                                );
                            })}

                          
                        </Form.Select>
                    </Form.Group>

                    <div className="mt-3 p-3 border rounded ">
                        <Form.Label className="fw-bold d-block mb-2">Language Requirement</Form.Label>
                        <div className="d-flex flex-column gap-2">
                            <Form.Check
                                type="checkbox"
                                label="English Required"
                                name="english"
                                checked={form.languageRequire.english}
                                onChange={handleChange}
                            />
                           
                            <Form.Check
                                type="checkbox"
                                label="Mother Tongue"
                                name="motherTongue"
                                checked={form.languageRequire.motherTongue}
                                onChange={handleChange}
                            />
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

                    <Form.Group className="mt-3">
                        <Form.Label>Description</Form.Label>
                        <TextEditor content={form.Eligibility} setContent={handleContentChange} />
                    </Form.Group>

                         <Form.Group className="mt-3">
            <Row>
              <Col>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={form.Fees.amount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      Fees: { ...prev.Fees, amount: e.target.value },
                    }))
                  }
                />
              </Col>
              <Col>
                <Form.Label>Currency</Form.Label>
                <Form.Select
                  value={form.Fees.currency}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      Fees: { ...prev.Fees, currency: e.target.value },
                    }))
                  }
                >
                  <option value="">Select</option>
                  {currencies.map((ele) => (
                    <option key={ele} value={ele}>
                      {ele}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Label>Mode</Form.Label>
                <Form.Select
                  value={form.Fees.mode}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      Fees: { ...prev.Fees, mode: e.target.value },
                    }))
                  }
                >
                  <option value="">Select</option>
                  {mode.map((ele) => (
                    <option key={ele} value={ele}>
                      {ele}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {ele?._id ? "Update Course" : "Create Course"}
                </Button>
            </Modal.Footer>
            <ToastContainer position="top-right" theme="colored" />
        </Modal>
    );
};

export default CreateAbroadCourse;

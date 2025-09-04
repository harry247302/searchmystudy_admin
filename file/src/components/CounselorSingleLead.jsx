import React, { useEffect, useState } from "react";
import "datatables.net-dt";
import { useParams } from "react-router-dom";
import { deleteCounsellorLead, fetchCounsellorSingleLead } from "../slice/counsellorLead";
import { useDispatch } from "react-redux";


const CounselorSingleLead = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [selectedIds, setSelectedIds] = useState([]);

    const [leads, setLeads] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const handleDelete = async () => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this webinar?");
            if (!confirmed) return; // stop if user clicks Cancel

            await dispatch(deleteCounsellorLead(selectedIds));
            await dispatch(fetchCounsellorSingleLead(id)).unwrap();
            toast.success("lead deleted successfully");
        } catch (error) {
            console.log(error);
            toast.error("Error deleting lead");
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await dispatch(fetchCounsellorSingleLead(id)).unwrap();
                // .unwrap() gives you the actual payload or throws error
                setLeads(res); // ✅ store payload in state
            } catch (err) {
                console.error("Error fetching leads:", err);
                setError(err?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, dispatch]);
    const handleCheckboxChange = (id) => {
        setSelectedIds((prevSelected) => {
            if (prevSelected.includes(id)) {
                // Remove if already selected
                return prevSelected.filter((item) => item !== id);
            } else {
                // Add if not selected
                return [...prevSelected, id];
            }
        });
    };




    if (loading) return <p>Loading leads...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="card basic-data-table">
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                <h5 className="card-title mb-0">ContactUs lead Table</h5>
                <div>
                    <button
                        type="button"
                        className="mx-4 btn rounded-pill text-primary radius-8 px-4 py-2"
                        onClick={"jhkjbkj"}
                    >
                        Download
                    </button>

                    <button className="mx-4 btn rounded-pill text-danger radius-8 px-4 py-2"
                        onClick={handleDelete}
                    >Delete</button>

                </div>
            </div>
            <div className="card-body overflow-x-auto">
                <>
                    <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
                }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #888;
              border-radius: 4px;
              border: 2px solid #f1f1f1;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: #555;
                }
                `}</style>

                    <table
                        id="dataTable"
                        className="table bordered-table mb-0"
                        data-page-length={10}
                    // style={{overflowX:"auto"}}
                    >
                        <thead>
                            <tr>
                                <th scope="col">
                                    <div className="form-check style-check d-flex align-items-center">
                                        <input className="form-check-input" type="checkbox" />
                                        <label className="form-check-label">S.L</label>
                                    </div>
                                </th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">City</th>
                                <th scope="col">Type</th>
                                <th scope="col">Interested Course</th>
                                <th scope="col">Interested Country</th>
                                <th scope="col">Test</th>
                                <th scope="col">Score</th>
                                <th scope="col">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads?.map((ele, ind) => (
                                <tr key={ele._id || ind}>
                                    <td>
                                        <div className="form-check style-check d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedIds.includes(ele._id)}
                                                onChange={() => handleCheckboxChange(ele._id)}
                                            />
                                            <label className="form-check-label">{ind + 1}</label>
                                        </div>
                                    </td>
                                    <td>
                                        {ele?.name}
                                    </td>
                                    <td>
                                        {ele?.email}
                                    </td>
                                    <td>
                                        {ele?.phone}
                                    </td>
                                    <td>{ele?.city}</td>
                                    <td>{ele?.type}</td>
                                    <td>{ele?.intersetedCourse}</td>
                                    <td>{ele?.intersetedCountry}</td>
                                    <td>{ele?.Test}</td>
                                    <td>{ele?.Score}</td>
                                    <td>{ele?.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            </div>
        </div>
    )
}

export default CounselorSingleLead
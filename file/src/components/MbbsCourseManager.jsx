import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import { useDispatch } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// import CreateAbroadProvince from "../form/CreateAbroadProvince";
import { deleteMbbsCourse, fetchMbbsCourse } from "../slice/MbbsCourse";
import CreateMbbsCourse from "../form/CreateMbbsCourse";

const MbbsCourseManager = () => {
  const dispatch = useDispatch();
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const res = await dispatch(fetchMbbsCourse());
      console.log(res, "||||||||||||||||||||||||||||||||||||||");
      if (res?.meta?.requestStatus === "fulfilled") {
        setCourse(res.payload);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadCourse();
  }, [dispatch]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Delete single OR multiple blogs
  const handleDelete = async (id) => {
    const idsToDelete = id ? [id] : selectedIds;

    if (idsToDelete.length === 0) {
      toast.warn("⚠️ No items selected for deletion.");
      return;
    }

    const confirmed = window.confirm(
      idsToDelete.length > 1
        ? `Are you sure you want to delete ${idsToDelete.length} blogs?`
        : "Are you sure you want to delete this blog?"
    );
    if (!confirmed) return;

    try {
      console.log("Deleting IDs:", idsToDelete);

      const res = await dispatch(deleteMbbsCourse(idsToDelete));
      // console.log("Delete response:", res);

      if (deleteMbbsCourse.fulfilled.match(res)) {
        toast.success("✅ Abroad Course deleted successfully!");
        setSelectedIds([]); // clear selection
        loadCourse(); // reload data (you might rename to loadCourses if it's about courses)
      } else if (deleteMbbsCourse.rejected.match(res)) {
        toast.error(
          "❌ Failed to delete Abroad Course: " +
          (res.payload?.message || res.error?.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Unexpected error: " + (error.message || "Something went wrong"));
    }
  };

  console.log(course);
  


  return (
    <div className="card basic-data-table">
      <div
        className="card-header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h5 className="card-title mb-0">Course Table</h5>
        <div>
          <button
            type="button"
            className="btn rounded-pill text-primary radius-8 px-4 py-2"
            onClick={() => setShowModal(true)}
          >
            Add Course
          </button>

          {selectedIds.length > 0 && (
            <button
              className="btn rounded-pill text-danger radius-8 px-4 py-2"
              onClick={() => handleDelete()}
            >
              Delete Selected ({selectedIds.length})
            </button>
          )}

          {showModal && (
            <CreateMbbsCourse
              loadCourse={loadCourse}
              ele={editingCourse}
              handleClose={() => {
                setShowModal(false);
                setEditingCourse(null);
              }}
            />
          )}
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
                <th scope="col">Course Name</th>
                <th scope="col">Country</th>
                <th scope="col">Province</th>
                <th scope="col">Fees</th>
                <th scope="col">University</th>
                <th scope="col">Category</th>
                <th scope="col">Location</th>
                <th scope="col">Website URL</th>
                <th scope="col">Eligibility</th>
                <th scrope="col">Created At</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {course?.map((ele, ind) => {
                return (
                  <tr key={ele._id}>
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
                    <td>{ele?.ProgramName || "None"}</td>
                    <td>{ele?.Country?.name || ele?.Country || "None"}</td>
                    <td>{ele?.Province?.name || ele?.Province || "None"}</td>
                    <td>{ele?.Fees !== undefined && ele?.Fees !== null ? ele?.Fees : "None"}</td>
                    <td>{ele?.University?.name || ele?.University || "None"}</td>
                    <td>{ele?.Category || "None"}</td>
                    <td>{ele?.Location || "None"}</td>
                    <td>
                      {ele?.WebsiteURL ? (
                        <a
                          href={ele?.WebsiteURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Click to Open
                        </a>
                      ) : "None"}
                    </td>
                    <td>
                      <div>
                        <h6 className="text-md mb-0 fw-medium flex-grow-1">
                          {ele?.Eligibility ? ele.Eligibility.slice(0, 300) : "None"}
                        </h6>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p>
                          {ele?.createdAt ? new Date(ele.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour12: true
                          }) : "None"}
                        </p>
                      </div>
                    </td>
                    <td>
                      <Link
                        onClick={() => {
                          setEditingCourse(ele);
                          setShowModal(true);
                        }}
                        to="#"
                        className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="lucide:edit" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      </div>
    </div>
  )
}

export default MbbsCourseManager;
import React,{ useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import { useDispatch } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { deleteAbroadStudy, fetchAbroadStudy } from "../slice/AbroadSlice";
import CreateCountry from "../form/CreateCountry";
import { toast } from "react-toastify";

const AbroadManager = () => {
  const dispatch = useDispatch();
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studyAbroad, setStudyAbroad] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);

  const loadAbroadStudy = async () => {
    setLoading(true);
    try {
      const res = await dispatch(fetchAbroadStudy());
      if (res?.meta?.requestStatus === "fulfilled") {
        setStudyAbroad(res.payload);
      }
    } finally {
      setLoading(false);
    }
  };


    useEffect(() => {
     loadAbroadStudy();
    }, [dispatch]);
    

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
          const res = await dispatch(deleteAbroadStudy(idsToDelete));
          console.log(res);
    
          if (deleteAbroadStudy.fulfilled.match(res)) {
            toast.success("✅ StudyAbroad deleted successfully!");
            setSelectedIds([]); // clear selection
            loadBlogs();
          } else if (deleteAbroadStudy.rejected.match(res)) {
            toast.error(
              "❌ Failed to delete Abroad: " +
              (res.payload?.message || res.error?.message || "Unknown error")
            );
          }
        } catch (error) {
          console.error(error);
          toast.error("⚠️ Unexpected error: " + (error.message || "Something went wrong"));
        }
      };

  return (
    <div className="card basic-data-table">
      <div
        className="card-header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h5 className="card-title mb-0">Country Table</h5>
        <div>
          <button
            type="button"
            className="btn rounded-pill text-primary radius-8 px-4 py-2"
            onClick={() => setShowModal(true)}
          >
            Add Country
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
            <CreateCountry
              ele={editingCountry}
              handleClose={() => {
                setShowModal(false);
                setEditingCountry(null);
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
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">MBBS</th>
                <th scope="col">Flag</th>
                <th scope="col">Banner</th>
                <th scope="col">Created At</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {studyAbroad?.map((ele,ind) => {
                return(
                  <tr key={ele._id}>
                <td>
                  <div className="form-check style-check d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedIds.includes(ele._id)}
                      onChange={() => handleCheckboxChange(ele._id)}
                    />
                    <label className="form-check-label">{ind+1}</label>
                  </div>
                </td>
                <td>{ele?.name}</td>
                <td>
                  <div
                      className="custom-scrollbar"
                      style={{
                        width: "300px",
                        height: "50px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        whiteSpace: "normal",
                      }}
                    >
                      <h6 className="text-md mb-0 fw-medium flex-grow-1">
                        {ele?.description.slice(0, 300)}
                      </h6>
                    </div>
                </td>
                <td>{ele?.mbbsAbroad == true? "Yes": "No"}</td>
                <td>
                  <a
                    href={ele?.flagURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click to View
                  </a>
                </td>
                <td>
                  <a
                    href={ele?.bannerURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click to View
                  </a>
                </td>
                <td>
                  <span className="text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                    {new Date(ele?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      weekday: "short",
                    })}
                  </span>
                </td>
                <td>
                  <Link
                    onClick={() => {
                      setEditingCountry(ele);
                      setShowModal(true);
                    }}
                    to="#"
                    className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                  >
                    <Icon icon="lucide:edit" />
                  </Link>
                  <Link
                    onClick={handleDelete}
                    to="#"
                    className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                  >
                    <Icon icon="mingcute:delete-2-line" />
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
    // <div>Hello</div>
  );
};

export default AbroadManager;

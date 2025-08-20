import React,{ useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import { useDispatch } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAbroadUniversity } from "../slice/AbroadUniversitySlice";
import CreateAbroadUniversity from "../form/CreateAbroadUniversity";

const AbroadUniversity = () => {
    const dispatch = useDispatch();
    const [selectedIds, setSelectedIds] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [university, setUniversity] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingUniversity, setEditingUniversity] = useState(null);

    const loadUniversity = async () => {
        setLoading(true);
        try {
          const res = await dispatch(fetchAbroadUniversity());
          if (res?.meta?.requestStatus === "fulfilled") {
            setUniversity(res.payload);
          }
        } finally {
          setLoading(false);
        }
      };
      console.log(university,"+++++++++");
      

      useEffect(() => {
        loadUniversity();
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
          const res = await dispatch(deleteAbroadProvince(idsToDelete));
          console.log(res);
    
          if (deleteAbroadProvince.fulfilled.match(res)) {
            toast.success("✅ Abroad University deleted successfully!");
            setSelectedIds([]); // clear selection
            loadBlogs();
          } else if (deleteAbroadProvince.rejected.match(res)) {
            toast.error(
              "❌ Failed to delete Abroad University: " +
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
            Add University
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
            <CreateAbroadUniversity
              ele={editingUniversity}
              handleClose={() => {
                setShowModal(false);
                setEditingUniversity(null);
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
                <th scope="col">Province</th>
                <th scope="col">Country</th>
                <th scope="col">Image</th>
                <th scope="col">Banner</th>
                <th scope="col">Logo</th>
                <th scope="col">Created Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {university?.map((ele,ind) => {
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
                <td>{ele?.name}</td>
                <td>{ele?.Country?.name}</td>
                <td>
                  <a
                    href={ele?.heroURL}
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
                  <a
                    href={ele?.logo}
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
                      setEditingUniversity(ele);
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
  )
}

export default AbroadUniversity
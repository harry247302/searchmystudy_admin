import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteVideo, fetchVideos } from "../slice/VideoSlice";
import CreateVideo from "../form/CreateVideo";

const VideoManager = () => {
  const dispatch = useDispatch();
  const { videos } = useSelector((state)=>state.video)
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(videos);
  

    // Handle checkbox (select blogs)
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
      toast.warn("⚠️ No blogs selected for deletion.");
      return;
    }

    const confirmed = window.confirm(
      idsToDelete.length > 1
        ? `Are you sure you want to delete ${idsToDelete.length} blogs?`
        : "Are you sure you want to delete this blog?"
    );
    if (!confirmed) return;

    try {
      const res = await dispatch(deleteVideo(idsToDelete));
      console.log(res);

      if (deleteVideo.fulfilled.match(res)) {
        toast.success("✅ Blog deleted successfully!");
        setSelectedIds([]); // clear selection
        await dispatch(fetchVideos());
      } else if (deleteVideo.rejected.match(res)) {
        toast.error(
          "❌ Failed to delete blog: " +
          (res.payload?.message || res.error?.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Unexpected error: " + (error.message || "Something went wrong"));
    }
  };


  useEffect(()=>{
    const data = async ()=>{
     await dispatch(fetchVideos())
    }
    data()
  },[])

  return (
    <div className="card basic-data-table">
      <div
        className="card-header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h5 className="card-title mb-0">Video Table</h5>
        <div>
          <button
            type="button"
            className="btn rounded-pill text-primary radius-8 px-4 py-2"
            onClick={() => setShowModal(true)}
          >
            Add Video
          </button>


          {/* <div className="mb-3"> */}
          {selectedIds.length > 0 && (
            <button
              className="btn rounded-pill text-danger radius-8 px-4 py-2"
              onClick={() => handleDelete()}
            >
              Delete Selected ({selectedIds.length})
            </button>
          )}
          {/* </div> */}

          {showModal && (
            <CreateVideo
            ele={editVideo}
              handleClose={() =>{ setShowModal(false); setEditVideo(null)}}
            />
          )}
        </div>
      </div>

      <div className="card-body">
        {loading ? (
          <p className="text-center py-4">Loading Videos...</p>
        ) : (
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
                  <th scope="col">Video URL</th>
                  <th scope="col">Thumbnail URL</th>
                  <th scope="col">Created At</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {videos?.map((ele, ind) => (
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
                    <td>{ele?.name}</td>
                    <td>
                      <a
                        href={ele?.videoURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Click to view
                      </a>
                    </td>
                    <td>
                    <a
                        href={ele?.thumbnailURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Click to view
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
                        onClick={() => {setShowModal(true); setEditVideo(ele)}}
                        to="#"
                        className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="lucide:edit" />
                      </Link>

                     
                      {/* <Link
                        onClick={() => handleDelete(ele._id)}
                        to="#"
                        className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="mingcute:delete-2-line" />
                      </Link> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}

export default VideoManager
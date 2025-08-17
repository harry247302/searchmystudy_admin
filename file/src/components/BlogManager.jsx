import { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteBlog, fetchBlog, GetOneBlog } from "../slice/blogSlice";
import CreateBlog from "../form/CreateBlog";
// import { toast } from "react-toastify";
import UpdateBlog from "../form/UpdateBlog";
import { toast } from "react-toastify";

const BlogManager = () => {
  const dispatch = useDispatch();
  const [blog, setBlog] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false)
  const [loading, setLoading] = useState(false);
  const [updateBlog, setUpdateBlog] = useState()
  // Fetch blogs
  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await dispatch(fetchBlog());
      if (res?.meta?.requestStatus === "fulfilled") {
        setBlog(res.payload);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
        // toast.success("✅ Blog deleted successfully!");
    // alert("sadfg")
  }, [dispatch]);

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
      const res = await dispatch(deleteBlog(idsToDelete));
      console.log(res);

      if (deleteBlog.fulfilled.match(res)) {
        toast.success("✅ Blog deleted successfully!");
        setSelectedIds([]); // clear selection
        loadBlogs();
      } else if (deleteBlog.rejected.match(res)) {
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
  // useEffect(() => {
  //   let table;
  //   if (blog.length > 0) {
  //     if ($.fn.DataTable.isDataTable("#dataTable")) {
  //       $("#dataTable").DataTable().destroy();
  //     }
  //     table = $("#dataTable").DataTable({
  //       pageLength: 10,
  //     });
  //   }
  //   return () => {
  //     if (table) {
  //       table.destroy(true);
  //     }
  //   };
  // }, [blog]);



  const editHandler = async (id) => {
    try {
      const res = await dispatch(GetOneBlog(id))
      console.log(res, ":::::::}}}}}}}}}}}}}}}}}}}}}}}}}");
      if (res?.meta?.requestStatus === "fulfilled") {
        setUpdateBlog(res?.payload)
        setEditModal(true)
      }
    } catch (error) {
      console.log(error);
    }
  }
  
console.log(updateBlog,":::::::::::::::::::::::::::::::::::::::");

  return (
    <div className="card basic-data-table">
      <div
        className="card-header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h5 className="card-title mb-0">Blog Tables</h5>
        <div>
          <button
            type="button"
            className="btn rounded-pill text-primary radius-8 px-4 py-2"
            onClick={() => setShowModal(true)}
          >
            Add blog
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
            <CreateBlog
              loadBlogs={loadBlogs}
              handleClose={() => setShowModal(false)}
            />
          )}
           {editModal && (
                        <UpdateBlog
                          loadBlogs={loadBlogs}
                          updateBlog = {updateBlog}
                          handleClose={() => setEditModal(false)}
                        />
                      )}
        </div>
      </div>

      <div className="card-body">
        {loading ? (
          <p className="text-center py-4">Loading blogs...</p>
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
                  <th scope="col">Image</th>
                  <th scope="col">Title</th>
                
                  <th scope="col">Content</th>
                  <th scope="col">Thumbnail</th>
                  <th scope="col" className="dt-orderable-asc dt-orderable-desc">
                    Date
                  </th>
                  <th scope="col">Created At</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {blog.map((ele, ind) => (
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
                      <a
                        href={ele?.bannerURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Click to view
                      </a>
                    </td>
                    <td>
                     {ele?.title}
                    </td>
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
                          {ele?.content.slice(0, 300)}
                        </h6>
                      </div>
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
                    <td>{ele?.date}</td>
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
                        onClick={() => editHandler(ele._id)}
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
  );
};

export default BlogManager;

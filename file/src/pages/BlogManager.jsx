import { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteBlog, fetchBlog } from "../slice/blogSlice";

const BlogManager = () => {
  const dispatch = useDispatch();
  const [blog, setBlog] = useState([]);
 const [selectedIds, setSelectedIds] = useState([]);

const loadBlogs = async () => {
      const res = await dispatch(fetchBlog());
      if (res?.meta?.requestStatus === "fulfilled") {
        setBlog(res.payload);
      }
    };

  useEffect(() => {   
    loadBlogs();
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

    const handleDelete = async (id) => {
    try {
      
      const res = await dispatch(deleteBlog(selectedIds));
      console.log(res);
      loadBlogs();
      // toast.success("Blog Deleted successfully")
    } catch (error) {
      console.log(error);

      // toast.error('Error deleting testimonial');
    }
  };



  useEffect(() => {
    if (blog.length > 0) {
      const table = $("#dataTable").DataTable({
        pageLength: 10,
      });
      return () => {
        table.destroy(true);
      };
    }
  }, [blog]);

  return (
    <div className="card basic-data-table">
      <div className="card-header">
        <h5 className="card-title mb-0">Blog Tables</h5>
      </div>
      <div className="card-body">
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
                    />                        <label className="form-check-label">{ind + 1}</label>
                    </div>
                  </td>
                  <td>
                    <a href={ele?.bannerURL} target="_blank" rel="noopener noreferrer">
                      Click to view
                    </a>
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
                    <a href={ele?.thumbnailURL} target="_blank" rel="noopener noreferrer">
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
              ))}
            </tbody>
          </table>
        </>
      </div>
    </div>
  );
};

export default BlogManager;

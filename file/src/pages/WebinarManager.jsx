import { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchBlog } from "../slice/blogSlice";
import { Log } from "@phosphor-icons/react";
import { fetchWebinar } from "../slice/webinarSlice";

const WebinarManager = () => {
  const dispatch = useDispatch();
  const [webinar, setWebinar] = useState([]);

  useEffect(() => {
    const loadBlogs = async () => {
      const res = await dispatch(fetchWebinar());
      console.log(res, "------------------------");

      if (res?.meta?.requestStatus === "fulfilled") {
        setWebinar(res.payload);
      }
    };
    loadBlogs();
  }, [dispatch]);

  // useEffect(() => {
  //   if (blog.length > 0) {
  //     const table = $("#dataTable").DataTable({
  //       pageLength: 10,
  //     });
  //     return () => {
  //       table.destroy(true);
  //     };
  //   }
  // }, [blog]);

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
                <th scope="col">Trainer</th>
                <th scope="col">Profession</th>
                <th scope="col">Title</th>
                 <th scope="col" className="dt-orderable-asc dt-orderable-desc">
                  Day
                </th>
                <th scope="col" className="dt-orderable-asc dt-orderable-desc">
                  Date
                </th>
                <th scope="col" className="dt-orderable-asc dt-orderable-desc">
                  Time
                </th>
                <th scope="col">Created At</th>
                <th scope="col" className="dt-orderable-asc dt-orderable-desc">
                  Banner
                </th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {webinar?.map((ele, ind) => (
                <tr key={ele._id || ind}>
                  <td>
                    <div className="form-check style-check d-flex align-items-center">
                      <input className="form-check-input" type="checkbox" />
                      <label className="form-check-label">{ind + 1}</label>
                    </div>
                  </td>
                  <td>

                    {ele?.trainer_name}

                  </td>
                  <td>

                    {ele?.trainer_profession}

                  </td>
                  <td>
                  
                      <h6 className="text-md mb-0 fw-medium flex-grow-1">
                        {ele?.title}
                      </h6>
                  </td>
                 
                  <td>
                    {ele?.weekday}
                  </td>
                  <td>{ele?.date}</td>
                  <td>{ele?.timeStart} - {ele?.timeEnd}</td>

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
                    <a target="blank" href={ele?.imageURL}>
                      Click to view
                    </a>
                    
                  </td>

                  <td>
                    <Link
                      to="#"
                      className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                    >
                      <Icon icon="lucide:edit" />
                    </Link>
                    <Link
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

export default WebinarManager;

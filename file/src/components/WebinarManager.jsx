import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { deleteWebinar, fetchWebinar } from '../slice/webinarSlice';
import CreateWebinar from "../form/CreateWebinar";
import { toast } from "react-toastify";

const WebinarManager = () => {
  const dispatch = useDispatch();
  const { webinars } = useSelector((state) => state.webinar)
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState(null);

  useEffect(() => {
    dispatch(fetchWebinar());
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
      // console.log(selectedIds, "|||||");

      const res = await dispatch(deleteWebinar(selectedIds));
      dispatch(fetchWebinar());
      toast.success("Blog Deleted successfully")
    } catch (error) {
      console.log(error);
      toast.error('Error deleting testimonial');
    }
  };
  return (
    <div className="card basic-data-table">
      <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <h5 className="card-title mb-0">Webinar Table</h5>
        <div>
          <button
            type="button"
            className="mx-4 btn rounded-pill text-primary radius-8 px-4 py-2"
            onClick={() => setShowModal(true)}
          >
            Add Webinar
          </button>

            <button   className="mx-4 btn rounded-pill text-danger radius-8 px-4 py-2" onClick={handleDelete}>Delete</button>

          {showModal && <CreateWebinar ele={editingWebinar} handleClose={() => {
            setShowModal(false);
            setEditingWebinar(null);
          }} />}
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
                <th scope="col">Title</th>
                <th scope="col">Trainer Name</th>
                <th scope="col">Trainer profession</th>
                <th scope="col" className="dt-orderable-asc dt-orderable-desc">
                  Date
                </th>
                <th scope="col">Image</th>
                <th scope="col">Created At</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {webinars?.map((ele, ind) => (
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
                    {ele?.title}
                  </td>
                  <td>
                    {ele?.trainer_name}
                  </td>
                  <td>
                    {ele?.trainer_profession}
                  </td>
                  <td>{ele?.date}</td>
                  <td>
                    <a href={ele?.imageURL} target="_blank" rel="noopener noreferrer">
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
                        setEditingWebinar(ele);
                        setShowModal(true);
                      }}
                      to="#"
                      className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                    >
                      <Icon icon="lucide:edit" />
                    </Link>
                    {/* <Link
                      onClick={handleDelete}
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
      </div>
    </div>
  )
}

export default WebinarManager
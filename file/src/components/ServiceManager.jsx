import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteService, fetchServices } from "../slice/serviceSlice";
import CreateService from "../form/CreateService";


const ServiceManager = () => {
  const dispatch = useDispatch();
  const {services} = useSelector((state)=>state.service);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);


  const handleDelete = async (id) => {
    try {

      const res = await dispatch(deleteService(id));
      console.log(res);
      // toast.success("Blog Deleted successfully")
    } catch (error) {
      console.log(error);
      // toast.error('Error deleting testimonial');
    }
  };

  console.log(services);
  

  useEffect(() => {
    dispatch(fetchServices())
  }, [dispatch]);

  useEffect(() => {
    if (services?.length > 0) {
      const table = $("#dataTable").DataTable({
        pageLength: 10,
      });
      return () => {
        table.destroy(true);
      };
    }
  }, [services]);
  return(
    <div className="card basic-data-table">
    <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
      <h5 className="card-title mb-0">Service Table</h5>
        <div>
    <button
      type="button"
      className="btn rounded-pill text-primary radius-8 px-4 py-2"
      onClick={() => setShowModal(true)}
    >
      Add Services
    </button>

    {showModal && <CreateService ele={editingService} handleClose={() => {
        setShowModal(false);
        setEditingService(null);
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
              <th scope="col">S.L</th>
              <th scope="col">Title</th>
              <th scope="col">Heading</th>
              <th scope="col">Image</th>
              <th scope="col">Created At</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {services?.map((ele, ind) => (
              <tr key={ele._id || ind}>
                <td>
                  {ind+1}
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
                        {ele?.heading.slice(0, 300)}
                      </h6>
                    </div>
                </td>
                <td>
                  <a href={ele?.banner} target="_blank" rel="noopener noreferrer">
                    Click to View
                  </a>
                </td>
                <td>
                  {ele?.createdAt}
                </td>
                <td>
                  <Link
                  onClick={() => {
                    setEditingService(ele);
                    setShowModal(true);
                  }}
                    to="#"
                    className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                  >
                    <Icon icon="lucide:edit" />
                  </Link>
                  <Link
                    onClick={()=>{handleDelete(ele?._id)}}
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
  )
};

export default ServiceManager;

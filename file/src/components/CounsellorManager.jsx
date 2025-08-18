import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { deleteCounsellor, fetchCounsellor } from "../slice/counsellorSlice";
import CreateService from "../form/CreateService";
import CreateCounsellor from "../form/CreateCounsellor";

const CounsellorManager = () => {
  const dispatch = useDispatch();
  const [counsellor, setCounsellor] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCounsellor, setEditingCounsellor] = useState(null);


  const loadCounsellors = async () => {
    const res = await dispatch(fetchCounsellor());
    if (res?.meta?.requestStatus === "fulfilled") {
      setCounsellor(res.payload);
    }
  };
  console.log(counsellor, "-----------------------------------");

  const handleDelete = async (id) => {
    try {
      const res = await dispatch(deleteCounsellor(id));
      console.log(res);
      loadCounsellors();
      // toast.success("Blog Deleted successfully")
    } catch (error) {
      console.log(error);

      // toast.error('Error deleting testimonial');
    }
  };

  useEffect(() => {
    loadCounsellors();
  }, [dispatch]);

  useEffect(() => {
    if (counsellor.length > 0) {
      const table = $("#dataTable").DataTable({
        pageLength: 10,
      });
      return () => {
        table.destroy(true);
      };
    }
  }, [counsellor]);

  return (
    <div className="card basic-data-table">
      <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <h5 className="card-title mb-0">Counsellor Table</h5>
        <div>
          <button
            type="button"
            className="btn rounded-pill text-primary radius-8 px-4 py-2"
            onClick={() => setShowModal(true)}
          >
            Add Counsellors
          </button>

          {showModal && <CreateCounsellor ele={editingCounsellor} handleClose={() => {
            setShowModal(false);
            setEditingCounsellor();
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
            className="table bordered-table  mb-0"
            data-page-length={10}
          // style={{overflowX:"auto"}}
          >
            <thead>
              <tr>
                <th scope="col">S.L</th>
                <th scope="col">Name</th>
                <th scope="col">Course</th>
                <th scope="col">Experience</th>
                <th scope="col">Image</th>
                <th scope="col">Created At</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {counsellor.map((ele, ind) => (
                <tr key={ele._id || ind}>
                  <td>
                    {ind + 1}
                  </td>
                  <td>
                    {ele?.name}
                  </td>
                  <td>
                    {ele?.course}
                  </td>
                  <td>
                    {ele?.experience}
                  </td>
                  <td>
                    <a href={ele?.imageURL} target="_blank" >
                      Click to View
                    </a>
                  </td>
                  <td>
                    {ele?.createdAt}
                  </td>
                  <td>
                    <Link
                      onClick={() => {
                        setEditingCounsellor(ele);
                        setShowModal(true);
                      }}
                      to="#"
                      className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                    >
                      <Icon icon="lucide:edit" />
                    </Link>
                    <Link
                      onClick={() => { handleDelete(ele?._id) }}
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
}

export default CounsellorManager
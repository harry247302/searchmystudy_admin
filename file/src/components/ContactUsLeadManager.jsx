import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { deleteWebinar, fetchWebinar } from '../slice/webinarSlice';
import CreateWebinar from "../form/CreateWebinar";
import { toast } from "react-toastify";
import { deleteContactUsLead, fetchContactUsLead } from "../slice/contachUsLead";
import CreateContactUsLead from "../form/CreateContactUsLead";

const ContactUsLeadManager = () => {
  const dispatch = useDispatch();
  const { contactUsLeads } = useSelector((state)=>state.contactUsLead)
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  console.log(contactUsLeads,"_____________************");
  

  const fetchData = async ()=>{
      const res1 = await dispatch(fetchContactUsLead());
    }
  useEffect(() => {    
    fetchData()
    
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

const handleDelete = async () => {
  try {
    const confirmed = window.confirm("Are you sure you want to delete this webinar?");
    if (!confirmed) return; // stop if user clicks Cancel

    await dispatch(deleteContactUsLead(selectedIds));
    fetchData()
    toast.success("lead deleted successfully");
  } catch (error) {
    console.log(error);
    toast.error("Error deleting lead");
  }
};

  // console.log(webinars);
  
  return (
    <div className="card basic-data-table">
      <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <h5 className="card-title mb-0">ContactUs lead Table</h5>
        <div>
          <button
            type="button"
            className="mx-4 btn rounded-pill text-primary radius-8 px-4 py-2"
            onClick={() => setShowModal(true)}
          >
            Add ContactUs lead
          </button>

            <button   className="mx-4 btn rounded-pill text-danger radius-8 px-4 py-2" onClick={handleDelete}>Delete</button>

          {showModal && <CreateContactUsLead fetchData={fetchData} ele={editingLead} handleClose={() => {
            setShowModal(false);
            setEditingLead(null);
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
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Occupation</th>
                <th scope="col">Comment</th>
                <th scope="col">Created At</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {contactUsLeads?.map((ele, ind) => (
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
                    {ele?.name}
                  </td>
                  <td>
                    {ele?.email}
                  </td>
                  <td>
                    {ele?.phoneNo}
                  </td>
                  <td>{ele?.occupation}</td>
                  <td>{ele?.comment}</td>
                  <td>{ele?.createdAt}</td>
                  <td className="text-center">
                    <Link
                      onClick={() => {
                        setEditingLead(ele);
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

export default ContactUsLeadManager
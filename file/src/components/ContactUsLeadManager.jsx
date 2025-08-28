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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const ContactUsLeadManager = () => {
  const dispatch = useDispatch();
  const { contactUsLeads } = useSelector((state)=>state.contactUsLead)
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

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
    const confirmed = window.confirm("Are you sure you want to delete this lead?");
    if (!confirmed) return;
    console.log(selectedIds);
    
    const result = await dispatch(deleteContactUsLead(selectedIds));
    if (result.meta.requestStatus === "fulfilled") {
      fetchData();
    } else {
      toast.error(result.payload || "Error deleting lead");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Unexpected error deleting lead");
  }
};

const exportToExcel = (data) => {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }

  // Format data for Excel
  const formattedData = data.map((item, index) => ({
    SNo: index + 1,
    Name: item.name || "",
    Email: item.email || "",
    Phone: item.phoneNo || "",
    Occupation: item.occupation || "",
    Comment: item.comment || "",
    CreatedAt: new Date(item.createdAt).toLocaleString(),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

  // Export Excel file
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const dataBlob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(dataBlob, `Contact_Leads_${Date.now()}.xlsx`);
};

  
  return (
    <div className="card basic-data-table">
      <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <h5 className="card-title mb-0">ContactUs lead Table</h5>
        <div>
          <button
            type="button"
             onClick={() => exportToExcel(contactUsLeads)}
            className="mx-4 btn rounded-pill text-primary radius-8 px-4 py-2"
          >
            Download In Excel
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
                  <td>  {new Date(ele?.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",    // 22
                            month: "2-digit",  // 08
                            year: "numeric",   // 2025
                            // hour: "2-digit",   // 07
                            // minute: "2-digit", // 31
                            // second: "2-digit", // 51
                            hour12: true       // AM/PM
                          })}</td>
                  <td className="text-center">
                   
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
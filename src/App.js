import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "job_tracker"));
      const jobList = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setJobs(jobList);
    };
    fetchJobs();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const updateStatus = async (job, newStatus) => {
    const jobRef = doc(db, "job_tracker", job.id);
    await updateDoc(jobRef, { status: newStatus });

    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id ? { ...j, status: newStatus } : j
      )
    );
  };

  const deleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Delete this job listing? This cannot be undone."
    );
    if (!confirmed) return;

    await deleteDoc(doc(db, "job_tracker", jobId));

    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const filteredJobs = jobs
  .filter(
    (job) =>
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_role.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest date first

  return (
    <div className="terminal">
      <div className="header">
        <h1>$ job-tracker</h1>
        <p>interactive terminal mode</p>
      </div>

      <input
        className="terminal-input"
        placeholder="> search company or role..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="terminal-table">
        <thead>
          <tr>
            <th>COMPANY</th>
            <th>ROLE</th>
            <th>DATE</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <tr onClick={() => toggleExpand(index)}>
                <td>{job.company_name}</td>
                <td>{job.job_role}</td>
                <td>{job.date}</td>
                <td>
                  <div className="status-cell">
                    <select
                      className={`status-select ${job.status.toLowerCase()}`}
                      value={job.status.toLowerCase()}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateStatus(job, e.target.value)
                      }
                    >
                      <option value="applied">applied</option>
                      <option value="interviewing">interviewing</option>
                      <option value="offer">offer</option>
                      <option value="rejected">rejected</option>
                    </select>

                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteJob(job.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>

              {expandedIndex === index && (
                <tr className="description-row">
                  <td colSpan="4">{job.job_description}</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

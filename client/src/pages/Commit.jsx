import React, { useState, useEffect } from "react";
import axios from "axios";
import { VscGitCommit } from "react-icons/vsc";

const CommitsPage = () => {
  const [commits, setCommits] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("master");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchCommits();
  }, [selectedBranch]);
  const fetchCommits = async () => {
    try {
      const response = await axios.get("/api/commit/getCommits");
      
      // Fix: Check for 'commit' instead of 'commits' in response
      if (response.data.success && Array.isArray(response.data.commit)) {
        const formattedCommits = response.data.commit.map(commit => ({
          id: commit.id ,
          content: commit.content || 'No message',
          date: new Date().toISOString(),
          author: commit.author || 'Unknown',
          branch: commit.branch || selectedBranch
        }));
        setCommits(formattedCommits);
      } else {
        console.error("Invalid commit data structure:", response.data);
        setCommits([]);
      }
    } catch (error) {
      console.error("Error fetching commits:", error);
      setCommits([]);
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...

  const handleRevert = async (commitId) => {
    try {
      // Fix: Send data in request body properly
      await axios.delete("/api/commit/revert", {
        data: { commitId }  // Correct way to send data with DELETE request
      });
      fetchCommits();
    } catch (error) {
      console.error("Error reverting commit:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6">
      <h1 className="text-2xl font-semibold mb-6">Commits</h1>

      <div className="flex gap-4 mb-8">
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
        >
          <option value="master">master</option>
          <option value="develop">develop</option>
        </select>

        <div className="ml-auto flex gap-4">
          <select
            value={selectedUsers}
            onChange={(e) => setSelectedUsers(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
          >
            <option value="all">All users</option>
          </select>
        </div>
      </div>

      {loading ? (
  <div>Loading commits...</div>
) : (
  <div className="space-y-4">
    {commits.map(commit => (
      <div key={commit.id} className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <VscGitCommit className="text-gray-500 dark:text-gray-400 w-5 h-5" />
              <p className="font-medium">{commit.content}</p>
            </div>
            <div className="text-sm text-gray-400">
              {new Date(commit.date).toLocaleDateString()}
            </div>
          </div>
          <button 
            onClick={() => handleRevert(commit.id)}
            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors ml-4"
          >
            Revert
          </button>
        </div>
      </div>
    ))}
  </div>
)}
        </div>
    );
    };

export default CommitsPage;
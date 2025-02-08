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
    const fetchCommits = async () => {
      try {
        const response = await axios.get("/api/commit/getCommits");
        
        // Fix: Check for 'commit' instead of 'commits' in response
        if (response.data.success && Array.isArray(response.data.commit)) {
          const formattedCommits = response.data.commit.map(commit => ({
            id: commit._id || '',
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

    fetchCommits();
  }, [selectedBranch]);

  // ...existing code...

  const groupCommitsByDate = () => {
    if (!Array.isArray(commits)) return {};

    return commits.reduce((grouped, commit) => {
      if (!commit.date) return grouped;
      const date = new Date(commit.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(commit);
      return grouped;
    }, {});
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
                <div className="flex items-center gap-2 mb-2">
                <VscGitCommit className="text-gray-500 dark:text-gray-400 w-5 h-5" />
                <p className="font-medium">{commit.content}</p>
                </div>
                <div className="text-sm text-gray-400">
                {new Date(commit.date).toLocaleDateString()}
                </div>
            </div>
            ))}
        </div>
        )}
            </div>
        );
        };

export default CommitsPage;
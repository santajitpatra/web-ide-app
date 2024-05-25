import Terminal from "./components/terminal";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import FileTree from "./components/tree";
import socket from "./socket";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {
  const [fileTree, setFileTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [code, setCode] = useState("");

  const isSaved = code === selectedFileContent;

  const getFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    const response = await fetch(
      `http://localhost:9000/files/content?path=${selectedFile}`
    );
    const result = await response.json();
    setSelectedFileContent(result.content);
  }, [selectedFile]);

  // get file contents on file change
  useEffect(() => {
    setCode("");
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile && selectedFileContent) setCode(selectedFileContent);
  }, [selectedFileContent, selectedFile]);

  useEffect(() => {
    if (selectedFile) getFileContents();
  }, [selectedFile, getFileContents]);

  //  get all files on mount (and on file refresh)
  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);

  // after 5 seconds, send file contents to server if it has changed
  useEffect(() => {
    if (code && !isSaved) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
        });
      }, 5 * 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, selectedFile, isSaved]);

  return (
    <div className="playground-container">
      <div className="editor-container">
        <div className="files">
          <FileTree
            onSelect={(path) => setSelectedFile(path)}
            tree={fileTree}
          />
        </div>
        <div className="editor">
          {selectedFile && (
            <p>
              {selectedFile.replaceAll("/", " > ")}
              {isSaved ? "Save" : "Unsave"}
            </p>
          )}
          <AceEditor value={code} onChange={(code) => setCode(code)} />
        </div>
      </div>
      <div className="terminal-container">
        <Terminal />
      </div>
    </div>
  );
}

export default App;

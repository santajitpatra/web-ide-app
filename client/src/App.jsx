import Terminal from "./components/terminal";
import "./App.css";
import { useEffect, useState } from "react";
import FileTree from "./components/tree";
import socket from "./socket";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {
  const [fileTree, setFileTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");

  const getFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    socket.on("file:change", getFileTree);
    return () => {
      socket.off("file:change", getFileTree);
    };
  }, []);

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
          {selectedFile && <p>{selectedFile.replaceAll("/", " > ")}</p>}
          <AceEditor />
        </div>
      </div>
      <div className="terminal-container">
        <Terminal />
      </div>
    </div>
  );
}

export default App;

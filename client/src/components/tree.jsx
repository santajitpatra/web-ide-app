export const FileTreeNode = ({ fileName, nodes,onSelect, path }) => {
  const isDir = !!nodes;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (isDir) return;
        onSelect(path);
      }}
      style={{ marginLeft: "10px" }}
    >
      <p className={isDir ? "" : "file-node"}>
        {isDir ? "📁" : "📄"}
        {fileName}
      </p>
      {nodes && fileName!=="node_modules" && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <FileTreeNode key={child}
            onSelect={onSelect}
            path={path + "/" + child} fileName={child} nodes={nodes[child]} />
          ))}
        </ul>
      )}
    </div>
  );
};

const FileTree = ({ tree, onSelect }) => {
  return (
    <div>
      <FileTreeNode onSelect={onSelect} fileName="/" path={""} nodes={tree} />
    </div>
  );
};

export default FileTree;

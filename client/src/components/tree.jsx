export const FileTreeNode = ({ fileName, nodes }) => {
  const isDir = !!nodes;

  return (
    <div style={{marginLeft: "10px"}}>
      <p className={isDir ? "" : "file-node"}>
        {isDir ? "📁" : "📄"}
        {fileName}
      </p>
      {nodes && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <FileTreeNode key={child} fileName={child} nodes={nodes[child]} />
          ))}
        </ul>
      )}
    </div>
  );
};

const FileTree = ({ tree }) => {
  return (
    <div>
      <FileTreeNode fileName="/" nodes={tree} />
    </div>
  );
};

export default FileTree;

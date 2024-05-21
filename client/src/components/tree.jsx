export const FileTreeNode = ({ fileName, nodes }) => {

  return (
    <div>
      {fileName}
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

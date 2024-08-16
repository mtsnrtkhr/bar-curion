import React, { useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph';

const GraphVisualization = ({ data }) => {
  const graphRef = useRef();

  useEffect(() => {
    // グラフの初期化や設定をここで行う
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-300);
      graphRef.current.d3Force('link').distance(50);
    }
  }, []);

  const handleNodeClick = (node) => {
    // ノードクリック時の処理
    console.log('Clicked node:', node);
    // ここで詳細情報の表示などの処理を追加できます
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        nodeLabel="name"
        nodeColor={node => node.group === 'cocktail' ? '#ff6347' : '#4682b4'}
        nodeRelSize={6}
        linkColor={link => link.type === 'similarity' ? '#ff9999' : '#999999'}
        linkWidth={link => link.value}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
};

export default GraphVisualization;
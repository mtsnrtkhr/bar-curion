import React, { useEffect, useRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';

// データの型定義
type GraphNode = {
  id: string;
  name: string;
  group: 'cocktail' | 'ingredient';
};

type GraphLink = {
  source: string;
  target: string;
  value: number;
  type?: 'similarity';
};

type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

// コンポーネントのプロップの型定義
type GraphVisualizationProps = {
  data: GraphData;
};

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ data }) => {
  const graphRef = useRef<any>();

  useEffect(() => {
    // グラフの初期化や設定をここで行う
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-300);
      graphRef.current.d3Force('link').distance(50);
    }
  }, []);

  const handleNodeClick = (node: GraphNode) => {
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
        nodeColor={(node: GraphNode) => node.group === 'cocktail' ? '#ff6347' : '#4682b4'}
        nodeRelSize={6}
        linkColor={(link: GraphLink) => link.type === 'similarity' ? '#ff9999' : '#999999'}
        linkWidth={(link: GraphLink) => link.value}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
};

export default GraphVisualization;
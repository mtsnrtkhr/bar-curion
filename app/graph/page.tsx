import dynamic from 'next/dynamic'
import Layout from '../../components/Layout'

const GraphVisualizationWrapper = dynamic(() => import('./GraphVisualizationWrapper'), {
  ssr: false,
  loading: () => <p>グラフデータを読み込んでいます...</p>
})

export default function GraphPage() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">カクテルと材料の関係グラフ</h1>
      <GraphVisualizationWrapper />
    </Layout>
  )
}
/*
'use client'

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import GraphVisualization from './GraphVisualization';

export default function GraphPage() {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    fetch('/data/graph-data.json')
      .then(response => response.json())
      .then(data => setGraphData(data))
      .catch(error => console.error('Error loading graph data:', error));
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">カクテルと材料の関係グラフ</h1>
      {graphData ? (
        <GraphVisualization data={graphData} />
      ) : (
        <p>グラフデータを読み込んでいます...</p>
      )}
    </Layout>
  );
}
*/
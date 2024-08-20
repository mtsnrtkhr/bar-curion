'use client'

import { useState, useEffect } from 'react';
import GraphVisualization from './GraphVisualization';
import { initClientDB, getGraphData } from '../../lib/clientDB';

// GraphDataの型定義
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

type GraphVisualizationWrapperProps = {
  searchTerm: string;
};

export default function GraphVisualizationWrapper({ searchTerm }: GraphVisualizationWrapperProps) {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [filteredData, setFilteredData] = useState<GraphData | null>(null);

  useEffect(() => {
    async function loadGraphData() {
      await initClientDB();
      const data = await getGraphData();
      setGraphData(data);
      setFilteredData(data);
    }
    loadGraphData();
  }, []);

  useEffect(() => {
    if (graphData && searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered: GraphData = {
        nodes: graphData.nodes.filter(node =>
          node.name.toLowerCase().includes(lowercasedSearch)
        ),
        links: graphData.links.filter(link => {
          const sourceNode = graphData.nodes.find(node => node.id === link.source);
          const targetNode = graphData.nodes.find(node => node.id === link.target);
          return (sourceNode?.name.toLowerCase().includes(lowercasedSearch) ||
                  targetNode?.name.toLowerCase().includes(lowercasedSearch));
        })
      };
      setFilteredData(filtered);
    } else {
      setFilteredData(graphData);
    }
  }, [graphData, searchTerm]);

  if (!filteredData) {
    return <p>グラフデータを読み込んでいます...</p>;
  }

  return <GraphVisualization data={filteredData} />;
}
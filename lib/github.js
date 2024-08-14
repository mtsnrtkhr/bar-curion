export async function fetchRecipesData() {
    const response = await fetch('/data/recipes.json');
    if (!response.ok) {
      throw new Error('Failed to fetch recipes data');
    }
    return response.json();
  }

  export async function fetchGraphData() {
    const response = await fetch('/data/graph-data.json');
    if (!response.ok) {
      throw new Error('Failed to fetch graph data');
    }
    return response.json();
  }
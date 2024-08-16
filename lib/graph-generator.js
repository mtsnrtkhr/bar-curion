import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cosSimilarity from 'cos-similarity';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateGraphData() {
  try {
    const recipesData = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'public', 'data', 'recipes.json'), 'utf8'));

    const nodes = [];
    const links = [];
    const cocktails = recipesData.cocktails;

    // 全ての材料のリストを作成
    const allIngredients = new Set(cocktails.flatMap(c => c.ingredients.map(i => i.name)));
    const ingredientsList = Array.from(allIngredients);

    // カクテルをベクトル化
    const cocktailVectors = cocktails.map(cocktail => {
      return ingredientsList.map(ingredient => {
        const found = cocktail.ingredients.find(i => i.name === ingredient);
        return found ? parseFloat(found.amount) : 0;
      });
    });

    // カクテルとその材料をノードとして追加
    cocktails.forEach((cocktail, index) => {
      nodes.push({ id: cocktail.id, name: cocktail.name, group: 'cocktail' });

      cocktail.ingredients.forEach(ingredient => {
        const ingredientId = `ingredient-${ingredient.name.toLowerCase().replace(/\s+/g, '-')}`;
        if (!nodes.some(node => node.id === ingredientId)) {
          nodes.push({ id: ingredientId, name: ingredient.name, group: 'ingredient' });
        }
        // 材料の量に基づいてリンクの太さを設定
        const weight = parseFloat(ingredient.amount) / 10; // 適切なスケールに調整
        links.push({ source: cocktail.id, target: ingredientId, value: weight });
      });
    });

    // カクテル同士の類似度を計算し、リンクを追加
    for (let i = 0; i < cocktails.length; i++) {
      for (let j = i + 1; j < cocktails.length; j++) {
        const similarity = cosSimilarity(cocktailVectors[i], cocktailVectors[j]);
        if (similarity > 0.1) { // 類似度の閾値
          links.push({
            source: cocktails[i].id,
            target: cocktails[j].id,
            value: similarity * 5, // スケールを調整
            type: 'similarity'
          });
        }
      }
    }

    const graphData = { nodes, links };
    await fs.writeFile(path.join(__dirname, '..', 'public', 'data', 'graph-data.json'), JSON.stringify(graphData, null, 2));
    console.log('Graph data generated successfully');
  } catch (error) {
    console.error('Error generating graph data:', error);
  }
}

generateGraphData();

export { generateGraphData };
import { Low, Memory } from 'lowdb'
import { getAssetPath } from '../app/utils/assetHelpers';

let recipeDb = null
let graphDb = null

async function initDb(url) {
    const adapter = new Memory()
    const db = new Low(adapter, {})

    try {
      // 初期データをフェッチする（GitHub Pages上のJSONファイル）
      let data;
      if (typeof window === 'undefined') {
          // サーバーサイド
          const fs = require('fs')
          const path = require('path')
          const filePath = path.join(process.cwd(), 'public', url)
          data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      } else {
          // クライアントサイド
          const response = await fetch(getAssetPath(url))
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
          }
          data = await response.json()
      }
      db.data = data
      await db.write()
    } catch (error) {
      console.error("Error in initDb:", error)
      throw error // エラーを再スロー
    }

    return db
  }

export async function initClientDB() {
    if (!recipeDb) {
      recipeDb = await initDb('/data/recipes.json')
    }
    if (!graphDb) {
      graphDb = await initDb('/data/graph-data.json')
    }
}

export function getRecipeDB() {
  return recipeDb
}

export function getGraphDB() {
  return graphDb
}


// レシピ関連の操作関数

export async function getRecipes() {
  await initClientDB()
  return recipeDb.data.cocktails
}

export async function getRecipeById(id) {
  await initClientDB()
  return recipeDb.data.cocktails.find(recipe => recipe.id === parseInt(id)) || null
}

export async function addRecipe(recipe) {
    await initClientDB()
    const newId = recipeDb.data.cocktails.length > 0 ? Math.max(...recipeDb.data.cocktails.map(r => r.id)) + 1 : 1
    const newRecipe = { ...recipe, id: newId }
    recipeDb.data.cocktails.push(newRecipe)
    await recipeDb.write()
    return newRecipe
  }

  export async function updateRecipe(id, updatedRecipe) {
    await initClientDB()
    const index = recipeDb.data.cocktails.findIndex(recipe => recipe.id === parseInt(id))
    if (index !== -1) {
      recipeDb.data.cocktails[index] = { ...recipeDb.data.cocktails[index], ...updatedRecipe }
      await recipeDb.write()
      return recipeDb.data.cocktails[index]
    }
    return null
  }

  export async function deleteRecipe(id) {
    await initClientDB()
    const initialLength = recipeDb.data.cocktails.length
    recipeDb.data.cocktails = recipeDb.data.cocktails.filter(recipe => recipe.id !== parseInt(id))
    if (recipeDb.data.cocktails.length < initialLength) {
      await recipeDb.write()
      return true
    }
    return false
  }

  // グラフデータ関連の操作関数

  export async function getGraphData() {
    await initClientDB()
    return graphDb.data
  }

  export async function updateGraphData(newGraphData) {
    await initClientDB()
    graphDb.data = newGraphData
    await graphDb.write()
  }


// 新しい検索関数
export async function searchRecipes(query, isAdvancedSearch = false) {
  await initClientDB();
  const cocktails = recipeDb.data.cocktails;
  const ingredients = recipeDb.data.ingredients;
  if (!isAdvancedSearch) {
    // 簡易検索のロジック
    const terms = query.match(/"[^"]+"|[^\s]+/g) || [];
    return cocktails.filter(cocktail =>
      terms.every(term => {
        const isExactMatch = term.startsWith('"') && term.endsWith('"');
        const cleanTerm = term.replace(/^"|"$/g, '').toLowerCase();

        const matchField = (field) => {
          if (typeof field !== 'string') return false;
          const lowercaseField = field.toLowerCase();
          return isExactMatch ? lowercaseField === cleanTerm : lowercaseField.includes(cleanTerm);
        };

        const matchAnyField = () =>
          matchField(cocktail.name) ||
          matchField(cocktail.category) ||
          cocktail.ingredients.some(ing => matchField(ing.name)) ||
          ingredients.some(ing =>
            matchField(ing.name) &&
            cocktail.ingredients.some(cocktailIng => cocktailIng.name.toLowerCase() === ing.name.toLowerCase())
          );

        return matchAnyField();
      })
    );
  } else {
    // 高度な検索のロジック
    const parts = query.match(/(\w+:(?:"[^"]+"|[^\s]+))|("[^"]+"|[^\s]+)/g) || [];
    const parsedQuery = parts.reduce((acc, part) => {
      const [key, value] = part.split(':');
      if (value) {
        acc[key.trim()] = value.replace(/^"|"$/g, '').trim();
      } else {
        acc.general = acc.general || [];
        acc.general.push(part.replace(/^"|"$/g, '').trim());
      }
      return acc;
    }, {});

    return cocktails.filter(cocktail => {
      return Object.entries(parsedQuery).every(([key, value]) => {
        if (key === 'general') {
          return value.every(term =>
            Object.values(cocktail).some(field =>
              typeof field === 'string' && field.toLowerCase().includes(term.toLowerCase())
            ) ||
            cocktail.ingredients.some(ing => ing.name.toLowerCase().includes(term.toLowerCase()))
          );
        }
        if (Array.isArray(cocktail[key])) {
          return cocktail[key].some(item => matchValue(item.name, value));
        }
        return matchValue(cocktail[key], value);
      });
    });
  }
}

function matchValue(field, value) {
  if (typeof field !== 'string') return false;
  field = field.toLowerCase();
  value = value.toLowerCase();

  if (value.startsWith('"') && value.endsWith('"')) {
    return field === value.slice(1, -1);
  }
  if (value.startsWith('*') && value.endsWith('*')) {
    return field.includes(value.slice(1, -1));
  }
  if (value.startsWith('*')) {
    return field.endsWith(value.slice(1));
  }
  if (value.endsWith('*')) {
    return field.startsWith(value.slice(0, -1));
  }
  return field.includes(value);
}
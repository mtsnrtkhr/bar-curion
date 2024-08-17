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
    const lowercaseQuery = query.toLowerCase();
    return cocktails.filter(cocktail =>
      cocktail.name.toLowerCase().includes(lowercaseQuery) ||
      cocktail.category.toLowerCase().includes(lowercaseQuery) ||
      cocktail.ingredients.some(ing => ing.name.toLowerCase().includes(lowercaseQuery)) ||
      ingredients.some(ing =>
        ing.name.toLowerCase().includes(lowercaseQuery) &&
        cocktail.ingredients.some(cocktailIng => cocktailIng.name.toLowerCase() === ing.name.toLowerCase())
      )
    );
  } else {
    // クエリを解析する関数
    const parseQuery = (queryString) => {
      const parts = queryString.match(/(\w+):(?:\(([^)]+)\)|(\S+))/g) || [];
      return parts.reduce((acc, part) => {
        const [key, value] = part.split(':');
        acc[key.trim()] = value.replace(/^\(|\)$/g, '').trim();
        return acc;
      }, {});
    };

    // 値がクエリに一致するかチェックする関数
    const matchesQuery = (value, queryValue) => {
      const orValues = queryValue.split(/\s+OR\s+/);
      return orValues.some(v => {
        if (v.startsWith('"') && v.endsWith('"')) {
          return value === v.slice(1, -1);
        }
        if (v.startsWith('-')) {
          return !value.includes(v.slice(1));
        }
        return value.includes(v);
      });
    };

    const parsedQuery = parseQuery(query);

    return cocktails.filter(cocktail => {
      return Object.entries(parsedQuery).every(([key, value]) => {
        const cocktailValue = cocktail[key];
        if (key === 'ingredients') {
          // 材料の検索ロジック
          const cocktailIngredients = cocktail.ingredients.map(i => i.name.toLowerCase());
          const queryIngredients = value.toLowerCase().split(/\s+AND\s+/);
          return queryIngredients.every(qi => {
            return matchesQuery(cocktailIngredients.join(' '), qi) ||
              ingredients.some(i => matchesQuery(i.name.toLowerCase(), qi) &&
                cocktailIngredients.includes(i.name.toLowerCase()));
          });
        } else if (cocktailValue) {
          // その他のキーの検索ロジック
          return matchesQuery(cocktailValue.toLowerCase(), value.toLowerCase());
        }
        return false;
      });
    });
  }
}
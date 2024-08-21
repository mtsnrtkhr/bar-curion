import { Low, Memory } from 'lowdb'
//import jsep from 'jsep';
//import get from 'lodash/get';
//import isArray from 'lodash/isArray';
//import some from 'lodash/some';
import { getAssetPath } from '../app/utils/assetHelpers';
import { searchRecipesAdvanced } from './searchRecipesAdvanced.js';

/*
jsep.addBinaryOp("AND", 2);
jsep.addBinaryOp("OR", 1);
jsep.addUnaryOp("NOT");
*/

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
  const recipeDb = getRecipeDB();
  const cocktails = recipeDb.data.cocktails;
  const ingredientsData = recipeDb.data.ingredients;

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
          ingredientsData.some(ing =>
            matchField(ing.name) &&
            cocktail.ingredients.some(cocktailIng => cocktailIng.id === ing.id)
          );

        return matchAnyField();
      })
    );
  } else {
    // 高度な検索のロジック
    try {
      return await searchRecipesAdvanced(query, recipeDb);
    } catch (error) {
      console.error('Advanced search error:', error);
      return [];
    }
  }
}

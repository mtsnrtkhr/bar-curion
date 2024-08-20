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
    //const parsedQuery = parseQuery(query);
    //return cocktails.filter(cocktail => evaluateQuery(parsedQuery, cocktail, ingredientsData));
  }
}
/* 以下不要
function parseQuery(query) {
  const tokens = tokenize(query);
  return buildAST(tokens);
}

function tokenize(query) {
  const regex = /(-?)(?:(\w+):)?(?:\(([^)]+)\)|"([^"]+)"|(\S+))/g;
  const tokens = [];
  let match;

  while ((match = regex.exec(query)) !== null) {
    const [, exclude, key, groupValue, quotedValue, singleValue] = match;
    if (groupValue) {
      tokens.push({ type: 'openParen', exclude: exclude === '-' });
      tokens.push(...tokenize(groupValue));
      tokens.push({ type: 'closeParen' });
    } else {
      tokens.push({
        type: 'term',
        exclude: exclude === '-',
        key: key || 'any',
        value: quotedValue || singleValue
      });
    }
    if (tokens.length > 0 && tokens[tokens.length - 1].type !== 'openParen') {
      tokens.push({ type: 'AND' });
    }
  }

  if (tokens.length > 0 && tokens[tokens.length - 1].type === 'AND') {
    tokens.pop();
  }

  return tokens;
}

function buildAST(tokens) {
  const ast = { type: 'AND', children: [] };
  let currentNode = ast;
  const stack = [ast];

  for (const token of tokens) {
    if (token.type === 'openParen') {
      const newNode = { type: 'AND', children: [], exclude: token.exclude };
      currentNode.children.push(newNode);
      stack.push(currentNode);
      currentNode = newNode;
    } else if (token.type === 'closeParen') {
      currentNode = stack.pop();
    } else if (token.type === 'AND' || token.type === 'OR') {
      if (currentNode.children.length > 0 && currentNode.type !== token.type) {
        const newNode = { type: token.type, children: [currentNode.children.pop()] };
        currentNode.children.push(newNode);
        currentNode = newNode;
      } else {
        currentNode.type = token.type;
      }
    } else {
      currentNode.children.push(token);
    }
  }

  return ast;
}

function evaluateQuery(ast, cocktail, ingredientsData) {
  switch (ast.type) {
    case 'AND':
      return ast.children.every(child => evaluateQuery(child, cocktail, ingredientsData));
    case 'OR':
      return ast.children.some(child => evaluateQuery(child, cocktail, ingredientsData));
    case 'term':
      const result = evaluateTerm(ast, cocktail, ingredientsData);
      return ast.exclude ? !result : result;
    default:
      throw new Error(`Unsupported node type: ${ast.type}`);
  }
}

function evaluateTerm(term, cocktail, ingredientsData) {
  const { key, value } = term;

  if (key === 'any') {
    return evaluateAnyQuery(value, cocktail, ingredientsData);
  } else if (key === 'ingredients') {
    return evaluateIngredientsQuery(value, cocktail);
  } else if (key === 'ingredientType') {
    return evaluateIngredientTypeQuery(value, cocktail, ingredientsData);
  }

  const fieldValue = get(cocktail, key);
  return matchValue(fieldValue, value);
}

function evaluateIngredientTypeQuery(value, cocktail, ingredientsData) {
  const matchingIngredients = ingredientsData.filter(ing => matchValue(ing.type, value));
  return cocktail.ingredients.some(cocktailIng =>
    matchingIngredients.some(ing => ing.id === cocktailIng.id)
  );
}

function evaluateAnyQuery(value, cocktail, ingredientsData) {
  const searchableFields = ['name', 'category', 'instructions'];
  return searchableFields.some(field => matchValue(cocktail[field], value)) ||
         cocktail.ingredients.some(ing => matchValue(ing.name, value)) ||
         ingredientsData.some(ing =>
           matchValue(ing.name, value) && cocktail.ingredients.some(cocktailIng => cocktailIng.id === ing.id)
         );
}

function evaluateIngredientsQuery(value, cocktail) {
  return cocktail.ingredients.some(ing => matchIngredientValue(ing.name, value));
}

function matchIngredientValue(field, value) {
  if (typeof field !== 'string') return false;

  field = field.toLowerCase();
  value = value.toLowerCase();

  if (value.startsWith('"') && value.endsWith('"')) {
    // 完全一致
    return field === value.slice(1, -1);
  } else if (value.startsWith('*') && value.endsWith('*')) {
    // 中間一致
    return field.includes(value.slice(1, -1));
  } else if (value.startsWith('*')) {
    // 後方一致
    return field.endsWith(value.slice(1));
  } else if (value.endsWith('*')) {
    // 前方一致
    return field.startsWith(value.slice(0, -1));
  }
  // 完全一致（ingredients の場合はデフォルトで完全一致にする）
  return field === value;
}

function matchValue(field, value) {
  if (typeof field !== 'string') return false;

  field = field.toLowerCase();
  value = value.toLowerCase();

  if (value.startsWith('"') && value.endsWith('"')) {
    // 完全一致
    return field === value.slice(1, -1);
  } else if (value.startsWith('*') && value.endsWith('*')) {
    // 中間一致
    return field.includes(value.slice(1, -1));
  } else if (value.startsWith('*')) {
    // 後方一致
    return field.endsWith(value.slice(1));
  } else if (value.endsWith('*')) {
    // 前方一致
    return field.startsWith(value.slice(0, -1));
  }
  // 部分一致（ingredients 以外のフィールドではデフォルトで部分一致）
  return field.includes(value);
}
*/
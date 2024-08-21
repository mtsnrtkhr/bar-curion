import peg from 'pegjs';
import { pegGrammar } from './parser/cocktailQueryGrammar.js';

// パーサーの生成を遅延させる
let parser;

function getParser() {
  if (typeof window === 'undefined') {
    return null; // サーバーサイドでは解析を行わない
  }
  if (!parser) {
    try {
      parser = peg.generate(pegGrammar);
    } catch (error) {
      console.error('Failed to generate parser:', error);
      console.error('PEG Grammar:', pegGrammar);
      return null;
    }
  }
  return parser;
}

export async function searchRecipesAdvanced(query, recipeDb) {
  const cocktails = recipeDb.data.cocktails;
  const ingredientsDB = recipeDb.data.ingredients;

  try {
    console.log('Advanced search query:', query); // デバッグ用ログ
    const parserInstance = getParser();
    if (!parserInstance) {
      throw new Error('Parser is not available');
    }
    const ast = parserInstance.parse(query);
    console.log('Parsed AST:', JSON.stringify(ast, null, 2)); // デバッグ用ログ
    const filter = astToFilter(ast);
    const results = cocktails.filter(cocktail => filter(cocktail, ingredientsDB));
    console.log('Search results:', results.length); // デバッグ用ログ
    return results;
  } catch (error) {
    console.error('Query parsing error:', error);
    return [];
  }
}

function astToFilter(ast) {
  if (!ast) return () => true;

  switch (ast.type) {
    case 'AND':
      return (cocktail, ingredientsDB) =>
        astToFilter(ast.left)(cocktail, ingredientsDB) && astToFilter(ast.right)(cocktail, ingredientsDB);
    case 'OR':
      return (cocktail, ingredientsDB) =>
        astToFilter(ast.left)(cocktail, ingredientsDB) || astToFilter(ast.right)(cocktail, ingredientsDB);
    case 'NOT':
      return (cocktail, ingredientsDB) =>
        !astToFilter(ast.value)(cocktail, ingredientsDB);
    case 'TERM':
      return createTermFilter(ast.key, ast.value);
    default:
      if (typeof ast === 'object' && ast.type) {
        return createTermFilter('any', ast);
      }
      throw new Error(`Unknown AST node type: ${JSON.stringify(ast)}`);
  }
}

function createTermFilter(key, value) {
  if (typeof value === 'object' && (value.type === 'AND' || value.type === 'OR' || value.type === 'NOT')) {
    //この部分は、複合クエリ（AND, OR, NOT）を正しく処理するために重要です。これにより、ingredients:(A OR B) のような複雑なクエリを適切に評価できます。
    return astToFilter({ type: 'TERM', key, value });
  }

  const matchFunc = createMatchFunction(value);

  if (typeof key === 'object' && key.base === 'ingredients') {
    //この部分は、ingredients.subfield のような複合キーを処理するために必要です。例えば、ingredients.alcohol_content:>40 のようなクエリを可能にします。
    return (cocktail, ingredientsDB) =>
      cocktail.ingredients.some(ing => {
        const ingredientData = ingredientsDB.find(i => i.id === ing.id);
        return ingredientData && matchFunc(ingredientData[key.subkey]);
      });
  }

  if (key === 'any') {
    return (cocktail, ingredientsDB) =>
      Object.values(cocktail).some(field => matchFunc(field)) ||
      cocktail.ingredients.some(ing => {
        const ingredientData = ingredientsDB.find(i => i.id === ing.id);
        return matchFunc(ing.name) ||
               (ingredientData && Object.values(ingredientData).some(field => matchFunc(field)));
      });
  } else if (key === 'ingredients') {
    return (cocktail, ingredientsDB) =>
      cocktail.ingredients.some(ing => {
        const ingredientData = ingredientsDB.find(i => i.id === ing.id);
        return matchFunc(ing.name) ||
               (ingredientData && Object.values(ingredientData).some(field => matchFunc(field)));
      });
  } else {
    return cocktail => matchFunc(cocktail[key]);
  }
}

function createMatchFunction(value) {
  if (typeof value === 'object') {
    switch (value.type) {
      case 'OR':
        return field => createMatchFunction(value.left)(field) || createMatchFunction(value.right)(field);
      case 'AND':
        return field => createMatchFunction(value.left)(field) && createMatchFunction(value.right)(field);
      case 'NOT':
        return field => !createMatchFunction(value.value)(field);
      case 'NUMERIC':
        return field => {
          const numField = parseFloat(field);
          if (isNaN(numField)) return false;
          switch (value.operator) {
            case '>': return numField > value.value;
            case '<': return numField < value.value;
            case '>=': return numField >= value.value;
            case '<=': return numField <= value.value;
            case '=': return numField === value.value;
            default: throw new Error(`Unknown numeric operator: ${value.operator}`);
          }
        };
      case 'EXACT':
      case 'STARTS_WITH':
      case 'ENDS_WITH':
      case 'CONTAINS':
      case 'PARTIAL':
        return field => {
          if (typeof field !== 'string') {
            field = String(field);
          }
          const fieldLower = field.toLowerCase();
          const valueLower = value.value.toLowerCase();
          switch (value.type) {
            case 'EXACT': return fieldLower === valueLower;
            case 'STARTS_WITH': return fieldLower.startsWith(valueLower);
            case 'ENDS_WITH': return fieldLower.endsWith(valueLower);
            case 'CONTAINS':
            case 'PARTIAL': return fieldLower.includes(valueLower);
          }
        };
      default:
        throw new Error(`Unknown value type: ${JSON.stringify(value)}`);
    }
  }

  // 文字列の場合（後方互換性のため）
  return field => {
    if (typeof field !== 'string') {
      field = String(field);
    }
    return field.toLowerCase().includes(value.toLowerCase());
  };
}
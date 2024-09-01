'use client'

import searchQuery from 'search-query-parser';
import { JSONPath } from 'jsonpath-plus';

function mergeRecipesAndIngredients(recipes, ingredients) {
  return recipes.map(recipe => ({
    ...recipe,
    ingredients: recipe.ingredients.map(ing => ({
      ...ing,
      ...ingredients.find(i => i.id === ing.id)
    }))
  }));
}


function parseQuery(query) {
  const options = {
    keywords: ['ingredients', 'name', 'ingredients.name', 'ingredients.type', 'ingredients.amount', "instructions", 'category'],
    ranges: ['alcohol_content'],
    alwaysArray: true,
    offsets: false
  };

  const parsed = searchQuery.parse(query, options);
  //console.log("parsed:", parsed)
  // カスタム処理を追加
  if (parsed.offsets) {
    parsed.offsets.forEach(offset => {
      if (offset.keyword === 'ingredients' && offset.value.includes(' OR ')) {
        offset.value = offset.value.replace(/^\(|\)$/g, '').split(' OR ').map(v => v.trim());
      }
    });
  }

  return parsed;
}

function buildJsonPathQuery(parsed) {
  let conditions = [];

  function buildCondition(key, values, isExclude = false) {
    //console.log("values in func:",values)
    let fieldConditions = []

    if (key == "alcohl_contents"){
      //大小比較の処理
    }else{
      //ネストしている場合で、キーの指定がない場合と、ネストしていない場合で異なる
      if (key == 'ingredients') {
        fieldConditions = values.map(value => {
          let matchExpression;
          if (value.startsWith('*') && value.endsWith('*')) {
            matchExpression = `val.toString().match(/${value.slice(1, -1)}/i)`;
          } else if (value.startsWith('*')) {
            matchExpression = `val.toString().match(/${value.slice(1)}$/i)`;
          } else if (value.endsWith('*')) {
            matchExpression = `val.toString().match(/^${value.slice(0, -1)}/i)`;
          } else {
            matchExpression = `val.toString() == "${value}"`;
          }
          return matchExpression;
        });
            //valusesは配列なので、keyに対して複数の値がある場合はorで結合する
        const condition = fieldConditions.join(' || ');

        return isExclude
          // Next.jsで実行すると、jsonpath-plusのindex-browser-ems.jsのjsepパーサーで{}がエラーになる
          ? `!@.${key}.some(function($i){return (Object.values($i).some(function(val) { return (${condition}) }))})`
          : `@.${key}.some(function($i){return (Object.values($i).some(function(val) { return (${condition}) }))})`;

          /* Next.jsで実行すると、jsonpath-plusのindex-browser-ems.jsのjsepパーサーで => がエラーになる
          ? `!@.${key}.some($i => Object.values($i).some(val => (${condition}) ))`
          : `@.${key}.some($i => Object.values($i).some(val => (${condition}) ))`;
          */

      } else if  (key.startsWith('ingredients.')) {
        const subKey = key.split('.')[1];

        fieldConditions = values.map(value => {
          let matchExpression;
          if (value.startsWith('*') && value.endsWith('*')) {
            matchExpression = `$i.${subKey}.match(/${value.slice(1, -1)}/i)`;
          } else if (value.startsWith('*')) {
            matchExpression = `$i.${subKey}.match(/${value.slice(1)}$/i)`;
          } else if (value.endsWith('*')) {
            matchExpression = `$i.${subKey}.match(/^${value.slice(0, -1)}/i)`;
          } else {
            matchExpression = `$i.${subKey} == "${value}"`;
          }
          return matchExpression;
        });
            //valusesは配列なので、keyに対して複数の値がある場合はorで結合する
        const condition = fieldConditions.join(' || ');
        return isExclude
          ? `!@.ingredients.some(function($i){ return (${condition}) })`
          : `@.ingredients.some(function($i){ return (${condition}) })`;
      } else {
        fieldConditions = values.map(value => {
          let matchExpression;
          if (value.startsWith('*') && value.endsWith('*')) {
            matchExpression = `@.${key}.match(/${value.slice(1, -1)}/i)`;
          } else if (value.startsWith('*')) {
            matchExpression = `@.${key}.match(/${value.slice(1)}$/i)`;
          } else if (value.endsWith('*')) {
            matchExpression = `@.${key}.match(/^${value.slice(0, -1)}/i)`;
          } else {
            matchExpression = `@.${key} == "${value}"`;
          }
          return matchExpression;
        });
            //valusesは配列なので、keyに対して複数の値がある場合はorで結合する
        const condition = fieldConditions.join(' || ');

        return isExclude
          ? `!(${condition})`
          : `(${condition})`;
      }
    }

  }

  // Handle include conditions
  Object.entries(parsed).forEach(([key, values]) => {
    console.log("key:",key)
    console.log("values:",values, Array.isArray(values))
    let isExclude = false;
    if (key === 'exclude') {
      if(Object.keys(values).length !== 0){
        isExclude = true;
        key = Object.keys(values)[0];
        values = values[key];
        console.log("key:",key);
        console.log("values:",values);
        conditions.push(`${buildCondition(key, values, isExclude)}`);
      }
    }else{
      conditions.push(`${buildCondition(key, values, isExclude)}`);
    }
  });

  return conditions.length > 0 ? `$[?(${conditions.join(' && ')})]` : '$[*]';
}

export async function searchRecipesAdvanced(query, recipeDb) {
  const cocktails = recipeDb.data.cocktails
  const ingredients = recipeDb.data.ingredients
  const parsed = parseQuery(query);
  const jsonPathQuery = buildJsonPathQuery(parsed);
  console.log('JsonPath Query:', jsonPathQuery);
  const results = JSONPath({ path: jsonPathQuery, json: cocktails, eval: 'native' });
  // 結果からIDのリストを抽出
  const idList = results.map(recipe => recipe.id);
  return idList;
}
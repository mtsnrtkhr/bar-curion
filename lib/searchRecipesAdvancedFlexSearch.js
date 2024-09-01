import FlexSearch from 'flexsearch'

let index = null

function createIndex(cocktails, ingredients) {
  index = new FlexSearch.Document({

    document: {
      id: "id",

      index: [
        "name",
        "category",
        "instructions",
        "ingredients[]:name",
        "ingredients[]:type",
        "ingredients[]:alcohol_content",
      ],
    },
    charset: "ckj:default",//"latin:extra",
    //language: "ja",
    //encode:
    tokenize: "reverse",
    resolution: 9,
  });



  cocktails.forEach((cocktail) => {
    const cocktailIngredients = cocktail.ingredients.map((ing) => {
      const ingredient = ingredients.find((i) => i.id === ing.id);
      if (ingredient) {
        return {
          name: ingredient.name,
          type: ingredient.type,
          alcohol_content: ingredient.alcohol_content,
        };
      } else {
        return {
          name: ing.name || "N/A",
          type: ing.type || "N/A",
          alcohol_content: ing.alcohol_content || "N/A",
        };
      }
    });

    const indexDoc = {
      id: cocktail.id,
      name: cocktail.name,
      category: cocktail.category,
      instructions:cocktail.instructions,
      ingredients: cocktailIngredients,
    };
    console.log("indexDoc:", indexDoc);
    index.add(indexDoc);
  });

  /*
  index.add({id:0,name:"matini",category:"classic",ingredients:[{name:"gin", type:"spirits", alcohol_content:18}]})
  index.add({id:1,name:"glass hopper",category:"classic", ingredients:[{name:"amarett", type:"spirit", alcohol_content:40},{name:"oishii wine", type:"wine", alcohol_content:18} ]})
  index.add({id:2,name:"matini glass hopper",category:"original"})
  index.add({id:3,name:"mマatini",category:"クラシック",ingredients:[{name:"gin", type:"spirits", alcohol_content:18}]})

  if(index.contain(1)){
    console.log("ID is already in index");
    console.log("index:", index)
  }else{
    console.log("index.contain:", index.contain(0))
  }
  */
}


function searchIndex(query) {
  if (query.includes(':')) {
    //
    const [field, queryTerm] = query.split(':').map(part => part.trim());
    console.log("field:",field,"queryTerm:", queryTerm)

    // フィールド名を変換
    const convertedField = field.replace(/\./g, '[]:');

    // クエリ
    const results = index.search({
      field: convertedField,
      query: queryTerm.replace(/^"|"$/g, '') // クォーテーションを削除

    })
    console.log("convertedField:",convertedField,"queryTerm:", queryTerm.replace(/^"|"$/g, '') )
    return results

  } else {
    const results =index.search(query.replace(/^"|"$/g, ''))
    return results;
  };
}

export async function searchRecipesAdvanced(query, recipeDb) {
  const cocktails = recipeDb.data.cocktails
  const ingredients = recipeDb.data.ingredients

  // index変数がnullの場合のみ、createIndex関数を呼び出してindexを作成する
  if (!index) {
    createIndex(cocktails, ingredients)
  }

  const results = searchIndex(query)
  console.log("results:", results)
  /*
  console.log("search query result for matini:", index.search("matini"))
  console.log("search query result for glass:", index.search("glass mat"))
  console.log("search query result for glass hopper:", index.search("glass hopper"))
  console.log("search query result for ingredients:alcohol_content:18:", index.search([{field:"ingredients[]:alcohol_content",query:18}]))
  console.log("search query result for ingredients[]:name:gin", index.search([{field:"ingredients[]:name",query:"gin"}]))
  console.log("search query result for ingredients[]:name:gin, oishii", index.search([{field:"ingredients[]:name",query:"gin"},{field:"ingredients[]:name", query:"oishii"}]))
  console.log("search query result for クラシック", index.search("クラシック"))
  console.log("search query result for classic", index.search("classic"))
  */

  const recipeIds = new Set(
    //結果からidだけ取り出す
    results.flatMap(result => result.result)
  );
  return recipeIds
}
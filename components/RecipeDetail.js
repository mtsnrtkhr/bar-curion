export default function RecipeDetail({ recipe }) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
         <div className="mb-4 relative h-48">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.name}
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-4">{recipe.name}</h2>
        <p className="text-gray-600 mb-4">カテゴリー: {recipe.category}</p>
        <h3 className="text-xl font-semibold mb-2">材料:</h3>
        <ul className="list-disc pl-5 mb-4">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.name}: {ingredient.amount}
            </li>
          ))}
        </ul>
        <h3 className="text-xl font-semibold mb-2">作り方:</h3>
        <p className="whitespace-pre-line">{recipe.instructions}</p>
      </div>
    )
  }
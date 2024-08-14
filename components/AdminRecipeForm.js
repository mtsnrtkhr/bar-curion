// components/AdminRecipeForm.js
import { useState, useEffect } from 'react'
import Image from 'next/image'
import imageCompression from 'browser-image-compression';

export default function AdminRecipeForm({ initialRecipe, onSubmit }) {
  const [recipe, setRecipe] = useState(initialRecipe || {
    name: '',
    category: '',
    ingredients: [{ name: '', amount: '' }],
    instructions: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialRecipe && initialRecipe.image) {
      setImagePreview(`/images/recipes/${initialRecipe.image}`)
    }
  }, [initialRecipe]);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value })
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // 画像の圧縮
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setRecipe({ ...recipe, image: reader.result });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleIngredientChange = (index, e) => {
    const newIngredients = recipe.ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [e.target.name]: e.target.value }
      }
      return ingredient
    })
    setRecipe({ ...recipe, ingredients: newIngredients })
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', amount: '' }]
    })
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index)
    setRecipe({ ...recipe, ingredients: newIngredients })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in recipe) {
      if (key === 'ingredients') {
        formData.append(key, JSON.stringify(recipe[key]));
      } else if (key === 'image' && recipe[key]) {
        // Base64 データを Blob に変換
        const blob = await fetch(recipe[key]).then(r => r.blob());
        formData.append('image', blob, 'image.jpg');
      } else {
        formData.append(key, recipe[key]);
      }
    }
    formData.append('uploadedBy', currentUser);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">レシピ名:</label>
        <input
          type="text"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block">カテゴリー:</label>
        <input
          type="text"
          name="category"
          value={recipe.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block">材料:</label>
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              name="name"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, e)}
              placeholder="材料名"
              className="flex-1 p-2 border rounded"
            />
            <input
              type="text"
              name="amount"
              value={ingredient.amount}
              onChange={(e) => handleIngredientChange(index, e)}
              placeholder="量"
              className="w-1/3 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="text-red-500"
            >
              削除
            </button>
          </div>
        ))}
        <button type="button" onClick={addIngredient} className="text-blue-500">
          + 材料を追加
        </button>
      </div>
      <div>
        <label className="block">作り方:</label>
        <textarea
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="4"
        ></textarea>
      </div>
      <div>
        <label className="block">レシピ画像:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
        {imagePreview && (
          <div className="mt-2">
            <Image src={imagePreview} alt="Recipe preview" width={200} height={200} objectFit="cover" />
          </div>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? '送信中...' : (initialRecipe ? 'レシピを更新' : 'レシピを作成')}
      </button>
    </form>
  )
}
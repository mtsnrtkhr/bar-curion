'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import Image from 'next/image'
import imageCompression from 'browser-image-compression';
import { Recipe } from '../types'; // Recipeタイプをインポート
import { getAssetPath } from '../../../utils/assetHelpers';

type AdminRecipeFormProps = {
  initialRecipe?: Recipe;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function AdminRecipeForm({ initialRecipe, onSubmit, isSubmitting}: AdminRecipeFormProps) {
  const [recipe, setRecipe] = useState<Recipe>(() => ({
    id: initialRecipe?.id || '',
    name: initialRecipe?.name || '',
    category: initialRecipe?.category || '',
    ingredients: initialRecipe?.ingredients || [{ name: '', amount: '' }],
    instructions: initialRecipe?.instructions || '',
    image: initialRecipe?.image || null
  }));
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialRecipe && initialRecipe.image) {
      setImagePreview(getAssetPath(`/images/recipes/${initialRecipe.image}`))
    }
  }, [initialRecipe]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value })
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImagePreview(result);
          setRecipe({ ...recipe, image: result });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleIngredientChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newIngredients = recipe.ingredients?.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [e.target.name]: e.target.value }
      }
      return ingredient
    }) || [];
    setRecipe({ ...recipe, ingredients: newIngredients })
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...(recipe.ingredients || []), { name: '', amount: '' }]
    })
  };

  const removeIngredient = (index: number) => {
    const newIngredients = recipe.ingredients?.filter((_, i) => i !== index) || [];
    setRecipe({ ...recipe, ingredients: newIngredients })
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    // recipe の各プロパティを明示的に処理
    if (recipe.id) formData.append('id', recipe.id);
    if (recipe.name) formData.append('name', recipe.name);
    if (recipe.category) formData.append('category', recipe.category);
    if (recipe.instructions) formData.append('instructions', recipe.instructions);

    // ingredients の処理
    if (recipe.ingredients) {
      formData.append('ingredients', JSON.stringify(recipe.ingredients));
    }

    // image の処理
    if (recipe.image) {
      try {
        // Base64 データを Blob に変換
        const blob = await fetch(recipe.image).then(r => r.blob());
        formData.append('image', blob, 'image.jpg');
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

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
          rows={4}
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
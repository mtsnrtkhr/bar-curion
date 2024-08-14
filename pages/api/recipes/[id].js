import { getRecipes, updateRecipes, uploadImage, getImageMetadata, updateImageMetadata } from '../../../lib/github';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const recipes = await getRecipes();
      const recipe = recipes.cocktails.find(r => r.id.toString() === id);
      if (recipe) {
        res.status(200).json(recipe);
      } else {
        res.status(404).json({ error: 'Recipe not found' });
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({ error: 'Failed to fetch recipe' });
    }
  } else if (req.method === 'PUT') {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Form parsing failed' });
        return;
      }

      try {
        const recipes = await getRecipes();
        const index = recipes.cocktails.findIndex(r => r.id.toString() === id);
        if (index === -1) {
          res.status(404).json({ error: 'Recipe not found' });
          return;
        }

        const updatedRecipe = {
          ...recipes.cocktails[index],
          name: fields.name,
          category: fields.category,
          ingredients: JSON.parse(fields.ingredients),
          instructions: fields.instructions,
        };

        // 画像の処理
        if (files.image) {
          const imageBuffer = await fs.readFile(files.image.path);
          const imageMetadata = {
            title: updatedRecipe.name,
            uploadDate: new Date().toISOString(),
            fileSize: files.image.size,
            width: 1200, // これは実際の画像サイズに応じて調整する必要があります
            height: 800, // これは実際の画像サイズに応じて調整する必要があります
            recipeId: updatedRecipe.id,
            uploadedBy: fields.uploadedBy
          };

          // 古い画像がある場合は削除
          if (updatedRecipe.image) {
            await deleteImage(updatedRecipe.image);
          }

          const uploadedImage = await uploadImage(imageBuffer, imageMetadata);
          updatedRecipe.image = uploadedImage.path;
        }

        recipes.cocktails[index] = updatedRecipe;
        await updateRecipes(recipes);

        res.status(200).json(updatedRecipe);
      } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'Failed to update recipe' });
      }
    });
  } else if (req.method === 'DELETE') {
    try {
      const recipes = await getRecipes();
      const index = recipes.cocktails.findIndex(r => r.id.toString() === id);
      if (index === -1) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }

      const deletedRecipe = recipes.cocktails[index];

      // 関連する画像を削除
      if (deletedRecipe.image) {
        await deleteImage(deletedRecipe.image);
      }

      recipes.cocktails.splice(index, 1);
      await updateRecipes(recipes);

      res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      res.status(500).json({ error: 'Failed to delete recipe' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
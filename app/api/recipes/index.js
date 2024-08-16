import { getRecipes, updateRecipes, uploadImage, getImageMetadata, updateImageMetadata } from '../../../lib/github';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const recipes = await getRecipes();
      res.status(200).json(recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ error: 'Failed to fetch recipes' });
    }
  } else if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Form parsing failed' });
        return;
      }

      try {
        const recipes = await getRecipes();
        const newRecipe = {
          id: recipes.cocktails.length + 1,
          name: fields.name,
          category: fields.category,
          ingredients: JSON.parse(fields.ingredients),
          instructions: fields.instructions,
        };

        if (files.image) {
          const imageBuffer = await fs.readFile(files.image.path);
          const imageMetadata = {
            title: newRecipe.name,
            uploadDate: new Date().toISOString(),
            fileSize: files.image.size,
            width: 1200, // これは実際の画像サイズに応じて調整する必要があります
            height: 800, // これは実際の画像サイズに応じて調整する必要があります
            recipeId: newRecipe.id,
            uploadedBy: fields.uploadedBy
          };
          const uploadedImage = await uploadImage(imageBuffer, imageMetadata);
          newRecipe.image = uploadedImage.path;
        }

        recipes.cocktails.push(newRecipe);
        await updateRecipes(recipes);

        res.status(201).json(newRecipe);
      } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ error: 'Failed to create recipe' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
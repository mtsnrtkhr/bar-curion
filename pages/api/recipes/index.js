import { getRecipes, updateRecipes, uploadImage } from '../../../lib/github';
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
          const imageName = `${newRecipe.id}-${files.image.name}`;
          const imageBuffer = await fs.readFile(files.image.path);
          await uploadImage(imageName, imageBuffer);
          newRecipe.image = imageName;
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
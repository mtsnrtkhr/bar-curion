import { getRecipes, updateRecipes, uploadImage } from '../../../lib/github';
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

        if (files.image) {
          const imageName = `${id}-${files.image.name}`;
          const imageBuffer = await fs.readFile(files.image.path);
          await uploadImage(imageName, imageBuffer);
          updatedRecipe.image = imageName;
        }

        recipes.cocktails[index] = updatedRecipe;
        await updateRecipes(recipes);

        res.status(200).json(updatedRecipe);
      } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'Failed to update recipe' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
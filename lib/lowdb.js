import { Low, Memory } from 'lowdb'

let db = null;

export async function initDB() {
  if (!db) {
    const defaultData = { cocktails: [], ingredients: [] }
    const adapter = new Memory()
    db = new Low(adapter, {})
    await db.read()
    db.data ||= { cocktails: [], ingredients: [] }
  }
  return db
}

export async function getRecipes() {
  const db = await initDB()
  return db.data.cocktails
}

export async function getRecipeById(id) {
  const db = await initDB()
  return db.data.cocktails.find(recipe => recipe.id === parseInt(id))
}

export async function addRecipe(recipe) {
  const db = await initDB()
  const newId = db.data.cocktails.length > 0 ? Math.max(...db.data.cocktails.map(r => r.id)) + 1 : 1
  const newRecipe = { ...recipe, id: newId }
  db.data.cocktails.push(newRecipe)
  await db.write()
  return newRecipe
}

export async function updateRecipe(id, updatedRecipe) {
  const db = await initDB()
  const index = db.data.cocktails.findIndex(recipe => recipe.id === parseInt(id))
  if (index !== -1) {
    db.data.cocktails[index] = { ...db.data.cocktails[index], ...updatedRecipe }
    await db.write()
    return db.data.cocktails[index]
  }
  return null
}

export async function deleteRecipe(id) {
  const db = await initDB()
  const initialLength = db.data.cocktails.length
  db.data.cocktails = db.data.cocktails.filter(recipe => recipe.id !== parseInt(id))
  if (db.data.cocktails.length < initialLength) {
    await db.write()
    return true
  }
  return false
}
import type { RecipesResponse } from './types'

const RECIPES_URL = 'https://dummyjson.com/recipes?limit=30'

export async function fetchRecipes(): Promise<RecipesResponse> {
  const response = await fetch(RECIPES_URL)

  if (!response.ok) {
    throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as RecipesResponse
}

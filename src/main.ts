import './style.css'
import { fetchRecipes } from './api'
import type { Recipe } from './types'

const recipeGrid = getElement<HTMLDivElement>('#recipe-grid')
const recipeControls = getElement<HTMLFormElement>('#recipe-controls')
const loadingState = getElement<HTMLDivElement>('#loading-state')
const errorState = getElement<HTMLDivElement>('#error-state')
const errorMessage = getElement<HTMLParagraphElement>('#error-message')
const searchInput = getElement<HTMLInputElement>('#recipe-search')
const difficultyFilter = getElement<HTMLSelectElement>('#difficulty-filter')
const sortSelect = getElement<HTMLSelectElement>('#sort-recipes')
const themeToggle = getElement<HTMLButtonElement>('#theme-toggle')
const recipeDialog = getElement<HTMLDialogElement>('#recipe-dialog')
const dialogContent = getElement<HTMLDivElement>('#dialog-content')
const resultsSummary = getElement<HTMLParagraphElement>('#results-summary')

let recipes: Recipe[] = []

function getElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) {
    throw new Error(`Required page element not found: ${selector}`)
  }

  return element
}

function createTextElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag)
  element.className = className
  element.textContent = text
  return element
}

function renderRecipeCard(recipe: Recipe): HTMLElement {
  const article = document.createElement('article')
  article.className = 'recipe-card'

  const image = document.createElement('img')
  image.className = 'recipe-card__image'
  image.src = recipe.image
  image.alt = `Страва: ${recipe.name}`
  image.loading = 'lazy'

  const content = document.createElement('div')
  content.className = 'recipe-card__content'
  content.append(
    createTextElement('h3', 'recipe-card__title', recipe.name),
    createTextElement(
      'p',
      'recipe-card__meta',
      `${recipe.cuisine} · ${recipe.difficulty} · ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} хв`,
    ),
    createTextElement(
      'p',
      'recipe-card__rating',
      `★ ${recipe.rating.toFixed(1)} · ${recipe.reviewCount} відгуків`,
    ),
  )

  const viewButton = document.createElement('button')
  viewButton.className = 'button button--text'
  viewButton.type = 'button'
  viewButton.textContent = 'Переглянути рецепт'
  viewButton.setAttribute('aria-label', `Переглянути рецепт: ${recipe.name}`)
  viewButton.addEventListener('click', () => showRecipeDetails(recipe))
  content.append(viewButton)

  article.append(image, content)
  return article
}

function showRecipeDetails(recipe: Recipe): void {
  dialogContent.replaceChildren()
  dialogContent.append(
    createTextElement('p', 'recipe-dialog__meta', `${recipe.cuisine} · ${recipe.difficulty}`),
    createTextElement('p', 'recipe-dialog__meta', `Порції: ${recipe.servings}`),
    createTextElement(
      'p',
      'recipe-dialog__meta',
      `Підготовка: ${recipe.prepTimeMinutes} хв · Приготування: ${recipe.cookTimeMinutes} хв`,
    ),
    createTextElement('h3', 'recipe-dialog__heading', 'Інгредієнти'),
  )

  const ingredients = document.createElement('ul')
  recipe.ingredients.forEach((ingredient) => {
    ingredients.append(createTextElement('li', '', ingredient))
  })
  dialogContent.append(ingredients, createTextElement('h3', 'recipe-dialog__heading', 'Приготування'))

  const instructions = document.createElement('ol')
  recipe.instructions.forEach((instruction) => {
    instructions.append(createTextElement('li', '', instruction))
  })
  dialogContent.append(
    instructions,
    createTextElement('p', 'recipe-dialog__meta', `Калорій на порцію: ${recipe.caloriesPerServing} ккал`),
  )

  getElement<HTMLHeadingElement>('#dialog-title').textContent = recipe.name
  recipeDialog.showModal()
}

function renderRecipes(): void {
  const query = searchInput.value.trim().toLocaleLowerCase('uk')
  const selectedDifficulty = difficultyFilter.value
  const visibleRecipes = recipes
    .filter((recipe) => recipe.name.toLocaleLowerCase('uk').includes(query))
    .filter((recipe) => !selectedDifficulty || recipe.difficulty === selectedDifficulty)

  switch (sortSelect.value) {
    case 'rating':
      visibleRecipes.sort((a, b) => b.rating - a.rating)
      break
    case 'name':
      visibleRecipes.sort((a, b) => a.name.localeCompare(b.name, 'uk'))
      break
    case 'prep-time':
      visibleRecipes.sort(
        (a, b) =>
          a.prepTimeMinutes + a.cookTimeMinutes - (b.prepTimeMinutes + b.cookTimeMinutes),
      )
      break
  }

  recipeGrid.replaceChildren(...visibleRecipes.map(renderRecipeCard))
  const count = visibleRecipes.length
  resultsSummary.textContent = count
    ? `Знайдено рецептів: ${count}`
    : 'За вашим запитом рецептів не знайдено.'
}

async function loadRecipes(): Promise<void> {
  loadingState.hidden = false
  errorState.hidden = true
  recipeGrid.setAttribute('aria-busy', 'true')

  try {
    const response = await fetchRecipes()
    recipes = response.recipes
    renderRecipes()
  } catch (error) {
    console.error('Failed to load recipes:', error)
    errorMessage.textContent =
      'Не вдалося завантажити рецепти. Перевірте з’єднання з інтернетом і спробуйте ще раз.'
    errorState.hidden = false
    resultsSummary.textContent = ''
  } finally {
    loadingState.hidden = true
    recipeGrid.setAttribute('aria-busy', 'false')
  }
}

function updateThemeToggle(isDark: boolean): void {
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
  themeToggle.textContent = isDark ? 'Світла тема' : 'Темна тема'
  themeToggle.setAttribute('aria-pressed', String(isDark))
}

recipeControls.addEventListener('submit', (event) => {
  event.preventDefault()
})
searchInput.addEventListener('input', renderRecipes)
difficultyFilter.addEventListener('change', renderRecipes)
sortSelect.addEventListener('change', renderRecipes)

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme !== 'dark'
  updateThemeToggle(isDark)
})

getElement<HTMLButtonElement>('#retry-button').addEventListener('click', () => {
  void loadRecipes()
})

getElement<HTMLButtonElement>('#dialog-close').addEventListener('click', () => {
  recipeDialog.close()
})

recipeDialog.addEventListener('click', (event) => {
  if (event.target === recipeDialog) {
    recipeDialog.close()
  }
})

updateThemeToggle(window.matchMedia('(prefers-color-scheme: dark)').matches)
void loadRecipes()

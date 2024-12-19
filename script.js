const form = document.getElementById('recipe-form');
const searchBar = document.getElementById('search-bar');
const recipesContainer = document.getElementById('recipes-container');

// Modal elements
const modal = document.getElementById('recipe-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalIngredients = document.getElementById('modal-ingredients');
const modalSteps = document.getElementById('modal-steps');
const closeModal = document.getElementById('close-modal');

// Retrieve stored recipes from localStorage
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

// Function to render recipes
function renderRecipes(filteredRecipes = recipes) {
    recipesContainer.innerHTML = '';
    filteredRecipes.forEach((recipe, index) => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
            <button class="view-recipe" data-index="${index}">View Details</button>
        `;
        recipesContainer.appendChild(recipeCard);
    });

    // Attach event listeners for "View Details" buttons
    document.querySelectorAll('.view-recipe').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            showRecipeModal(index);
        });
    });
}

// Add recipe
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('recipe-name').value;
    const ingredients = document.getElementById('recipe-ingredients').value.split(',');
    const steps = document.getElementById('recipe-steps').value;
    const image = document.getElementById('recipe-image').files[0];

    const reader = new FileReader();
    reader.onload = () => {
        const newRecipe = {
            name,
            ingredients,
            steps,
            image: reader.result
        };
        recipes.push(newRecipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        renderRecipes();
        form.reset();
    };

    if (image) {
        reader.readAsDataURL(image);
    }
});

// Show modal with recipe details
function showRecipeModal(index) {
    const recipe = recipes[index];
    modalImage.src = recipe.image;
    modalTitle.textContent = recipe.name;
    modalIngredients.innerHTML = recipe.ingredients
        .map(ingredient => `<li>${ingredient}</li>`)
        .join('');
    modalSteps.textContent = recipe.steps;

    modal.classList.add('visible');
}

// Close modal
closeModal.addEventListener('click', () => {
    modal.classList.remove('visible');
});

// Search functionality
searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
    );
    renderRecipes(filteredRecipes);
});

// Initial render
renderRecipes();


// Show modal with recipe details
function showRecipeModal(index) {
    const recipe = recipes[index];
    modalImage.src = recipe.image;
    modalTitle.textContent = recipe.name;
    modalIngredients.innerHTML = recipe.ingredients
        .map(ingredient => `<li>${ingredient}</li>`)
        .join('');
    modalSteps.textContent = recipe.steps;

    modal.classList.add('visible');
    document.body.classList.add('modal-open'); // Disable background scrolling
}

// Close modal
function closeRecipeModal() {
    modal.classList.remove('visible');
    document.body.classList.remove('modal-open'); // Re-enable background scrolling
}

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeRecipeModal();
    }
});

// Close modal when pressing the Esc key
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('visible')) {
        closeRecipeModal();
    }
});

// Close modal button functionality
closeModal.addEventListener('click', closeRecipeModal);

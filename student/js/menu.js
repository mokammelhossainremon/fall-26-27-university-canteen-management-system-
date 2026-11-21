const foodGrid = document.getElementById("foodGrid");
const foodSearch = document.getElementById("foodSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const noFoodMessage = document.getElementById("noFoodMessage");
let selectedCategory = "All";

function getFoodEmoji(category) {
    if (category === "Breakfast") return "🥪";
    if (category === "Lunch") return "🍛";
    if (category === "Snacks") return "🍔";
    return "☕";
}

function displayFoods() {
    const searchValue = foodSearch.value.toLowerCase().trim();
    const filteredFoods = foodItems.filter(function(food) {
        const matchesName = food.name.toLowerCase().includes(searchValue);
        const matchesCategory = selectedCategory === "All" || food.category === selectedCategory;
        return matchesName && matchesCategory;
    });

    foodGrid.innerHTML = "";
    noFoodMessage.hidden = filteredFoods.length !== 0;

    for (const food of filteredFoods) {
        const card = document.createElement("article");
        card.className = "food-card";
        const availabilityClass = food.available ? "available" : "unavailable";
        const availabilityText = food.available ? "Available" : "Not Available";
        card.innerHTML = `<div class="food-card-top"><span class="food-emoji">${getFoodEmoji(food.category)}</span><span class="availability status ${availabilityClass}">${availabilityText}</span></div><div class="food-card-body"><span class="category-label">${food.category}</span><h3>${food.name}</h3><p>Freshly prepared at the university canteen</p><span class="food-price">৳${food.price}</span></div>`;
        foodGrid.appendChild(card);
    }
}

filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        for (const item of filterButtons) {
            item.classList.remove("active");
        }
        button.classList.add("active");
        selectedCategory = button.dataset.category;
        displayFoods();
    });
});

foodSearch.addEventListener("input", displayFoods);
displayFoods();

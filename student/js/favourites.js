const favouriteForm = document.getElementById("favouriteForm");
const favouriteId = document.getElementById("favouriteId");
const favouriteFoodName = document.getElementById("favouriteFoodName");
const favouriteCategory = document.getElementById("favouriteCategory");
const favouritePrice = document.getElementById("favouritePrice");
const favouriteSearch = document.getElementById("favouriteSearch");
const favouriteTable = document.getElementById("favouriteTable");
const favouriteEmpty = document.getElementById("favouriteEmpty");
const favouriteSubmit = document.getElementById("favouriteSubmit");
const cancelFavourite = document.getElementById("cancelFavourite");
const favouriteFormTitle = document.getElementById("favouriteFormTitle");

function displayFavourites() {
    const searchValue = favouriteSearch.value.toLowerCase().trim();
    const filteredFoods = favouriteFoods.filter(function(food) {
        return food.name.toLowerCase().includes(searchValue) || food.category.toLowerCase().includes(searchValue);
    });

    favouriteTable.innerHTML = "";
    favouriteEmpty.hidden = filteredFoods.length !== 0;

    for (const food of filteredFoods) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${food.name}</td><td>${food.category}</td><td>৳${food.price}</td><td><div class="action-group"><button class="btn-small edit-favourite" data-id="${food.id}">Edit</button><button class="btn-small delete delete-favourite" data-id="${food.id}">Delete</button></div></td>`;
        favouriteTable.appendChild(row);
    }
}

function resetFavouriteForm() {
    favouriteForm.reset();
    favouriteId.value = "";
    favouriteSubmit.textContent = "Add Favourite";
    favouriteFormTitle.textContent = "Add Favourite Food";
    cancelFavourite.hidden = true;
}

function editFavourite(id) {
    const food = favouriteFoods.find(function(item) {
        return item.id === Number(id);
    });

    if (food) {
        favouriteId.value = food.id;
        favouriteFoodName.value = food.name;
        favouriteCategory.value = food.category;
        favouritePrice.value = food.price;
        favouriteSubmit.textContent = "Update Favourite";
        favouriteFormTitle.textContent = "Update Favourite Food";
    }
    cancelFavourite.hidden = false;
}

favouriteForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = favouriteFoodName.value.trim();
    const category = favouriteCategory.value;
    const price = Number(favouritePrice.value);

    if (name.length < 2 || !category || !Number.isFinite(price) || price <= 0 || price > 10000) {
        alert("Enter valid favourite food information.");
        return;
    }

    if (favouriteId.value === "") {
        favouriteFoods.push({ id: Date.now(), name: name, category: category, price: price });
        alert("Food added to your favourite list.");
    } else {
        const food = favouriteFoods.find(function(item) {
            return item.id === Number(favouriteId.value);
        });

        if (food) {
            food.name = name;
            food.category = category;
            food.price = price;
        }
        alert("Favourite food updated.");
    }

    resetFavouriteForm();
    displayFavourites();
});

favouriteTable.addEventListener("click", function(event) {
    const id = event.target.dataset.id;

    if (event.target.classList.contains("edit-favourite")) {
        editFavourite(id);
    } else if (event.target.classList.contains("delete-favourite")) {
        if (confirm("Remove this food from favourites?")) {
            favouriteFoods = favouriteFoods.filter(function(food) {
                return food.id !== Number(id);
            });
            displayFavourites();
        }
    }
});

cancelFavourite.addEventListener("click", resetFavouriteForm);
favouriteSearch.addEventListener("input", displayFavourites);
displayFavourites();

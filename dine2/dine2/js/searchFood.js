let foodItems = [
    {
        name: "Chicken Burger",
        category: "Fast Food",
        price: 80,
        availability: "Available"
    },
    {
        name: "Pizza",
        category: "Fast Food",
        price: 200,
        availability: "Available"
    },
    {
        name: "French Fries",
        category: "Snacks",
        price: 100,
        availability: "Available"
    },
    {
        name: "Tea",
        category: "Drinks",
        price: 20,
        availability: "Available"
    },
    {
        name: "Fried Rice",
        category: "Rice Items",
        price: 150,
        availability: "Unavailable"
    }
];


function searchFood() {

    let foodname = document.getElementById("foodname").value.trim();
    let category = document.getElementById("category").value;
    let minprice = document.getElementById("minprice").value;
    let maxprice = document.getElementById("maxprice").value;

    let availability = document.querySelector(
        'input[name="availability"]:checked'
    ).value;

    let found = false;
    let results = "";

    // Validate price range
    if (minprice !== "" && maxprice !== "" &&
        Number(minprice) > Number(maxprice)) {

        alert("Minimum price cannot be greater than maximum price.");
        return false;
    }

    // Search food items
    for (let i = 0; i < foodItems.length; i++) {

        let matchesName =
            foodItems[i].name.toLowerCase().indexOf(foodname.toLowerCase()) !== -1;

        let matchesCategory =
            (category === "All" || foodItems[i].category === category);

        let matchesMinPrice =
            (minprice === "" || foodItems[i].price >= Number(minprice));

        let matchesMaxPrice =
            (maxprice === "" || foodItems[i].price <= Number(maxprice));

        let matchesAvailability =
            (availability === "All" ||
                foodItems[i].availability === availability);

        if (matchesName && matchesCategory &&
            matchesMinPrice && matchesMaxPrice &&
            matchesAvailability) {

            results += "<p>" +
                "Food Name: " + foodItems[i].name + "<br>" +
                "Category: " + foodItems[i].category + "<br>" +
                "Price: " + foodItems[i].price + " Tk<br>" +
                "Availability: " + foodItems[i].availability +
                "</p>";

            found = true;
        }
    }

    // Display search results
    if (found === false) {

        document.getElementById("searchResults").innerHTML =
            "No food found.";

    } else {

        document.getElementById("searchResults").innerHTML = results;
    }

    return false;
}

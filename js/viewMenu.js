
// Sample Food Menu
let foodItems = [
    {
        id: "F001",
        name: "Chicken Burger",
        category: "Fast Food",
        price: 150,
        availability: "Available"
    },
    {
        id: "F002",
        name: "Pizza",
        category: "Fast Food",
        price: 350,
        availability: "Available"
    },
    {
        id: "F003",
        name: "French Fries",
        category: "Fast Food",
        price: 90,
        availability: "Available"
    },
    {
        id: "F004",
        name: "Tea",
        category: "Drinks",
        price: 30,
        availability: "Available"
    },
    {
        id: "F005",
        name: "Fried Rice",
        category: "Rice Items",
        price: 180,
        availability: "Available"
    }
];


// View Menu Function
function viewMenu() {

    let category = document.getElementById("category").value;
    let foodname = document.getElementById("foodname").value.trim();

    let found = false;
    let rows = "";

    // Search Food Items
    for (let i = 0; i < foodItems.length; i++) {

        let sameCategory =
            (category === "All" || foodItems[i].category === category);

        let sameName =
            foodItems[i].name.toLowerCase().indexOf(foodname.toLowerCase()) !== -1;

        if (sameCategory && sameName) {

            rows += "<tr>" +
                "<td>" + foodItems[i].id + "</td>" +
                "<td>No photo</td>" +
                "<td>" + foodItems[i].name + "</td>" +
                "<td>" + foodItems[i].category + "</td>" +
                "<td>" + foodItems[i].price + "</td>" +
                "<td>" + foodItems[i].availability + "</td>" +
                "</tr>";

            found = true;
        }
    }

    // Display Results
    if (found === false) {

        document.getElementById("menuBody").innerHTML =
            '<tr><td colspan="6">No food items found.</td></tr>';

    } else {

        document.getElementById("menuBody").innerHTML = rows;
    }

    return false;
}

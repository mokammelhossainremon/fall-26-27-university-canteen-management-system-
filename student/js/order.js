const orderForm = document.getElementById("orderForm");
const orderId = document.getElementById("orderId");
const foodName = document.getElementById("foodName");
const quantity = document.getElementById("quantity");
const orderNotes = document.getElementById("orderNotes");
const orderSearch = document.getElementById("orderSearch");
const ordersTableBody = document.getElementById("ordersTableBody");
const ordersEmpty = document.getElementById("ordersEmpty");
const orderSubmit = document.getElementById("orderSubmit");
const cancelOrderEdit = document.getElementById("cancelOrderEdit");
const orderFormTitle = document.getElementById("orderFormTitle");

function loadOrderFoods() {
    for (const food of foodItems) {
        if (food.available) {
            const option = document.createElement("option");
            option.value = food.name;
            option.textContent = food.name + " - ৳" + food.price;
            foodName.appendChild(option);
        }
    }
}

function displayOrders() {
    const searchValue = orderSearch.value.toLowerCase().trim();
    const filteredOrders = studentOrders.filter(function(order) {
        return order.id.toLowerCase().includes(searchValue) || order.food.toLowerCase().includes(searchValue) || order.status.toLowerCase().includes(searchValue);
    });

    ordersTableBody.innerHTML = "";
    ordersEmpty.hidden = filteredOrders.length !== 0;

    for (const order of filteredOrders) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${order.id}</td><td>${order.food}</td><td>${order.quantity}</td><td>৳${order.price * order.quantity}</td><td>${order.date}</td><td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td><td><div class="action-group"><button class="btn-small edit-order" data-id="${order.id}">Edit</button><button class="btn-small delete delete-order" data-id="${order.id}">Delete</button></div></td>`;
        ordersTableBody.appendChild(row);
    }
}

function resetOrderForm() {
    orderForm.reset();
    orderId.value = "";
    quantity.value = 1;
    orderSubmit.textContent = "Place Order";
    orderFormTitle.textContent = "Place New Order";
    cancelOrderEdit.hidden = true;
}

function editOrder(id) {
    const order = studentOrders.find(function(item) {
        return item.id === id;
    });

    if (order) {
        orderId.value = order.id;
        foodName.value = order.food;
        quantity.value = order.quantity;
        orderNotes.value = order.notes;
        orderSubmit.textContent = "Update Order";
        orderFormTitle.textContent = "Update Order";
        cancelOrderEdit.hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

orderForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const selectedFood = foodItems.find(function(food) {
        return food.name === foodName.value && food.available;
    });
    const amount = Number(quantity.value);

    if (!selectedFood || !Number.isInteger(amount) || amount < 1 || amount > 20) {
        alert("Please select an available food and enter a valid quantity.");
        return;
    }

    if (orderId.value === "") {
        const newOrder = {
            id: "ORD" + (Date.now().toString().slice(-6)),
            food: selectedFood.name,
            quantity: amount,
            price: selectedFood.price,
            notes: orderNotes.value.trim(),
            date: getTodayDate(),
            status: "Pending"
        };
        studentOrders.push(newOrder);
        alert("Your order has been placed.");
    } else {
        const existingOrder = studentOrders.find(function(order) {
            return order.id === orderId.value;
        });

        if (existingOrder && existingOrder.status === "Pending") {
            existingOrder.food = selectedFood.name;
            existingOrder.quantity = amount;
            existingOrder.price = selectedFood.price;
            existingOrder.notes = orderNotes.value.trim();
            alert("Your order has been updated.");
        } else {
            alert("Only pending orders can be updated.");
            resetOrderForm();
            return;
        }
    }

    resetOrderForm();
    displayOrders();
});

ordersTableBody.addEventListener("click", function(event) {
    const id = event.target.dataset.id;

    if (event.target.classList.contains("edit-order")) {
        editOrder(id);
    } else if (event.target.classList.contains("delete-order")) {
        const order = studentOrders.find(function(item) {
            return item.id === id;
        });

        if (order && order.status === "Pending" && confirm("Delete this order?")) {
            studentOrders = studentOrders.filter(function(item) {
                return item.id !== id;
            });
            displayOrders();
        } else if (order && order.status !== "Pending") {
            alert("Only pending orders can be deleted.");
        }
    }
});

cancelOrderEdit.addEventListener("click", resetOrderForm);
orderSearch.addEventListener("input", displayOrders);
loadOrderFoods();
displayOrders();

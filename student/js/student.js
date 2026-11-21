const currentDate = document.getElementById("currentDate");
const totalOrders = document.getElementById("totalOrders");
const pendingOrders = document.getElementById("pendingOrders");
const completedOrders = document.getElementById("completedOrders");
const totalSpending = document.getElementById("totalSpending");
const recentOrders = document.getElementById("recentOrders");

function displayDashboard() {
    currentDate.textContent = getTodayDate();
    totalOrders.textContent = studentOrders.length;

    let pending = 0;
    let completed = 0;
    let spending = 0;

    for (const order of studentOrders) {
        if (order.status === "Pending" || order.status === "Preparing") {
            pending++;
        } else if (order.status === "Completed") {
            completed++;
        }
        spending += order.price * order.quantity;
    }

    pendingOrders.textContent = pending;
    completedOrders.textContent = completed;
    totalSpending.textContent = "৳" + spending.toLocaleString("en-IN");

    recentOrders.innerHTML = "";

    for (let i = studentOrders.length - 1; i >= 0 && i >= studentOrders.length - 5; i--) {
        const order = studentOrders[i];
        const row = document.createElement("tr");
        row.innerHTML = `<td>${order.id}</td><td>${order.food}</td><td>${order.date}</td><td>৳${order.price * order.quantity}</td><td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>`;
        recentOrders.appendChild(row);
    }
}

displayDashboard();

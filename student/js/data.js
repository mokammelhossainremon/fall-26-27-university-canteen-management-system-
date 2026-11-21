let foodItems = [
    { id: 1, name: "Chicken Burger", category: "Snacks", price: 180, available: true },
    { id: 2, name: "Fried Rice", category: "Lunch", price: 150, available: true },
    { id: 3, name: "Chicken Sandwich", category: "Breakfast", price: 120, available: true },
    { id: 4, name: "Pizza", category: "Snacks", price: 250, available: false },
    { id: 5, name: "Pasta", category: "Lunch", price: 200, available: true },
    { id: 6, name: "Coffee", category: "Drinks", price: 80, available: true },
    { id: 7, name: "Tea", category: "Drinks", price: 30, available: true },
    { id: 8, name: "Egg Sandwich", category: "Breakfast", price: 90, available: true }
];

let studentOrders = [
    { id: "ORD101", food: "Chicken Burger", quantity: 1, price: 180, notes: "", date: "21 Nov 2026", status: "Completed" },
    { id: "ORD102", food: "Fried Rice", quantity: 1, price: 150, notes: "Less spicy", date: "21 Nov 2026", status: "Preparing" },
    { id: "ORD103", food: "Coffee", quantity: 2, price: 80, notes: "", date: "20 Nov 2026", status: "Pending" }
];

let favouriteFoods = [
    { id: 1, name: "Chicken Burger", category: "Snacks", price: 180 },
    { id: 2, name: "Fried Rice", category: "Lunch", price: 150 }
];

let studentBudget = { daily: 300, monthly: 5000 };

let studentExpenses = [
    { id: 1, description: "Chicken Burger", amount: 180, date: "21 Nov 2026" },
    { id: 2, description: "Coffee", amount: 80, date: "21 Nov 2026" },
    { id: 3, description: "Fried Rice", amount: 150, date: "20 Nov 2026" }
];

let studentFeedback = [
    { id: 1, food: "Chicken Burger", rating: 5, comments: "Very tasty and fresh.", date: "20 Nov 2026" },
    { id: 2, food: "Fried Rice", rating: 4, comments: "Good taste.", date: "19 Nov 2026" }
];

function getTodayDate() {
    return new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

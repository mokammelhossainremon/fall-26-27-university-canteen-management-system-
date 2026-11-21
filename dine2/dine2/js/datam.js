/* =====================================================================
   data.js  -  Sample data for the UniCanteen system
   ---------------------------------------------------------------------
   Every list is an ARRAY OF OBJECTS (Lecture 05: "Arrays of objects").
   Each object groups related values as  name: value  pairs.

   IMPORTANT (frontend only):
   This data lives in the browser's memory. When you reload a page or
   move to another page, it starts again from these values.
   When the backend (PHP + MySQL) is built later, these arrays will be
   replaced by data that comes from the database.
   ===================================================================== */


// ---------- Food items of the canteen (used by Manager, Menu, Student) ----------
// stock = units available right now
//   status: "Available"   = can be ordered
//           "Unavailable" = hidden from ordering
let foodItems = [
  { id: "F-001", name: "Paratha & Egg", category: "Breakfast", price: 40, stock: 50, status: "Available" },
  { id: "F-002", name: "Khichuri", category: "Breakfast", price: 60, stock: 30, status: "Available" },
  { id: "F-003", name: "Vegetable Roll", category: "Breakfast", price: 30, stock: 8, status: "Available" },
  { id: "F-004", name: "Chicken Biryani", category: "Lunch", price: 150, stock: 25, status: "Available" },
  { id: "F-005", name: "Rice with Chicken Curry", category: "Lunch", price: 120, stock: 40, status: "Available" },
  { id: "F-006", name: "Rice with Fish Curry", category: "Lunch", price: 110, stock: 0, status: "Unavailable" },
  { id: "F-007", name: "Singara", category: "Snacks", price: 10, stock: 100, status: "Available" },
  { id: "F-008", name: "Chicken Burger", category: "Snacks", price: 130, stock: 6, status: "Available" },
  { id: "F-009", name: "French Fries", category: "Snacks", price: 70, stock: 35, status: "Available" },
  { id: "F-010", name: "Milk Tea", category: "Drinks", price: 15, stock: 200, status: "Available" },
  { id: "F-011", name: "Cold Coffee", category: "Drinks", price: 70, stock: 18, status: "Available" },
  { id: "F-012", name: "Fresh Lemon Juice", category: "Drinks", price: 30, stock: 9, status: "Available" }
];


// ---------- Orders placed by customers (used by Manager and Student) ----------
//   status: "Pending"   = waiting for the manager
//           "Completed" = served and paid (counts as revenue)
//           "Cancelled" = cancelled by the manager
let orders = [
  { id: "O-1001", customer: "Rahim Uddin", items: "Chicken Biryani x1, Milk Tea x1", total: 165, status: "Completed" },
  { id: "O-1002", customer: "Nusrat Jahan", items: "Paratha & Egg x2", total: 80, status: "Completed" },
  { id: "O-1003", customer: "Tanvir Ahmed", items: "Chicken Burger x1, French Fries x1", total: 200, status: "Pending" },
  { id: "O-1004", customer: "Sadia Akter", items: "Rice with Chicken Curry x1", total: 120, status: "Completed" },
  { id: "O-1005", customer: "Imran Hossain", items: "Cold Coffee x2", total: 140, status: "Cancelled" },
  { id: "O-1006", customer: "Farhana Kabir", items: "Khichuri x1, Fresh Lemon Juice x1", total: 90, status: "Pending" },
  { id: "O-1007", customer: "Mehedi Hasan", items: "Singara x3, Milk Tea x2", total: 60, status: "Completed" },
  { id: "O-1008", customer: "Nadia Rahman", items: "Vegetable Roll x2", total: 60, status: "Pending" }
];
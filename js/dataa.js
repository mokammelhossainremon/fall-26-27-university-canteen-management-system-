
let users = [
  { id: "U-001", name: "Rimon ",   username: "admin",   password: "admin1234",  email: "admin@campusbite.edu",   role: "Admin",   status: "Active" },
  { id: "U-002", name: "Sadia Akter",   username: "manager", password: "manager123", email: "sadia@campusbite.edu",   role: "Manager", status: "Active" },
  { id: "U-003", name: "ayesha siddiqua",   username: "ayesha",    password: "ayesha12345",  email: "ayesha@campusbite.edu",    role: "Manager", status: "Active" },
  { id: "U-004", name: "Jamal Uddin",   username: "staff",   password: "staff1234",  email: "jamal@campusbite.edu",   role: "Staff",   status: "Active" },
  { id: "U-005", name: "Nusrat Jahan",  username: "nusrat",  password: "nusrat123",  email: "nusrat@campusbite.edu",  role: "Staff",   status: "Active" },
  { id: "U-006", name: "Rahim Ahmed",   username: "student", password: "student123", email: "rahim@student.edu",      role: "Student", status: "Active" },
  { id: "U-007", name: "Sara Khan",     username: "sara",    password: "sara12345",  email: "sara@student.edu",       role: "Student", status: "Active" },
  { id: "U-008", name: "Tawhid Islam",  username: "tawhid",  password: "tawhid123",  email: "tawhid@student.edu",     role: "Student", status: "Active" },
  { id: "U-009", name: "Tanvir Ahmed",  username: "tanvir",  password: "tanvir123",  email: "tanvir@student.edu",     role: "Student", status: "Blocked" }
];


let foods = [
  { id: "F-101", name: "Chicken Biryani",  category: "Meals",    price: 150, quantity: 40, status: "Available" },
  { id: "F-102", name: "Beef Khichuri",    category: "Meals",    price: 130, quantity: 25, status: "Available" },
  { id: "F-103", name: "Vegetable Roll",   category: "Snacks",   price: 40,  quantity: 60, status: "Available" },
  { id: "F-104", name: "Samosa",           category: "Snacks",   price: 15,  quantity: 4,  status: "Available" },
  { id: "F-105", name: "Milk Tea",         category: "Drinks",   price: 20,  quantity: 80, status: "Available" },
  { id: "F-106", name: "Mango Juice",      category: "Drinks",   price: 50,  quantity: 0,  status: "Unavailable" },
  { id: "F-107", name: "Rasmalai",         category: "Desserts", price: 60,  quantity: 18, status: "Available" },
  { id: "F-108", name: "Firni",            category: "Desserts", price: 45,  quantity: 3,  status: "Available" }
];

let orders = [
  { id: "O-001", studentName: "Rahim Ahmed",  item: "Chicken Biryani", quantity: 2, total: 300, date: "2026-11-10", status: "Completed" },
  { id: "O-002", studentName: "Sara Khan",    item: "Milk Tea",        quantity: 3, total: 60,  date: "2026-11-10", status: "Completed" },
  { id: "O-003", studentName: "Tawhid Islam", item: "Vegetable Roll",  quantity: 4, total: 160, date: "2026-11-11", status: "Completed" },
  { id: "O-004", studentName: "Rahim Ahmed",  item: "Rasmalai",        quantity: 1, total: 60,  date: "2026-11-12", status: "Completed" },
  { id: "O-005", studentName: "Sara Khan",    item: "Beef Khichuri",   quantity: 1, total: 130, date: "2026-11-13", status: "Pending" },
  { id: "O-006", studentName: "Tanvir Ahmed", item: "Samosa",          quantity: 5, total: 75,  date: "2026-11-13", status: "Cancelled" }
];

let canteenRules = {
  serviceCharge: 5,   
  maxItems: 10,       
  lowStockLimit: 5,    
  cancelMinutes: 10   
};

let activityLog = [
  { time: "2026-11-10 09:12", user: "admin",   type: "User",     message: "Created manager account for Mitu Sarker" },
  { time: "2026-11-10 11:40", user: "manager", type: "Food",     message: "Added food item: Firni (F-108)" },
  { time: "2026-11-11 14:05", user: "admin",   type: "Security", message: "Blocked account of Tanvir Ahmed (unpaid bill)" },
  { time: "2026-11-12 08:55", user: "admin",   type: "Settings", message: "Changed service charge to 5%" }
];

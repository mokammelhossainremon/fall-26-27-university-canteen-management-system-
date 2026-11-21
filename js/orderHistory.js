
// Order records
let orders = [
    {
        orderid: "ORD-1001",
        orderdate: "2026-11-10",
        foodname: "Chicken Burger",
        quantity: 2,
        totalprice: 300,
        status: "Completed"
    },

    {
        orderid: "ORD-1002",
        orderdate: "2026-11-12",
        foodname: "Tea",
        quantity: 3,
        totalprice: 90,
        status: "Completed"
    },

    {
        orderid: "ORD-1003",
        orderdate: "2026-11-14",
        foodname: "Pizza",
        quantity: 1,
        totalprice: 350,
        status: "Pending"
    }
];


// Display all orders when page loads
function displayOrders(orderList) {

    let rows = "";
    let total = 0;

    for (let i = 0; i < orderList.length; i++) {

        rows += "<tr>" +
            "<td>" + orderList[i].orderid + "</td>" +
            "<td>" + orderList[i].orderdate + "</td>" +
            "<td>" + orderList[i].foodname + "</td>" +
            "<td>" + orderList[i].quantity + "</td>" +
            "<td>" + orderList[i].totalprice + "</td>" +
            "<td><strong>" + orderList[i].status + "</strong></td>" +
            "</tr>";

        total += orderList[i].totalprice;
    }

    if (orderList.length === 0) {
        rows = '<tr><td colspan="6">No order records found.</td></tr>';
    }

    document.getElementById("orderBody").innerHTML = rows;
    document.getElementById("totalAmount").innerHTML = total;

}


// Search Order Function
function searchOrder() {

    let orderid = document.getElementById("orderid").value.trim();
    let orderdate = document.getElementById("orderdate").value;
    let foodname = document.getElementById("foodname").value.trim();
    let status = document.getElementById("status").value;

    let filteredOrders = [];

    for (let i = 0; i < orders.length; i++) {

        let matchesId =
            (orderid === "" || orders[i].orderid === orderid);

        let matchesDate =
            (orderdate === "" || orders[i].orderdate === orderdate);

        let matchesFood =
            (foodname === "" ||
                orders[i].foodname.toLowerCase().indexOf(foodname.toLowerCase()) !== -1);

        let matchesStatus =
            (status === "" || orders[i].status === status);

        if (matchesId && matchesDate && matchesFood && matchesStatus) {

            filteredOrders.push(orders[i]);

        }
    }

    displayOrders(filteredOrders);

    return false;
}


// Show all orders initially
displayOrders(orders);

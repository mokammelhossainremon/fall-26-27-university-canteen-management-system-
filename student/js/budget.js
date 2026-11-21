const budgetForm = document.getElementById("budgetForm");
const budgetType = document.getElementById("budgetType");
const budgetAmount = document.getElementById("budgetAmount");
const totalBudget = document.getElementById("totalBudget");
const totalSpent = document.getElementById("totalSpent");
const remainingBudget = document.getElementById("remainingBudget");
const budgetProgress = document.getElementById("budgetProgress");
const budgetPercentage = document.getElementById("budgetPercentage");
const budgetMessage = document.getElementById("budgetMessage");
const budgetPeriodLabel = document.getElementById("budgetPeriodLabel");
const expenseForm = document.getElementById("expenseForm");
const expenseId = document.getElementById("expenseId");
const expenseDescription = document.getElementById("expenseDescription");
const expenseAmount = document.getElementById("expenseAmount");
const expenseSearch = document.getElementById("expenseSearch");
const expenseTableBody = document.getElementById("expenseTableBody");
const expenseEmpty = document.getElementById("expenseEmpty");
const expenseSubmit = document.getElementById("expenseSubmit");
const cancelExpense = document.getElementById("cancelExpense");

function getSelectedBudget() {
    return studentBudget[budgetType.value];
}

function getPeriodExpenses() {
    const today = new Date();
    return studentExpenses.filter(function(expense) {
        const expenseDate = new Date(expense.date);
        if (budgetType.value === "daily") {
            return expenseDate.toDateString() === today.toDateString();
        }
        return expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear();
    });
}

function displayBudget() {
    const periodExpenses = getPeriodExpenses();
    let spent = 0;

    for (const expense of periodExpenses) {
        spent += expense.amount;
    }

    const limit = getSelectedBudget();
    const remaining = limit - spent;
    const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

    totalBudget.textContent = "৳" + limit.toLocaleString("en-IN");
    totalSpent.textContent = "৳" + spent.toLocaleString("en-IN");
    remainingBudget.textContent = "৳" + remaining.toLocaleString("en-IN");
    budgetPeriodLabel.textContent = budgetType.value === "daily" ? "Daily budget summary" : "Monthly budget summary";
    budgetPercentage.textContent = Math.round(percentage) + "%";
    budgetProgress.style.width = percentage + "%";

    if (limit === 0) {
        budgetMessage.textContent = "Set a budget to start tracking your expenses.";
    } else if (remaining < 0) {
        budgetMessage.textContent = "You have exceeded your budget by ৳" + Math.abs(remaining).toLocaleString("en-IN") + ".";
    } else {
        budgetMessage.textContent = "You have ৳" + remaining.toLocaleString("en-IN") + " remaining in your budget.";
    }
}

function displayExpenses() {
    const searchValue = expenseSearch.value.toLowerCase().trim();
    const filteredExpenses = studentExpenses.filter(function(expense) {
        return expense.description.toLowerCase().includes(searchValue) || String(expense.id).includes(searchValue);
    });

    expenseTableBody.innerHTML = "";
    expenseEmpty.hidden = filteredExpenses.length !== 0;

    for (const expense of filteredExpenses) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>EXP${expense.id}</td><td>${expense.description}</td><td>৳${expense.amount}</td><td>${expense.date}</td><td><div class="action-group"><button class="btn-small edit-expense" data-id="${expense.id}">Edit</button><button class="btn-small delete delete-expense" data-id="${expense.id}">Delete</button></div></td>`;
        expenseTableBody.appendChild(row);
    }
}

function resetExpenseForm() {
    expenseForm.reset();
    expenseId.value = "";
    expenseSubmit.textContent = "Add Expense";
    cancelExpense.hidden = true;
}

function editExpense(id) {
    const expense = studentExpenses.find(function(item) {
        return item.id === Number(id);
    });

    if (expense) {
        expenseId.value = expense.id;
        expenseDescription.value = expense.description;
        expenseAmount.value = expense.amount;
        expenseSubmit.textContent = "Update Expense";
        cancelExpense.hidden = false;
    }
}

budgetForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const amount = Number(budgetAmount.value);

    if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000) {
        alert("Enter a valid budget amount.");
        return;
    }

    studentBudget[budgetType.value] = amount;
    displayBudget();
    alert("Budget saved successfully.");
});

expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const description = expenseDescription.value.trim();
    const amount = Number(expenseAmount.value);

    if (description.length < 2 || !Number.isFinite(amount) || amount <= 0 || amount > 100000) {
        alert("Enter valid expense information.");
        return;
    }

    if (expenseId.value === "") {
        studentExpenses.push({ id: Date.now(), description: description, amount: amount, date: getTodayDate() });
        alert("Expense added.");
    } else {
        const expense = studentExpenses.find(function(item) {
            return item.id === Number(expenseId.value);
        });

        if (expense) {
            expense.description = description;
            expense.amount = amount;
        }
        alert("Expense updated.");
    }

    resetExpenseForm();
    displayExpenses();
    displayBudget();
});

expenseTableBody.addEventListener("click", function(event) {
    const id = event.target.dataset.id;

    if (event.target.classList.contains("edit-expense")) {
        editExpense(id);
    } else if (event.target.classList.contains("delete-expense")) {
        if (confirm("Delete this expense?")) {
            studentExpenses = studentExpenses.filter(function(item) {
                return item.id !== Number(id);
            });
            displayExpenses();
            displayBudget();
        }
    }
});

budgetType.addEventListener("change", function() {
    budgetAmount.value = studentBudget[budgetType.value];
    displayBudget();
});
expenseSearch.addEventListener("input", displayExpenses);
cancelExpense.addEventListener("click", resetExpenseForm);
budgetAmount.value = studentBudget.daily;
displayBudget();
displayExpenses();

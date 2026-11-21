const feedbackForm = document.getElementById("feedbackForm");
const feedbackId = document.getElementById("feedbackId");
const feedbackFood = document.getElementById("feedbackFood");
const feedbackRating = document.getElementById("feedbackRating");
const feedbackComments = document.getElementById("feedbackComments");
const feedbackSearch = document.getElementById("feedbackSearch");
const feedbackTableBody = document.getElementById("feedbackTableBody");
const feedbackEmpty = document.getElementById("feedbackEmpty");
const feedbackSubmit = document.getElementById("feedbackSubmit");
const cancelFeedback = document.getElementById("cancelFeedback");
const feedbackFormTitle = document.getElementById("feedbackFormTitle");

function loadFeedbackFoods() {
    for (const food of foodItems) {
        const option = document.createElement("option");
        option.value = food.name;
        option.textContent = food.name;
        feedbackFood.appendChild(option);
    }
}

function displayFeedback() {
    const searchValue = feedbackSearch.value.toLowerCase().trim();
    const filteredFeedback = studentFeedback.filter(function(item) {
        return item.food.toLowerCase().includes(searchValue) || item.comments.toLowerCase().includes(searchValue);
    });

    feedbackTableBody.innerHTML = "";
    feedbackEmpty.hidden = filteredFeedback.length !== 0;

    for (const item of filteredFeedback) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>FB${item.id}</td><td>${item.food}</td><td>${"★".repeat(item.rating)}</td><td>${item.comments}</td><td>${item.date}</td><td><div class="action-group"><button class="btn-small edit-feedback" data-id="${item.id}">Edit</button><button class="btn-small delete delete-feedback" data-id="${item.id}">Delete</button></div></td>`;
        feedbackTableBody.appendChild(row);
    }
}

function resetFeedbackForm() {
    feedbackForm.reset();
    feedbackId.value = "";
    feedbackSubmit.textContent = "Submit Feedback";
    feedbackFormTitle.textContent = "Submit Your Feedback";
    cancelFeedback.hidden = true;
}

function editFeedback(id) {
    const item = studentFeedback.find(function(feedback) {
        return feedback.id === Number(id);
    });

    if (item) {
        feedbackId.value = item.id;
        feedbackFood.value = item.food;
        feedbackRating.value = item.rating;
        feedbackComments.value = item.comments;
        feedbackSubmit.textContent = "Update Feedback";
        feedbackFormTitle.textContent = "Update Your Feedback";
        cancelFeedback.hidden = false;
    }
}

feedbackForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const food = feedbackFood.value;
    const rating = Number(feedbackRating.value);
    const comments = feedbackComments.value.trim();

    if (!food || !Number.isInteger(rating) || rating < 1 || rating > 5 || comments.length < 3) {
        alert("Please select a food, rating and write a valid comment.");
        return;
    }

    if (feedbackId.value === "") {
        studentFeedback.push({ id: Date.now(), food: food, rating: rating, comments: comments, date: getTodayDate() });
        alert("Thank you for your feedback.");
    } else {
        const item = studentFeedback.find(function(feedback) {
            return feedback.id === Number(feedbackId.value);
        });

        if (item) {
            item.food = food;
            item.rating = rating;
            item.comments = comments;
        }
        alert("Feedback updated.");
    }

    resetFeedbackForm();
    displayFeedback();
});

feedbackTableBody.addEventListener("click", function(event) {
    const id = event.target.dataset.id;

    if (event.target.classList.contains("edit-feedback")) {
        editFeedback(id);
    } else if (event.target.classList.contains("delete-feedback")) {
        if (confirm("Delete this feedback?")) {
            studentFeedback = studentFeedback.filter(function(item) {
                return item.id !== Number(id);
            });
            displayFeedback();
        }
    }
});

cancelFeedback.addEventListener("click", resetFeedbackForm);
feedbackSearch.addEventListener("input", displayFeedback);
loadFeedbackFoods();
displayFeedback();

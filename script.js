// ReuseHub - Screen Navigation

const navItems = document.querySelectorAll(".nav-item");
const screens = document.querySelectorAll(".screen");

navItems.forEach(item => {
    item.addEventListener("click", () => {

        // Get the screen name
        const page = item.dataset.page;

// Clear Browse search when returning to Browse
if (page === "browse") {
    browseSearch.value = "";
}

        // Clear Home search and scroll to top when returning to Home
if (page === "home") {
    homeSearch.value = "";

    const homeScreen = document.querySelector("#home-screen");
    homeScreen.scrollTop = 0;
}
        // Reset Browse to All when opened from bottom navigation
if (page === "browse") {
    currentCategory = "all";

    filterButtons.forEach(filter => filter.classList.remove("active"));

    const allFilter = document.querySelector('.filter[data-category="all"]');
    if (allFilter) allFilter.classList.add("active");

    resourceCards.forEach(card => card.style.display = "flex");

    checkNoResults();
}
        history.pushState({ page: page }, "", "#" + page);

        // Remove active from all navigation items
        navItems.forEach(nav => nav.classList.remove("active"));

        // Activate the clicked navigation item
        item.classList.add("active");

        // Hide all screens
        screens.forEach(screen => screen.classList.remove("active"));

        // Show the selected screen
        document.getElementById(page + "-screen").classList.add("active");

        // Reset Home scroll position
if (page === "home") {
    document.getElementById("home-screen").scrollTop = 0;
}

// Reset Browse scroll position
if (page === "browse") {
    document.getElementById("browse-screen").scrollTop = 0;
}

    });
});

// Android Back Button - Return to Home
window.addEventListener("popstate", () => {
    // Close Notifications if open
if (notificationPanel.style.display === "block") {
    notificationPanel.style.display = "none";
    history.pushState({ page: "home" }, "", "#home");
    return;
}

    const activeScreen = document.querySelector(".screen.active");

    if (activeScreen && activeScreen.id !== "home-screen") {

        navItems.forEach(nav => nav.classList.remove("active"));
        screens.forEach(screen => screen.classList.remove("active"));

        const homeScreen = document.getElementById("home-screen");
        homeScreen.classList.add("active");

        const homeNav = document.querySelector('[data-page="home"]');
        if (homeNav) homeNav.classList.add("active");

    }

    history.pushState({ page: "home" }, "", "#home");

});
// ReuseHub - Browse Filters

let currentCategory = "all";
const filterButtons = document.querySelectorAll(".filter");
let resourceCards = document.querySelectorAll(".browse-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        // Get the selected category
        currentCategory = button.dataset.category;
const category = currentCategory;

        // Update active filter button
        filterButtons.forEach(filter => filter.classList.remove("active"));
        button.classList.add("active");

        // Show or hide resource cards
        resourceCards.forEach(card => {
            if (category === "all" || card.dataset.category === category) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
                checkNoResults();

    });
});
// ReuseHub - My Items Tabs

const myItemTabs = document.querySelectorAll(".my-items-tabs .tab");
const tabContents = document.querySelectorAll(".tab-content");

myItemTabs.forEach(tab => {
    tab.addEventListener("click", () => {

        // Remove active from all tabs
        myItemTabs.forEach(t => t.classList.remove("active"));

        // Activate clicked tab
        tab.classList.add("active");

        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove("active"));

        // Show selected content
        const selectedContent = document.getElementById(tab.dataset.tab + "-content");
        selectedContent.classList.add("active");

    });
});
// ReuseHub - Add Item Form Toggle

const addItemButton = document.querySelector(".add-item-btn");
const addItemForm = document.querySelector(".add-item-form");

addItemButton.addEventListener("click", () => {
    addItemForm.classList.toggle("show");
});
// ReuseHub - Add New Resource

const resourceForm = document.querySelector("#add-item-form");
const listingsContent = document.querySelector("#listings-content");
// Track the listing currently being edited
let editingCard = null;
let editingBrowseCard = null;
let isLoadingListings = false;

resourceForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // Get values from the form
    const name = document.querySelector("#item-name").value;
    const category = document.querySelector("#item-category").value;
    const price = document.querySelector("#item-price").value;
    const condition = document.querySelector("#item-condition").value;
    const type = document.querySelector("#item-type").value;
    const description = document.querySelector("#item-description").value;
    const availability = document.querySelector("#item-availability").value;

    // Choose an icon
    let icon = "📦";

    if (category === "books") icon = "📘";
    if (category === "lab") icon = "🥼";
    if (category === "tools") icon = "📐";
    if (category === "calculator") icon = "🧮";

    // Listing type text
    const typeText = {
        sale: "Available for sale",
        exchange: "Available for exchange",
        donate: "Available for donation",
        borrow: "Available for lending"
    };

    // Create resource card
    const card = document.createElement("div");
    card.className = "my-listing-card";
    // Store resource data on the listing card
card.dataset.name = name;
card.dataset.category = category;
card.dataset.price = price;
card.dataset.condition = condition;
card.dataset.type = type;
card.dataset.description = description;
card.dataset.availability = availability;

    const iconBox = document.createElement("div");
    iconBox.className = "my-listing-icon";
    iconBox.textContent = icon;

    const details = document.createElement("div");
    details.className = "my-listing-details";

    const title = document.createElement("h3");
    title.textContent = name;

    const priceText = document.createElement("p");
    priceText.textContent = Number(price) === 0 ? "Free" : "₹" + price;

    const conditionText = document.createElement("p");
    conditionText.textContent = "Condition: " + condition;

    const statusText = document.createElement("p");
    statusText.className = "status";
    statusText.textContent = typeText[type];

    details.append(title, priceText, conditionText, statusText);

const availabilityText = document.createElement("p");
availabilityText.className = "availability-status " + availability;
availabilityText.textContent = "Availability: " + availability.charAt(0).toUpperCase() + availability.slice(1);
details.appendChild(availabilityText);

    if (description.trim() !== "") {
        const descriptionText = document.createElement("p");
        descriptionText.textContent = description;
        details.appendChild(descriptionText);
    }

    // Create Edit button
const editButton = document.createElement("button");
editButton.className = "edit-listing-btn";
editButton.textContent = "Edit Listing";

// Edit button action
editButton.addEventListener("click", () => {

    // Remember which cards are being edited
    editingCard = card;
    editingBrowseCard = browseCard;

    // Fill form with existing details
    document.querySelector("#item-name").value = name;
    document.querySelector("#item-category").value = category;
    document.querySelector("#item-price").value = price;
    document.querySelector("#item-condition").value = condition;
    document.querySelector("#item-type").value = type;
    document.querySelector("#item-description").value = description;
    document.querySelector("#item-availability").value =
    card.dataset.availability || "available";

    // Open the form
    resourceForm.classList.add("show");

});

// Create Delete button
const deleteButton = document.createElement("button");
deleteButton.className = "delete-listing-btn";
deleteButton.textContent = "Delete Listing";

deleteButton.addEventListener("click", () => {

    // Remove from My Listings
    card.remove();

    // Remove from Browse
    browseCard.remove();

    // Refresh resource cards
    resourceCards = document.querySelectorAll(".browse-card");

    checkNoResults();

    // Update saved listings
    const listingsData = [];

    document.querySelectorAll("#listings-content .my-listing-card").forEach(listing => {
        if (listing.dataset.name) {
            listingsData.push({
                name: listing.dataset.name,
                category: listing.dataset.category,
                price: listing.dataset.price,
                condition: listing.dataset.condition,
                type: listing.dataset.type,
                availability: listing.dataset.availability,
                description: listing.dataset.description
            });
        }
    });

    localStorage.setItem("reusehub-listings", JSON.stringify(listingsData));

});

// Listing action buttons
const listingActions = document.createElement("div");
listingActions.className = "listing-actions";
listingActions.append(editButton, deleteButton);

card.append(iconBox, details, listingActions);
    // Create Browse card
const browseCard = document.createElement("div");
browseCard.className = "browse-card";
browseCard.dataset.category = category;
browseCard.dataset.availability = availability;

const browseIcon = document.createElement("div");
browseIcon.className = "browse-book-icon";
browseIcon.textContent = icon;

const browseDetails = document.createElement("div");
browseDetails.className = "browse-details";

const browseTitle = document.createElement("h3");
browseTitle.textContent = name;

const browsePrice = document.createElement("p");
browsePrice.className = "price";
browsePrice.textContent = Number(price) === 0 ? "Free" : "₹" + price;

const browseCondition = document.createElement("p");
browseCondition.textContent = "Condition: " + condition;

const browseStatus = document.createElement("p");
browseStatus.className = "status";
browseStatus.textContent = typeText[type];

browseDetails.append(browseTitle, browsePrice, browseCondition, browseStatus);

const browseAvailability = document.createElement("p");
browseAvailability.className = "availability-status " + availability;
browseAvailability.textContent = "Availability: " + availability.charAt(0).toUpperCase() + availability.slice(1);
browseDetails.appendChild(browseAvailability);
// Create Save button
const saveButton = document.createElement("button");
saveButton.className = "save-btn";
saveButton.textContent = "♡ Save";
saveButton.setAttribute("onclick", "saveResource(this)");

browseDetails.appendChild(saveButton);

// Store description for the details screen
browseCard.dataset.description = description;
browseCard.append(browseIcon, browseDetails);

// Add or update Browse card
if (editingBrowseCard) {
    editingBrowseCard.replaceWith(browseCard);
} else {
    document.querySelector(".browse-resources").prepend(browseCard);
}
// Refresh resource cards list
resourceCards = document.querySelectorAll(".browse-card");

// Apply current search and category
const searchText = browseSearch.value.toLowerCase().trim();
const matchesSearch = browseCard.textContent.toLowerCase().includes(searchText);
const matchesCategory = currentCategory === "all" || browseCard.dataset.category === currentCategory;

browseCard.style.display = matchesSearch && matchesCategory ? "flex" : "none";

checkNoResults();

    // Add or update My Listing
if (editingCard) {
    editingCard.replaceWith(card);
} else {
    listingsContent.prepend(card);
}
// Save listings to browser storage
const listingsData = [];

document.querySelectorAll("#listings-content .my-listing-card").forEach(listing => {
    if (listing.dataset.name) {
        listingsData.push({
            name: listing.dataset.name,
            category: listing.dataset.category,
            price: listing.dataset.price,
            condition: listing.dataset.condition,
            type: listing.dataset.type,
            description: listing.dataset.description,
            availability: listing.dataset.availability
        });
    }
});

if (!isLoadingListings) {
    localStorage.setItem("reusehub-listings", JSON.stringify(listingsData));
    updateFeaturedResource();
}

    // Reset form
    resourceForm.reset();

    // Reset edit mode
editingCard = null;
editingBrowseCard = null;


    // Close form
    resourceForm.classList.remove("show");

    // Show My Listings tab
    myItemTabs[0].click();

    if (!isLoadingListings) {
    const itemAddedPopup = document.querySelector("#item-added-popup");
    itemAddedPopup.classList.add("show");
}

});
// ReuseHub - Edit Sample Listing

const sampleListing = document.querySelector(
    '#listings-content .my-listing-card[data-name="Engineering Mathematics-I"]'
);

if (sampleListing) {
    const sampleEditButton = sampleListing.querySelector(".edit-listing-btn");

    sampleEditButton.addEventListener("click", () => {

        editingCard = sampleListing;
        editingBrowseCard = null;

        document.querySelector("#item-name").value = sampleListing.dataset.name;
        document.querySelector("#item-category").value = sampleListing.dataset.category;
        document.querySelector("#item-price").value = sampleListing.dataset.price;
        document.querySelector("#item-condition").value = sampleListing.dataset.condition;
        document.querySelector("#item-type").value = sampleListing.dataset.type;
        document.querySelector("#item-description").value = sampleListing.dataset.description;
        document.querySelector("#item-availability").value = sampleListing.dataset.availability;

        resourceForm.classList.add("show");
    });
}
// ReuseHub - Delete Sample Listing

if (sampleListing) {
    const sampleDeleteButton = sampleListing.querySelector(".delete-listing-btn");

    sampleDeleteButton.addEventListener("click", () => {

        // Remove the sample listing
        sampleListing.remove();

        // Remove its Browse card
        document.querySelectorAll(".browse-card").forEach(browseCard => {
            if (browseCard.querySelector("h3")?.textContent.trim() === "Engineering Mathematics-I") {
                browseCard.remove();
            }
        });

        // Refresh resource cards
        resourceCards = document.querySelectorAll(".browse-card");

        checkNoResults();

        // Update saved listings
        const listingsData = [];

        document.querySelectorAll("#listings-content .my-listing-card").forEach(listing => {
            if (listing.dataset.name) {
                listingsData.push({
                    name: listing.dataset.name,
                    category: listing.dataset.category,
                    price: listing.dataset.price,
                    condition: listing.dataset.condition,
                    type: listing.dataset.type,
                    description: listing.dataset.description,
                    availability: listing.dataset.availability
                });
            }
        });

        localStorage.setItem("reusehub-listings", JSON.stringify(listingsData));
        updateFeaturedResource();

    });
}
// ReuseHub - Home Search
const homeSearch = document.querySelector("#home-search");

homeSearch.addEventListener("input", () => {
    const searchText = homeSearch.value;

    if (searchText !== "") {
        // Open Browse screen
        navItems.forEach(nav => nav.classList.remove("active"));
        screens.forEach(screen => screen.classList.remove("active"));

        document.querySelector('[data-page="browse"]').classList.add("active");
        document.querySelector("#browse-screen").classList.add("active");

        // Transfer search text to Browse
        browseSearch.value = searchText;
        browseSearch.dispatchEvent(new Event("input", { bubbles: true }));

        // Focus Browse search so typing can continue
        browseSearch.focus();
        browseSearch.setSelectionRange(
            browseSearch.value.length,
            browseSearch.value.length
        );
    }
});
// ReuseHub - Browse Search
const browseSearch = document.querySelector("#browse-search");
const noResults = document.querySelector("#no-results");

function checkNoResults() {
    const visibleCards = [...resourceCards].filter(
        card => card.style.display !== "none"
    );

    noResults.style.display = visibleCards.length === 0 ? "block" : "none";
}

browseSearch.addEventListener("input", () => {
    const searchText = browseSearch.value.toLowerCase().trim();

    resourceCards.forEach(card => {
        const matchesSearch = card.textContent.toLowerCase().includes(searchText);
        card.style.display = matchesSearch ? "flex" : "none";
    });

    checkNoResults();
});
// ReuseHub - Save Resources

function saveResource(button) {
    const card = button.closest(".browse-card");
    const resourceName = card.querySelector("h3").textContent;
    // Get saved resources from storage
const savedResources = JSON.parse(localStorage.getItem("reusehub-saved")) || [];

// Check for duplicates
if (savedResources.some(item => item.name === resourceName)) {
    return;
}

// Store resource details
savedResources.push({
    name: resourceName,
    html: card.innerHTML,
    category: card.dataset.category,
    description: card.dataset.description
});

localStorage.setItem("reusehub-saved", JSON.stringify(savedResources));

    const savedContent = document.querySelector("#saved-content");

    const savedCard = card.cloneNode(true);

    // Remove the Save button from the copied card
    savedCard.querySelector(".save-btn").remove();
    // Create Remove from Saved button
const removeSavedButton = document.createElement("button");
removeSavedButton.className = "remove-saved-btn";
removeSavedButton.textContent = "Remove from Saved";

removeSavedButton.addEventListener("click", () => {
    // Remove from screen
savedCard.remove();

// Remove from saved resources array
const savedIndex = savedResources.findIndex(item => item.name === resourceName);

if (savedIndex !== -1) {
    savedResources.splice(savedIndex, 1);
    localStorage.setItem("reusehub-saved", JSON.stringify(savedResources));
}

// Show empty message if no saved cards remain
if (savedContent.children.length === 0) {
    emptyMessage.style.display = "block";
}
});
savedCard.appendChild(removeSavedButton);
    savedContent.appendChild(savedCard);
    // Remove empty message
const emptyMessage = document.querySelector("#saved-empty-message");

if (emptyMessage) {
    emptyMessage.style.display = "none";
}

    // Change button text
    button.textContent = "♥ Saved";
    button.disabled = true;

    showToast(resourceName + " saved successfully! ❤️");
}

// ReuseHub - Custom Toast Notification
function showToast(message) {
    let toast = document.querySelector("#reusehub-toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "reusehub-toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
// ReuseHub - Resource Details

const detailsScreen = document.querySelector("#resource-details-screen");
const detailsBackButton = document.querySelector("#details-back-btn");

function openResourceDetails(card) {
    // Get resource information
    const icon = card.querySelector(".browse-book-icon").textContent;
    const name = card.querySelector("h3").textContent;
    const price = card.querySelector(".price").textContent;
    const condition = card.querySelectorAll("p")[1].textContent;
    const status = card.querySelector(".status").textContent;
    // Show Borrow button only for lending resources
borrowRequestButton.style.display =
    status.toLowerCase().includes("lend") ? "block" : "none";

    // Display information
    document.querySelector("#detail-icon").textContent = icon;
    document.querySelector("#detail-name").textContent = name;
    document.querySelector("#detail-price").textContent = price;
    document.querySelector("#detail-category").textContent =
    card.dataset.category.charAt(0).toUpperCase() + card.dataset.category.slice(1);
    document.querySelector("#detail-condition").textContent = condition;
    document.querySelector("#detail-status").textContent = status;
    const availability = card.dataset.availability || "available";

document.querySelector("#detail-availability").textContent =
    "Availability: " + availability.charAt(0).toUpperCase() + availability.slice(1);
    document.querySelector("#detail-description").textContent =
    card.dataset.description || "No description provided.";

    // Switch screens
    screens.forEach(screen => screen.classList.remove("active"));
    detailsScreen.classList.add("active");
}

let previousScreen = "browse";
// Click on Browse card
document.querySelector(".browse-resources").addEventListener("click", function (event) {

    const card = event.target.closest(".browse-card");

    if (!card) return;

    // Ignore Save button clicks
    if (event.target.closest(".save-btn")) return;

    previousScreen = "browse";
openResourceDetails(card);
});

const savedContent = document.querySelector("#saved-content");


// Click on Saved card

savedContent.addEventListener("click", function (event) {

    const card = event.target.closest(".browse-card");

    if (!card) return;

    // Ignore button clicks
    if (event.target.closest("button")) return;

    previousScreen = "saved";
openResourceDetails(card);
});
    

// Back button
detailsBackButton.addEventListener("click", () => {
    detailsScreen.classList.remove("active");
    screens.forEach(screen => screen.classList.remove("active"));
    navItems.forEach(nav => nav.classList.remove("active"));

    if (previousScreen === "saved") {
        document.querySelector("#my-items-screen").classList.add("active");

        document.querySelectorAll(".my-items-tab").forEach(tab => {
            tab.classList.remove("active");
        });

        document.querySelector('[data-tab="saved"]').classList.add("active");

        document.querySelectorAll(".my-items-content").forEach(content => {
            content.classList.remove("active");
        });

        document.querySelector("#saved-content").classList.add("active");

        document.querySelector('[data-page="my-items"]').classList.add("active");

    } else {
        const targetScreen = previousScreen === "home" ? "home" : "browse";

        document.querySelector(`#${targetScreen}-screen`).classList.add("active");
        document.querySelector(`[data-page="${targetScreen}"]`).classList.add("active");
    }
});
// ReuseHub - Load Saved Resources

const savedResources = JSON.parse(localStorage.getItem("reusehub-saved")) || [];



savedResources.forEach(resource => {

    const savedCard = document.createElement("div");
    savedCard.className = "browse-card";
    savedCard.innerHTML = resource.html;
    // Restore resource information
savedCard.dataset.category = resource.category;
savedCard.dataset.description = resource.description;

    // Remove Save button from restored card
    const saveButton = savedCard.querySelector(".save-btn");
    if (saveButton) {
        saveButton.remove();
    }
    // Create Remove from Saved button
const removeSavedButton = document.createElement("button");
removeSavedButton.className = "remove-saved-btn";
removeSavedButton.textContent = "Remove from Saved";

removeSavedButton.addEventListener("click", () => {

    // Remove card from screen
    savedCard.remove();

    // Update Local Storage
    let currentSaved = JSON.parse(localStorage.getItem("reusehub-saved")) || [];

    currentSaved = currentSaved.filter(item => item.name !== resource.name);

    localStorage.setItem("reusehub-saved", JSON.stringify(currentSaved));

});
savedCard.appendChild(removeSavedButton);
    savedContent.appendChild(savedCard);

});

// Hide empty message if saved resources exist
if (savedResources.length > 0) {
    const emptyMessage = savedContent.querySelector(".empty-message");

    if (emptyMessage) {
        emptyMessage.remove();
    }
}
// ReuseHub - Contact Seller Popup

const contactSellerButton = document.querySelector("#contact-seller-btn");
const contactPopup = document.querySelector("#contact-popup");
const contactPopupOk = document.querySelector("#contact-popup-ok");

contactSellerButton.addEventListener("click", () => {
    contactPopup.classList.add("show");
});

contactPopupOk.addEventListener("click", () => {
    contactPopup.classList.remove("show");
});
// ReuseHub - Borrow Request

const borrowRequestButton = document.querySelector("#borrow-request-btn");
const borrowedContent = document.querySelector("#borrowed-content");
let isLoadingBorrowed = false;

borrowRequestButton.addEventListener("click", () => {

    // Get resource details from the currently open Details screen
const name = document.querySelector("#detail-name").textContent;
const icon = document.querySelector("#detail-icon").textContent;
const price = document.querySelector("#detail-price").textContent;

// Create a borrowed card
const borrowedCard = document.createElement("div");
borrowedCard.className = "my-listing-card";

borrowedCard.innerHTML = `
    <div class="my-listing-icon">${icon}</div>

    <div class="my-listing-details">
        <h3>${name}</h3>
        <p>${price}</p>
        <p class="status">Request Pending</p>
    </div>
`;

// Remove empty message
const emptyMessage = borrowedContent.querySelector(".empty-message");
if (emptyMessage) {
    emptyMessage.remove();
}

// Add resource to Borrowed tab
borrowedContent.prepend(borrowedCard);
addNotification("Your borrow request for " + name + " has been submitted.");
// Save borrowed request
if (!isLoadingBorrowed) {
    saveBorrowedRequests();
}
// Cancel Borrow Request button
const cancelButton = document.createElement("button");
cancelButton.textContent = "Cancel Request";
cancelButton.className = "cancel-request-btn";

cancelButton.addEventListener("click", () => {
    borrowedCard.remove();
    if (!isLoadingBorrowed) {
    saveBorrowedRequests();
}

// Show empty message if no borrowed requests remain
if (borrowedContent.querySelectorAll(".my-listing-card").length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "You haven't borrowed anything yet.";
    borrowedContent.append(emptyMessage);
}
});
borrowedCard.append(cancelButton);


document.querySelector("#borrow-request-popup").classList.add("show");

});

// ReuseHub - Borrow Request Popup
const borrowRequestPopup = document.querySelector("#borrow-request-popup");
const borrowRequestOk = document.querySelector("#borrow-request-ok");

borrowRequestOk.addEventListener("click", () => {
    borrowRequestPopup.classList.remove("show");
});
// ReuseHub - Edit Profile Toggle

const editProfileButton = document.querySelector("#edit-profile-btn");
const editProfileForm = document.querySelector("#edit-profile-form");

editProfileButton.addEventListener("click", () => {
    editProfileForm.classList.toggle("show");
});
// ReuseHub - Save Profile

editProfileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.querySelector("#profile-name").value;
    const college = document.querySelector("#profile-college").value;
    const branch = document.querySelector("#profile-branch").value;

    // Update profile display
    document.querySelector("#display-profile-name").textContent = name;

    document.querySelector("#display-profile-details").textContent =
        college + " • " + branch;

    // Save profile to browser storage
    localStorage.setItem("reusehub-profile", JSON.stringify({
        name: name,
        college: college,
        branch: branch
    }));

    // Close form after saving
    editProfileForm.classList.remove("show");

    document.querySelector("#profile-updated-popup").classList.add("show");
});

// ReuseHub - Cancel Edit Profile

const cancelEditProfile = document.querySelector("#cancel-edit-profile");

cancelEditProfile.addEventListener("click", () => {

    // Restore previously saved profile details
    const savedProfile = JSON.parse(localStorage.getItem("reusehub-profile"));

    if (savedProfile) {
        document.querySelector("#profile-name").value = savedProfile.name || "";
        document.querySelector("#profile-college").value = savedProfile.college || "";
        document.querySelector("#profile-branch").value = savedProfile.branch || "";
    }

    // Close the edit form
    editProfileForm.classList.remove("show");

});

// ReuseHub - Profile My Listings Shortcut

const profileMyListings = document.querySelector("#profile-my-listings");

profileMyListings.addEventListener("click", () => {

    // Open My Items screen
    screens.forEach(screen => screen.classList.remove("active"));
    document.querySelector("#my-items-screen").classList.add("active");

    // Select My Listings tab
    myItemTabs[0].click();

});
// ReuseHub - Profile My Transactions Shortcut

const profileMyTransactions = document.querySelector("#profile-my-transactions");

profileMyTransactions.addEventListener("click", () => {

    // Open My Items screen
    screens.forEach(screen => screen.classList.remove("active"));
    document.querySelector("#my-items-screen").classList.add("active");

    // Select Borrowed tab
    myItemTabs[1].click();

});
// ReuseHub - Settings Toggle

const profileSettings = document.querySelector("#profile-settings");
const settingsPanel = document.querySelector("#settings-panel");

profileSettings.addEventListener("click", () => {
    settingsPanel.classList.toggle("show");
});
// ReuseHub - Dark Mode Toggle

const darkModeToggle = document.querySelector("#dark-mode-toggle");

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkModeToggle.textContent = "☀️ Disable Dark Mode";
    } else {
        darkModeToggle.textContent = "🌙 Enable Dark Mode";
    }
});

// ReuseHub - Cancel Settings

const cancelSettingsButton = document.querySelector("#cancel-settings-btn");

cancelSettingsButton.addEventListener("click", () => {
    settingsPanel.classList.remove("show");
});
// ReuseHub - Load Saved Listings

const savedListings = JSON.parse(localStorage.getItem("reusehub-listings")) || [];

isLoadingListings = true;

savedListings.forEach(listing => {

    // Fill the form with saved listing data
    document.querySelector("#item-name").value = listing.name;
    document.querySelector("#item-category").value = listing.category;
    document.querySelector("#item-price").value = listing.price;
    document.querySelector("#item-condition").value = listing.condition;
    document.querySelector("#item-type").value = listing.type;
    document.querySelector("#item-description").value = listing.description;
    document.querySelector("#item-availability").value = listing.availability || "available";

    // Trigger the existing form logic
    resourceForm.dispatchEvent(new Event("submit", {
        bubbles: true,
        cancelable: true
    }));

});

isLoadingListings = false;
// ReuseHub - Load Saved Profile

const savedProfile = localStorage.getItem("reusehub-profile");

if (savedProfile) {
    const profile = JSON.parse(savedProfile);

    document.querySelector("#display-profile-name").textContent =
        profile.name;

    document.querySelector("#display-profile-details").textContent =
        profile.college + " • " + profile.branch;
}
// ReuseHub - Save Borrowed Requests

function saveBorrowedRequests() {

    const borrowedCards = borrowedContent.querySelectorAll(".my-listing-card");

    const borrowedData = [];

    borrowedCards.forEach(card => {
        borrowedData.push({
            html: card.innerHTML
        });
    });

    localStorage.setItem("reusehub-borrowed", JSON.stringify(borrowedData));
}
// ReuseHub - Load Borrowed Requests

function loadBorrowedRequests() {

    const borrowedData = JSON.parse(localStorage.getItem("reusehub-borrowed")) || [];

    borrowedData.forEach(item => {

        const borrowedCard = document.createElement("div");
        borrowedCard.className = "my-listing-card";
        borrowedCard.innerHTML = item.html;

        // Restore Cancel Request button
const cancelButton = document.createElement("button");
cancelButton.textContent = "Cancel Request";
cancelButton.className = "cancel-request-btn";

cancelButton.addEventListener("click", () => {

    borrowedCard.remove();
    saveBorrowedRequests();

    if (borrowedContent.querySelectorAll(".my-listing-card").length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "You haven't borrowed anything yet.";
        borrowedContent.append(emptyMessage);
    }
});

borrowedCard.append(cancelButton);

        borrowedContent.prepend(borrowedCard);

    });

    // Remove empty message if requests exist
    if (borrowedData.length > 0) {
        const emptyMessage = borrowedContent.querySelector(".empty-message");

        if (emptyMessage) {
            emptyMessage.remove();
        }
    }
}
// Load borrowed requests when ReuseHub starts
loadBorrowedRequests();
// ReuseHub - Browse Sorting

const sortDropdown = document.querySelector("#browse-sort");
const browseContainer = document.querySelector(".browse-resources");

if (sortDropdown && browseContainer) {

    sortDropdown.addEventListener("change", function () {

        const cards = Array.from(
            browseContainer.querySelectorAll(".browse-card")
        );

        if (sortDropdown.value === "price-low") {
            cards.sort((a, b) => {
                const priceA = parseFloat(
                    a.querySelector(".price")?.textContent.replace(/[^\d.]/g, "") || 0
                );
                const priceB = parseFloat(
                    b.querySelector(".price")?.textContent.replace(/[^\d.]/g, "") || 0
                );
                return priceA - priceB;
            });
        }

        else if (sortDropdown.value === "price-high") {
            cards.sort((a, b) => {
                const priceA = parseFloat(
                    a.querySelector(".price")?.textContent.replace(/[^\d.]/g, "") || 0
                );
                const priceB = parseFloat(
                    b.querySelector(".price")?.textContent.replace(/[^\d.]/g, "") || 0
                );
                return priceB - priceA;
            });
        }

        else if (sortDropdown.value === "recent") {
            cards.reverse();
        }

        else {
            cards.sort((a, b) => {
                return Number(a.dataset.order || 0) - Number(b.dataset.order || 0);
            });
        }

        cards.forEach(card => browseContainer.appendChild(card));

    });
}
// ReuseHub - Home Category Navigation

document.querySelectorAll(".category[data-category]").forEach(categoryCard => {

    categoryCard.addEventListener("click", () => {

        const category = categoryCard.dataset.category;

        // Open Browse screen
        document.querySelector('[data-page="browse"]').click();

        // Activate the matching Browse filter
        const matchingFilter = document.querySelector(
            `.filter[data-category="${category}"]`
        );

        if (matchingFilter) {
            matchingFilter.click();
        }

    });

});
// ReuseHub - Home Category Navigation

const homeCategoryCards = document.querySelectorAll(".category[data-category]");

homeCategoryCards.forEach(card => {
    card.addEventListener("click", () => {

        // Get the selected category
        const category = card.dataset.category;

        // Activate the matching Browse filter
        const matchingFilter = document.querySelector(
            `.filter[data-category="${category}"]`
        );

        if (matchingFilter) {
            matchingFilter.click();
        }

        // Navigate to Browse screen
        screens.forEach(screen => screen.classList.remove("active"));
        document.getElementById("browse-screen").classList.add("active");

        // Update bottom navigation
        navItems.forEach(nav => nav.classList.remove("active"));
        document.querySelector('.nav-item[data-page="browse"]').classList.add("active");

    });
});
// ReuseHub - Dynamic Featured Resource

const featuredCard = document.querySelector("#featured-resource-card");

function updateFeaturedResource() {

    const listings = JSON.parse(
        localStorage.getItem("reusehub-listings") || "[]"
    );

    const featured = listings[0];

    if (!featured) return;

    // Dynamic Icon based on Category
    const categoryIcons = {
        books: "📖",
        stationery: "✏️",
        lab: "🥼",
        electronics: "🔌"
    };

    const icon = categoryIcons[featured.category] || "📦";

    featuredCard.querySelector(".resource-icon").textContent = icon;

    // Update Featured Resource display
    featuredCard.querySelector("h3").textContent = featured.name;

    featuredCard.querySelector(".price").textContent =
        "Price: ₹" + featured.price;

    featuredCard.querySelector(".resource-details").children[2].textContent =
        "Condition: " + featured.condition;
}

// Update Featured Resource on page load
updateFeaturedResource();

featuredCard.addEventListener("click", () => {

    const listings = JSON.parse(
        localStorage.getItem("reusehub-listings") || "[]"
    );

    // Use the first listing, or the default featured resource
    const featured = listings[0] || {
        name: "Engineering Mechanics",
        price: 200,
        condition: "Good",
        category: "books",
        availability: "available",
        description: "No description provided.",
        type: "exchange"
    };

    // ReuseHub - Featured Laboratory Coat Details
const featuredLabcoatCard = document.querySelector("#featured-labcoat-card");

featuredLabcoatCard.addEventListener("click", () => {

    const tempCard = document.createElement("div");
    tempCard.className = "browse-card";

    tempCard.dataset.category = "lab";
    tempCard.dataset.availability = "available";
    tempCard.dataset.description = "Laboratory coat in good condition.";

    tempCard.innerHTML = `
        <div class="browse-book-icon">🥼</div>
        <h3></h3>
        <p class="price"></p>
        <p></p>
        <p class="status"></p>
    `;

    tempCard.querySelector("h3").textContent = "Laboratory Coat";
    tempCard.querySelector(".price").textContent = "Price: ₹150";
    tempCard.querySelectorAll("p")[1].textContent = "Condition: Good";
    tempCard.querySelector(".status").textContent = "Available for sale";

    previousScreen = "home";
    openResourceDetails(tempCard);
});

    // Create a temporary Browse-style card
    const tempCard = document.createElement("div");
    tempCard.className = "browse-card";

    tempCard.dataset.category = featured.category || "books";
    tempCard.dataset.availability = featured.availability || "available";
    tempCard.dataset.description = featured.description || "No description provided.";

    tempCard.innerHTML = `
        <div class="browse-book-icon">📖</div>
        <h3></h3>
        <p class="price"></p>
        <p></p>
        <p class="status"></p>
    `;

    tempCard.querySelector("h3").textContent = featured.name;
    tempCard.querySelector(".price").textContent = "Price: ₹" + featured.price;
    tempCard.querySelectorAll("p")[1].textContent = "Condition: " + featured.condition;
    tempCard.querySelector(".status").textContent =
        "Available for " + (featured.type || "exchange");

    // Open Resource Details
    previousScreen = "home";
    openResourceDetails(tempCard);

});
// ReuseHub - Cancel Add/Edit Resource

const cancelButton = document.querySelector(".cancel-item-btn");

cancelButton.addEventListener("click", () => {

    // Clear the form
    resourceForm.reset();

    // Exit edit mode
    editingCard = null;
    editingBrowseCard = null;

    // Close the form
    resourceForm.classList.remove("show");

});

// ReuseHub - Notification Panel Toggle

const notificationButton = document.querySelector("#notification-btn");
const notificationPanel = document.querySelector("#notification-panel");
const notificationDot = document.querySelector(".notification-dot");

notificationButton.addEventListener("click", () => {
    if (notificationPanel.style.display === "block") {
        notificationPanel.style.display = "none";
    } else {
        notificationPanel.style.display = "block";
        notificationDot.style.display = "none";
    }
});

// ReuseHub - Close Notifications on Outside Click

document.addEventListener("click", (event) => {

    if (
        notificationPanel.style.display === "block" &&
        !notificationPanel.contains(event.target) &&
        !notificationButton.contains(event.target)
    ) {
        notificationPanel.style.display = "none";
    }

});

// ReuseHub - Persistent Notifications

let notificationMessages = JSON.parse(
    localStorage.getItem("reusehub-notifications") || "[]"
);

function addNotification(message) {
    notificationMessages.unshift(message);

    // Save notifications
    localStorage.setItem(
        "reusehub-notifications",
        JSON.stringify(notificationMessages)
    );

    const notificationContent = document.querySelector(".notification-content");

    // Remove empty state
    notificationContent.innerHTML = "";

    // Display all notifications
    notificationMessages.forEach(message => {
        const notification = document.createElement("div");
        notification.className = "notification-item";
        notification.textContent = message;
        notificationContent.appendChild(notification);
    });

    // Show red dot
    notificationDot.style.display = "block";
}

// ReuseHub - Load Saved Notifications

const notificationContent = document.querySelector(".notification-content");

if (notificationMessages.length > 0) {
    notificationContent.innerHTML = "";

    notificationMessages.forEach(message => {
        const notification = document.createElement("div");
        notification.className = "notification-item";
        notification.textContent = message;
        notificationContent.appendChild(notification);
    });

    notificationDot.style.display = "block";
} else {
    notificationContent.innerHTML = `
        <p>You're all caught up!</p>
        <span>No new notifications right now.</span>
    `;
    notificationDot.style.display = "none";
}

// ReuseHub - Clear All Notifications

const clearNotificationsButton = document.querySelector("#clear-notifications-btn");

clearNotificationsButton.addEventListener("click", () => {
    notificationMessages = [];

    localStorage.setItem("reusehub-notifications", "[]");

    notificationContent.innerHTML = `
        <p>You're all caught up!</p>
        <span>No new notifications right now.</span>
    `;

    notificationDot.style.display = "none";
});
// ReuseHub - Register Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("ReuseHub offline support is active!"))
            .catch(error => console.log("Service Worker registration failed:", error));
    });
}

// ReuseHub - Item Added Popup
const itemAddedPopup = document.querySelector("#item-added-popup");
const itemAddedOk = document.querySelector("#item-added-ok");

itemAddedOk.addEventListener("click", () => {
    itemAddedPopup.classList.remove("show");
});

// ReuseHub - Profile Updated Popup
const profileUpdatedPopup = document.querySelector("#profile-updated-popup");
const profileUpdatedOk = document.querySelector("#profile-updated-ok");

profileUpdatedOk.addEventListener("click", () => {
    profileUpdatedPopup.classList.remove("show");
});
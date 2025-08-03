// Get the navigation buttons and the page sections
const reactionNavBtn = document.getElementById("nav-reaction")
const aimNavBtn = document.getElementById("nav-aim")

const reactionPage = document.getElementById("page-reaction")
const aimPage = document.getElementById("page-aim")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
    // Show reaction test by default
    showReactionPage()

    // Add event listeners to the navigation buttons
    reactionNavBtn.addEventListener("click", () => {
        showReactionPage()
    })

    aimNavBtn.addEventListener("click", () => {
        showAimPage()
    })
})

function showReactionPage() {
    // Hide all pages
    aimPage.style.display = "none"
    // Show the reaction page
    reactionPage.style.display = "block"

    // Update active navigation button
    reactionNavBtn.classList.add("active")
    aimNavBtn.classList.remove("active")
}

function showAimPage() {
    // Hide all pages
    reactionPage.style.display = "none"
    // Show the aim page
    aimPage.style.display = "block"

    // Update active navigation button
    aimNavBtn.classList.add("active")
    reactionNavBtn.classList.remove("active")
}

// Utility function to reset all games when switching pages
function resetAllGames() {
    // Reset reaction test if it exists
    if (window.reactionTest) {
        window.reactionTest.reset()
    }

    // Reset aim trainer if it exists
    if (window.aimTrainer) {
        window.aimTrainer.showModeSelection()
    }
}

// Add reset functionality when switching pages
reactionNavBtn.addEventListener("click", resetAllGames)
aimNavBtn.addEventListener("click", resetAllGames)
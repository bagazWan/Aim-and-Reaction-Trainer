class ReactionTest {
    constructor() {
        this.gameArea = document.getElementById("reaction-game-area")
        this.display = document.getElementById("reaction-display")
        this.text = document.getElementById("reaction-text")
        this.subtext = document.getElementById("reaction-subtext")
        this.results = document.getElementById("reaction-results")
        this.reactionTime = document.getElementById("reaction-time")
        this.retryBtn = document.getElementById("reaction-retry")

        this.startTime = 0
        this.timeout = null
        this.isWaiting = false
        this.isReady = false

        this.init()
    }

    init() {
        this.display.addEventListener("click", () => this.handleClick())
        this.retryBtn.addEventListener("click", () => this.reset())
        this.reset()
    }

    handleClick() {
        if (this.isWaiting) {
            this.tooEarly()
        } else if (this.isReady) {
            this.measureReaction()
        } else {
            this.startTest()
        }
    }

    startTest() {
        this.isWaiting = true
        this.display.className = "reaction-display waiting"
        this.text.textContent = "Wait for green..."
        this.subtext.textContent = "Get ready to click"

        // Delay between 3-5 seconds
        const delay = Math.random() * 2000 + 3000

        this.timeout = setTimeout(() => {
        this.showGreen()
        }, delay)
    }

    showGreen() {
        this.isWaiting = false
        this.isReady = true
        this.startTime = performance.now()

        this.display.className = "reaction-display ready"
        this.text.textContent = "CLICK NOW!"
        this.subtext.textContent = ""
    }

    measureReaction() {
        const endTime = performance.now()
        const reactionTimeMs = Math.round(endTime - this.startTime)

        this.showResults(reactionTimeMs)
    }

    tooEarly() {
        clearTimeout(this.timeout)
        this.isWaiting = false
        this.isReady = false

        this.display.className = "reaction-display too-early"
        this.text.textContent = "Too early!"
        this.subtext.textContent = "Click to try again"
    }

    showResults(time) {
        this.gameArea.style.display = "none"
        this.results.classList.remove("hidden")
        this.reactionTime.textContent = `${time} ms`
    }

    reset() {
        clearTimeout(this.timeout)
        this.isWaiting = false
        this.isReady = false
    
        this.gameArea.style.display = "block"
        this.results.classList.add("hidden")
    
        this.display.className = "reaction-display waiting"
        this.text.textContent = "Click to start"
        this.subtext.textContent = "Wait for green, then click!"
    }
}

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", () => {
    new ReactionTest()
})
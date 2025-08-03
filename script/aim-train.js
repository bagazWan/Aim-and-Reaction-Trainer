class AimTrainer {
    constructor() {
        this.modeSelection = document.getElementById("aim-mode-selection")
        this.gameArea = document.getElementById("aim-game-area")
        this.canvas = document.getElementById("aim-canvas")
        this.results = document.getElementById("aim-results")

        // UI elements
        this.targetsHitSpan = document.getElementById("targets-hit")
        this.totalTargetsSpan = document.getElementById("total-targets")
        this.timerSpan = document.getElementById("game-timer")
        this.backBtn = document.getElementById("aim-back")
        this.retryBtn = document.getElementById("aim-retry")
        this.menuBtn = document.getElementById("aim-menu")
        this.resultsTitle = document.getElementById("results-title")
        this.statLabel = document.getElementById("stat-label")
        this.statValue = document.getElementById("stat-value")

        // Game state
        this.currentMode = null
        this.gameStartTime = 0
        this.targetsHit = 0
        this.totalTargets = 20
        this.targetsShown = 0
        this.currentTarget = null
        this.gameActive = false
        this.difficulty = "medium"
        this.targetTimes = []
        this.reflexTargetTimeout = null

        this.init()
    }

    init() {
        // Mode selection buttons
        document.querySelectorAll(".mode-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
            const mode = e.target.dataset.mode
            this.startMode(mode)
            })
        })

      // Control buttons
        this.backBtn.addEventListener("click", () => this.showModeSelection())
        this.retryBtn.addEventListener("click", () => this.startMode(this.currentMode))
        this.menuBtn.addEventListener("click", () => this.showModeSelection())

      // Canvas click handler
        this.canvas.addEventListener("click", (e) => this.handleCanvasClick(e))
    }

    startMode(mode) {
        this.currentMode = mode

        if (mode === "basic") {
            this.totalTargets = Number.parseInt(document.getElementById("target-count").value)
            this.startBasicMode()
        } else if (mode === "reflex") {
            this.difficulty = document.getElementById("difficulty").value
            this.totalTargets = 30
            this.startReflexMode()
        }

        this.showGameArea()
    }

    startBasicMode() {
        this.resetGame()
        this.gameActive = true
        this.gameStartTime = performance.now()
        this.createTarget()
        this.startTimer()
    }

    startReflexMode() {
        this.resetGame()
        this.gameActive = true
        this.gameStartTime = performance.now()
        this.createReflexTarget()
        this.startTimer()
    }

    resetGame() {
        this.targetsHit = 0
        this.targetsShown = 0
        this.targetTimes = []
        this.clearCanvas()
        this.updateUI()
        clearTimeout(this.reflexTargetTimeout)
    }

    createTarget() {
        this.clearCanvas()

        const target = document.createElement("div")
        target.className = "target"

        // Get actual canvas dimensions and target size
        const canvasRect = this.canvas.getBoundingClientRect()
        const targetSize = 60

        // Calculate safe boundaries (subtract target size from max positions)
        const maxX = this.canvas.offsetWidth - targetSize
        const maxY = this.canvas.offsetHeight - targetSize

        // Ensure minimum margins from edges
        const margin = 10
        const safeMaxX = Math.max(margin, maxX - margin)
        const safeMaxY = Math.max(margin, maxY - margin)

        const x = Math.random() * safeMaxX + margin
        const y = Math.random() * safeMaxY + margin

        target.style.left = x + "px"
        target.style.top = y + "px"

        target.addEventListener("click", (e) => {
            e.stopPropagation()
            this.hitTarget(target)
        })

        this.canvas.appendChild(target)
        this.currentTarget = target
        this.targetStartTime = performance.now()
    }

    createReflexTarget() {
        // Check if game should end based on targets shown, not targets hit
        if (!this.gameActive || this.targetsShown >= this.totalTargets) {
            this.endGame()
            return
        }
    
        this.targetsShown++ // Increment targets shown counter
        this.createTarget()
    
        // Set disappear timeout based on difficulty
        let disappearTime
        switch (this.difficulty) {
            case "easy":
                disappearTime = 1500
            break
            case "medium":
                disappearTime = 1000
            break
            case "hard":
                disappearTime = 600
            break
        }
    
        this.reflexTargetTimeout = setTimeout(() => {
            if (this.currentTarget && this.gameActive) {
                this.missTarget()
            }
        }, disappearTime)
    }

    hitTarget(target) {
        if (!this.gameActive) return
    
        const hitTime = performance.now()
        const targetTime = hitTime - this.targetStartTime
        this.targetTimes.push(targetTime)
    
        // Visual feedback
        target.classList.add("hit")
        setTimeout(() => {
            if (target.parentNode) {
                target.parentNode.removeChild(target)
            }
        }, 100)
    
        this.targetsHit++
        this.updateUI()
    
        clearTimeout(this.reflexTargetTimeout)
    
        if (this.currentMode === "basic") {
            // Basic mode: end when all targets are hit
            if (this.targetsHit >= this.totalTargets) {
                this.endGame()
            } else {
                setTimeout(() => this.createTarget(), 100)
            }
        } else {
            // Reflex mode: continue until all targets are shown
            if (this.targetsShown < this.totalTargets) {
                const delay = Math.random() * 500 + 200
                setTimeout(() => this.createReflexTarget(), delay)
            } else {
                this.endGame()
            }
        }
    }

    missTarget() {
        if (this.currentTarget) {
            this.currentTarget.remove()
            this.currentTarget = null
        }
    
        // Continue game if we haven't shown all targets yet
        if (this.targetsShown < this.totalTargets && this.gameActive) {
            const delay = Math.random() * 500 + 200
            setTimeout(() => this.createReflexTarget(), delay)
        } else if (this.targetsShown >= this.totalTargets) {
            // End game if all targets have been shown
            this.endGame()
        }
    }

    endGame() {
        this.gameActive = false
        clearTimeout(this.reflexTargetTimeout)
        this.clearCanvas()
        this.showResults()
    }

    showResults() {
        this.gameArea.classList.add("hidden")
        this.results.classList.remove("hidden")
    
        if (this.currentMode === "basic") {
            const avgTime = this.targetTimes.reduce((a, b) => a + b, 0) / this.targetTimes.length
            this.resultsTitle.textContent = "Basic Mode Results"
            this.statLabel.textContent = "Average Time per Target"
            this.statValue.textContent = `${Math.round(avgTime)} ms`
        } else {
            this.resultsTitle.textContent = "Reflex Mode Results"
            this.statLabel.textContent = "Targets Hit"
            this.statValue.textContent = `${this.targetsHit}/${this.totalTargets}`
        }
    }

    showModeSelection() {
        this.gameActive = false
        clearTimeout(this.reflexTargetTimeout)
        this.modeSelection.classList.remove("hidden")
        this.gameArea.classList.add("hidden")
        this.results.classList.add("hidden")
        this.clearCanvas()
    }

    showGameArea() {
        this.modeSelection.classList.add("hidden")
        this.gameArea.classList.remove("hidden")
        this.results.classList.add("hidden")
    }

    clearCanvas() {
        this.canvas.innerHTML = ""
        this.currentTarget = null
    }

    updateUI() {
        this.targetsHitSpan.textContent = this.targetsHit
        this.totalTargetsSpan.textContent = this.totalTargets
    }

    startTimer() {
        const updateTimer = () => {
            if (this.gameActive) {
            const elapsed = (performance.now() - this.gameStartTime) / 1000
            this.timerSpan.textContent = elapsed.toFixed(2) + "s"
            requestAnimationFrame(updateTimer)
            }
        }
        updateTimer()
        }
}

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", () => {
    new AimTrainer()
})
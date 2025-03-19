class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.timerId = null;
        this.isRunning = false;
        
        // Timer durations in minutes
        this.durations = {
            pomodoro: 25,
            shortBreak: 5,
            longBreak: 15,
            rest: 5,
            work: 25
        };
        
        this.currentMode = 'pomodoro';
        this.totalTime = this.durations[this.currentMode] * 60;
        
        this.isWorkMode = true;
        
        this.requestNotificationPermission();
        this.initializeElements();
        this.initializeEventListeners();
        this.updateDisplay();
        this.originalTitle = "Pomodoro Timer";  // Set default title
        document.title = this.originalTitle;     // Set initial document title
    }

    initializeElements() {
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.pomodoroButton = document.getElementById('pomodoro');
        this.shortBreakButton = document.getElementById('shortBreak');
        this.longBreakButton = document.getElementById('longBreak');
        this.progressBar = document.querySelector('.progress');
        this.alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        this.workRestToggle = document.getElementById('workRestToggle');
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.pomodoroButton.addEventListener('click', () => this.setMode('pomodoro'));
        this.shortBreakButton.addEventListener('click', () => this.setMode('shortBreak'));
        this.longBreakButton.addEventListener('click', () => this.setMode('longBreak'));
        this.workRestToggle.addEventListener('click', () => this.toggleWorkRest());
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update timer display
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        
        // Update browser tab title - show remaining time first
        document.title = `(${timeString}) ${this.originalTitle}`;
        
        // Update progress bar
        const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
        this.progressBar.style.width = `${100 - progress}%`;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();

                if (this.timeLeft === 0) {
                    this.playAlarm();
                    this.pause();
                }
            }, 1000);
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
    }

    reset() {
        this.pause();
        this.timeLeft = this.durations[this.currentMode] * 60;
        this.totalTime = this.timeLeft;
        this.updateDisplay();
        document.title = this.originalTitle;  // Reset title when timer is reset
    }

    setMode(mode) {
        this.pause();
        this.currentMode = mode;
        this.timeLeft = this.durations[mode] * 60;
        this.totalTime = this.timeLeft;
        this.updateDisplay();

        // Update active button
        [this.pomodoroButton, this.shortBreakButton, this.longBreakButton].forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(mode).classList.add('active');
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            await Notification.requestPermission();
        }
    }

    toggleWorkRest() {
        this.isWorkMode = !this.isWorkMode;
        
        // Update icon and button style
        const icon = this.workRestToggle.querySelector('i');
        if (this.isWorkMode) {
            icon.className = 'fas fa-laptop';
            this.workRestToggle.classList.remove('rest-mode');
            this.timeLeft = this.durations.work * 60;
        } else {
            icon.className = 'fas fa-coffee';
            this.workRestToggle.classList.add('rest-mode');
            this.timeLeft = this.durations.rest * 60;
        }
        
        // Reset timer with new duration
        this.pause();
        this.totalTime = this.timeLeft;
        this.updateDisplay();
    }

    playAlarm() {
        this.alarmSound.play();
        document.title = '🔔 Time is up! - ' + this.originalTitle;  // Add notification to title
        
        if (Notification.permission === 'granted') {
            const mode = this.isWorkMode ? 'Work' : 'Rest';
            new Notification('Pomodoro Timer', {
                body: `${mode} session completed!`,
                icon: 'https://example.com/icon.png'
            });
        }
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PomodoroTimer();
}); 
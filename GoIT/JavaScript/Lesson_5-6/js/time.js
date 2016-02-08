var timer = {
    timeData: document.getElementById("timer"),
    timeZero: "00:00:00:000",
    timerId: 0,
    startButton: document.getElementById("startButton"),
    pauseButton: document.getElementById("pauseButton"),
    clearButton: document.getElementById("clearButton"),

    handler: function(event) {  
        timer.guard(event.target);
        
    },

    guard: function(el) {   
        if (el === this.startButton) {
           this.runTimer(); 
           el.style.display = "none";
           this.pauseButton.style.display = "inline"; 
        }

        if (el === this.pauseButton) {
            clearInterval(this.timerId);
        }

        if (el === this.clearButton) {
            timer.timeData.innerHTML = timer.timeZero;
            clearInterval(this.timerId);
            this.startButton.style.display = "";
            this.pauseButton.style.display = "";
        }
    },

    runTimer: function() {  
        var arr = this.timeData.innerHTML.split(":");
        var h = arr[0];
        var m = arr[1];
        var s = arr[2];
        var ms = arr[3];
        var self = this;

        this.timerId = setInterval(function() {
            ms++;

            if (ms === 1000) {
                s++;
                ms = 0;

                if (s < 10) {
                s = "0" + s;
                }
            }

            if (ms < 10) {
                ms = "00" + ms;
            }

            if (ms >=10 && ms < 100) {
                ms = "0" + ms;
            }


            if (s === 60) {
                m++;
                s = "00";

                if (m < 10) {
                m = "0" + m;
                }
            }

            if (m === 60) {
                h++;
                m = "00";

                if (h < 10) {
                h = "0" + h;
                }
            }
     
            self.timeData.innerHTML = h+":"+m+":"+s+":"+ms;
        
        }, 1);
    }
};


window.addEventListener('click', timer.handler);


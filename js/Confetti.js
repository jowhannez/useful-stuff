export class Confetti {
    constructor() {
        this.maxParticleCount  = 150;
        this.particleSpeed     = 2;
        this.colors            = [
            "rgb(255,214,41)",  // Gul
            "rgb(237,105,75)",  // Rød
            "rgb(54,102,79)",   // Mørkegrønn
            "rgb(65,141,105)",  // Mellomgrønn
            "rgb(137,209,244)", // Isblå
            "rgb(0,102,179)"    // Dypblå
        ];
        this.streamingConfetti = false;
        this.animationTimer    = null;
        this.particles         = [];
        this.waveAngle         = 0;
        this.canvas            = null;
        this.context           = null;
    }
    startConfettiInner() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		this.canvas = document.getElementById("confetti-canvas");
		if (!this.canvas) {
			this.canvas = document.createElement("canvas");
			this.canvas.setAttribute("id", "confetti-canvas");
			this.canvas.setAttribute("style", "position:absolute;z-index:999999;pointer-events:none;top:0;left:0;right:0;bottom:0;");
			document.body.appendChild(this.canvas);
			this.canvas.width = width;
			this.canvas.height = height;
			window.addEventListener("resize", function() {
				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
			}, true);
		}

		this.context = this.canvas.getContext("2d");
		while (this.particles.length < this.maxParticleCount) {
            this.particles.push(this.resetParticle({}, width, height));
            this.streamingConfetti = true;
        }

        this.animationInterval = setInterval(() => {
            this.runAnimation();
        }, 1000/60)
	}
    runAnimation() {
        this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.updateParticles();
        this.drawParticles();
    }
    stopConfettiInner() {
		this.streamingConfetti = false;
        setTimeout(() => {
            clearInterval(this.animationInterval);
        }, 5000)
	}
    resetParticle(particle, width, height) {
		particle.color = this.colors[(Math.random() * this.colors.length) | 0];
		particle.x = Math.random() * width;
		particle.y = Math.random() * height - height;
		particle.diameter = Math.random() * 10 + 5;
		particle.tilt = Math.random() * 10 - 10;
		particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
		particle.tiltAngle = 0;

		return particle;
	}
    drawParticles() {
		for (let i = 0; i < this.particles.length; i++) {
			let particle = this.particles[i];
			this.context.beginPath();
			this.context.lineWidth = particle.diameter;
			this.context.strokeStyle = particle.color;
			
            const x = particle.x + particle.tilt;
			this.context.moveTo(x + particle.diameter / 2, particle.y);
			this.context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
			this.context.stroke();
		}
	}
    updateParticles() {
		this.waveAngle += 0.01;
		const width = window.innerWidth;
		const height = window.innerHeight;
		for (let i = 0; i < this.particles.length; i++) {
			let particle = this.particles[i];

			if (!this.streamingConfetti && particle.y < -15) {
				particle.y = height + 100;
            } else {
				particle.tiltAngle += particle.tiltAngleIncrement;
				particle.x += Math.sin(this.waveAngle);
				particle.y += (Math.cos(this.waveAngle) + particle.diameter + this.particleSpeed) * 0.5;
				particle.tilt = Math.sin(particle.tiltAngle) * 15;
			}

			if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
				if (this.streamingConfetti && this.particles.length <= this.maxParticleCount) {
                    this.resetParticle(particle, width, height);
                } else {
					this.particles.splice(i, 1);
					i--;
				}
			}
		}
	}
}

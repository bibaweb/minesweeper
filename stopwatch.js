// export default class StopWatch {
class StopWatch {
  constructor() {
    this.minutes = '00';
    this.seconds = '00';
    this.secBLock = document.querySelector('.game__seconds');
    this.minBLock = document.querySelector('.game__minutes');
    this.startButton = document.querySelector('.game__button');
    this.interval = 0;
    this.setInterval = () => {
      this.interval = setInterval(this.countTime.bind(this), 1000);
    };
  }

  countTime() {
    this.seconds++;
    if (this.seconds < 9) {
      
      this.secBLock.textContent = '0' + this.seconds;
    }
    if (this.seconds > 9) {
      this.secBLock.textContent = this.seconds;
    }
    if (this.seconds > 59) {
      this.minutes++;
      this.minBLock.textContent = '0' + this.minutes + ':';
      this.seconds = 0;
      this.secBLock.textContent = '0' + this.seconds;
    }
    if (this.minutes > 9) {
      this.minBLock.textContent = this.minutes + ':';
    }
  }

  stopTime() {
    clearInterval(this.interval);
  }

  resetTime() {
    clearInterval(this.interval);
    this.minutes = '00';
    this.seconds = '00';
  }

  // если время больше 30 минут, попап
}

const stopwatch = new StopWatch();

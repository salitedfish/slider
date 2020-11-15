class Slider {
  constructor(el, options) {
    //以下利用对象的解构赋值，将用户传入数据与默认数据结合
    this.options = {
      ...{
        initIndex: 0,
        speed: 300,
        hasIndicator: false,
        autochange: false
      }, ...options
    };
    this.el = el;
    this.itemContent = el.querySelector(".slider-item-container");
    this.items = this.itemContent.querySelectorAll('.slider-item');
    this.distancePerSlider = this.items[0].offsetWidth;

    this.minIndex = 0;
    this.maxIndex = this.items.length - 1;
    this.index = this._adjustIndex(this.options.initIndex);
    this.ischange = false;
    if (this.options.autochange) {
      this.autoRoll();
    }
    this.move(this.getDistanceByIndex(this.index));
    if (this.options.hasIndicator) {
      this._createIndicators();
      this._setIndicatorActive(this.index);
    }
  }
  //设置自动轮播
  autoRoll() {
    let sli = this;
    let autoPlay = setInterval(() => {
      sli.next()
    }, 1000);
    //鼠标进入关闭定时器
    this.el.addEventListener("mouseenter", () => {
      clearInterval(autoPlay)
    }, false)
    //鼠标离开开启定时器
    this.el.addEventListener("mouseleave", () => {
      this.autoRoll()
    }, false)
  }
  to(index) {
    //以下为设置函数节流
    if (this.ischange) return;
    this.ischange = true;
    this.index = index;
    this.move(this.getDistanceByIndex(this.index));
    if (this.options.hasIndicator) {
      this._setIndicatorActive(this.index);
    }
    this._setTransitionSpeed(this.options.speed);
    //以下为设置函数节流
    let sli = this;
    setTimeout(() => {
      sli.ischange = false
    }, 1000)
  }
  prev() {
    while (this.index == 0) {
      this.index = this.maxIndex + 1
    }
    // this.index -= 1
    // this.move(this.getDistanceByIndex(this.index));
    // this._setIndicatorActive(this.index);
    this.to(this.index - 1)
  }
  next() {
    while (this.index == this.maxIndex) {
      this.index = -1
    }
    // this.index += 1
    // this.move(this.getDistanceByIndex(this.index));
    // this._setIndicatorActive(this.index);
    this.to(this.index + 1)
  }
  //以下为根据传入的speed给图片父元素设置动画
  _setTransitionSpeed(speed) {
    this.itemContent.style.transition = `transform ${speed / 1000}s`;
  }
  _adjustIndex(index) {
    if (index < this.minIndex) {
      index = this.minIndex
    } else if (index > this.maxIndex) {
      index = this.maxIndex
    }
    return index
  }
  //以下为移动到指定距离的函数
  move(distance) {
    this.itemContent.style.transform = `translate3d(${distance}px,0,0)`
  }
  //以下为根据index获取到指定的距离
  getDistanceByIndex(index) {
    return -index * this.distancePerSlider
  }
  //以下为根据图片数量动态创建原点
  _createIndicators() {
    const indicatorContainer = document.createElement("div")
    let html = '';
    indicatorContainer.className = "slider-indicator-container";
    for (let i = 0; i <= this.maxIndex; i++) {
      html += '<span class="slider-indicator"></span>';
    }
    indicatorContainer.innerHTML = html;
    this.el.appendChild(indicatorContainer)

    const indicators = document.querySelectorAll(".slider-indicator")
    const that = this
    for (let i = 0; i < indicators.length; i++) {
      indicators[i].addEventListener("click", () => {
        that.to(i)
      }, false)
    }
  }
  //以下为给动态原点根据index添加属性
  _setIndicatorActive(index) {
    this.indiactors = this.indiacators || this.el.querySelectorAll('.slider-indicator');
    //先循环移除所有元素的对应属性
    for (let i = 0; i < this.indiactors.length; i++) {
      this.indiactors[i].classList.remove('slider-indicator-active')
    }
    //再根据index给对应元素添加属性
    this.indiactors[index].classList.add('slider-indicator-active')
  }

}

export default Slider




//给小圆点循环添加事件监听
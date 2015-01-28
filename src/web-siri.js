/**
 * 类似Siri的Web实时波动展示
 * @author xuhua.yolo@gmail.com
 * @date 2015.1.28
 */
(function(exports) {

  var defaults = {
    speed: 0.15,
    frequence: 2,
    attenuations: [-2, -6, 4, 2, 1],
    lineColors: ['rgba(205,244,255,0,1)', 'rgba(205,244,255,0.2)', 'rgba(205,244,255,0.4)', 'rgba(205,244,255,0.6)', 'rgba(205,244,255,1)'],
    lineWidths: [1, 1, 1, 1, 2]
  }

  var K = 2;

  /**
   * options配置:
   *   speed: 波形移动速度
   *   attenuations: 衰减参数
   *   lineColors: 波形颜色
   *   lineWidths: 波形宽度
   *   
   *   
   */
  function jSiri(options) {
    var self = this

    var Noise = 0.01
    var ALPHA = 0.6

    var opt = this.opt = extend({}, defaults, options)

    var canvas = document.createElement('canvas')
    var container = opt.container ? (typeof opt.container === 'string' ? document.getElementById(opt.container) : opt.container) : document.body
    container.appendChild(canvas);
    var context = canvas.getContext("2d")
    // 展示比例
    var ratio = opt.ratio || exports.devicePixelRatio || 1
    // 元素尺寸
    var width = canvas.width = (opt.width || window.innerWidth)
    var height = canvas.height = (opt.height || window.innerHeight)

    canvas.style.width = width / 2

    var phase = 0

    var i = 0
    var attenuations = []
    var lineColors = []
    var lineWidths = []

    while(i < 5) {
      attenuations[i] = opt.attenuations[i] || defaults.attenuations[i];
      lineColors[i] = opt.lineColors[i] || defaults.lineColors[i];
      lineWidths[i] = opt.lineWidths[i] || defaults.lineWidths[i];
      i++;
    }

    // 开始绘线
    this.update = function() {
      phase = (phase + opt.speed) % (Math.PI * 64)
      
      self.clear();

      for(i = 0; i < 5; i++) {
        drawLine(attenuations[i], lineColors[i], lineWidths[i])
      }
      
      // 循环绘制
      requestAnimationFrame(self.update)
    }

    

    // 清除之前绘制
    this.clear = function() {
      context.clearRect(0, 0, width, height)
      // context.globalCompositeOperation = 'destination-out'
      // context.fillRect(0, 0, this.width, this.height)
      // context.globalCompositeOperation = 'source-over'
    }

    // 更新数据
    this.updateData = function(value) {
      if (value > 0) {
        self.changeNoise(value);
        self.changeFrequence(value);
      }
    }

    // 改变降噪参数
    this.changeNoise = function(value) {
      var now = Noise;
      Noise = ALPHA * now + (1 - ALPHA) * (value / 100);
    }

    // 改变波频
    this.changeFrequence = function(value) {
      self.opt.frequence = 2 + (value/100) * 3;
    }

    // 绘制线
    function drawLine(attenuation, lineColor, lineWidth) {
      context.moveTo(0, 0)
      context.beginPath()
      context.strokeStyle = lineColor
      context.lineWidth = lineWidth || 1
      var x, y
      for (var i = -K; i <= K; i += 0.01) {
        x = width * ((i + K) / (K * 2))
        y = height / 2 + Noise * (1 / attenuation) * ((height / 2) * (Math.sin(self.opt.frequence * i - phase))) * attenuationFn(i)
        context.lineTo(x, y)
      }
      context.stroke()
    }

    // 衰减函数
    function attenuationFn(x) {
      return Math.pow(K * 4 / (K * 4 + Math.pow(x, 4)), K * 2);
    }

    this.update();
  }

  /******* 工具函数 *******/

  // 对象扩展
  function extend(target) {
    var sourcesArray = Array.prototype.slice.call(arguments, 1)
    var source;

    for (var i = 0; i < sourcesArray.length; i++) {
      source = sourcesArray[i]
      if (source) {
        for (var prop in source) {
          target[prop] = source[prop]
        }
      }
    }

    return target;
  }


  exports.jSiri = jSiri;

})(window);
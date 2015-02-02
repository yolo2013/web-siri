/**
 * 类似Siri的Web实时波动展示
 * @author xuhua.yolo@gmail.com
 * @date 2015.1.28
 */
(function(exports) {

  var defaults = {
    autoStart: true, // 自动开始
    speed: 0.15,
    noise: 0.01,
    frequence: 2,
    attenuations: [1, 2, -2, 4, -6],
    lineColors: ['rgba(205,244,255,1)', 'rgba(205,244,255,0.4)', 'rgba(205,244,255,0,1)', 'rgba(205,244,255,0.4)', 'rgba(205,244,255,0.2)'],
    lineWidths: [2, 1, 1, 1, 1]
  }

  var K = 2;

  /**
   * options配置:
   *   speed: 波形移动速度
   *   attenuations: 衰减参数
   *   lineColors: 波形颜色
   *   lineWidths: 波形宽度
   *   
   */
  function jSiri(options) {
    var self = this

    // 波形阶段，即周期内的偏移量
    var phase = 0
    var run = false

    var ALPHA = 0.8

    var opt = extend({}, defaults, options)

    var canvas = document.createElement('canvas')
    var container = opt.container ? (typeof opt.container === 'string' ? document.getElementById(opt.container) : opt.container) : document.body
    container.appendChild(canvas)
    var context = canvas.getContext("2d")
    // 展示比例
    var ratio = opt.ratio || exports.devicePixelRatio || 1
    // 元素尺寸
    var width = canvas.width = (opt.width || window.innerWidth)
    var height = canvas.height = (opt.height || 600)

    var i = 0
    var attenuations = []
    var lineColors = []
    var lineWidths = []

    while(i < 5) {
      attenuations[i] = opt.attenuations[i] || defaults.attenuations[i]
      lineColors[i] = opt.lineColors[i] || defaults.lineColors[i]
      lineWidths[i] = opt.lineWidths[i] || defaults.lineWidths[i]
      i++
    }

    /* 内部函数 */

    // 绘制单条线
    function drawLine(attenuation, lineColor, lineWidth) {
      context.moveTo(0, 0)
      context.beginPath()
      context.strokeStyle = lineColor
      context.lineWidth = lineWidth || 1
      var x, y
      for (var i = -K; i <= K; i += 0.01) {
        x = width * ((i + K) / (K * 2))
        y = height / 2 + opt.noise * (1 / attenuation) * ((height / 2) * (Math.sin(opt.frequence * i - phase))) * attenuationFn(i)
        context.lineTo(x, y)
      }
      context.stroke()
    }

    // 衰减函数
    function attenuationFn(x) {
      return Math.pow(K * 4 / (K * 4 + Math.pow(x, 4)), K * 2)
    }

    // 绘制波形
    function draw() {
      if(!run) {
        return
      }

      phase = (phase + opt.speed) % (Math.PI * 64)
      
      self.clear();

      for(i = 0; i < 5; i++) {
        drawLine(attenuations[i], lineColors[i], lineWidths[i])
      }

      // 循环绘制
      requestAnimationFrame(draw)
    }


    /* 公共API */

    this.start = function() {
      phase = 0
      run = true
      draw()
    }

    this.stop = function() {
      phase = 0
      run = false
    }
    
    // 清除之前绘制
    this.clear = function() {
      context.clearRect(0, 0, width, height)
    }

    // 更新数据
    this.updateData = function(value) {
      if (value > 0) {
        self.noise(value)
        self.frequence(value)
      }
    }

    // 获取/设置振幅
    this.noise = function(value) {
      if(value) {
        opt.noise = ALPHA * opt.noise + (1 - ALPHA) * (value / 100)
      } else {
        return opt.noise
      }
    }

    // 获取/设置波频
    this.frequence = function(value) {
      if(value) {
        opt.frequence = 2 + (value/100) * 3
      } else {
        return opt.frequence
      }
    }

    // 获取/设置速度
    this.speed = function(value) {
      if(value) {
        opt.spped = value
      } else {
        return opt.speed
      }
    }

    // 自启动
    if(opt.autoStart) {
      this.start();
    }
  }

  /******* 工具函数 *******/

  // 对象扩展
  function extend(target) {
    var sourcesArray = Array.prototype.slice.call(arguments, 1)
    var source

    for (var i = 0; i < sourcesArray.length; i++) {
      source = sourcesArray[i]
      if (source) {
        for (var prop in source) {
          target[prop] = source[prop]
        }
      }
    }

    return target
  }

  exports.jSiri = jSiri

})(window);
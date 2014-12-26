(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Main;

Main = (function() {
  function Main(o) {
    this.o = o != null ? o : {};
    this.vars();
    this.listeners();
  }

  Main.prototype.vars = function() {
    this.$effect = $('#js-effect');
    this.$close = $('#js-close-button');
    this.$modal = $('#js-modal');
    this.$modalHolder = $('#js-modal-holder');
    this.$protoImage = $('.js-proto-image');
    this.$breakParts = $('#js-break-parts');
    this.$modalOverlay = $('#js-modal-overlay');
    this.$hint1 = $('#js-hint1');
    this.$hint2 = $('#js-hint2');
    this.$burst = $('#js-burst');
    this.$burstPaths = this.$burst.find('path');
    this.$showModal = $('#js-show-modal');
    this.$circle = $('#js-circle');
    this.$breakParts = $('#js-break-parts');
    this.$breakOverlays = this.$breakParts.find('.svg-overlay');
    this.$breakPart1 = this.$breakOverlays.eq(0);
    this.$breakPart2 = this.$breakOverlays.eq(1);
    this.$breakPart3 = this.$breakOverlays.eq(2);
    this.$breakPart4 = this.$breakOverlays.eq(3);
    this.$lines = $('.js-line').children();
    this.loop = this.loop.bind(this);
    this.loop();
    this.initEffectTweens();
    this.showModal(true);
    return this.showHints(700);
  };

  Main.prototype.showHints = function(delay) {
    var HIDE_DELAY, HINT2_DELAY, it;
    it = this;
    HIDE_DELAY = 5000;
    HINT2_DELAY = 200;
    this.hint1T = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 500).onUpdate(function() {
      return it.$hint1.css({
        opacity: this.p
      });
    }).delay(delay).start();
    this.hint2T = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 500).onUpdate(function() {
      return it.$hint2.css({
        opacity: this.p
      });
    }).delay(delay + HINT2_DELAY).start();
    return this.hintHideT = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 500).onUpdate(function() {
      it.$hint1.css({
        opacity: 1 - this.p
      });
      return it.$hint2.css({
        opacity: 1 - this.p
      });
    }).delay(delay + HINT2_DELAY + HIDE_DELAY).start();
  };

  Main.prototype.showModal = function(isFirst) {
    this.initEffectTweens(isFirst);
    return this.showModalT.start();
  };

  Main.prototype.listeners = function() {
    var $input;
    this.$showModal.on('click', (function(_this) {
      return function() {
        return _this.showModal();
      };
    })(this));
    this.$modal.on('keyup', 'input', function(e) {
      var $it, k, text;
      $it = $(e.target);
      text = $it.val();
      $it.toggleClass('is-fill', !!text);
      if ($it.attr('type') === 'text') {
        text = text.replace(/\s/g, '');
      }
      k = e.keyCode;
      if ((k > 48 && k < 90) || (k === 48 || k === 45 || k === 32)) {
        return $it.val(text);
      }
    });
    $input = null;
    this.$close.on('mouseleave touchstart', function() {
      if ($input != null) {
        $input.removeClass('is-keep-focus');
      }
      return $input = null;
    });
    this.$close.on('mouseenter touchstart', (function(_this) {
      return function() {
        $input = $('input:focus').addClass('is-keep-focus');
        return html2canvas(_this.$modal, {
          onrendered: function(canvas) {
            var dataURL;
            dataURL = canvas.toDataURL();
            return _this.$protoImage.attr('xlink:href', dataURL);
          }
        });
      };
    })(this));
    return this.$close.on('click', (function(_this) {
      return function() {
        _this.$modal.css({
          display: 'none'
        });
        _this.$breakParts.css({
          'z-index': 2,
          opacity: 1
        });
        _this.$effect.show();
        _this.launchEffects();
        return true;
      };
    })(this));
  };

  Main.prototype.initEffectTweens = function(isFirst) {
    var colors, i, it, len, path, shakeOffset, showLen, showOffset, _i, _len, _ref;
    it = this;
    len = 900;
    colors = ['hotpink', 'yellow', 'cyan'];
    this.s = 1;
    _ref = it.$burstPaths;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      path = _ref[i];
      len = path.getTotalLength();
      showLen = this.rand(0, ~~len / 2);
      showOffset = this.rand(0, -(~~len));
      path.len = len;
      path.showLen = showLen;
      path.showOffset = showOffset;
      path.strokeWidth = this.rand(0, 5);
      path.setAttribute('stroke-dasharray', "" + showLen + " " + (3 * len));
      path.setAttribute('stroke-dashoffset', showLen);
      path.setAttribute('stroke-linecap', 'round');
    }
    this.linesT = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 450 * this.s).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
      var line, nP, p, progress, _j, _len1, _ref1;
      p = this.p;
      nP = 1 - p;
      progress = (2 * len) * nP + len;
      _ref1 = it.$lines;
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        line = _ref1[i];
        line.setAttribute('stroke-dashoffset', progress + (i * 100) * nP);
        line.setAttribute('stroke', colors[i]);
        line.setAttribute('stroke-width', 2 * nP);
      }
      return it.$circle.attr({
        'r': 11 * p,
        'stroke-width': 7 * nP,
        'fill': "rgba(" + (~~(0 + 255 * p)) + "," + (~~(255 - 153 * p)) + "," + (~~(255 - 75 * p)) + ", " + nP + ")"
      });
    }).onComplete((function(_this) {
      return function() {
        return _this.$effect.css({
          display: 'none'
        });
      };
    })(this));
    this.burstT = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 300 * this.s).onUpdate(function() {
      var nP, p, _j, _len1, _ref1, _results;
      p = this.p;
      nP = 1 - p;
      _ref1 = it.$burstPaths;
      _results = [];
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        path = _ref1[i];
        path.setAttribute('stroke-dashoffset', path.showOffset - (path.len * p));
        _results.push(path.setAttribute('stroke-width', path.strokeWidth * nP));
      }
      return _results;
    });
    shakeOffset = 50;
    this.shakeT = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 350 * this.s).onUpdate(function() {
      var nP, p, shake;
      p = this.p;
      nP = 1 - p;
      shake = shakeOffset * nP;
      it.$breakParts.css({
        transform: "translate(" + shake + "px, " + shake + "px)"
      });
      return it.$effect.css({
        transform: "translate(" + (-.75 * shake) + "px, " + (-.5 * shake) + "px)"
      });
    }).easing(TWEEN.Easing.Elastic.Out);
    this.shiftT = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 1200 * this.s).onUpdate(function() {
      var nP, p, shift, t1, t2, t3, t4;
      p = this.p;
      nP = 1 - p;
      shift = 900 * p;
      t1 = "translate(" + (-shift) + "px, " + shift + "px) rotate(" + (-50 * p) + "deg)";
      t2 = "translate(" + (-1270 * p) + "px, " + (500 * p) + "px) rotate(" + (905 * p) + "deg)";
      t3 = "translate(" + (1100 * p) + "px, " + (600 * p) + "px) rotate(" + (-1500 * p) + "deg)";
      t4 = "translate(0, " + (1000 * p) + "px) rotate(" + (-15 * p) + "deg)";
      it.$breakPart1.css({
        transform: t1
      });
      it.$breakPart2.css({
        transform: t2
      });
      it.$breakPart3.css({
        transform: t3
      });
      it.$breakPart4.css({
        transform: t4
      });
      return it.$modalOverlay.css({
        transform: "translate(0, " + (50 * p) + ")",
        opacity: nP
      });
    }).onComplete((function(_this) {
      return function() {
        _this.$modalOverlay.css({
          display: 'none'
        });
        _this.$breakParts.css({
          display: 'none'
        });
        return _this.$modalHolder.css({
          display: 'none'
        });
      };
    })(this));
    return this.showModalT = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 800 * this.s).easing(TWEEN.Easing.Exponential.Out).onStart((function(_this) {
      return function() {
        TWEEN.remove(_this.shiftT);
        TWEEN.remove(_this.shakeT);
        TWEEN.remove(_this.linesT);
        _this.$modal.css({
          display: 'block',
          opacity: 0
        });
        _this.$breakParts.css({
          display: 'block'
        });
        _this.$modalHolder.css({
          display: 'block'
        });
        !isFirst && _this.$modalOverlay.css({
          display: 'block',
          opacity: 0
        });
        _this.$breakPart1.css({
          transform: 'none'
        });
        _this.$breakPart2.css({
          transform: 'none'
        });
        _this.$breakPart3.css({
          transform: 'none'
        });
        _this.$breakPart4.css({
          transform: 'none'
        });
        _this.$modal.css({
          display: 'block'
        });
        return _this.$breakParts.css({
          'z-index': 0,
          opacity: 0
        });
      };
    })(this)).onUpdate(function() {
      var nP, p;
      p = this.p;
      nP = 1 - p;
      it.$modal.css({
        opacity: p,
        transform: "translateY(" + (15 * nP) + "px)"
      });
      return !isFirst && it.$modalOverlay.css({
        opacity: p
      });
    });
  };

  Main.prototype.launchEffects = function() {
    this.$hint1.hide();
    this.$hint2.hide();
    this.burstT.start();
    this.linesT.start();
    this.shiftT.start();
    return this.shakeT.start();
  };

  Main.prototype.loop = function() {
    requestAnimationFrame(this.loop);
    return TWEEN.update();
  };

  Main.prototype.rand = function(min, max) {
    return Math.floor((Math.random() * ((max + 1) - min)) + min);
  };

  return Main;

})();

new Main;



},{}]},{},[1])
(function($, Markdown) {
    var converter = new Markdown.Converter();
    var slides = [];
    var slideClasses = {};

    var inherit = function(func, parent) {
        func.prototype = new parent;
        func.prototype.constructor = func;
        return func;
    }

    var Slide = function(el) {
        $.extend(this, {
            element: el,
            next: function() {
                return false;
            },
            prev: function() {
                return false;
            },
            resize: function() {
            },
        });
    }

    var Slideshow = function(slides) {
        var currentPage = 1,
            self = this,
            callStack = [],
            locked = false,
            pages = slides.length;
        $('.pagination select').change(function(e) {
            self.goToPage(this.selectedIndex + 1);
        }).click(function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        $.each(slides, function(key, slide) {
            if (key != 0) {
                $(slide.element).hide();
            }
        });

        $.extend(this, {
            goToPage: function(page, isHashChange) {
                if (locked && isHashChange) {
                    return;
                } else if (locked) {
                    callStack.push(function() {
                        self.goToPage(page);
                    });
                    return;
                }
                if (page < 1 || page > pages || page == currentPage) return;
                locked = true;
                var startOffset = 0;
                var endOffset = 0;
                if (currentPage > page) {
                    startOffset = -1 * $('div.slider div').width();
                    endOffset = 0;
                } else {
                    endOffset = -1 * $('div.slider div').width();
                    startOffset = 0;
                }
                $('div.slider').css('left', startOffset);
                $(slides[page - 1].element).show();
                $('div.slider').animate({left: endOffset}, 1000, function() {
                    $('div.slider').css('left', 0);
                    $(slides[currentPage - 1].element).hide(); 
                    currentPage = page;
                    window.location.hash = currentPage;
                    $('.pagination select')[0].selectedIndex = currentPage - 1;
                    locked = false;
                    if (callStack.length) callStack.shift()();
                });
                
            },
            next: function() {
                if (locked) {
                    callStack.push(function() {
                        self.next();
                    });
                    return;
                }
                if (!slides[currentPage - 1].next()) {
                    this.goToPage(currentPage + 1);
                }
            },
            prev: function() {
                if (locked) {
                    callStack.push(function() {
                        self.prev();
                    });
                    return;
                }
                if (!slides[currentPage - 1].prev()) {
                    this.goToPage(currentPage - 1);
                }
            },
            resize: function(width, height) {
                $('div.slider').css({
                    'width': $(slides[currentPage - 1].element).width() * 2
                });
                $.each(slides, function(idx, slide) { 
                    slide.resize(width, height);
                });
                $('.pagination').css({
                    right: $(window).width() - $('div.window').offset().left - width
                });
            }
        });
    }

    var Appear = inherit(function() {
        $.extend(this, {
            next: function() {
                if (this.currentItem >= this.count) return false;
                $($(this.element).find(this.selector).get(this.currentItem)).css(this.startCss).animate(this.endCss, 1000);
                this.currentItem += 1;
                return true;
            }
        });
    }, Slide);

    slideClasses.List = inherit(function(el) {
        $.extend(this, {
            element: el,
            count: $(el).find('li').length,
            currentItem: 0,
            element: el,
            selector: 'li',
            startCss: {
                display: 'list-item',
                opacity: 0
            },
            endCss: {
                opacity: 1
            }
        });
    }, Appear);

    slideClasses.Letters = inherit(function(el) {
        $.extend(this, {
            element: el,
            count: $(el).find('dd.show').length,
            currentItem: 0,
            element: el,
            selector: 'dd.show',
            startCss: {
                display: 'block',
                opacity: 0
            },
            endCss: {
                opacity: 1
            }
        });
    }, Appear);

    slideClasses.Paradigms = inherit(function(el) {
        var canvas = $(el).find('canvas')[0],
        self = this,
        currentStep = 0,
        ctx = canvas.getContext('2d');
    
        $(canvas).attr('width', 1200).attr('height', 900);

        ctx.font = 'bold 55px Trebuchet,Georgia,Arial,sans-serif';

        $.extend(this, {
            element: el,
            resize: function(width, height) {
                var min = Math.min(width, height);
                $(canvas).css({
                    width: min * 4 / 3,
                    height: min
                });
            },
            step1: function() {
                ctx.strokeStyle = '#FFFFFF';
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(600, 200, 10, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.fill();
                ctx.textAlign = 'center';
                ctx.fillText("Object Oriented Programming", 600, 180);
            },
            step2: function() {
                ctx.strokeStyle = '#FFFFFF';
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(859, 650, 10, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.fill();
                ctx.textAlign = 'left';
                ctx.fillText("Procedural", 840, 710);
                ctx.fillText("Programming", 800, 760);

            },
            step3: function() {
                ctx.strokeStyle = '#FFFFFF';
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(340, 650, 10, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.fill();
                ctx.textAlign = 'right';
                ctx.fillText("Functional", 360, 710);
                ctx.fillText("Programming", 390, 760);

            },
            step4: function() {
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(600, 200);
                ctx.lineTo(859, 650);
                ctx.lineTo(340, 650);
                ctx.lineTo(600, 200);
                ctx.closePath();
                ctx.stroke();
            },
            step5: function() {
                ctx.strokeStyle = '#FF0000';
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.arc(859, 350, 10, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.fill();
                ctx.textAlign = 'left';
                ctx.fillText("Class", 850, 300);
                ctx.fillText("Oriented", 880, 350);
                ctx.fillText("Prog.", 900, 400);

            },
            step6: function() {
                ctx.strokeStyle = '#FF0000';
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.arc(600, 800, 10, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.fill();
                ctx.textAlign = 'center';
                ctx.fillText("Function Oriented Programming", 600, 850);

            },
            step7: function() {
                ctx.strokeStyle = '#FF0000';
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.arc(340, 350, 10, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.fill();
                ctx.textAlign = 'right';
                ctx.fillText("Value", 330, 310);
                ctx.fillText("Oriented", 320, 360);
                ctx.fillText("Prog.", 290, 410);

            },
            step8: function() {
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(859, 350);
                ctx.lineTo(600, 800);
                ctx.lineTo(340, 350);
                ctx.lineTo(859, 350);
                ctx.closePath();
                ctx.stroke();
            },
            step9: function() {
                var angle = 3 * (Math.PI / 2);
                var opacity = 0;
                var interval = setInterval(function() {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = '#0000FF';
                    ctx.fillStyle = '#0000FF';
                    var newAngle = angle + (Math.PI / 50);
                    ctx.beginPath();
                    ctx.arc(600, 500, 300, angle, newAngle, false);
                    ctx.stroke();
                    angle = newAngle;
                    if (angle >= 7 * (Math.PI / 2)) {
                        self.step1();
                        self.step2();
                        self.step3();
                        self.step5();
                        self.step6();
                        self.step7();
                        clearInterval(interval);
                    }
                }, 20);
                var interval2 = setInterval(function() {
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.strokeStyle = "rgba(255, 255, 255, " + opacity + ")";
                    self.step4();
                    ctx.strokeStyle = "rgba(255, 0, 0, " + opacity + ")";
                    self.step8();
                    opacity += 0.02;
                    if (opacity >= 1.0) {
                        ctx.globalCompositeOperation = 'source-over';
                        self.step1();
                        self.step2();
                        self.step3();
                        self.step5();
                        self.step6();
                        self.step7();
                        clearInterval(interval2);
                    }
                }, 50);
            },
            next: function() {
                currentStep += 1;
                
                if (this['step' + currentStep]) {
                    this['step' + currentStep]()
                    return true;
                } else {
                    return false;
                }
            }
        });
    }, Slide);

    $(function() {
        $('.markdown').each(function() {
            var html = converter.makeHtml(normalize($(this).text())).replace(/>\s+</g, "><");
            $(this).html(html).removeClass('markdown');
        });

        $('div.slider div').each(function() {
            var classes = ($(this).attr('class') || '').split(/\s+/);
            var found = false;
            for (var i = 0; i < classes.length; i++) {
                if (slideClasses[classes[i]]) {
                    slides.push(new slideClasses[classes[i]](this));
                    found = true;
                    i = classes.length;
                }
            }
            if (!found) {
                slides.push(new Slide(this));
            }
            $('.pagination select').append($('<option></option>').text(slides.length + ' - ' + $(this).attr('title')));
        });
        var ss = new Slideshow(slides);

        $(window).click(function(e) {
            if (e.clientX < $('div.window').css('margin-left').replace('px', '')) {
                ss.prev();
            } else {
                ss.next();
            }
            e.preventDefault();
            e.stopPropagation();
        }).keydown(function(e) {
            if (e.which == 37) {
                ss.prev();
            } else if (e.which == 39) {
                ss.next();
            }
        }).swipeleft(function() {
            ss.next();
        }).swiperight(function() {
            ss.prev();
        }).resize(function() {
            var min = Math.min($(window).height() * 4/3, $(window).width());
            $('div.window, div.slider div').height(Math.floor(min * 3 / 4)).width(Math.floor(min));
            var fontSize = Math.floor((Math.min($(window).height()*4/3, $(window).width()) / 480) * 80);
            $('body').css('font-size', fontSize + '%');
            ss.resize(Math.floor(min), Math.floor(min * 3 / 4));
        }).hashchange(function() {
            if (document.location.hash != '' && document.location.hash != '#') {
                ss.goToPage(parseInt(document.location.hash.replace('#', '')), true);
            }
        }).resize().hashchange();
        $('code').addClass('prettyprint');
        prettyPrint();
    });
    
    function normalize(str) {
        var arr = str.replace("\r", "").split("\n");
        var minChars = str.length;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == '' || /^\s*$/.test(arr[i])) {
                arr[i] = '';  
            } else {
                arr[i] = arr[i].replace("\t", "    ");
                minChars=Math.min(/^\s*/.exec(arr[i])[0].length, minChars);
            }
        }
        var re3 = new RegExp('^\\\s{' + minChars + '}');
        for (i = 0; i < arr.length; i++) {
            arr[i] = arr[i].replace(re3, '');
        }
        return arr.join("\n");
    }
    
})(jQuery, Markdown);
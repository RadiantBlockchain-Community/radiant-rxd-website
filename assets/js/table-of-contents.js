if (!Util)
function Util() {}
if (Util.scrollTo = function (l, o, s, t) {
        var i = t || window,
            r = i.scrollTop || document.documentElement.scrollTop,
            a = null;
        t || (r = window.scrollY || document.documentElement.scrollTop);
        var c = function (t) {
            a || (a = t);
            var e = t - a;
            o < e && (e = o);
            var n = Math.easeInOutQuad(e, r, l - r, o);
            i.scrollTo(0, n), e < o ? window.requestAnimationFrame(c) : s && s()
        };
        window.requestAnimationFrame(c)
    }, Util.moveFocus = function (t) {
        t || (t = document.getElementsByTagName("body")[0]), t.focus(), document.activeElement !== t && (t.setAttribute("tabindex", "-1"), t.focus())
    }, Util.cssSupports = function (t, e) {
        return CSS.supports(t, e)
    }, Math.easeInOutQuad = function (t, e, n, l) {
        return (t /= l / 2) < 1 ? n / 2 * t * t + e : -n / 2 * (--t * (t - 2) - 1) + e
    }, function () {
        var t = function (t) {
            "CSS" in window && CSS.supports("color", "var(--color-var)") && (this.element = t, this.scrollDuration = parseInt(this.element.getAttribute("data-duration")) || 300, this.dataElementY = this.element.getAttribute("data-scrollable-element-y") || this.element.getAttribute("data-scrollable-element") || this.element.getAttribute("data-element"), this.scrollElementY = this.dataElementY ? document.querySelector(this.dataElementY) : window, this.dataElementX = this.element.getAttribute("data-scrollable-element-x"), this.scrollElementX = this.dataElementY ? document.querySelector(this.dataElementX) : window, this.initScroll())
        };
        t.prototype.initScroll = function () {
            var r = this;
            this.element.addEventListener("click", function (t) {
                t.preventDefault();
                var e = t.target.closest(".js-smooth-scroll").getAttribute("href").replace("#", ""),
                    n = document.getElementById(e),
                    l = n.getAttribute("tabindex"),
                    o = r.scrollElementY.scrollTop || document.documentElement.scrollTop;
                r.dataElementY || (o = window.scrollY || document.documentElement.scrollTop);
                var s = !!r.dataElementY && r.scrollElementY,
                    i = r.getFixedElementHeight();
                Util.scrollTo(n.getBoundingClientRect().top + o - i, r.scrollDuration, function () {
                    r.scrollHorizontally(n, i), Util.moveFocus(n), history.pushState(!1, !1, "#" + e), r.resetTarget(n, l)
                }, s)
            })
        }, t.prototype.scrollHorizontally = function (t, e) {
            var n = !!this.dataElementX && this.scrollElementX,
                l = this.scrollElementX ? this.scrollElementX.scrollLeft : document.documentElement.scrollLeft,
                o = t.getBoundingClientRect().left + l - e,
                s = this.scrollDuration,
                i = n || window,
                r = i.scrollLeft || document.documentElement.scrollLeft,
                a = null;
            if (n || (r = window.scrollX || document.documentElement.scrollLeft), !(Math.abs(r - o) < 5)) {
                var c = function (t) {
                    a || (a = t);
                    var e = t - a;
                    s < e && (e = s);
                    var n = Math.easeInOutQuad(e, r, o - r, s);
                    i.scrollTo({
                        left: n
                    }), e < s && window.requestAnimationFrame(c)
                };
                window.requestAnimationFrame(c)
            }
        }, t.prototype.resetTarget = function (t, e) {
            parseInt(t.getAttribute("tabindex")) < 0 && (t.style.outline = "none", !e && t.removeAttribute("tabindex"))
        }, t.prototype.getFixedElementHeight = function () {
            var t = this.dataElementY ? this.scrollElementY : document.documentElement,
                e = parseInt(getComputedStyle(t).getPropertyValue("scroll-padding"));
            if (isNaN(e)) {
                e = 0;
                var n = document.querySelector(this.element.getAttribute("data-fixed-element"));
                n && (e = parseInt(n.getBoundingClientRect().height))
            }
            return e
        };
        var e = document.getElementsByClassName("js-smooth-scroll");
        if (0 < e.length && !Util.cssSupports("scroll-behavior", "smooth") && window.requestAnimationFrame)
            for (var n = 0; n < e.length; n++) new t(e[n])
    }(), !Util)
function Util() {}
Util.hasClass = function (t, e) {
        return t.classList.contains(e)
    }, Util.addClass = function (t, e) {
        var n = e.split(" ");
        t.classList.add(n[0]), 1 < n.length && Util.addClass(t, n.slice(1).join(" "))
    }, Util.removeClass = function (t, e) {
        var n = e.split(" ");
        t.classList.remove(n[0]), 1 < n.length && Util.removeClass(t, n.slice(1).join(" "))
    }, Util.toggleClass = function (t, e, n) {
        n ? Util.addClass(t, e) : Util.removeClass(t, e)
    },
    function () {
        var t = function (t) {
            var e;
            this.element = t, this.list = this.element.getElementsByClassName("js-toc__list")[0], this.anchors = this.list.querySelectorAll('a[href^="#"]'), this.sections = function (t) {
                    for (var e = [], n = 0; n < t.anchors.length; n++) {
                        var l = document.getElementById(t.anchors[n].getAttribute("href").replace("#", ""));
                        l && e.push(l)
                    }
                    return e
                }(this), this.controller = this.element.getElementsByClassName("js-toc__control"), this.controllerLabel = this.element.getElementsByClassName("js-toc__control-label"), this.content = !((e = this).sections.length < 1) && e.sections[0].closest(".js-toc-content"), this.clickScrolling = !1, this.intervalID = !1, this.staticLayoutClass = "toc--static", this.contentStaticLayoutClass = "toc-content--toc-static", this.expandedClass = "toc--expanded", this.isStatic = Util.hasClass(this.element, this.staticLayoutClass), this.layout = "static",
                function (n) {
                    if (o(n), 0 < n.sections.length) {
                        n.list.addEventListener("click", function (t) {
                            var e = t.target.closest('a[href^="#"]');
                            e && (n.clickScrolling = !0, s(n, e), i(n, !0))
                        });
                        var t = "IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype;
                        if (t)
                            for (var e = new IntersectionObserver(function (t, e) {
                                    t.forEach(function (t) {
                                        n.clickScrolling || function (o) {
                                            o.intervalID && clearInterval(o.intervalID);
                                            o.intervalID = setTimeout(function () {
                                                for (var t = window.innerHeight / 2, e = -1, n = 0; n < o.sections.length; n++) {
                                                    var l = o.sections[n].getBoundingClientRect().top;
                                                    l < t && (e = n)
                                                } - 1 < e && s(o, o.anchors[e]), o.intervalID = !1
                                            }, 100)
                                        }(n)
                                    })
                                }, {
                                    threshold: [0, .1],
                                    rootMargin: "0px 0px -70% 0px"
                                }), l = 0; l < n.sections.length; l++) e.observe(n.sections[l]);
                        n.element.addEventListener("toc-scroll", function (t) {
                            n.clickScrolling = !1
                        })
                    }
                    n.element.addEventListener("toc-resize", function (t) {
                            o(n)
                        }),
                        function (n) {
                            if (n.controller.length < 1) return;
                            n.controller[0].addEventListener("click", function (t) {
                                var e = Util.hasClass(n.element, n.expandedClass);
                                i(n, e)
                            }), n.element.addEventListener("keydown", function (t) {
                                "static" != n.layout && (t.keyCode && 27 == t.keyCode || t.key && "escape" == t.key.toLowerCase()) && (i(n, !0), n.controller[0].focus())
                            })
                        }(n)
                }(this)
        };

        function s(t, e) {
            if (e) {
                for (var n = 0; n < t.anchors.length; n++) Util.removeClass(t.anchors[n], "toc__link--selected");
                Util.addClass(e, "toc__link--selected")
            }
        }

        function o(t) {
            t.isStatic || (t.layout = getComputedStyle(t.element, ":before").getPropertyValue("content").replace(/\'|"/g, ""), Util.toggleClass(t.element, t.staticLayoutClass, "static" == t.layout), t.content && Util.toggleClass(t.content, t.contentStaticLayoutClass, "static" == t.layout))
        }

        function i(t, e) {
            t.controller.length < 1 || (Util.toggleClass(t.element, t.expandedClass, !e), e ? t.controller[0].removeAttribute("aria-expanded") : t.controller[0].setAttribute("aria-expanded", "true"), !e && 0 < t.anchors.length && t.anchors[0].focus())
        }
        var e, n = document.getElementsByClassName("js-toc"),
            l = [];
        if (0 < n.length) {
            for (var r = 0; r < n.length; r++) e = r, l.push(new t(n[e]));
            var a = !1,
                c = new CustomEvent("toc-scroll"),
                u = new CustomEvent("toc-resize");

            function d() {
                for (var t = 0; t < l.length; t++) l[t].element.dispatchEvent(c)
            }

            function m() {
                for (var t = 0; t < l.length; t++) l[t].element.dispatchEvent(u)
            }
            window.addEventListener("scroll", function () {
                clearTimeout(a), a = setTimeout(d, 100)
            }), window.addEventListener("resize", function () {
                clearTimeout(!1), a = setTimeout(m, 100)
            })
        }
    }();
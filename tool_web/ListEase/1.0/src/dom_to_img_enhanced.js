(function (global) {
    'use strict';

    var util = newUtil();
    var inliner = newInliner();
    var fontFaces = newFontFaces();
    var images = newImages();

    // Default impl options
    var defaultOptions = {
        imagePlaceholder: undefined,
        cacheBust: false,
        maxRetries: 2, // 最大重试次数
        retryDelay: 1000, // 重试延迟（毫秒）
        imageTimeout: 10000, // 图片加载超时（毫秒）
        skipFailedImages: true // 是否跳过失败的图片
    };

    var domtoimage = {
        toSvg: toSvg,
        toPng: toPng,
        toJpeg: toJpeg,
        toBlob: toBlob,
        toPixelData: toPixelData,
        impl: {
            fontFaces: fontFaces,
            images: images,
            util: util,
            inliner: inliner,
            options: {}
        }
    };

    if (typeof module !== 'undefined')
        module.exports = domtoimage;
    else
        global.domtoimage = domtoimage;

    function toSvg(node, options) {
        options = options || {};
        copyOptions(options);
        return Promise.resolve(node)
            .then(function (node) {
                return cloneNode(node, options.filter, true);
            })
            .then(embedFonts)
            .then(inlineImages)
            .then(applyOptions)
            .then(function (clone) {
                return makeSvgDataUri(clone,
                    options.width || util.width(node),
                    options.height || util.height(node)
                );
            });

        function applyOptions(clone) {
            if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;
            if (options.width) clone.style.width = options.width + 'px';
            if (options.height) clone.style.height = options.height + 'px';
            if (options.style)
                Object.keys(options.style).forEach(function (property) {
                    clone.style[property] = options.style[property];
                });
            return clone;
        }
    }

    function toPixelData(node, options) {
        return draw(node, options || {})
            .then(function (canvas) {
                return canvas.getContext('2d').getImageData(
                    0, 0,
                    util.width(node),
                    util.height(node)
                ).data;
            });
    }

    function toPng(node, options) {
        return draw(node, options || {})
            .then(function (canvas) {
                return canvas.toDataURL();
            });
    }

    function toJpeg(node, options) {
        options = options || {};
        return draw(node, options)
            .then(function (canvas) {
                return canvas.toDataURL('image/jpeg', options.quality || 1.0);
            });
    }

    function toBlob(node, options) {
        return draw(node, options || {})
            .then(util.canvasToBlob);
    }

    function copyOptions(options) {
        if(typeof(options.imagePlaceholder) === 'undefined') {
            domtoimage.impl.options.imagePlaceholder = defaultOptions.imagePlaceholder;
        } else {
            domtoimage.impl.options.imagePlaceholder = options.imagePlaceholder;
        }
        if(typeof(options.cacheBust) === 'undefined') {
            domtoimage.impl.options.cacheBust = defaultOptions.cacheBust;
        } else {
            domtoimage.impl.options.cacheBust = options.cacheBust;
        }
        // 新增选项
        domtoimage.impl.options.maxRetries = options.maxRetries !== undefined ? options.maxRetries : defaultOptions.maxRetries;
        domtoimage.impl.options.retryDelay = options.retryDelay !== undefined ? options.retryDelay : defaultOptions.retryDelay;
        domtoimage.impl.options.imageTimeout = options.imageTimeout !== undefined ? options.imageTimeout : defaultOptions.imageTimeout;
        domtoimage.impl.options.skipFailedImages = options.skipFailedImages !== undefined ? options.skipFailedImages : defaultOptions.skipFailedImages;
    }

    function draw(domNode, options) {
        return toSvg(domNode, options)
            .then(util.makeImage)
            .then(util.delay(100))
            .then(function (image) {
                var canvas = newCanvas(domNode);
                canvas.getContext('2d').drawImage(image, 0, 0);
                return canvas;
            });

        function newCanvas(domNode) {
            var canvas = document.createElement('canvas');
            canvas.width = options.width || util.width(domNode);
            canvas.height = options.height || util.height(domNode);
            if (options.bgcolor) {
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = options.bgcolor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            return canvas;
        }
    }

    function cloneNode(node, filter, root) {
        if (!root && filter && !filter(node)) return Promise.resolve();
        return Promise.resolve(node)
            .then(makeNodeCopy)
            .then(function (clone) {
                return cloneChildren(node, clone, filter);
            })
            .then(function (clone) {
                return processClone(node, clone);
            });

        function makeNodeCopy(node) {
            if (node instanceof HTMLCanvasElement) return util.makeImage(node.toDataURL());
            return node.cloneNode(false);
        }

        function cloneChildren(original, clone, filter) {
            var children = original.childNodes;
            if (children.length === 0) return Promise.resolve(clone);
            return cloneChildrenInOrder(clone, util.asArray(children), filter)
                .then(function () {
                    return clone;
                });

            function cloneChildrenInOrder(parent, children, filter) {
                var done = Promise.resolve();
                children.forEach(function (child) {
                    done = done
                        .then(function () {
                            return cloneNode(child, filter);
                        })
                        .then(function (childClone) {
                            if (childClone) parent.appendChild(childClone);
                        });
                });
                return done;
            }
        }

        function processClone(original, clone) {
            if (!(clone instanceof Element)) return clone;
            return Promise.resolve()
                .then(cloneStyle)
                .then(clonePseudoElements)
                .then(copyUserInput)
                .then(fixSvg)
                .then(function () {
                    return clone;
                });

            function cloneStyle() {
                copyStyle(window.getComputedStyle(original), clone.style);
                function copyStyle(source, target) {
                    if (source.cssText) target.cssText = source.cssText;
                    else copyProperties(source, target);
                    function copyProperties(source, target) {
                        util.asArray(source).forEach(function (name) {
                            target.setProperty(
                                name,
                                source.getPropertyValue(name),
                                source.getPropertyPriority(name)
                            );
                        });
                    }
                }
            }

            function clonePseudoElements() {
                [':before', ':after'].forEach(function (element) {
                    clonePseudoElement(element);
                });
                function clonePseudoElement(element) {
                    var style = window.getComputedStyle(original, element);
                    var content = style.getPropertyValue('content');
                    if (content === '' || content === 'none') return;
                    var className = util.uid();
                    clone.className = clone.className + ' ' + className;
                    var styleElement = document.createElement('style');
                    styleElement.appendChild(formatPseudoElementStyle(className, element, style));
                    clone.appendChild(styleElement);
                    function formatPseudoElementStyle(className, element, style) {
                        var selector = '.' + className + ':' + element;
                        var cssText = style.cssText ? formatCssText(style) : formatCssProperties(style);
                        return document.createTextNode(selector + '{' + cssText + '}');
                        function formatCssText(style) {
                            var content = style.getPropertyValue('content');
                            return style.cssText + ' content: ' + content + ';';
                        }
                        function formatCssProperties(style) {
                            return util.asArray(style)
                                .map(formatProperty)
                                .join('; ') + ';';
                            function formatProperty(name) {
                                return name + ': ' +
                                    style.getPropertyValue(name) +
                                    (style.getPropertyPriority(name) ? ' !important' : '');
                            }
                        }
                    }
                }
            }

            function copyUserInput() {
                if (original instanceof HTMLTextAreaElement) clone.innerHTML = original.value;
                if (original instanceof HTMLInputElement) clone.setAttribute("value", original.value);
            }

            function fixSvg() {
                if (!(clone instanceof SVGElement)) return;
                clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                if (!(clone instanceof SVGRectElement)) return;
                ['width', 'height'].forEach(function (attribute) {
                    var value = clone.getAttribute(attribute);
                    if (!value) return;
                    clone.style.setProperty(attribute, value);
                });
            }
        }
    }

    function embedFonts(node) {
        return fontFaces.resolveAll()
            .then(function (cssText) {
                var styleNode = document.createElement('style');
                node.appendChild(styleNode);
                styleNode.appendChild(document.createTextNode(cssText));
                return node;
            });
    }

    function inlineImages(node) {
        return images.inlineAll(node)
            .then(function () {
                return node;
            });
    }

    function makeSvgDataUri(node, width, height) {
        return Promise.resolve(node)
            .then(function (node) {
                node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
                return new XMLSerializer().serializeToString(node);
            })
            .then(util.escapeXhtml)
            .then(function (xhtml) {
                return '<foreignObject x="0" y="0" width="100%" height="100%">' + xhtml + '</foreignObject>';
            })
            .then(function (foreignObject) {
                return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" >' +
                    foreignObject + '</svg>';
            })
            .then(function (svg) {
                return 'data:image/svg+xml;charset=utf-8,' + svg;
            });
    }

    function newUtil() {
        return {
            escape: escape,
            parseExtension: parseExtension,
            mimeType: mimeType,
            dataAsUrl: dataAsUrl,
            isDataUrl: isDataUrl,
            canvasToBlob: canvasToBlob,
            resolveUrl: resolveUrl,
            getAndEncode: getAndEncode,
            uid: uid(),
            delay: delay,
            asArray: asArray,
            escapeXhtml: escapeXhtml,
            makeImage: makeImage,
            width: width,
            height: height
        };

        function mimes() {
            var WOFF = 'application/font-woff';
            var JPEG = 'image/jpeg';
            return {
                'woff': WOFF,
                'woff2': WOFF,
                'ttf': 'application/font-truetype',
                'eot': 'application/vnd.ms-fontobject',
                'png': 'image/png',
                'jpg': JPEG,
                'jpeg': JPEG,
                'gif': 'image/gif',
                'tiff': 'image/tiff',
                'svg': 'image/svg+xml'
            };
        }

        function parseExtension(url) {
            var match = /\.([^\.\/]*?)$/g.exec(url);
            if (match) return match[1];
            else return '';
        }

        function mimeType(url) {
            var extension = parseExtension(url).toLowerCase();
            return mimes()[extension] || '';
        }

        function isDataUrl(url) {
            return url.search(/^(data:)/) !== -1;
        }

        function toBlob(canvas) {
            return new Promise(function (resolve) {
                var binaryString = window.atob(canvas.toDataURL().split(',')[1]);
                var length = binaryString.length;
                var binaryArray = new Uint8Array(length);
                for (var i = 0; i < length; i++)
                    binaryArray[i] = binaryString.charCodeAt(i);
                resolve(new Blob([binaryArray], {
                    type: 'image/png'
                }));
            });
        }

        function canvasToBlob(canvas) {
            if (canvas.toBlob)
                return new Promise(function (resolve) {
                    canvas.toBlob(resolve);
                });
            return toBlob(canvas);
        }

        function resolveUrl(url, baseUrl) {
            var doc = document.implementation.createHTMLDocument();
            var base = doc.createElement('base');
            doc.head.appendChild(base);
            var a = doc.createElement('a');
            doc.body.appendChild(a);
            base.href = baseUrl;
            a.href = url;
            return a.href;
        }

        function uid() {
            var index = 0;
            return function () {
                return 'u' + fourRandomChars() + index++;
                function fourRandomChars() {
                    return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
                }
            };
        }

        function makeImage(uri) {
            return new Promise(function (resolve, reject) {
                var image = new Image();
                var timeoutId;
                // 添加超时处理
                timeoutId = setTimeout(function() {
                    image.onload = null;
                    image.onerror = null;
                    reject(new Error('Image load timeout: ' + uri));
                }, domtoimage.impl.options.imageTimeout || 10000);
                
                image.onload = function () {
                    clearTimeout(timeoutId);
                    resolve(image);
                };
                image.onerror = function() {
                    clearTimeout(timeoutId);
                    reject(new Error('Image load error: ' + uri));
                };
                image.src = uri;
            });
        }

        // 改进的 getAndEncode 函数，添加重试机制和更好的错误处理
        function getAndEncode(url, retryCount) {
            retryCount = retryCount || 0;
            var TIMEOUT = domtoimage.impl.options.imageTimeout || 10000;
            var MAX_RETRIES = domtoimage.impl.options.maxRetries || 2;
            var RETRY_DELAY = domtoimage.impl.options.retryDelay || 1000;
            var SKIP_FAILED = domtoimage.impl.options.skipFailedImages !== false;

            if(domtoimage.impl.options.cacheBust) {
                url += ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
            }

            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                var timeoutId;
                var aborted = false;

                function cleanup() {
                    if (timeoutId) clearTimeout(timeoutId);
                    request.onreadystatechange = null;
                    request.ontimeout = null;
                    request.onerror = null;
                }

                function done() {
                    if (aborted) return;
                    if (request.readyState !== 4) return;

                    cleanup();

                    if (request.status === 200) {
                        try {
                            var encoder = new FileReader();
                            encoder.onloadend = function () {
                                var content = encoder.result.split(/,/)[1];
                                resolve(content);
                            };
                            encoder.onerror = function() {
                                if (retryCount < MAX_RETRIES) {
                                    setTimeout(function() {
                                        getAndEncode(url, retryCount + 1).then(resolve).catch(reject);
                                    }, RETRY_DELAY);
                                } else {
                                    handleFailure('FileReader error');
                                }
                            };
                            encoder.readAsDataURL(request.response);
                        } catch (e) {
                            if (retryCount < MAX_RETRIES) {
                                setTimeout(function() {
                                    getAndEncode(url, retryCount + 1).then(resolve).catch(reject);
                                }, RETRY_DELAY);
                            } else {
                                handleFailure('Encoding error: ' + e.message);
                            }
                        }
                    } else {
                        if (retryCount < MAX_RETRIES && request.status !== 404) {
                            setTimeout(function() {
                                getAndEncode(url, retryCount + 1).then(resolve).catch(reject);
                            }, RETRY_DELAY);
                        } else {
                            handleFailure('HTTP ' + request.status + ': ' + url);
                        }
                    }
                }

                function timeout() {
                    if (aborted) return;
                    cleanup();
                    if (retryCount < MAX_RETRIES) {
                        setTimeout(function() {
                            getAndEncode(url, retryCount + 1).then(resolve).catch(reject);
                        }, RETRY_DELAY);
                    } else {
                        handleFailure('Timeout after ' + TIMEOUT + 'ms: ' + url);
                    }
                }

                function handleError() {
                    if (aborted) return;
                    cleanup();
                    if (retryCount < MAX_RETRIES) {
                        setTimeout(function() {
                            getAndEncode(url, retryCount + 1).then(resolve).catch(reject);
                        }, RETRY_DELAY);
                    } else {
                        handleFailure('Network error: ' + url);
                    }
                }

                function handleFailure(message) {
                    console.warn('[domtoimage] ' + message);
                    var placeholder;
                    if(domtoimage.impl.options.imagePlaceholder) {
                        var split = domtoimage.impl.options.imagePlaceholder.split(/,/);
                        if(split && split[1]) {
                            placeholder = split[1];
                            resolve(placeholder);
                            return;
                        }
                    }
                    if (SKIP_FAILED) {
                        // 返回一个透明的 1x1 像素图片作为占位符
                        resolve('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
                    } else {
                        reject(new Error(message));
                    }
                }

                request.onreadystatechange = done;
                request.ontimeout = timeout;
                request.onerror = handleError;
                request.responseType = 'blob';
                request.timeout = TIMEOUT;

                try {
                    request.open('GET', url, true);
                    request.send();
                } catch (e) {
                    cleanup();
                    if (retryCount < MAX_RETRIES) {
                        setTimeout(function() {
                            getAndEncode(url, retryCount + 1).then(resolve).catch(reject);
                        }, RETRY_DELAY);
                    } else {
                        handleFailure('Request error: ' + e.message);
                    }
                }

                // 添加 abort 支持
                var originalAbort = request.abort;
                request.abort = function() {
                    aborted = true;
                    cleanup();
                    originalAbort.call(this);
                };
            });
        }

        function dataAsUrl(content, type) {
            return 'data:' + type + ';base64,' + content;
        }

        function escape(string) {
            return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
        }

        function delay(ms) {
            return function (arg) {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve(arg);
                    }, ms);
                });
            };
        }

        function asArray(arrayLike) {
            var array = [];
            var length = arrayLike.length;
            for (var i = 0; i < length; i++) array.push(arrayLike[i]);
            return array;
        }

        function escapeXhtml(string) {
            return string.replace(/#/g, '%23').replace(/\n/g, '%0A');
        }

        function width(node) {
            var leftBorder = px(node, 'border-left-width');
            var rightBorder = px(node, 'border-right-width');
            return node.scrollWidth + leftBorder + rightBorder;
        }

        function height(node) {
            var topBorder = px(node, 'border-top-width');
            var bottomBorder = px(node, 'border-bottom-width');
            return node.scrollHeight + topBorder + bottomBorder;
        }

        function px(node, styleProperty) {
            var value = window.getComputedStyle(node).getPropertyValue(styleProperty);
            return parseFloat(value.replace('px', ''));
        }
    }

    function newInliner() {
        var URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;

        return {
            inlineAll: inlineAll,
            shouldProcess: shouldProcess,
            impl: {
                readUrls: readUrls,
                inline: inline
            }
        };

        function shouldProcess(string) {
            return string.search(URL_REGEX) !== -1;
        }

        function readUrls(string) {
            var result = [];
            var match;
            while ((match = URL_REGEX.exec(string)) !== null) {
                result.push(match[1]);
            }
            return result.filter(function (url) {
                return !util.isDataUrl(url);
            });
        }

        function inline(string, url, baseUrl, get) {
            return Promise.resolve(url)
                .then(function (url) {
                    return baseUrl ? util.resolveUrl(url, baseUrl) : url;
                })
                .then(get || util.getAndEncode)
                .catch(function(error) {
                    // 如果图片加载失败，返回原始字符串（不替换）
                    console.warn('[domtoimage] Failed to inline image: ' + url, error);
                    return string;
                })
                .then(function (data) {
                    if (typeof data === 'string' && data === string) {
                        // 如果返回的是原始字符串，说明加载失败
                        return string;
                    }
                    return util.dataAsUrl(data, util.mimeType(url));
                })
                .then(function (dataUrl) {
                    if (dataUrl === string) return string;
                    return string.replace(urlAsRegex(url), '$1' + dataUrl + '$3');
                });

            function urlAsRegex(url) {
                return new RegExp('(url\\([\'"]?)(' + util.escape(url) + ')([\'"]?\\))', 'g');
            }
        }

        function inlineAll(string, baseUrl, get) {
            if (nothingToInline()) return Promise.resolve(string);
            return Promise.resolve(string)
                .then(readUrls)
                .then(function (urls) {
                    var done = Promise.resolve(string);
                    urls.forEach(function (url) {
                        done = done.then(function (string) {
                            return inline(string, url, baseUrl, get);
                        });
                    });
                    return done;
                });

            function nothingToInline() {
                return !shouldProcess(string);
            }
        }
    }

    function newFontFaces() {
        return {
            resolveAll: resolveAll,
            impl: {
                readAll: readAll
            }
        };

        function resolveAll() {
            return readAll(document)
                .then(function (webFonts) {
                    return Promise.all(
                        webFonts.map(function (webFont) {
                            return webFont.resolve();
                        })
                    );
                })
                .then(function (cssStrings) {
                    return cssStrings.join('\n');
                });
        }

        function readAll() {
            return Promise.resolve(util.asArray(document.styleSheets))
                .then(getCssRules)
                .then(selectWebFontRules)
                .then(function (rules) {
                    return rules.map(newWebFont);
                });

            function selectWebFontRules(cssRules) {
                return cssRules
                    .filter(function (rule) {
                        return rule.type === CSSRule.FONT_FACE_RULE;
                    })
                    .filter(function (rule) {
                        return inliner.shouldProcess(rule.style.getPropertyValue('src'));
                    });
            }

            function getCssRules(styleSheets) {
                var cssRules = [];
                styleSheets.forEach(function (sheet) {
                    try {
                        util.asArray(sheet.cssRules || []).forEach(cssRules.push.bind(cssRules));
                    } catch (e) {
                        // 忽略跨域样式表错误
                    }
                });
                return cssRules;
            }

            function newWebFont(webFontRule) {
                return {
                    resolve: function resolve() {
                        var baseUrl = (webFontRule.parentStyleSheet || {}).href;
                        return inliner.inlineAll(webFontRule.cssText, baseUrl);
                    },
                    src: function () {
                        return webFontRule.style.getPropertyValue('src');
                    }
                };
            }
        }
    }

    function newImages() {
        return {
            inlineAll: inlineAll,
            impl: {
                newImage: newImage
            }
        };

        function newImage(element) {
            return {
                inline: inline
            };

            function inline(get) {
                if (util.isDataUrl(element.src)) return Promise.resolve();

                return Promise.resolve(element.src)
                    .then(get || util.getAndEncode)
                    .catch(function(error) {
                        // 图片加载失败时，使用占位符或跳过
                        console.warn('[domtoimage] Failed to load image: ' + element.src, error);
                        if (domtoimage.impl.options.imagePlaceholder) {
                            var split = domtoimage.impl.options.imagePlaceholder.split(/,/);
                            if (split && split[1]) {
                                return util.dataAsUrl(split[1], util.mimeType(element.src));
                            }
                        }
                        // 返回透明像素
                        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
                    })
                    .then(function (data) {
                        return util.dataAsUrl(data, util.mimeType(element.src));
                    })
                    .then(function (dataUrl) {
                        return new Promise(function (resolve, reject) {
                            var timeoutId = setTimeout(function() {
                                element.onload = null;
                                element.onerror = null;
                                resolve(); // 超时也继续，不阻塞
                            }, domtoimage.impl.options.imageTimeout || 10000);
                            
                            element.onload = function () {
                                clearTimeout(timeoutId);
                                resolve();
                            };
                            element.onerror = function() {
                                clearTimeout(timeoutId);
                                resolve(); // 错误也继续，不阻塞
                            };
                            element.src = dataUrl;
                        });
                    });
            }
        }

        function inlineAll(node) {
            if (!(node instanceof Element)) return Promise.resolve(node);

            return inlineBackground(node)
                .then(function () {
                    if (node instanceof HTMLImageElement)
                        return newImage(node).inline();
                    else
                        return Promise.all(
                            util.asArray(node.childNodes).map(function (child) {
                                return inlineAll(child);
                            })
                        );
                });

            function inlineBackground(node) {
                var background = node.style.getPropertyValue('background');
                if (!background) return Promise.resolve(node);

                return inliner.inlineAll(background)
                    .then(function (inlined) {
                        node.style.setProperty(
                            'background',
                            inlined,
                            node.style.getPropertyPriority('background')
                        );
                    })
                    .then(function () {
                        return node;
                    });
            }
        }
    }
})(this);


/// <reference types="web-animations-js" />
var WebAnimator = /** @class */ (function () {
    function WebAnimator() {
        this.styleElement = document.createElement('style');
        this.styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(this.styleElement);
    }
    WebAnimator.getKeyframeOffsets = function (keyframes) {
        var keyframeOffsets = {};
        if (Array.isArray(keyframes)) {
            var offsets = keyframes.map(function (k) { return k.offset; });
            var _loop_1 = function (i) {
                var keyframe = keyframes[i];
                var offset = keyframe.offset;
                var lowerOffset = 0;
                var upperOffset = 1;
                var offsetRange = offsets.length;
                if (offset !== undefined && offset !== null) {
                    lowerOffset = offset;
                }
                else if (i === 0) {
                    offset = offsets[i] = 0;
                }
                else if (i === keyframes.length - 1) {
                    offset = offsets[i] = 1;
                }
                else {
                    var lowerOffsetIndex = i;
                    var upperOffsetIndex = i;
                    while (--lowerOffsetIndex >= 0) {
                        if (offsets[lowerOffsetIndex] !== undefined) {
                            lowerOffset = offsets[lowerOffsetIndex];
                            break;
                        }
                    }
                    while (++upperOffsetIndex < offsets.length) {
                        if (offsets[upperOffsetIndex] !== undefined) {
                            upperOffset = offsets[upperOffsetIndex];
                            break;
                        }
                    }
                    offsetRange = upperOffsetIndex - lowerOffsetIndex;
                    offset = offsets[i] = Number.parseFloat((lowerOffset +
                        (upperOffset - lowerOffset) * ((i - lowerOffsetIndex) / offsetRange)).toFixed(4));
                }
                keyframeOffsets[offset] = keyframeOffsets[offset] || {};
                Object.keys(keyframe).forEach(function (property) {
                    if (property === 'offset')
                        return;
                    var keyframeOffset = keyframeOffsets[offset];
                    keyframeOffset[property] = keyframe[property];
                });
                if (keyframe.easing) {
                    keyframeOffsets[offset].easing = keyframe.easing;
                }
            };
            for (var i = 0; i < keyframes.length; i++) {
                _loop_1(i);
            }
        }
        else {
            var offsets_1 = keyframes.offset;
            Object.keys(keyframes).forEach(function (property) {
                if (property === 'offset')
                    return;
                var propertyKeyframes = [].concat(keyframes[property]);
                if (!propertyKeyframes)
                    return;
                var propertyKeyframesArray = propertyKeyframes.map(function (value, i) {
                    return (_a = {}, _a[property] = value, _a.offset = offsets_1 ? offsets_1[i] : undefined, _a);
                    var _a;
                });
                var propertyKeyframeOffsets = WebAnimator.getKeyframeOffsets(propertyKeyframesArray);
                Object.keys(propertyKeyframeOffsets).forEach(function (offset) {
                    if (keyframeOffsets[offset]) {
                        Object.assign(keyframeOffsets[offset], propertyKeyframeOffsets[offset]);
                    }
                    else {
                        keyframeOffsets[offset] = propertyKeyframeOffsets[offset];
                    }
                });
            });
        }
        return keyframeOffsets;
    };
    WebAnimator.getRuleString = function (property, value) {
        return property + ": " + value + ";\n";
    };
    WebAnimator.prototype.addAnimation = function (element, keyframes) {
        var keyframeOffsets = WebAnimator.getKeyframeOffsets(keyframes);
        var id = "anim-" + Math.floor(Math.random() * 100);
        var offsetStrings = Object.keys(keyframeOffsets).map(function (offset) {
            var rules = Object.keys(keyframeOffsets[offset]).map(function (property) {
                return WebAnimator.getRuleString(property, keyframeOffsets[offset][property]);
            });
            return +offset * 100 + "% {\n\t\t" + rules.join('\n\t\t') + "\n\t}";
        });
        var anim = "@keyframes " + id + " {\n\t" + offsetStrings.join('\n\t') + "\n}";
        element.style.setProperty('animation', id + " 1s infinite");
        this.styleElement.innerHTML = anim;
    };
    return WebAnimator;
}());
var as = new WebAnimator();
as.addAnimation(document.body, [
    { 'background-color': 'blue' },
    { 'background-color': 'green', offset: 0.5 },
    { 'background-color': 'red' },
    { 'background-color': 'yellow', offset: 0.8 },
    { 'background-color': 'pink' }
]);
//# sourceMappingURL=webanimate.es5.js.map

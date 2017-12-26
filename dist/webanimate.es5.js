/// <reference types="web-animations-js" />
var WebAnimator = /** @class */ (function () {
    function WebAnimator() {
        this.styleElement = document.createElement('style');
        this.styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(this.styleElement);
    }
    WebAnimator.prototype.addAnimation = function (element, keyframes) {
        var id = "anim-" + Math.floor(Math.random() * 100);
        var anim = "\n@keyframes " + id + " {\n  " + keyframes
            .map(function (keyframe, i) {
            var offset = 100 / (keyframes.length - 1) * i;
            return offset + "% {\n" + Object.keys(keyframe)
                .map(function (key) {
                var value = keyframe[key];
                return key + ": " + value + ";";
            })
                .join('\n') + "\n}";
        })
            .join('\n') + "\n}";
        element.style.setProperty('animation', id + " 1s infinite");
        this.styleElement.innerHTML = anim;
    };
    return WebAnimator;
}());
var as = new WebAnimator();
as.addAnimation(document.body, [{ background: 'red' }, { background: 'green' }]);
//# sourceMappingURL=webanimate.es5.js.map

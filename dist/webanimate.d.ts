/// <reference types="web-animations-js" />
declare class WebAnimator {
    private styleElement;
    constructor();
    addAnimation(element: HTMLElement, keyframes: AnimationKeyFrame[]): void;
}
declare const as: WebAnimator;

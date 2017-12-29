interface WebAnimationKeyframeMap {
    easing?: string;
    offset?: (number | null | undefined)[];
    [key: string]: string | number | (string | number | null | undefined)[] | undefined;
}
interface WebAnimationKeyframe {
    easing?: string;
    offset?: number | null | undefined;
    [key: string]: string | number | null | undefined;
}
interface WebAnimationKeyframeOffsets {
    [offset: string]: {
        easing?: string | number;
        [property: string]: string | number | undefined;
    };
}
declare class WebAnimator {
    private styleElement;
    constructor();
    static getKeyframeOffsets(keyframes: WebAnimationKeyframe[] | WebAnimationKeyframeMap): WebAnimationKeyframeOffsets;
    static getRuleString(property: string, value: any): string;
    addAnimation(element: HTMLElement, keyframes: WebAnimationKeyframe[] | WebAnimationKeyframeMap): void;
}
declare const as: WebAnimator;

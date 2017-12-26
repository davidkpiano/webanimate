/// <reference types="web-animations-js" />

class WebAnimator {
  private styleElement: HTMLStyleElement

  constructor() {
    this.styleElement = document.createElement('style')
    this.styleElement.type = 'text/css'

    document.getElementsByTagName('head')![0].appendChild(this.styleElement)
  }

  addAnimation(element: HTMLElement, keyframes: AnimationKeyFrame[]) {
    const id = `anim-${Math.floor(Math.random() * 100)}`

    const anim = `
@keyframes ${id} {
  ${keyframes
    .map((keyframe, i) => {
      const offset = 100 / (keyframes.length - 1) * i

      return `${offset}% {
${Object.keys(keyframe)
        .map(key => {
          const value = keyframe[key]
          return `${key}: ${value};`
        })
        .join('\n')}
}`
    })
    .join('\n')}
}`

    element.style.setProperty('animation', `${id} 1s infinite`)
    this.styleElement.innerHTML = anim
  }
}

const as = new WebAnimator()

as.addAnimation(document.body, [{ background: 'red' }, { background: 'green' }])

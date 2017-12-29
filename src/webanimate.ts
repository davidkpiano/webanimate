/// <reference types="web-animations-js" />

interface WebAnimationKeyframeMap {
  easing?: string
  offset?: (number | null | undefined)[]
  [key: string]: string | number | (string | number | null | undefined)[] | undefined
}

interface WebAnimationKeyframe {
  easing?: string
  offset?: number | null | undefined
  [key: string]: string | number | null | undefined
}

interface WebAnimationKeyframeOffsets {
  [offset: string]: {
    easing?: string | number
    [property: string]: string | number | undefined
  }
}

class WebAnimator {
  private styleElement: HTMLStyleElement

  constructor() {
    this.styleElement = document.createElement('style')
    this.styleElement.type = 'text/css'

    document.getElementsByTagName('head')![0].appendChild(this.styleElement)
  }

  static getKeyframeOffsets(
    keyframes: WebAnimationKeyframe[] | WebAnimationKeyframeMap
  ): WebAnimationKeyframeOffsets {
    const keyframeOffsets: WebAnimationKeyframeOffsets = {}

    if (Array.isArray(keyframes)) {
      const offsets = keyframes.map(k => k.offset)

      for (let i = 0; i < keyframes.length; i++) {
        const keyframe = keyframes[i]
        let { offset } = keyframe
        let lowerOffset = 0
        let upperOffset = 1
        let offsetRange = offsets.length

        if (offset !== undefined && offset !== null) {
          lowerOffset = offset
        } else if (i === 0) {
          offset = offsets[i] = 0
        } else if (i === keyframes.length - 1) {
          offset = offsets[i] = 1
        } else {
          let lowerOffsetIndex = i
          let upperOffsetIndex = i

          while (--lowerOffsetIndex >= 0) {
            if (offsets[lowerOffsetIndex] !== undefined) {
              lowerOffset = offsets[lowerOffsetIndex]!
              break
            }
          }
          while (++upperOffsetIndex < offsets.length) {
            if (offsets[upperOffsetIndex] !== undefined) {
              upperOffset = offsets[upperOffsetIndex]!
              break
            }
          }

          offsetRange = upperOffsetIndex - lowerOffsetIndex

          offset = offsets[i] = Number.parseFloat(
            (
              lowerOffset +
              (upperOffset - lowerOffset) * ((i - lowerOffsetIndex) / offsetRange)
            ).toFixed(4)
          )
        }
        keyframeOffsets[offset] = keyframeOffsets[offset] || {}

        Object.keys(keyframe).forEach(property => {
          if (property === 'offset') return
          const keyframeOffset = keyframeOffsets[offset as number]

          keyframeOffset[property] = keyframe[property] as string | number
        })

        if (keyframe.easing) {
          keyframeOffsets[offset].easing = keyframe.easing
        }
      }
    } else {
      const offsets = keyframes.offset

      Object.keys(keyframes).forEach(property => {
        if (property === 'offset') return

        const propertyKeyframes = ([] as (string | number | null | undefined)[]).concat(
          keyframes[property]!
        )

        if (!propertyKeyframes) return

        const propertyKeyframesArray = propertyKeyframes.map((value, i) => ({
          [property]: value,
          offset: offsets ? offsets[i] : undefined
        }))

        const propertyKeyframeOffsets = WebAnimator.getKeyframeOffsets(propertyKeyframesArray)

        Object.keys(propertyKeyframeOffsets).forEach(offset => {
          if (keyframeOffsets[offset]) {
            Object.assign(keyframeOffsets[offset], propertyKeyframeOffsets[offset])
          } else {
            keyframeOffsets[offset] = propertyKeyframeOffsets[offset]
          }
        })
      })
    }

    return keyframeOffsets
  }

  static getRuleString(property: string, value: any) {
    return `${property}: ${value};\n`
  }

  addAnimation(element: HTMLElement, keyframes: WebAnimationKeyframe[] | WebAnimationKeyframeMap) {
    const keyframeOffsets = WebAnimator.getKeyframeOffsets(keyframes)
    const id = `anim-${Math.floor(Math.random() * 100)}`

    const offsetStrings = Object.keys(keyframeOffsets).map(offset => {
      const rules = Object.keys(keyframeOffsets[offset]).map(property =>
        WebAnimator.getRuleString(property, keyframeOffsets[offset][property])
      )

      return `${+offset * 100}% {\n\t\t${rules.join('\n\t\t')}\n\t}`
    })

    const anim = `@keyframes ${id} {\n\t${offsetStrings.join('\n\t')}\n}`

    element.style.setProperty('animation', `${id} 1s infinite`)
    this.styleElement.innerHTML = anim
  }
}

const as = new WebAnimator()

as.addAnimation(document.body, [
  { 'background-color': 'blue' },
  { 'background-color': 'green', offset: 0.5 },
  { 'background-color': 'red' },
  { 'background-color': 'yellow', offset: 0.8 },
  { 'background-color': 'pink' }
])

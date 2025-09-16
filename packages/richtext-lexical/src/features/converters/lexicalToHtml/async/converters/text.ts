import type { SerializedTextNode } from '../../../../../nodeTypes.js'
import type { HTMLConvertersAsync } from '../types.js'

import { NodeFormat } from '../../../../../lexical/utils/nodeFormat.js'
import { defaultColors } from '../../../../textState/defaultColors.js'

const textState = {
  type: {},
  background: {
    ...defaultColors.background,
  },
  color: {
    ...defaultColors.text,
  },
  fontWeight: {
    Boldest: { css: { 'font-weight': '900' }, label: 'Boldest' },
  },
  size: {
    xl: { css: { 'font-size': '96px' }, label: 'Extra Large' },
    xs: { css: { 'font-size': 'var(--text-xs, 4px)' }, label: 'Extra Small' },
  },
}

export type StateValues = { [stateValue: string]: { css: string; label: string } }

type ExtractAllColorKeys<T> = {
  [P in keyof T]: T[P] extends StateValues ? keyof T[P] : never
}[keyof T]

type TextStateKeys = ExtractAllColorKeys<typeof textState>

export const TextHTMLConverterAsync: HTMLConvertersAsync<SerializedTextNode> = {
  text: ({ node }) => {
    let text = node.text

    const style = {}
    if (node.$) {
      Object.entries(textState).forEach(([stateKey, stateValues]) => {
        const stateValue = node.$ && (node.$[stateKey] as TextStateKeys)
        if (stateValue && stateValues[stateValue]) {
          //@ts-ignore
          Object.assign(style, stateValues[stateValue].css)
        }
      })
    }

    let providedCSSString = ''
    for (const key of Object.keys(style)) {
      // @ts-expect-error we're iterating over the keys of the object
      providedCSSString += `${key}: ${style[key]};`
    }

    if (node.format & NodeFormat.IS_BOLD) {
      text = `<strong style="${providedCSSString}">${text}</strong>`
    }
    if (node.format & NodeFormat.IS_ITALIC) {
      text = `<em style="${providedCSSString}>${text}</em>`
    }
    if (node.format & NodeFormat.IS_STRIKETHROUGH) {
      text = `<span style="text-decoration: line-through;${providedCSSString}">${text}</span>`
    }
    if (node.format & NodeFormat.IS_UNDERLINE) {
      text = `<span style="text-decoration: underline;${providedCSSString}">${text}</span>`
    }
    if (node.format & NodeFormat.IS_CODE) {
      text = `<code style="${providedCSSString}>${text}</code>`
    }
    if (node.format & NodeFormat.IS_SUBSCRIPT) {
      text = `<sub style="${providedCSSString}>${text}</sub>`
    }
    if (node.format & NodeFormat.IS_SUPERSCRIPT) {
      text = `<sup style="${providedCSSString}>${text}</sup>`
    }

    return text
  },
}

import type { SerializedTextNode } from '../../../../../nodeTypes.js'
import type { HTMLConvertersAsync } from '../types.js'

import { NodeFormat } from '../../../../../lexical/utils/nodeFormat.js'
import { defaultColors } from '../../../../textState/defaultColors.js'

const textState = {
  type: {
    cursive: { css: { 'font-family': 'var(--cursive, cursive)' }, label: 'cursive' },
    sans: { css: { 'font-family': 'var(--sans, sans-serif)' }, label: 'sans-serif' },
    serif: { css: { 'font-family': 'var(--serif, serif)' }, label: 'serif' },
  },
  background: {
    ...defaultColors.background,
  },
  color: {
    ...defaultColors.text,
  },
  fontWeight: {
    black: { css: { 'font-weight': '900' }, label: 'black' },
    bold: { css: { 'font-weight': '700' }, label: 'bold' },
    extrabold: { css: { 'font-weight': '800' }, label: 'extrabold' },
    extralight: { css: { 'font-weight': '200' }, label: 'extralight' },
    light: { css: { 'font-weight': '300' }, label: 'light' },
    medium: { css: { 'font-weight': '500' }, label: 'medium' },
    normal: { css: { 'font-weight': '400' }, label: 'normal' },
    semibold: { css: { 'font-weight': '600' }, label: 'semibold' },
    thin: { css: { 'font-weight': '100' }, label: 'thin' },
  },
  size: {
    'text-2xl': {
      css: {
        'font-size': 'var(--text-2xl,24px)',
        'line-height': 'var(--text-2xl--line-height, 1.2)',
      },
      label: 'text-2xl',
    },
    'text-3xl': {
      css: {
        'font-size': 'var(--text-3xl,30px)',
        'line-height': 'var(--text-3xl--line-height,1.2 )',
      },
      label: 'text-3xl',
    },
    'text-4xl': {
      css: {
        'font-size': 'var(--text-4xl,36px)',
        'line-height': 'var(--text-4xl--line-height, 1.2)',
      },
      label: 'text-4xl',
    },
    'text-5xl': {
      css: {
        'font-size': 'var(--text-5xl,48px)',
        'line-height': 'var(--text-5xl--line-height, 1)',
      },
      label: 'text-5xl',
    },
    'text-6xl': {
      css: {
        'font-size': 'var(--text-6xl,60px)',
        'line-height': 'var(--text-6xl--line-height, 1)',
      },
      label: 'text-6xl',
    },
    'text-7xl': {
      css: {
        'font-size': 'var(--text-7xl,72px)',
        'line-height': 'var(--text-7xl--line-height,1 )',
      },
      label: 'text-7xl',
    },
    'text-8xl': {
      css: {
        'font-size': 'var(--text-8xl, 96px)',
        'line-height': 'var(--text-8xl--line-height, 1)',
      },
      label: 'text-8xl',
    },
    'text-9xl': {
      css: {
        'font-size': 'var(--text-9xl, 128px)',
        'line-height': 'var(--text-9xl--line-height, 1)',
      },
      label: 'text-9xl',
    },
    'text-base': {
      css: {
        'font-size': ' var(--text-base, 16px)',
        'line-height': ' var(--text-base--line-height,1.5)',
      },
      label: 'text-base',
    },
    'text-lg': {
      css: {
        'font-size': 'var(--text-lg, 18px)',
        'line-height': 'var(--text-lg--line-height,1.4)',
      },
      label: 'text-lg',
    },
    'text-sm': {
      css: {
        'font-size': ' var(--text-sm, 14px)',
        'line-height': ' var(--text-sm--line-height, 1.6])',
      },
      label: 'text-sm',
    },
    'text-xl': {
      css: {
        'font-size': 'var(--text-xl, 20px)',
        'line-height': 'var(--text-xl--line-height, 1.4)',
      },
      label: 'text-xl',
    },
    'text-xs': {
      css: {
        'font-size': ' var(--text-xs, 12px)',
        'line-height': ' var(--text-xs--line-height,1.7)',
      },
      label: 'text-xs',
    },
  },
  themeColors: {
    background: { css: { color: 'var(--background, #3a383b)' }, label: 'background' },
    foreground: { css: { color: 'var(--foreground, #bbb5bd)' }, label: 'foreground' },
    primary: { css: { color: 'var(--primary, #531970)' }, label: 'primary' },
    'secondary ': { css: { color: 'var(--secondary, #6155cf )' }, label: 'secondary ' },
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

    text = `<span style="${providedCSSString}">${text}</span>`

    if (node.format & NodeFormat.IS_BOLD) {
      text = `<strong ">${text}</strong>`
    }
    if (node.format & NodeFormat.IS_ITALIC) {
      text = `<em >${text}</em>`
    }
    if (node.format & NodeFormat.IS_STRIKETHROUGH) {
      text = `<span style="text-decoration: line-through;">${text}</span>`
    }
    if (node.format & NodeFormat.IS_UNDERLINE) {
      text = `<span style="text-decoration: underline;">${text}</span>`
    }
    if (node.format & NodeFormat.IS_CODE) {
      text = `<code >${text}</code>`
    }
    if (node.format & NodeFormat.IS_SUBSCRIPT) {
      text = `<sub >${text}</sub>`
    }
    if (node.format & NodeFormat.IS_SUPERSCRIPT) {
      text = `<sup >${text}</sup>`
    }

    return text
  },
}

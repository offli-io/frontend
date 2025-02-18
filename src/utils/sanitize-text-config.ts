import * as sanitize from 'sanitize-html';

export const SANITIZED_TEXT_CONFIG_DEFAULT: sanitize.IOptions = {
  allowedTags: [
    'a',
    'b',
    'br',
    'del',
    'dd',
    'div',
    'dl',
    'dt',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'i',
    'li',
    'img',
    'ol',
    'strong',
    'p',
    's',
    'span',
    'ul',
    'u'
  ],
  allowedAttributes: {
    '*': ['style', 'data-tooltip-id'],
    a: ['href', 'target', 'hreflang', 'media', 'referrerpolicy', 'rel', 'type', 'download'],
    img: [
      'alt',
      'crossorigin',
      'height',
      'ismpap',
      'longdesc',
      'referrerpolicy',
      'sizes',
      'src',
      'srcset',
      'usemap',
      'width'
    ],
    li: ['value'],
    ol: ['reversed', 'start', 'type']
  }
};

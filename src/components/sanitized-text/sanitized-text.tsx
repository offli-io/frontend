import React, { ReactHTML } from 'react';
import sanitize from 'sanitize-html';
import { SANITIZED_TEXT_CONFIG_DEFAULT } from 'utils/sanitize-text-config';

interface SanitizedTextProps {
  text: string;
  config?: sanitize.IOptions;
  tagName?: keyof ReactHTML;
  className?: string;
  style?: React.CSSProperties;
}

export const SanitizedText: React.FC<SanitizedTextProps> = ({
  text,
  config = SANITIZED_TEXT_CONFIG_DEFAULT,
  tagName = 'div',
  className,
  style
}) => {
  return React.createElement(tagName, {
    style,
    className,
    dangerouslySetInnerHTML: {
      __html: sanitize(text, config)
    }
  });
};

export default SanitizedText;

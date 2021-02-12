const { isEmptyObject } = require('./utils/isEmptyObject');

module.exports = (opts = {}) => {
  // Work with options here

  const { prefix } = opts;

  if (isEmptyObject(opts)) {
    throw new Error(
      'postcss-wrap-plugin: prefix option needs to be provided (eg.: `{ prefix: ".my-class-prefix"}` )'
    );
  }

  if (typeof prefix !== 'string') {
    throw new Error(
      'postcss-wrap-plugin: prefix option should be a string (eg.: ".my-class-prefix")'
    );
  }

  const addWrapToSelector = selector => {
    if (selector === 'html') {
      return selector + prefix;
    }
    return `${prefix} ${selector}`;
  };

  const wrapCSSSelector = selector => {
    if (selector === '') {
      return null;
    }

    return addWrapToSelector(selector);
  };

  const wrapCssRuleSelector = cssRuleSelector => {
    return cssRuleSelector
      .split(',')
      .map(selector => wrapCSSSelector(selector.trim()))
      .join(', ');
  };

  const isRuleKeyframes = rule => {
    const { parent } = rule;
    return parent.type === 'atrule' && parent.name.includes('keyframes');
  };

  const isRuleId = rule => {
    const { selector } = rule;
    return selector.includes('#');
  };

  const checkIncludeRules = rule => {
    // Don't prefix IDs
    if (isRuleId(rule)) {
      return false;
    }
    // Don't prefix keyframe rules
    if (isRuleKeyframes(rule)) {
      return false;
    }
    return true;
  };

  return {
    postcssPlugin: 'postcss-class-prefixer',
    Rule(rule) {
      const { selector } = rule;
      if (checkIncludeRules(rule))
        rule.selector = wrapCssRuleSelector(selector);
    },
  };
};

module.exports.postcss = true;

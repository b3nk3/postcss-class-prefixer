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

  /**
   * Prefixes the selector with the user provided prefix
   * Special case for html is hard coded
   *
   * @param {string} selector css selector
   * @returns prefixed string
   */
  const addWrapToSelector = selector => {
    // Suffix `html`
    if (selector === 'html') {
      return selector + prefix;
    }

    // Don't prefix IDs
    if (selector.includes('#')) return selector;

    return `${prefix} ${selector}`;
  };

  /**
   * Checks if the selector is empty
   * @param {string} selector css selector
   * @returns string | null
   */
  const wrapCSSSelector = selector => {
    if (selector === '') {
      return null;
    }

    return addWrapToSelector(selector);
  };

  /**
   * Splits a list of selectors and prefixes them individually then rejoins them
   * @param {string} cssRuleSelector css selector
   * @returns string
   */
  const wrapCssRuleSelector = cssRuleSelector => {
    return cssRuleSelector
      .split(',')
      .map(selector => wrapCSSSelector(selector.trim()))
      .join(', ');
  };

  /**
   * Checks if the rule's parent is a keyframe
   *
   * @param {object} rule AST Object from PostCSS
   * @returns boolean
   */
  const isRuleKeyframes = rule => {
    const { parent } = rule;
    return parent.type === 'atrule' && parent.name.includes('keyframes');
  };

  /**
   * Determins whether to prefix a certain rule or no
   * Currently hardcoded to skip IDs and child rules of `@keyframes`
   *
   * @param {Object} rule AST Object from PostCSS
   * @returns boolean
   */
  const checkIncludeRules = rule => {
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

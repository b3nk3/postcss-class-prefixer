import { PostCSSAcceptedPlugin, PostCSSRule } from './Types';

export = (prefixSelector: string): PostCSSAcceptedPlugin => {
  /**
   * Prefixes the selector with the user provided prefix
   * Special case for html is hard coded
   *
   * @param {string} selector css selector
   * @returns prefixed string
   */
  const addWrapToSelector = (selector: string) => {
    // Suffix `html`
    if (selector === 'html') {
      return selector + prefixSelector;
    }

    // Don't prefix IDs
    if (selector.includes('#')) return selector;

    return `${prefixSelector} ${selector}`;
  };

  /**
   * Checks if the selector is empty
   * @param {string} selector css selector
   * @returns string | null
   */
  const wrapCSSSelector = (selector: string) => {
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
  const wrapCssRuleSelector = (rule: PostCSSRule) => {
    const { selector } = rule;
    return selector
      .split(',')
      .map((selector: string) => wrapCSSSelector(selector.trim()))
      .join(', ');
  };

  /**
   * Checks if the rule's parent is a keyframe
   *
   * @param {object} rule AST Object from PostCSS
   * @returns boolean
   */
  const isRuleKeyframes = (rule: PostCSSRule) => {
    const { parent } = rule;
    return parent?.type === 'atrule' && parent?.name?.includes('keyframes');
  };

  /**
   * Determins whether to prefix a certain rule or no
   * Currently hardcoded to skip IDs and child rules of `@keyframes`
   *
   * @param {Object} rule AST Object from PostCSS
   * @returns boolean
   */
  const checkIncludeRules = (rule: PostCSSRule) => {
    // Don't prefix keyframe rules
    if (isRuleKeyframes(rule)) {
      return false;
    }
    return true;
  };

  return {
    postcssPlugin: 'postcss-class-prefixer',
    Rule(rule: PostCSSRule): void {
      if (checkIncludeRules(rule)) rule.selector = wrapCssRuleSelector(rule);
    },
  };
};

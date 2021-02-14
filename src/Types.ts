export interface PostCSSContainer {
  parent?: PostCSSContainerParent;
  type?: string;
}

export interface PostCSSRule extends PostCSSContainer {
  selector: string;
  name?: string;
}

export interface PostCSSContainerParent extends PostCSSContainer {
  name?: string;
}

export interface PostCSSAcceptedPlugin {
  postcssPlugin: string;

  Rule(rule: PostCSSRule): void;
}

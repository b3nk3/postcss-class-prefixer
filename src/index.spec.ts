import postcss from 'postcss';
import plugin from '.';
import { PluginOptionsObject } from './Types';

async function run(
  input: string,
  output: string,
  { prefixSelector, shouldPrefixId }: PluginOptionsObject
) {
  const result = await postcss([
    plugin({ prefixSelector, shouldPrefixId }),
  ]).process(input, {
    from: undefined,
  });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}
const prefixSelector = '.cms-content';

describe('Class Perfixer defaults', () => {
  it('prefixes classes', async () => {
    await run(`.class { a:10px; }`, `${prefixSelector} .class { a:10px; }`, {
      prefixSelector,
    });
  });

  it('prefixes root tags', async () => {
    await run(`body { a:10px; }`, `${prefixSelector} body { a:10px; }`, {
      prefixSelector,
    });
  });

  it("affixes html tag 'html.prefix'", async () => {
    await run(`html { a:10px; }`, `html${prefixSelector} { a:10px; }`, {
      prefixSelector,
    });
  });

  it('prefixes element tags', async () => {
    await run(`div { a:10px; }`, `${prefixSelector} div { a:10px; }`, {
      prefixSelector,
    });
  });

  it("skips @keyframes' children", async () => {
    await run(
      `@keyframes errorIn {0% {transform: translateY(-20%);opacity: 0;}100% {transform: translateY(0);opacity: 1;}}`,
      `@keyframes errorIn {0% {transform: translateY(-20%);opacity: 0;}100% {transform: translateY(0);opacity: 1;}}`,
      { prefixSelector }
    );
  });

  it("skips IDs '#'", async () => {
    await run(`#id { a:10px; }`, `#id { a:10px; }`, { prefixSelector });
  });

  it('skips empty selectors', async () => {
    await run(`{ a:10px; }`, `{ a:10px; }`, { prefixSelector });
  });

  it('handles mixed multiple selectors', async () => {
    await run(
      `.class-a, div{ b: 4px; }, #id, .class-b { a:10px; }`,
      `${prefixSelector} .class-a, ${prefixSelector} div{ b: 4px; }, #id, ${prefixSelector} .class-b { a:10px; }`,
      { prefixSelector }
    );
  });
});

describe('Class Perfixer options', () => {
  it("prefixes IDs '#'", async () => {
    await run(`#id { a:10px; }`, `.test-class #id { a:10px; }`, {
      prefixSelector: '.test-class',
      shouldPrefixId: true,
    });
  });
});

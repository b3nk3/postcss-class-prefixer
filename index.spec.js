const postcss = require('postcss');
const plugin = require('.');

async function run(input, output, opts = {}, checkResults = true) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });
  if (checkResults) {
    expect(result.css).toEqual(output);
    expect(result.warnings()).toHaveLength(0);
  }
}

describe('Class Perfixer tests', () => {
  const prefixSelector = '.cms-content';

  it('throws error if options object is missing/empty', async () => {
    // const result = await ;
    await expect(
      run(`.class { a:10px; }`, `.class { a:10px; }`, false, {})
    ).rejects.toThrowError(
      'postcss-wrap-plugin: prefix option needs to be provided (eg.: `{ prefix: ".my-class-prefix"}` )'
    );
  });

  it('throws error if prefix is not a string', async () => {
    await expect(
      run(
        `.class { a:10px; }`,
        `.class { a:10px; }`,
        {
          prefix: 10,
        },
        false
      )
    ).rejects.toThrowError(
      'postcss-wrap-plugin: prefix option should be a string (eg.: ".my-class-prefix")'
    );
  });

  it('prefixes classes', async () => {
    await run(`.class { a:10px; }`, `${prefixSelector} .class { a:10px; }`, {
      prefix: prefixSelector,
    });
  });

  it('prefixes root tags', async () => {
    await run(`body { a:10px; }`, `${prefixSelector} body { a:10px; }`, {
      prefix: prefixSelector,
    });
  });

  it("affixes html tag 'html.prefix'", async () => {
    await run(`html { a:10px; }`, `html${prefixSelector} { a:10px; }`, {
      prefix: prefixSelector,
    });
  });

  it('prefixes element tags', async () => {
    await run(`div { a:10px; }`, `${prefixSelector} div { a:10px; }`, {
      prefix: prefixSelector,
    });
  });

  it("skips @keyframes' children", async () => {
    await run(
      `@keyframes errorIn {0% {transform: translateY(-20%);opacity: 0;}100% {transform: translateY(0);opacity: 1;}}`,
      `@keyframes errorIn {0% {transform: translateY(-20%);opacity: 0;}100% {transform: translateY(0);opacity: 1;}}`,
      { prefix: prefixSelector }
    );
  });

  it("skips IDs '#'", async () => {
    await run(`#id { a:10px; }`, `#id { a:10px; }`, { prefix: prefixSelector });
  });

  it('skips empty selectors', async () => {
    await run(`{ a:10px; }`, `{ a:10px; }`, { prefix: prefixSelector });
  });

  it('handles mixed multiple selectors', async () => {
    await run(
      `.class-a, div{ b: 4px; }, #id, .class-b { a:10px; }`,
      `${prefixSelector} .class-a, ${prefixSelector} div{ b: 4px; }, #id, ${prefixSelector} .class-b { a:10px; }`,
      { prefix: prefixSelector }
    );
  });
});

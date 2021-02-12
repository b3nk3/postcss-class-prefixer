[![Build Status](https://travis-ci.com/b3nk3/postcss-class-prefixer.svg?token=j23qhVmXEx5v17YPL7yq&branch=main)](https://travis-ci.com/b3nk3/postcss-class-prefixer)

# PostCSS Class Prefixer

Opinionated [PostCSS] plugin to prefix all off the classes and root tags with a class name of your choosing except for IDs and children of @keyframes.

The html root tag gets affixed like so:

```css
html.foo {
  baz: 3px;
}
```

[postcss]: https://github.com/postcss/postcss

### Examples

```css
/* Input */
.bar-a {
  baz: 3px;
}
.bar-b,
div {
  baz: 3px;
}
.bar-c,
#bar,
.bar-d {
  baz: 3px;
}
```

```css
/* Output */
.foo .bar-a {
  baz: 3px;
}
.foo .bar-b,
.foo div {
  baz: 3px;
}
.foo .bar-c,
#bar,
.foo .bar-d {
  baz: 3px;
}
```

## Usage

**Step 1:** Install plugin (and `postcss` if you haven't got it in your project):

```sh
npm install --save-dev postcss-class-prefixer
```

**Step 2:** Check you project for existing PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

Example:

```js
postcss([plugin(opts)]).process(input);
```

Where `opts` is and object with the prefix key containing your class for prefixing `{ prefix: '.my-custom-prefix' }` and `input` is a string of your css `'.foo { bar: baz; }'`

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-class-prefixer'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage

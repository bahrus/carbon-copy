[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/carbon-copy)

# \<carbon-copy\>

Copy a template inside a DOM node.  ~900B (minified/gzipped).

Syntax:

```html
<template id="beautiful">
    <div>
        <slot name="subjectIs"></slot> beautiful
    </div>
</template>
...
<c-c copy template-id="beautiful">
    <span slot="subjectIs">
        You are
    </span>
</c-c>
```

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

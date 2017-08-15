[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/carbon-copy)

# \<carbon-copy\>

Copy HTML Template into DOM

## Install the Polymer-CLI

There are a number of scenarios where a snippet of HTML must be copied (repeatedly) into the DOM tree.  This is partly what the Template Element [was designed for:](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)

>  Think of a template as a content fragment that is being stored for subsequent use in the document. While the parser does process the contents of the \<template\> element while loading the page, it does so only to ensure that those contents are valid; the element's contents are not rendered, however.

Out of the box, the template must be imported programmatically.  This can disrupt the flow when inspecting a document, especially when it is primarly markup driven, requiring a two-stop navigation jump, rather than a single navigation jump in order to inspect the contents of the source document fragment.

Imagine if, in JavaScript, every reference to a constant required retrieving it via a function.

The carbon copy element (c-c) for short, allows one to declaratively copy contents from an external HTML template into a sibling of the element.

The syntax for this element, at its simplest level is as follows:

```html
<template id="myTemplate">
</template>
<c-c href="/myPath/toTemplate/myHTMLFile.html#myTemplateId">
</c-c>
```

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

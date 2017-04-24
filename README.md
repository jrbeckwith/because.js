because.js
==========


Overview
--------

because.js is a Javascript client library for accessing BCS HTTP services
provided by Boundless, like geocoding and routing.

This library abstracts away details of how HTTP requests are constructed and
made and how HTTP responses are parsed, so that you are just using Javascript
objects to ask for data which comes in the form of other Javascript objects.

To use these services, you first need credentials, which you can get by signing
up at [Boundless Connect.](https://connect.boundlessgeo.com/)


Installing
-----------

These instructions assume you already have signed up with [Boundless
Connect.](https://connect.boundlessgeo.com/)

You'll need to [install Node and
npm](https://docs.npmjs.com/getting-started/installing-node) if you don't have
them already.

To download the code, clone the repository:

    git clone https://github.com/harts-boundless/because.js.git

When this is cloned, you can find a usable UMD module in `dist/because.js`.

However, it may be a little out of date. If you want to make sure you have a
fresh bundle reflecting the latest state of the original code in `src/` then
see the section on "Building" below.


Building
--------

`make dist/because.js`

This will create the JS bundle `dist/because.js` and the accompanying sourcemap
`dist/because.js.map`. 

This is a [UMD module.](https://github.com/umdjs/umd) If you don't know or care
what that means, you can just include it in the normal `<script>` way. This
will define a global variable `because`.

See the `example/` directory for an extended usage example using React and
ES2015. You don't have to use React or make things as complicated as the
example app, though.


Watch
-----

`make watch` watches for changes and triggers rebuilds of `dist/because.js`.
This is useful if you are making edits to the library in `src/`.


Running Tests
-------------

`make test`


Style Checking
--------------

`make lint`


Example Code
------------

Some rough React+ES2015 code is in `example/`.
See `example/README.md` for simple instructions.

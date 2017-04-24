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
up at Boundless Connect. Consult the docs for this library to see how to use
your credentials to enable the library to make requests against BCS services.


Installing
-----------

You need some kind of Node and npm. Let me know if your version doesn't work
and I'll mark it as deprecated. :)

To download the code for use, first clone the repository:

    git clone https://github.com/harts-boundless/because.js.git


Building
--------

`make dist/because.js`

This will create the JS bundle `dist/because.js` and the accompanying sourcemap
`dist/because.js.map`. 

This is a UMD module. If you don't know or care what that means, you can just
include it in the normal `<script>` way. This will define a global variable
`because`.

See the `examples/` directory for a more complicated example using React and
ES2015.


Running Tests
-------------

`make test`


Style Checking
--------------

`make lint`

/*jslint plusplus: false, nomen: false, strict: false */
/*global define: false, require: false, doh: false */

define(['build', 'env!env/file'], function (build, file) {
    //Remove any old builds
    file.deleteFile("builds");

    function c(fileName) {
        return file.readFile(fileName);
    }

    //Remove line returns to make comparisons easier.
    function nol(contents) {
        return contents.replace(/[\r\n]/g, "");
    }

    //Do a build of the text plugin to get any pragmas processed.
    build(["name=text", "baseUrl=../../../requirejs", "out=builds/text.js", "optimize=none"]);

    //Reset build state for next run.
    require._buildReset();

    var requireTextContents = c("builds/text.js"),
        oneResult = [
            c("../../../requirejs/tests/dimple.js"),
            c("../../../requirejs/tests/two.js"),
            c("../../../requirejs/tests/one.js")
        ].join("");

    doh.register("buildOneCssFile",
        [
            function buildOneCssFile(t) {
                build(["cssIn=css/sub/sub1.css", "out=builds/sub1.css"]);

                t.is(nol(c("cssTestCompare.css")), nol(c("builds/sub1.css")));

                //Reset require internal state for the contexts so future
                //builds in these tests will work correctly.
                require._buildReset();
            }
        ]
    );
    doh.run();

    doh.register("buildOneJsFile",
        [
            function buildOneJsFile(t) {
                build(["name=one", "include=dimple", "out=builds/outSingle.js",
                       "baseUrl=../../../requirejs/tests", "optimize=none"]);

                t.is(nol(oneResult), nol(c("builds/outSingle.js")));

                //Reset require internal state for the contexts so future
                //builds in these tests will work correctly.
                require._buildReset();
            }
        ]
    );
    doh.run();


    doh.register("buildOneJsFileWrapped",
        [
            function buildOneJsFile(t) {
                build(["name=one", "include=dimple", "out=builds/outSingleWrap.js",
                       "baseUrl=../../../requirejs/tests", "optimize=none",
                       "wrap.start=START", "wrap.end=END"]);

                t.is(nol("START" + oneResult + "END"), nol(c("builds/outSingleWrap.js")));

                //Reset require internal state for the contexts so future
                //builds in these tests will work correctly.
                require._buildReset();
            }
        ]
    );
    doh.run();

    doh.register("buildOneJsFileWrappedTrue",
        [
            function buildOneJsFile(t) {
                build(["name=one", "include=dimple", "out=builds/outSingleWrapTrue.js",
                       "baseUrl=../../../requirejs/tests", "optimize=none",
                       "wrap=true"]);

                t.is(nol("(function () {" + oneResult + "}());"), nol(c("builds/outSingleWrapTrue.js")));

                //Reset require internal state for the contexts so future
                //builds in these tests will work correctly.
                require._buildReset();
            }
        ]
    );
    doh.run();

    doh.register("buildOneJsFileWrappedFile",
        [
            function buildOneJsFile(t) {
                build(["name=one", "include=dimple", "out=builds/outSingleWrap.js",
                       "baseUrl=../../../requirejs/tests", "optimize=none",
                       "wrap.startFile=start.frag", "wrap.endFile=end.frag"]);

                t.is(nol(c("start.frag") + oneResult + c("end.frag")), nol(c("builds/outSingleWrap.js")));

                //Reset require internal state for the contexts so future
                //builds in these tests will work correctly.
                require._buildReset();
            }
        ]
    );
    doh.run();

    doh.register("buildSimple",
        [
            function buildSimple(t) {
                //Do the build
                build(["simple.build.js"]);

                t.is(nol(oneResult), nol(c("builds/simple/one.js")));

                //Reset require internal state for the contexts so future
                //builds in these tests will work correctly.
                require._buildReset();
            }
        ]
    );
    doh.run();

    doh.register("buildExcludeShallow",
        [
            function buildExcludeShallow(t) {
                build(["name=uno", "excludeShallow=dos", "out=builds/unoExcludeShallow.js",
                       "baseUrl=../../../requirejs/tests", "optimize=none"]);
                t.is(nol(c("../../../requirejs/tests/tres.js") +
                     c("../../../requirejs/tests/uno.js")), nol(c("builds/unoExcludeShallow.js")));
                require._buildReset();
            }
        ]
    );
    doh.run();

    doh.register("buildExclude",
        [
            function buildExclude(t) {
                build(["name=uno", "exclude=dos", "out=builds/unoExclude.js",
                       "baseUrl=../../../requirejs/tests", "optimize=none"]);

                t.is(nol(c("../../../requirejs/tests/uno.js")), nol(c("builds/unoExclude.js")));
                require._buildReset();
            }
        ]
    );
    doh.run();

    doh.register("buildTextPluginIncluded",
        [
            function buildTextPluginIncluded(t) {
                build(["name=one", "include=text", "out=builds/oneText.js",
                       "baseUrl=../../../requirejs/tests", "paths.text=../text", "optimize=none"]);

                t.is(nol(requireTextContents +
                         nol(c("../../../requirejs/tests/two.js") +
                         c("../../../requirejs/tests/one.js"))), nol(c("builds/oneText.js")));
                require._buildReset();
            }

        ]
    );
    doh.run();

    doh.register("buildPluginAsModule",
        [
            function buildPluginAsModule(t) {
                build(["name=refine!a", "out=builds/refineATest.js",
                       "baseUrl=../../../requirejs/tests/plugins/fromText",
                       "exclude=text,refine",
                       "paths.text=../../../text", "optimize=none"]);

                t.is(nol(nol(c("../../../requirejs/tests/plugins/fromText/a.refine")
                             .replace(/refine/g, 'define')))
                             .replace(/define\(\{/, "define('refine!a',{"),
                         nol(c("builds/refineATest.js")));

                require._buildReset();
            }

        ]
    );
    doh.run();

    doh.register("buildNamespace",
        [
            function buildPluginAsModule(t) {
                build(["baseUrl=lib/namespace", "optimize=none", "namespace=foo",
                       "name=main", "out=lib/namespace/foo.js"]);

                t.is(nol(c("lib/namespace/foo.js")),
                     nol(c("lib/namespace/expected.js")));

                require._buildReset();
            }

        ]
    );
    doh.run();
});

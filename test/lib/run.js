load('test/lib/env.rhino.1.2.js',
        'test/lib/jspec/jspec.js',
        'test/lib/jspec/jspec.xhr.js',
        'test/lib/jquery.js',
        'test/lib/jspec/jspec.jquery.js',
        'test/lib/loadFiles.js');

var testDirectoryPath = arguments[0];
var srcDirectoryPath = arguments[1];

var srcFiles = getFiles(srcDirectoryPath);
jQuery.each(srcFiles, function(index, model) {
    load(model);
});

function runTestSuite(testSuite) {
    JSpec.exec(testSuite);

}
;

var tests = getFiles(testDirectoryPath);
jQuery.each(tests, function(index, test) {
    if (isJavaScriptFile(test.getName())) {
        runTestSuite(test);
    }
});

var resultsFile = arguments[2];
load('test/lib/formatters.js');

JSpec

        .run({reporter:function(results, options) {
            JSpec.reporters.jUnit(results, options);
            JSpec.reporters.Terminal(results, options);
        }})
        .report()
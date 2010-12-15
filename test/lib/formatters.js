/*
  JSpec module which adds a new formatter (JSpec.formatters.jUnit) to generate an
  xml document compatible with Hudson CI jUnit result browser.

  Original: (c) 2009 Iv‡n -DrSlump- Montes <drslump _at_ pollinimini.net
  Public Domain

  Adjusted by Jo Cranford http://www.postposttechnical.com to write to file
  instead of printing output. 
*/
importClass(java.io.FileWriter);

JSpec.include({
    'reporters': {
        jUnit: function(results, options) {
            function callIterator(callback, a, b) {
               return callback.length == 1 ? callback(b) : callback(a, b)
            }

            function each(object, callback) {
                if (typeof object == 'string') object = object.split(' ')
                for (key in object)
                    if (object.hasOwnProperty(key))
                        callIterator(callback, key, object[key])
            }

            var out = {};
            out.$name = 'testsuites';
            out.$childs = [];

            each(results.allSuites, function(suite) {
                if (suite.ran) {
                    var testsuite = {
                        $name: 'testsuite',
                        $childs: [],
                        name: suite.description,
                        tests: suite.specs.length,
                        assertions: 0,
                        failures: 0
                    };

                    each(suite.specs, function(spec){
                        var testcase = {
                            $name: 'testcase',
                            $childs: [],
                            name: spec.description,
                            assertions: spec.assertions.length
                        };

                        each(spec.assertions, function(assertion){
                            if (!assertion.passed) {
                                testcase.$childs.push({
                                    $name: 'failure',
                                    type: assertion.message
                                });
                                testsuite.failures++;
                            }
                            testsuite.assertions++;
                        });

                        testsuite.$childs.push(testcase);
                    });

                    out.$childs.push(testsuite);
                }
            });

            function obj2xml(obj)
            {
                var xml = '<' + obj.$name + ' ';
                for (var k in obj) if (obj.hasOwnProperty(k) && k.charAt(0) !== '$') {
                    xml += k + '="' + (''+obj[k]).replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '" ';
                }
                if (obj.$childs && obj.$childs.length) {
                    xml += '>' + '\n';
                    for (var i=0; i<obj.$childs.length; i++) {
                        xml += obj2xml(obj.$childs[i]);
                    }
                    xml += '</' + obj.$name + '>' + '\n';
                } else {
                    xml += '/>' + '\n';
                }

                return xml;
            }

            var results = new File(resultsFile);
            var file_writer = new FileWriter(results);
            file_writer.write("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n");
            file_writer.write(obj2xml(out));
            file_writer.close();
        }
    }
});
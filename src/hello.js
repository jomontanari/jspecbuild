function Hello(dom) {
    var self = this;
    self.dom = dom;

    function setUp() {
        dom.html("Hello World");
    }

    setUp();
}
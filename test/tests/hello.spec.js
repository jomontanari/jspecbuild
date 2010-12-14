describe('Hello', function() {

    it("writes Hello World into the dom it is passed", function() {

        var dom = $("<div></div>");

        var hello = new Hello(dom);

        dom.html().should.be("Hello World");

    });

});
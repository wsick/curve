module runner {
    var libpath = "lib/Path2D/dist/Path2D";
    var testModules = [
        ".build/tests/test1"
    ];
    require([libpath], () => {
        require(testModules, (...modules: any[]) => {
            for (var i = 0; i < modules.length; i++) {
                modules[i].load();
            }
            QUnit.load();
            QUnit.start();
        });
    });
}
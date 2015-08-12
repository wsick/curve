module runner {
    var libpath = "lib/path2d/dist/path2d";
    var testModules = [
        ".build/tests/parseNumber"
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
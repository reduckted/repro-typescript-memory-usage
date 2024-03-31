const ts = require("typescript");
const path = require("path");

let tsconfigPath = path.join(__dirname, "tsconfig.memory.json");

let host = ts.createWatchCompilerHost(
  tsconfigPath,
  {
    noEmit: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    allowNonTsExtensions: true,
    allowJs: true,
    checkJs: true,
    extendedDiagnostics: true,
  },
  ts.sys,
  ts.createAbstractBuilder,
  () => {},
  () => {}
);

host.onUnRecoverableConfigFileDiagnostic = (diagnostic) => {
  console.log(
    ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine)
  );
};

host.trace = () => {};

console.log("TypeScript v" + ts.version);

console.log(
  `Memory before: ${Math.trunc(process.memoryUsage().heapUsed / 1048576)} MB`
);
let program = ts.createWatchProgram(host);

console.log(
  `Memory after:  ${Math.trunc(process.memoryUsage().heapUsed / 1048576)} MB`
);
program.close();

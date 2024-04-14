const ts = require("typescript");

const StatisticType = {
  time: 0,
  count: 1,
  memory: 2,
};

const Extension = {
  Ts: ".ts",
  Tsx: ".tsx",
  Dts: ".d.ts",
  Js: ".js",
  Jsx: ".jsx",
  Json: ".json",
  TsBuildInfo: ".tsbuildinfo",
  Mjs: ".mjs",
  Mts: ".mts",
  Dmts: ".d.mts",
  Cjs: ".cjs",
  Cts: ".cts",
  Dcts: ".d.cts",
};

const CharacterCodes = {
  nullCharacter: 0,
  maxAsciiCharacter: 0x7f,

  lineFeed: 0x0a, // \n
  carriageReturn: 0x0d, // \r
  lineSeparator: 0x2028,
  paragraphSeparator: 0x2029,
  nextLine: 0x0085,
};

/**
 * @param {ts.System} sys
 * @param {ts.Program} program
 * @param {SolutionPerformance | undefined} solutionPerformance
 */
function reportStatistics(sys, program, solutionPerformance) {
  const compilerOptions = program.getCompilerOptions();

  // @ts-ignore
  let performance = ts.performance;

  let statistics;
  statistics = [];
  const memoryUsed = sys.getMemoryUsage ? sys.getMemoryUsage() : -1;
  reportCountStatistic("Files", program.getSourceFiles().length);

  const lineCounts = countLines(program);
  if (compilerOptions.extendedDiagnostics) {
    for (const [key, value] of lineCounts.entries()) {
      reportCountStatistic("Lines of " + key, value);
    }
  } else {
    reportCountStatistic(
      "Lines",
      reduceLeftIterator(lineCounts.values(), (sum, count) => sum + count, 0)
    );
  }

  reportCountStatistic("Identifiers", program.getIdentifierCount());
  reportCountStatistic("Symbols", program.getSymbolCount());
  reportCountStatistic("Types", program.getTypeCount());
  reportCountStatistic("Instantiations", program.getInstantiationCount());
  if (memoryUsed >= 0) {
    reportStatisticalValue(
      {
        name: "Memory used",
        value: memoryUsed,
        type: StatisticType.memory,
      },
      /*aggregate*/ true
    );
  }

  const isPerformanceEnabled = performance.isEnabled();
  const programTime = isPerformanceEnabled
    ? // @ts-expect-error
      ts.performance.getDuration("Program")
    : 0;
  const bindTime = isPerformanceEnabled ? performance.getDuration("Bind") : 0;
  const checkTime = isPerformanceEnabled ? performance.getDuration("Check") : 0;
  const emitTime = isPerformanceEnabled ? performance.getDuration("Emit") : 0;
  if (compilerOptions.extendedDiagnostics) {
    const caches = program.getRelationCacheSizes();
    reportCountStatistic("Assignability cache size", caches.assignable);
    reportCountStatistic("Identity cache size", caches.identity);
    reportCountStatistic("Subtype cache size", caches.subtype);
    reportCountStatistic("Strict subtype cache size", caches.strictSubtype);
    if (isPerformanceEnabled) {
      performance.forEachMeasure((name, duration) => {
        if (!isSolutionMarkOrMeasure(name))
          reportTimeStatistic(`${name} time`, duration, /*aggregate*/ true);
      });
    }
  } else if (isPerformanceEnabled) {
    // Individual component times.
    // Note: To match the behavior of previous versions of the compiler, the reported parse time includes
    // I/O read time and processing time for triple-slash references and module imports, and the reported
    // emit time includes I/O write time. We preserve this behavior so we can accurately compare times.
    reportTimeStatistic(
      "I/O read",
      performance.getDuration("I/O Read"),
      /*aggregate*/ true
    );
    reportTimeStatistic(
      "I/O write",
      performance.getDuration("I/O Write"),
      /*aggregate*/ true
    );
    reportTimeStatistic("Parse time", programTime, /*aggregate*/ true);
    reportTimeStatistic("Bind time", bindTime, /*aggregate*/ true);
    reportTimeStatistic("Check time", checkTime, /*aggregate*/ true);
    reportTimeStatistic("Emit time", emitTime, /*aggregate*/ true);
  }
  if (isPerformanceEnabled) {
    reportTimeStatistic(
      "Total time",
      programTime + bindTime + checkTime + emitTime,
      /*aggregate*/ false
    );
  }
  reportAllStatistics(sys, statistics);
  if (!isPerformanceEnabled) {
    sys.write(
      "Performance_timings_for_diagnostics_or_extendedDiagnostics_are_not_available_in_this_session_A_native_implementation_of_the_Web_Performance_API_could_not_be_found\n"
    );
  } else {
    if (solutionPerformance) {
      // Clear selected marks and measures
      performance.forEachMeasure((name) => {
        if (!isSolutionMarkOrMeasure(name)) performance.clearMeasures(name);
      });
      performance.forEachMark((name) => {
        if (!isSolutionMarkOrMeasure(name)) performance.clearMarks(name);
      });
    } else {
      performance.disable();
    }
  }

  /**
   * @param {any} s
   * @param {boolean} aggregate
   */
  function reportStatisticalValue(s, aggregate) {
    statistics.push(s);
    if (aggregate) solutionPerformance?.addAggregateStatistic(s);
  }

  /**
   * @param {string} name
   * @param {number} count
   */
  function reportCountStatistic(name, count) {
    reportStatisticalValue(
      { name, value: count, type: StatisticType.count },
      /*aggregate*/ true
    );
  }

  /**
   * @param {string} name
   * @param {number} time
   * @param {boolean} aggregate
   */
  function reportTimeStatistic(name, time, aggregate) {
    reportStatisticalValue(
      { name, value: time, type: StatisticType.time },
      aggregate
    );
  }

  /**
   * @param {string} name
   * @returns {boolean}
   */
  function isSolutionMarkOrMeasure(name) {
    return startsWith(name, "SolutionBuilder::");
  }
}

function reportAllStatistics(sys, statistics) {
  let nameSize = 0;
  let valueSize = 0;
  for (const s of statistics) {
    if (s.name.length > nameSize) {
      nameSize = s.name.length;
    }

    const value = statisticValue(s);
    if (value.length > valueSize) {
      valueSize = value.length;
    }
  }

  for (const s of statistics) {
    sys.write(
      `${s.name}:`.padEnd(nameSize + 2) +
        statisticValue(s).toString().padStart(valueSize) +
        sys.newLine
    );
  }
}

/**
 * @param { Statistic} s
 * @returns {string}
 */
function statisticValue(s) {
  switch (s.type) {
    case StatisticType.count:
      return "" + s.value;
    case StatisticType.time:
      return (s.value / 1000).toFixed(2) + "s";
    case StatisticType.memory:
      return Math.round(s.value / 1000) + "K";
    default:
      return "";
  }
}

/**
 *
 * @param {ts.Program} program
 * @returns {Map<string, number>}
 */
function countLines(program) {
  const counts = getCountsMap();
  forEach(program.getSourceFiles(), (file) => {
    const key = getCountKey(program, file);
    const lineCount = getLineStarts(file).length;
    counts.set(key, counts.get(key) + lineCount);
  });
  return counts;
}

function getCountsMap() {
  const counts = new Map();
  counts.set("Library", 0);
  counts.set("Definitions", 0);
  counts.set("TypeScript", 0);
  counts.set("JavaScript", 0);
  counts.set("JSON", 0);
  counts.set("Other", 0);
  return counts;
}

function getCountKey(program, file) {
  const supportedTSExtensions = [
    [Extension.Ts, Extension.Tsx, Extension.Dts],
    [Extension.Cts, Extension.Dcts],
    [Extension.Mts, Extension.Dmts],
  ];
  const supportedTSExtensionsFlat = flatten(supportedTSExtensions);

  const supportedJSExtensions = [
    [Extension.Js, Extension.Jsx],
    [Extension.Mjs],
    [Extension.Cjs],
  ];
  const supportedJSExtensionsFlat = flatten(supportedJSExtensions);

  if (program.isSourceFileDefaultLibrary(file)) {
    return "Library";
  } else if (file.isDeclarationFile) {
    return "Definitions";
  }

  const path = file.path;
  if (fileExtensionIsOneOf(path, supportedTSExtensionsFlat)) {
    return "TypeScript";
  } else if (fileExtensionIsOneOf(path, supportedJSExtensionsFlat)) {
    return "JavaScript";
  } else if (fileExtensionIs(path, Extension.Json)) {
    return "JSON";
  } else {
    return "Other";
  }
}

function getLineStarts(sourceFile) {
  return (
    sourceFile.lineMap ||
    (sourceFile.lineMap = computeLineStarts(sourceFile.text))
  );
}

function computeLineStarts(text) {
  const result = [];
  let pos = 0;
  let lineStart = 0;
  while (pos < text.length) {
    const ch = text.charCodeAt(pos);
    pos++;
    switch (ch) {
      case CharacterCodes.carriageReturn:
        if (text.charCodeAt(pos) === CharacterCodes.lineFeed) {
          pos++;
        }
      // falls through
      case CharacterCodes.lineFeed:
        result.push(lineStart);
        lineStart = pos;
        break;
      default:
        if (ch > CharacterCodes.maxAsciiCharacter && isLineBreak(ch)) {
          result.push(lineStart);
          lineStart = pos;
        }
        break;
    }
  }
  result.push(lineStart);
  return result;
}

function isLineBreak(ch) {
  // ES5 7.3:
  // The ECMAScript line terminator characters are listed in Table 3.
  //     Table 3: Line Terminator Characters
  //     Code Unit Value     Name                    Formal Name
  //     \u000A              Line Feed               <LF>
  //     \u000D              Carriage Return         <CR>
  //     \u2028              Line separator          <LS>
  //     \u2029              Paragraph separator     <PS>
  // Only the characters in Table 3 are treated as line terminators. Other new line or line
  // breaking characters are treated as white space but not as line terminators.

  return (
    ch === CharacterCodes.lineFeed ||
    ch === CharacterCodes.carriageReturn ||
    ch === CharacterCodes.lineSeparator ||
    ch === CharacterCodes.paragraphSeparator
  );
}

function fileExtensionIsOneOf(path, extensions) {
  for (const extension of extensions) {
    if (fileExtensionIs(path, extension)) {
      return true;
    }
  }

  return false;
}

function fileExtensionIs(path, extension) {
  return path.length > extension.length && endsWith(path, extension);
}

function endsWith(str, suffix, ignoreCase) {
  const expectedPos = str.length - suffix.length;
  return (
    expectedPos >= 0 &&
    (ignoreCase
      ? equateStringsCaseInsensitive(str.slice(expectedPos), suffix)
      : str.indexOf(suffix, expectedPos) === expectedPos)
  );
}

function equateStringsCaseInsensitive(a, b) {
  return (
    a === b ||
    (a !== undefined && b !== undefined && a.toUpperCase() === b.toUpperCase())
  );
}

function forEach(array, callback) {
  if (array) {
    for (let i = 0; i < array.length; i++) {
      const result = callback(array[i], i);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
}

function flatten(array) {
  const result = [];
  for (const v of array) {
    if (v) {
      if (Array.isArray(v)) {
        addRange(result, v);
      } else {
        result.push(v);
      }
    }
  }
  return result;
}

function addRange(to, from, start, end) {
  if (from === undefined || from.length === 0) return to;
  if (to === undefined) return from.slice(start, end);

  start = start === undefined ? 0 : toOffset(from, start);
  end = end === undefined ? from.length : toOffset(from, end);
  for (let i = start; i < end && i < from.length; i++) {
    if (from[i] !== undefined) {
      to.push(from[i]);
    }
  }
  return to;
}

function toOffset(array, offset) {
  return offset < 0 ? array.length + offset : offset;
}

function startsWith(str, prefix, ignoreCase) {
  return ignoreCase
    ? equateStringsCaseInsensitive(str.slice(0, prefix.length), prefix)
    : str.lastIndexOf(prefix, 0) === 0;
}

function reduceLeftIterator(iterator, f, initial) {
  let result = initial;
  if (iterator) {
    let pos = 0;
    for (const value of iterator) {
      result = f(result, value, pos);
      pos++;
    }
  }
  return result;
}

/**
 * @typedef Statistic
 * @property {string} name
 * @property {number} value
 * @property {number} type
 */

/**
 * @typedef SolutionPerformance
 * @property {(s: Statistic) => void} addAggregateStatistic
 * @property {(cb: (s: Statistic) => void)=> void} forEachAggregateStatistics;
 * @property {() => void} clear
 */

module.exports = { reportStatistics };

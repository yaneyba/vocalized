var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../../node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../../node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../../node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../../node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// ../../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../../node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../../node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// ../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// ../../node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../../node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// ../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, workerdProcess, isWorkerdProcessV2, unenvProcess, exit, features, platform, env, hrtime3, nextTick, _channel, _disconnect, _events, _eventsCount, _handleQueue, _maxListeners, _pendingMessage, _send, assert2, disconnect, mainModule, _debugEnd, _debugProcess, _exiting, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _linkedBinding, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, availableMemory, binding, channel, chdir, config, connected, constrainedMemory, cpuUsage, cwd, debugPort, dlopen, domain, emit, emitWarning, eventNames, execArgv, execPath, exitCode, finalization, getActiveResourcesInfo, getegid, geteuid, getgid, getgroups, getMaxListeners, getuid, hasUncaughtExceptionCaptureCallback, initgroups, kill, listenerCount, listeners, loadEnvFile, memoryUsage, moduleLoadList, off, on, once, openStdin, permission, pid, ppid, prependListener, prependOnceListener, rawListeners, reallyExit, ref, release, removeAllListeners, removeListener, report, resourceUsage, send, setegid, seteuid, setgid, setgroups, setMaxListeners, setSourceMapsEnabled, setuid, setUncaughtExceptionCaptureCallback, sourceMapsEnabled, stderr, stdin, stdout, throwDeprecation, title, traceDeprecation, umask, unref, uptime, version, versions, _process, process_default;
var init_process2 = __esm({
  "../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
    unenvProcess = new Process({
      env: globalProcess.env,
      // `hrtime` is only available from workerd process v2
      hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
      env: (
        // Always implemented by workerd
        env
      ),
      hrtime: (
        // Only implemented in workerd v2
        hrtime3
      ),
      nextTick: (
        // Always implemented by workerd
        nextTick
      )
    } = unenvProcess);
    ({
      _channel,
      _disconnect,
      _events,
      _eventsCount,
      _handleQueue,
      _maxListeners,
      _pendingMessage,
      _send,
      assert: assert2,
      disconnect,
      mainModule
    } = unenvProcess);
    ({
      _debugEnd: (
        // @ts-expect-error `_debugEnd` is missing typings
        _debugEnd
      ),
      _debugProcess: (
        // @ts-expect-error `_debugProcess` is missing typings
        _debugProcess
      ),
      _exiting: (
        // @ts-expect-error `_exiting` is missing typings
        _exiting
      ),
      _fatalException: (
        // @ts-expect-error `_fatalException` is missing typings
        _fatalException
      ),
      _getActiveHandles: (
        // @ts-expect-error `_getActiveHandles` is missing typings
        _getActiveHandles
      ),
      _getActiveRequests: (
        // @ts-expect-error `_getActiveRequests` is missing typings
        _getActiveRequests
      ),
      _kill: (
        // @ts-expect-error `_kill` is missing typings
        _kill
      ),
      _linkedBinding: (
        // @ts-expect-error `_linkedBinding` is missing typings
        _linkedBinding
      ),
      _preload_modules: (
        // @ts-expect-error `_preload_modules` is missing typings
        _preload_modules
      ),
      _rawDebug: (
        // @ts-expect-error `_rawDebug` is missing typings
        _rawDebug
      ),
      _startProfilerIdleNotifier: (
        // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
        _startProfilerIdleNotifier
      ),
      _stopProfilerIdleNotifier: (
        // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
        _stopProfilerIdleNotifier
      ),
      _tickCallback: (
        // @ts-expect-error `_tickCallback` is missing typings
        _tickCallback
      ),
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      availableMemory,
      binding: (
        // @ts-expect-error `binding` is missing typings
        binding
      ),
      channel,
      chdir,
      config,
      connected,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      domain: (
        // @ts-expect-error `domain` is missing typings
        domain
      ),
      emit,
      emitWarning,
      eventNames,
      execArgv,
      execPath,
      exitCode,
      finalization,
      getActiveResourcesInfo,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getMaxListeners,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      initgroups: (
        // @ts-expect-error `initgroups` is missing typings
        initgroups
      ),
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      memoryUsage,
      moduleLoadList: (
        // @ts-expect-error `moduleLoadList` is missing typings
        moduleLoadList
      ),
      off,
      on,
      once,
      openStdin: (
        // @ts-expect-error `openStdin` is missing typings
        openStdin
      ),
      permission,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit: (
        // @ts-expect-error `reallyExit` is missing typings
        reallyExit
      ),
      ref,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      send,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setMaxListeners,
      setSourceMapsEnabled,
      setuid,
      setUncaughtExceptionCaptureCallback,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      throwDeprecation,
      title,
      traceDeprecation,
      umask,
      unref,
      uptime,
      version,
      versions
    } = isWorkerdProcessV2 ? workerdProcess : unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// ../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// ../../node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// src/utils/crypto.ts
var crypto_exports = {};
__export(crypto_exports, {
  generateId: () => generateId,
  hashPassword: () => hashPassword,
  signJWT: () => signJWT,
  verifyJWT: () => verifyJWT,
  verifyPassword: () => verifyPassword
});
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
async function signJWT(payload, secret, expiresIn = "7d") {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  const now = Math.floor(Date.now() / 1e3);
  const exp = now + parseExpiry(expiresIn);
  const jwtPayload = {
    ...payload,
    iat: now,
    exp
  };
  const encodeBase64URL = /* @__PURE__ */ __name((data) => {
    const str = JSON.stringify(data);
    const base64 = btoa(str);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }, "encodeBase64URL");
  const headerEncoded = encodeBase64URL(header);
  const payloadEncoded = encodeBase64URL(jwtPayload);
  const message = `${headerEncoded}.${payloadEncoded}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, messageData);
  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureBase64 = btoa(String.fromCharCode(...signatureArray)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return `${message}.${signatureBase64}`;
}
async function verifyJWT(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }
  const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
  const message = `${headerEncoded}.${payloadEncoded}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const signatureBase64 = signatureEncoded.replace(/-/g, "+").replace(/_/g, "/");
  const paddedSignature = signatureBase64 + "==".substring(0, 3 * signatureBase64.length % 4);
  const signatureStr = atob(paddedSignature);
  const signatureArray = new Uint8Array(signatureStr.length);
  for (let i = 0; i < signatureStr.length; i++) {
    signatureArray[i] = signatureStr.charCodeAt(i);
  }
  const isValid = await crypto.subtle.verify("HMAC", key, signatureArray, messageData);
  if (!isValid) {
    throw new Error("Invalid signature");
  }
  const decodeBase64URL = /* @__PURE__ */ __name((str) => {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "==".substring(0, 3 * base64.length % 4);
    return JSON.parse(atob(padded));
  }, "decodeBase64URL");
  const payload = decodeBase64URL(payloadEncoded);
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1e3)) {
    throw new Error("Token expired");
  }
  return payload;
}
function parseExpiry(expiresIn) {
  const match2 = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match2) {
    throw new Error("Invalid expiry format");
  }
  const value = parseInt(match2[1]);
  const unit = match2[2];
  switch (unit) {
    case "d":
      return value * 24 * 60 * 60;
    case "h":
      return value * 60 * 60;
    case "m":
      return value * 60;
    case "s":
      return value;
    default:
      throw new Error("Invalid expiry unit");
  }
}
function generateId(prefix = "") {
  const randomPart = crypto.randomUUID();
  return prefix ? `${prefix}_${randomPart}` : randomPart;
}
var init_crypto = __esm({
  "src/utils/crypto.ts"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(hashPassword, "hashPassword");
    __name(verifyPassword, "verifyPassword");
    __name(signJWT, "signJWT");
    __name(verifyJWT, "verifyJWT");
    __name(parseExpiry, "parseExpiry");
    __name(generateId, "generateId");
  }
});

// .wrangler/tmp/bundle-X1FbDe/middleware-loader.entry.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-X1FbDe/middleware-insertion-facade.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/index.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/hono.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/hono-base.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/compose.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context2.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context2, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// ../../node_modules/hono/dist/context.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/request.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/http-exception.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/request/constants.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GET_MATCH_RESULT = Symbol();

// ../../node_modules/hono/dist/utils/body.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// ../../node_modules/hono/dist/utils/url.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// ../../node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// ../../node_modules/hono/dist/utils/html.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context2, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// ../../node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// ../../node_modules/hono/dist/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// ../../node_modules/hono/dist/utils/constants.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../../node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class {
  static {
    __name(this, "Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env2, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
    }
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env2,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context2 = await composed(c);
        if (!context2.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context2.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// ../../node_modules/hono/dist/router/reg-exp-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/router/reg-exp-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/router/reg-exp-router/matcher.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }, "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// ../../node_modules/hono/dist/router/reg-exp-router/node.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class {
  static {
    __name(this, "Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context2, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node();
        if (name !== "") {
          node.#varIndex = context2.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context2, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// ../../node_modules/hono/dist/router/reg-exp-router/trie.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// ../../node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// ../../node_modules/hono/dist/router/reg-exp-router/prepared-router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/router/smart-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/router/smart-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// ../../node_modules/hono/dist/router/trie-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/router/trie-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/router/trie-router/node.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class {
  static {
    __name(this, "Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// ../../node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// ../../node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// ../../node_modules/hono/dist/middleware/cors/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var cors = /* @__PURE__ */ __name((options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// ../../node_modules/hono/dist/middleware/logger/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/utils/color.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function getColorEnabled() {
  const { process, Deno } = globalThis;
  const isNoColor = typeof Deno?.noColor === "boolean" ? Deno.noColor : process !== void 0 ? "NO_COLOR" in process?.env : false;
  return !isNoColor;
}
__name(getColorEnabled, "getColorEnabled");
async function getColorEnabledAsync() {
  const { navigator } = globalThis;
  const cfWorkers = "cloudflare:workers";
  const isNoColor = navigator !== void 0 && navigator.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(cfWorkers)).env ?? {});
    } catch {
      return false;
    }
  })() : !getColorEnabled();
  return !isNoColor;
}
__name(getColorEnabledAsync, "getColorEnabledAsync");

// ../../node_modules/hono/dist/middleware/logger/index.js
var humanize = /* @__PURE__ */ __name((times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
}, "humanize");
var time3 = /* @__PURE__ */ __name((start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s"]);
}, "time");
var colorStatus = /* @__PURE__ */ __name(async (status) => {
  const colorEnabled = await getColorEnabledAsync();
  if (colorEnabled) {
    switch (status / 100 | 0) {
      case 5:
        return `\x1B[31m${status}\x1B[0m`;
      case 4:
        return `\x1B[33m${status}\x1B[0m`;
      case 3:
        return `\x1B[36m${status}\x1B[0m`;
      case 2:
        return `\x1B[32m${status}\x1B[0m`;
    }
  }
  return `${status}`;
}, "colorStatus");
async function log3(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `${prefix} ${method} ${path}` : `${prefix} ${method} ${path} ${await colorStatus(status)} ${elapsed}`;
  fn(out);
}
__name(log3, "log");
var logger = /* @__PURE__ */ __name((fn = console.log) => {
  return /* @__PURE__ */ __name(async function logger2(c, next) {
    const { method, url } = c.req;
    const path = url.slice(url.indexOf("/", 8));
    await log3(fn, "<--", method, path);
    const start = Date.now();
    await next();
    await log3(fn, "-->", method, path, c.res.status, time3(start));
  }, "logger2");
}, "logger");

// src/routes/admin/index.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/routes/admin/auth.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_crypto();

// src/middleware/auth.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_crypto();
async function authenticate(c, next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({
      error: "Unauthorized",
      message: "Missing or invalid authorization header"
    }, 401);
  }
  const token = authHeader.substring(7);
  try {
    const payload = await verifyJWT(token, c.env.JWT_SECRET);
    c.set("auth", {
      userId: payload.sub,
      email: payload.email,
      type: payload.type,
      role: payload.role,
      workspaceId: payload.workspaceId
    });
    await next();
  } catch (error3) {
    console.error("JWT verification failed:", error3);
    return c.json({
      error: "Unauthorized",
      message: "Invalid or expired token"
    }, 401);
  }
}
__name(authenticate, "authenticate");
async function requireAdmin(c, next) {
  const auth = c.get("auth");
  if (!auth || auth.type !== "admin") {
    return c.json({
      error: "Forbidden",
      message: "Admin access required"
    }, 403);
  }
  await next();
}
__name(requireAdmin, "requireAdmin");
async function requireWorkspaceAccess(c, next) {
  const auth = c.get("auth");
  const workspaceId = c.req.param("workspaceId");
  if (!auth || auth.type !== "client") {
    return c.json({
      error: "Forbidden",
      message: "Client access required"
    }, 403);
  }
  const member = await c.env.DB.prepare(
    "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?"
  ).bind(workspaceId, auth.userId).first();
  if (!member) {
    return c.json({
      error: "Forbidden",
      message: "You do not have access to this workspace"
    }, 403);
  }
  c.set("auth", {
    ...auth,
    workspaceId,
    role: member.role
  });
  await next();
}
__name(requireWorkspaceAccess, "requireWorkspaceAccess");
function requireWorkspaceRole(...roles) {
  return async (c, next) => {
    const auth = c.get("auth");
    if (!auth || !auth.role || !roles.includes(auth.role)) {
      return c.json({
        error: "Forbidden",
        message: `Required workspace role: ${roles.join(" or ")}`
      }, 403);
    }
    await next();
  };
}
__name(requireWorkspaceRole, "requireWorkspaceRole");

// src/routes/admin/auth.ts
var authRoutes = new Hono2();
authRoutes.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({
        error: "Validation Error",
        message: "Email and password are required"
      }, 400);
    }
    const admin = await c.env.DB.prepare(
      "SELECT id, email, name, password_hash, role, is_active FROM platform_admins WHERE email = ?"
    ).bind(email).first();
    if (!admin) {
      return c.json({
        error: "Authentication Failed",
        message: "Invalid credentials"
      }, 401);
    }
    if (!admin.is_active) {
      return c.json({
        error: "Account Inactive",
        message: "Your admin account has been deactivated"
      }, 403);
    }
    const isValidPassword = await verifyPassword(password, admin.password_hash);
    if (!isValidPassword) {
      return c.json({
        error: "Authentication Failed",
        message: "Invalid credentials"
      }, 401);
    }
    await c.env.DB.prepare(
      "UPDATE platform_admins SET last_login = ? WHERE id = ?"
    ).bind(Date.now(), admin.id).run();
    const token = await signJWT(
      {
        sub: admin.id,
        email: admin.email,
        type: "admin",
        role: admin.role
      },
      c.env.JWT_SECRET,
      "24h"
    );
    const refreshToken = await signJWT(
      {
        sub: admin.id,
        type: "admin_refresh"
      },
      c.env.JWT_SECRET,
      "7d"
    );
    await c.env.DB.prepare(`
      INSERT INTO admin_activity_logs
      (id, admin_id, action, resource_type, resource_id, details, ip_address, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      admin.id,
      "login",
      null,
      null,
      null,
      c.req.header("CF-Connecting-IP") || null,
      Date.now()
    ).run();
    return c.json({
      token,
      refresh_token: refreshToken,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error3) {
    console.error("Admin login error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred during login"
    }, 500);
  }
});
authRoutes.post("/logout", authenticate, async (c) => {
  try {
    const auth = c.get("auth");
    await c.env.DB.prepare(`
      INSERT INTO admin_activity_logs
      (id, admin_id, action, resource_type, resource_id, details, ip_address, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      auth.userId,
      "logout",
      null,
      null,
      null,
      c.req.header("CF-Connecting-IP") || null,
      Date.now()
    ).run();
    return c.json({
      message: "Logged out successfully"
    });
  } catch (error3) {
    console.error("Admin logout error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred during logout"
    }, 500);
  }
});
authRoutes.get("/me", authenticate, async (c) => {
  try {
    const auth = c.get("auth");
    const admin = await c.env.DB.prepare(
      "SELECT id, email, name, role, created_at, last_login FROM platform_admins WHERE id = ?"
    ).bind(auth.userId).first();
    if (!admin) {
      return c.json({
        error: "Not Found",
        message: "Admin not found"
      }, 404);
    }
    return c.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        created_at: admin.created_at,
        last_login: admin.last_login
      }
    });
  } catch (error3) {
    console.error("Get admin error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching admin details"
    }, 500);
  }
});
authRoutes.post("/refresh", async (c) => {
  try {
    const { refresh_token } = await c.req.json();
    if (!refresh_token) {
      return c.json({
        error: "Validation Error",
        message: "Refresh token is required"
      }, 400);
    }
    const { verifyJWT: verifyJWT2 } = await Promise.resolve().then(() => (init_crypto(), crypto_exports));
    const payload = await verifyJWT2(refresh_token, c.env.JWT_SECRET);
    if (payload.type !== "admin_refresh") {
      return c.json({
        error: "Invalid Token",
        message: "Invalid refresh token"
      }, 401);
    }
    const admin = await c.env.DB.prepare(
      "SELECT id, email, name, role, is_active FROM platform_admins WHERE id = ?"
    ).bind(payload.sub).first();
    if (!admin || !admin.is_active) {
      return c.json({
        error: "Unauthorized",
        message: "Admin account not found or inactive"
      }, 401);
    }
    const token = await signJWT(
      {
        sub: admin.id,
        email: admin.email,
        type: "admin",
        role: admin.role
      },
      c.env.JWT_SECRET,
      "24h"
    );
    return c.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error3) {
    console.error("Token refresh error:", error3);
    return c.json({
      error: "Unauthorized",
      message: "Invalid or expired refresh token"
    }, 401);
  }
});
var auth_default = authRoutes;

// src/routes/admin/dashboard.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var dashboardRoutes = new Hono2();
dashboardRoutes.use("*", authenticate, requireAdmin);
dashboardRoutes.get("/overview", async (c) => {
  const db = c.env.DB;
  try {
    const now = /* @__PURE__ */ new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const totalWorkspacesResult = await db.prepare(
      "SELECT COUNT(*) as count FROM workspaces"
    ).first();
    const total_workspaces = totalWorkspacesResult?.count || 0;
    const activeWorkspacesResult = await db.prepare(
      "SELECT COUNT(*) as count FROM workspaces WHERE status IN ('active', 'trial')"
    ).first();
    const active_workspaces = activeWorkspacesResult?.count || 0;
    const callsTodayResult = await db.prepare(
      "SELECT COUNT(*) as count FROM calls WHERE DATE(started_at) = DATE(?)"
    ).bind(today).first();
    const total_calls_today = callsTodayResult?.count || 0;
    const callsMonthResult = await db.prepare(
      "SELECT COUNT(*) as count FROM calls WHERE started_at >= ?"
    ).bind(monthStart).first();
    const total_calls_month = callsMonthResult?.count || 0;
    const revenueMonthResult = await db.prepare(
      "SELECT SUM(total_amount) as total FROM billing_periods WHERE period_start >= ? AND status = ?"
    ).bind(monthStart, "finalized").first();
    const total_revenue_month = revenueMonthResult?.total || 0;
    const mrrResult = await db.prepare(`
      SELECT SUM(st.monthly_fee) as mrr
      FROM workspaces w
      JOIN subscription_tiers st ON w.subscription_tier = st.tier_name
      WHERE w.status IN ('active', 'trial')
    `).first();
    const mrr = mrrResult?.mrr || 0;
    const activeAgentsResult = await db.prepare(
      "SELECT COUNT(*) as count FROM voice_agents WHERE status = 'live'"
    ).first();
    const active_agents = activeAgentsResult?.count || 0;
    const providerHealthResult = await db.prepare(`
      SELECT
        provider,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_calls,
        COUNT(CASE WHEN status IN ('failed', 'no-answer') THEN 1 END) as failed_calls,
        COUNT(*) as total_calls
      FROM calls
      WHERE started_at >= ?
      GROUP BY provider
    `).bind(monthStart).all();
    const provider_health_summary = providerHealthResult.results.map((row) => ({
      provider: row.provider,
      success_rate: row.total_calls > 0 ? Math.round(row.successful_calls / row.total_calls * 100) : 0,
      total_calls: row.total_calls
    }));
    return c.json({
      total_workspaces,
      active_workspaces,
      total_calls_today,
      total_calls_month,
      total_revenue_month,
      mrr,
      active_agents,
      provider_health_summary
    });
  } catch (error3) {
    console.error("Dashboard overview error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "Failed to fetch dashboard overview"
    }, 500);
  }
});
dashboardRoutes.get("/revenue", async (c) => {
  const db = c.env.DB;
  const period = c.req.query("period") || "month";
  try {
    const now = /* @__PURE__ */ new Date();
    let periodStart;
    switch (period) {
      case "quarter":
        const currentQuarter = Math.floor(now.getMonth() / 3);
        periodStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
        break;
      case "year":
        periodStart = new Date(now.getFullYear(), 0, 1);
        break;
      case "month":
      default:
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    const periodStartISO = periodStart.toISOString();
    const totalRevenueResult = await db.prepare(
      "SELECT SUM(total_amount) as total FROM billing_periods WHERE period_start >= ? AND status = ?"
    ).bind(periodStartISO, "finalized").first();
    const total_revenue = totalRevenueResult?.total || 0;
    const revenuByTierResult = await db.prepare(`
      SELECT
        w.subscription_tier as tier,
        COUNT(DISTINCT w.id) as workspace_count,
        SUM(bp.total_amount) as revenue
      FROM billing_periods bp
      JOIN workspaces w ON bp.workspace_id = w.id
      WHERE bp.period_start >= ? AND bp.status = ?
      GROUP BY w.subscription_tier
    `).bind(periodStartISO, "finalized").all();
    const revenue_by_tier = revenuByTierResult.results.map((row) => ({
      tier: row.tier,
      workspace_count: row.workspace_count,
      revenue: row.revenue || 0
    }));
    const mrrResult = await db.prepare(`
      SELECT SUM(st.monthly_fee) as mrr
      FROM workspaces w
      JOIN subscription_tiers st ON w.subscription_tier = st.tier_name
      WHERE w.status IN ('active', 'trial')
    `).first();
    const mrr = mrrResult?.mrr || 0;
    const arr = mrr * 12;
    const churnResult = await db.prepare(`
      SELECT
        COUNT(CASE WHEN status = 'suspended' THEN 1 END) as churned,
        COUNT(*) as total
      FROM workspaces
    `).first();
    const churn_rate = churnResult && churnResult.total > 0 ? Math.round(churnResult.churned / churnResult.total * 100 * 10) / 10 : 0;
    return c.json({
      period,
      total_revenue,
      revenue_by_tier,
      mrr,
      arr,
      churn_rate
    });
  } catch (error3) {
    console.error("Dashboard revenue error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "Failed to fetch revenue analytics"
    }, 500);
  }
});
dashboardRoutes.get("/usage", async (c) => {
  const db = c.env.DB;
  const period = c.req.query("period") || "day";
  try {
    const now = /* @__PURE__ */ new Date();
    let periodStart;
    switch (period) {
      case "week":
        periodStart = new Date(now);
        periodStart.setDate(now.getDate() - 7);
        break;
      case "month":
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "day":
      default:
        periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    const periodStartISO = periodStart.toISOString();
    const totalCallsResult = await db.prepare(
      "SELECT COUNT(*) as count FROM calls WHERE started_at >= ?"
    ).bind(periodStartISO).first();
    const total_calls = totalCallsResult?.count || 0;
    const totalMinutesResult = await db.prepare(
      "SELECT SUM(duration_seconds) / 60.0 as minutes FROM calls WHERE started_at >= ? AND duration_seconds IS NOT NULL"
    ).bind(periodStartISO).first();
    const total_minutes = Math.round(totalMinutesResult?.minutes || 0);
    const callsByProviderResult = await db.prepare(`
      SELECT
        provider,
        COUNT(*) as call_count,
        SUM(duration_seconds) / 60.0 as total_minutes
      FROM calls
      WHERE started_at >= ?
      GROUP BY provider
    `).bind(periodStartISO).all();
    const calls_by_provider = callsByProviderResult.results.map((row) => ({
      provider: row.provider,
      call_count: row.call_count,
      total_minutes: Math.round(row.total_minutes || 0)
    }));
    const avgDurationResult = await db.prepare(
      "SELECT AVG(duration_seconds) as avg_duration FROM calls WHERE started_at >= ? AND duration_seconds IS NOT NULL"
    ).bind(periodStartISO).first();
    const avg_call_duration = Math.round(avgDurationResult?.avg_duration || 0);
    const peakHoursResult = await db.prepare(`
      SELECT
        CAST(strftime('%H', started_at) AS INTEGER) as hour,
        COUNT(*) as call_count
      FROM calls
      WHERE started_at >= ?
      GROUP BY hour
      ORDER BY call_count DESC
      LIMIT 5
    `).bind(periodStartISO).all();
    const peak_hours = peakHoursResult.results.map((row) => ({
      hour: row.hour,
      call_count: row.call_count
    }));
    return c.json({
      period,
      total_calls,
      total_minutes,
      calls_by_provider,
      avg_call_duration,
      peak_hours
    });
  } catch (error3) {
    console.error("Dashboard usage error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "Failed to fetch usage statistics"
    }, 500);
  }
});
var dashboard_default = dashboardRoutes;

// src/routes/admin/workspaces.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var workspacesRoutes = new Hono2();
workspacesRoutes.use("*", authenticate, requireAdmin);
workspacesRoutes.get("/", async (c) => {
  const db = c.env.DB;
  try {
    const page = parseInt(c.req.query("page") || "1");
    const limit = Math.min(parseInt(c.req.query("limit") || "50"), 100);
    const offset = (page - 1) * limit;
    const status = c.req.query("status");
    const tier = c.req.query("tier");
    const search = c.req.query("search");
    const conditions = [];
    const params = [];
    if (status) {
      conditions.push("w.status = ?");
      params.push(status);
    }
    if (tier) {
      conditions.push("w.subscription_tier = ?");
      params.push(tier);
    }
    if (search) {
      conditions.push("w.name LIKE ?");
      params.push(`%${search}%`);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const countQuery = `
      SELECT COUNT(*) as count
      FROM workspaces w
      ${whereClause}
    `;
    const countResult = await db.prepare(countQuery).bind(...params).first();
    const total = countResult?.count || 0;
    const query = `
      SELECT
        w.id,
        w.name,
        w.status,
        w.subscription_tier,
        w.trial_ends_at,
        w.created_at,
        w.updated_at,
        u.id as owner_id,
        u.email as owner_email,
        u.name as owner_name,
        (SELECT COUNT(*) FROM workspace_members WHERE workspace_id = w.id) as member_count,
        (SELECT COUNT(*) FROM voice_agents WHERE workspace_id = w.id) as agent_count,
        (SELECT COUNT(*) FROM calls WHERE workspace_id = w.id) as total_calls,
        (SELECT SUM(duration_seconds) / 60.0 FROM calls WHERE workspace_id = w.id AND duration_seconds IS NOT NULL) as total_minutes
      FROM workspaces w
      LEFT JOIN workspace_members wm ON w.id = wm.workspace_id AND wm.role = 'owner'
      LEFT JOIN client_users u ON wm.user_id = u.id
      ${whereClause}
      ORDER BY w.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const result = await db.prepare(query).bind(...params, limit, offset).all();
    const workspaces = result.results.map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      subscription_tier: row.subscription_tier,
      trial_ends_at: row.trial_ends_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      owner: row.owner_id ? {
        id: row.owner_id,
        email: row.owner_email,
        name: row.owner_name
      } : null,
      stats: {
        member_count: row.member_count || 0,
        agent_count: row.agent_count || 0,
        total_calls: row.total_calls || 0,
        total_minutes: Math.round(row.total_minutes || 0)
      }
    }));
    return c.json({
      workspaces,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    });
  } catch (error3) {
    console.error("Admin list workspaces error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "Failed to fetch workspaces"
    }, 500);
  }
});
workspacesRoutes.get("/:id", async (c) => {
  const db = c.env.DB;
  const workspaceId = c.req.param("id");
  try {
    const workspace = await db.prepare(`
      SELECT
        w.*,
        st.tier_name,
        st.monthly_fee,
        st.max_agents,
        st.included_minutes
      FROM workspaces w
      LEFT JOIN subscription_tiers st ON w.subscription_tier = st.tier_name
      WHERE w.id = ?
    `).bind(workspaceId).first();
    if (!workspace) {
      return c.json({
        error: "Not Found",
        message: "Workspace not found"
      }, 404);
    }
    const owner = await db.prepare(`
      SELECT u.id, u.email, u.name, u.created_at
      FROM client_users u
      JOIN workspace_members wm ON u.id = wm.user_id
      WHERE wm.workspace_id = ? AND wm.role = 'owner'
    `).bind(workspaceId).first();
    const membersResult = await db.prepare(`
      SELECT
        u.id,
        u.email,
        u.name,
        wm.role,
        wm.joined_at
      FROM workspace_members wm
      JOIN client_users u ON wm.user_id = u.id
      WHERE wm.workspace_id = ?
      ORDER BY wm.joined_at
    `).bind(workspaceId).all();
    const agentsResult = await db.prepare(`
      SELECT
        id,
        name,
        status,
        voice_provider,
        created_at
      FROM voice_agents
      WHERE workspace_id = ?
      ORDER BY created_at DESC
    `).bind(workspaceId).all();
    const phoneNumbersResult = await db.prepare(`
      SELECT
        id,
        phone_number,
        provider,
        status
      FROM phone_numbers
      WHERE workspace_id = ?
      ORDER BY created_at DESC
    `).bind(workspaceId).all();
    const callStats = await db.prepare(`
      SELECT
        COUNT(*) as total_calls,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_calls,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_calls,
        SUM(duration_seconds) / 60.0 as total_minutes,
        AVG(duration_seconds) as avg_duration
      FROM calls
      WHERE workspace_id = ?
    `).bind(workspaceId).first();
    const currentBillingPeriod = await db.prepare(`
      SELECT
        bp.id,
        bp.period_start,
        bp.period_end,
        bp.total_amount,
        bp.status,
        (SELECT SUM(quantity)
         FROM usage_records
         WHERE billing_period_id = bp.id
         AND resource_type = 'call_minutes') as total_minutes,
        (SELECT COUNT(DISTINCT call_id)
         FROM usage_records
         WHERE billing_period_id = bp.id
         AND call_id IS NOT NULL) as total_calls
      FROM billing_periods bp
      WHERE bp.workspace_id = ?
      ORDER BY bp.period_start DESC
      LIMIT 1
    `).bind(workspaceId).first();
    const recentCallsResult = await db.prepare(`
      SELECT
        id,
        direction,
        status,
        duration_seconds,
        started_at,
        ended_at
      FROM calls
      WHERE workspace_id = ?
      ORDER BY started_at DESC
      LIMIT 10
    `).bind(workspaceId).all();
    return c.json({
      workspace: {
        ...workspace,
        tier_info: {
          tier_name: workspace.tier_name,
          monthly_fee: workspace.monthly_fee,
          max_agents: workspace.max_agents,
          included_minutes: workspace.included_minutes
        }
      },
      owner,
      members: membersResult.results,
      agents: agentsResult.results,
      phone_numbers: phoneNumbersResult.results,
      call_stats: {
        total_calls: callStats?.total_calls || 0,
        completed_calls: callStats?.completed_calls || 0,
        failed_calls: callStats?.failed_calls || 0,
        total_minutes: Math.round(callStats?.total_minutes || 0),
        avg_duration: Math.round(callStats?.avg_duration || 0)
      },
      current_billing_period: currentBillingPeriod || null,
      recent_calls: recentCallsResult.results
    });
  } catch (error3) {
    console.error("Admin get workspace error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "Failed to fetch workspace details"
    }, 500);
  }
});
workspacesRoutes.put("/:id", async (c) => {
  const db = c.env.DB;
  const workspaceId = c.req.param("id");
  try {
    const body = await c.req.json();
    const workspace = await db.prepare(
      "SELECT id FROM workspaces WHERE id = ?"
    ).bind(workspaceId).first();
    if (!workspace) {
      return c.json({
        error: "Not Found",
        message: "Workspace not found"
      }, 404);
    }
    if (body.subscription_tier) {
      const tier = await db.prepare(
        "SELECT tier_name FROM subscription_tiers WHERE tier_name = ?"
      ).bind(body.subscription_tier).first();
      if (!tier) {
        return c.json({
          error: "Bad Request",
          message: "Invalid subscription tier"
        }, 400);
      }
    }
    if (body.status && !["active", "trial", "suspended", "cancelled"].includes(body.status)) {
      return c.json({
        error: "Bad Request",
        message: "Invalid status. Must be one of: active, trial, suspended, cancelled"
      }, 400);
    }
    const updates = [];
    const params = [];
    if (body.name !== void 0) {
      updates.push("name = ?");
      params.push(body.name);
    }
    if (body.subscription_tier !== void 0) {
      updates.push("subscription_tier = ?");
      params.push(body.subscription_tier);
    }
    if (body.status !== void 0) {
      updates.push("status = ?");
      params.push(body.status);
    }
    if (body.timezone !== void 0) {
      updates.push("timezone = ?");
      params.push(body.timezone);
    }
    if (updates.length === 0) {
      return c.json({
        error: "Bad Request",
        message: "No valid fields to update"
      }, 400);
    }
    updates.push("updated_at = ?");
    params.push((/* @__PURE__ */ new Date()).toISOString());
    params.push(workspaceId);
    await db.prepare(`
      UPDATE workspaces
      SET ${updates.join(", ")}
      WHERE id = ?
    `).bind(...params).run();
    const auth = c.get("auth");
    await db.prepare(`
      INSERT INTO admin_activity_logs (id, admin_id, action, resource_type, resource_id, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      auth.userId,
      "update_workspace",
      "workspace",
      workspaceId,
      JSON.stringify({ updates: body }),
      Math.floor(Date.now() / 1e3)
    ).run();
    const updatedWorkspace = await db.prepare(
      "SELECT * FROM workspaces WHERE id = ?"
    ).bind(workspaceId).first();
    return c.json({
      message: "Workspace updated successfully",
      workspace: updatedWorkspace
    });
  } catch (error3) {
    console.error("Admin update workspace error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "Failed to update workspace"
    }, 500);
  }
});
workspacesRoutes.post("/:id/suspend", async (c) => {
  const db = c.env.DB;
  const workspaceId = c.req.param("id");
  try {
    const body = await c.req.json();
    const reason = body.reason || "Suspended by admin";
    const workspace = await db.prepare(
      "SELECT id, name, status FROM workspaces WHERE id = ?"
    ).bind(workspaceId).first();
    if (!workspace) {
      return c.json({
        error: "Not Found",
        message: "Workspace not found"
      }, 404);
    }
    if (workspace.status === "suspended") {
      return c.json({
        error: "Bad Request",
        message: "Workspace is already suspended"
      }, 400);
    }
    await db.prepare(`
      UPDATE workspaces
      SET status = 'suspended', updated_at = ?
      WHERE id = ?
    `).bind((/* @__PURE__ */ new Date()).toISOString(), workspaceId).run();
    await db.prepare(`
      UPDATE voice_agents
      SET status = 'paused'
      WHERE workspace_id = ? AND status = 'live'
    `).bind(workspaceId).run();
    const auth = c.get("auth");
    await db.prepare(`
      INSERT INTO admin_activity_logs (id, admin_id, action, resource_type, resource_id, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      auth.userId,
      "suspend_workspace",
      "workspace",
      workspaceId,
      JSON.stringify({ reason, previous_status: workspace.status }),
      Math.floor(Date.now() / 1e3)
    ).run();
    return c.json({
      message: "Workspace suspended successfully",
      workspace_id: workspaceId,
      workspace_name: workspace.name,
      previous_status: workspace.status,
      reason
    });
  } catch (error3) {
    console.error("Admin suspend workspace error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "Failed to suspend workspace"
    }, 500);
  }
});
workspacesRoutes.post("/:id/activate", async (c) => {
  const db = c.env.DB;
  const workspaceId = c.req.param("id");
  try {
    const body = await c.req.json();
    const subscriptionTier = body.subscription_tier;
    const workspace = await db.prepare(
      "SELECT id, name, status, subscription_tier FROM workspaces WHERE id = ?"
    ).bind(workspaceId).first();
    if (!workspace) {
      return c.json({
        error: "Not Found",
        message: "Workspace not found"
      }, 404);
    }
    if (workspace.status === "active") {
      return c.json({
        error: "Bad Request",
        message: "Workspace is already active"
      }, 400);
    }
    let finalTier = workspace.subscription_tier;
    if (subscriptionTier) {
      const tier = await db.prepare(
        "SELECT tier_name FROM subscription_tiers WHERE tier_name = ?"
      ).bind(subscriptionTier).first();
      if (!tier) {
        return c.json({
          error: "Bad Request",
          message: "Invalid subscription tier"
        }, 400);
      }
      finalTier = subscriptionTier;
    }
    const updates = ["status = ?", "updated_at = ?"];
    const params = ["active", (/* @__PURE__ */ new Date()).toISOString()];
    if (subscriptionTier) {
      updates.push("subscription_tier = ?");
      params.push(subscriptionTier);
    }
    params.push(workspaceId);
    await db.prepare(`
      UPDATE workspaces
      SET ${updates.join(", ")}
      WHERE id = ?
    `).bind(...params).run();
    const auth = c.get("auth");
    await db.prepare(`
      INSERT INTO admin_activity_logs (id, admin_id, action, resource_type, resource_id, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      auth.userId,
      "activate_workspace",
      "workspace",
      workspaceId,
      JSON.stringify({
        previous_status: workspace.status,
        new_tier: finalTier
      }),
      Math.floor(Date.now() / 1e3)
    ).run();
    return c.json({
      message: "Workspace activated successfully",
      workspace_id: workspaceId,
      workspace_name: workspace.name,
      previous_status: workspace.status,
      subscription_tier: finalTier
    });
  } catch (error3) {
    console.error("Admin activate workspace error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "Failed to activate workspace"
    }, 500);
  }
});
var workspaces_default = workspacesRoutes;

// src/routes/admin/providers.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var providersRoutes = new Hono2();
providersRoutes.use("*", authenticate, requireAdmin);
providersRoutes.get("/", async (c) => {
  const db = c.env.DB;
  try {
    const providersResult = await db.prepare(`
      SELECT
        provider,
        config,
        priority,
        is_enabled,
        cost_per_unit,
        created_at,
        updated_at
      FROM platform_provider_configs
      ORDER BY priority ASC, provider ASC
    `).all();
    const providers = await Promise.all(
      providersResult.results.map(async (provider) => {
        const healthResult = await db.prepare(`
          SELECT
            region,
            status,
            last_check,
            error_rate,
            avg_latency
          FROM provider_health_status
          WHERE provider = ?
          ORDER BY region ASC
        `).bind(provider.provider).all();
        const healthStatuses = healthResult.results.map((h) => h.status);
        let overallHealth = "healthy";
        if (healthStatuses.includes("down")) {
          overallHealth = "down";
        } else if (healthStatuses.includes("degraded")) {
          overallHealth = "degraded";
        }
        return {
          provider: provider.provider,
          config: provider.config ? JSON.parse(provider.config) : null,
          priority: provider.priority,
          is_enabled: Boolean(provider.is_enabled),
          cost_per_unit: provider.cost_per_unit,
          created_at: provider.created_at,
          updated_at: provider.updated_at,
          health: {
            overall_status: overallHealth,
            regions: healthResult.results.map((h) => ({
              region: h.region,
              status: h.status,
              last_check: h.last_check,
              error_rate: h.error_rate,
              avg_latency: h.avg_latency
            }))
          }
        };
      })
    );
    const providersWithStats = await Promise.all(
      providers.map(async (provider) => {
        const usageResult = await db.prepare(`
          SELECT
            COUNT(DISTINCT workspace_id) as workspace_count,
            COUNT(*) as usage_count,
            SUM(total_cost) as total_cost
          FROM usage_records
          WHERE provider = ?
          AND created_at >= ?
        `).bind(
          provider.provider,
          Math.floor(Date.now() / 1e3) - 30 * 24 * 60 * 60
          // Last 30 days
        ).first();
        return {
          ...provider,
          usage_stats: {
            workspace_count: usageResult?.workspace_count || 0,
            usage_count: usageResult?.usage_count || 0,
            total_cost: usageResult?.total_cost || 0
          }
        };
      })
    );
    return c.json({
      providers: providersWithStats
    });
  } catch (error3) {
    console.error("Admin list providers error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "Failed to fetch providers"
    }, 500);
  }
});
providersRoutes.post("/", async (c) => {
  const db = c.env.DB;
  try {
    const body = await c.req.json();
    const { provider, api_key, config: config2, priority, cost_per_unit } = body;
    if (!provider || !api_key) {
      return c.json({
        error: "Bad Request",
        message: "provider and api_key are required"
      }, 400);
    }
    const validProviders = ["elevenlabs", "vapi", "retell", "deepgram", "bolna"];
    if (!validProviders.includes(provider)) {
      return c.json({
        error: "Bad Request",
        message: `Invalid provider. Must be one of: ${validProviders.join(", ")}`
      }, 400);
    }
    const existing = await db.prepare(
      "SELECT provider FROM platform_provider_configs WHERE provider = ?"
    ).bind(provider).first();
    if (existing) {
      return c.json({
        error: "Conflict",
        message: "Provider already exists. Use PUT to update."
      }, 409);
    }
    const api_key_encrypted = api_key;
    const now = Math.floor(Date.now() / 1e3);
    await db.prepare(`
      INSERT INTO platform_provider_configs (
        provider,
        api_key_encrypted,
        config,
        priority,
        is_enabled,
        cost_per_unit,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      provider,
      api_key_encrypted,
      config2 ? JSON.stringify(config2) : null,
      priority || 0,
      1,
      // enabled by default
      cost_per_unit || 0,
      now,
      now
    ).run();
    const auth = c.get("auth");
    await db.prepare(`
      INSERT INTO admin_activity_logs (id, admin_id, action, resource_type, resource_id, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      auth.userId,
      "add_provider",
      "provider",
      provider,
      JSON.stringify({ provider, priority, cost_per_unit }),
      now
    ).run();
    return c.json({
      message: "Provider added successfully",
      provider: {
        provider,
        config: config2 || null,
        priority: priority || 0,
        is_enabled: true,
        cost_per_unit: cost_per_unit || 0,
        created_at: now,
        updated_at: now
      }
    }, 201);
  } catch (error3) {
    console.error("Admin add provider error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "Failed to add provider"
    }, 500);
  }
});
providersRoutes.put("/:provider", async (c) => {
  const db = c.env.DB;
  const provider = c.req.param("provider");
  try {
    const body = await c.req.json();
    const existing = await db.prepare(
      "SELECT provider FROM platform_provider_configs WHERE provider = ?"
    ).bind(provider).first();
    if (!existing) {
      return c.json({
        error: "Not Found",
        message: "Provider not found"
      }, 404);
    }
    const updates = [];
    const params = [];
    if (body.api_key !== void 0) {
      updates.push("api_key_encrypted = ?");
      params.push(body.api_key);
    }
    if (body.config !== void 0) {
      updates.push("config = ?");
      params.push(JSON.stringify(body.config));
    }
    if (body.priority !== void 0) {
      updates.push("priority = ?");
      params.push(body.priority);
    }
    if (body.is_enabled !== void 0) {
      updates.push("is_enabled = ?");
      params.push(body.is_enabled ? 1 : 0);
    }
    if (body.cost_per_unit !== void 0) {
      updates.push("cost_per_unit = ?");
      params.push(body.cost_per_unit);
    }
    if (updates.length === 0) {
      return c.json({
        error: "Bad Request",
        message: "No valid fields to update"
      }, 400);
    }
    updates.push("updated_at = ?");
    const now = Math.floor(Date.now() / 1e3);
    params.push(now);
    params.push(provider);
    await db.prepare(`
      UPDATE platform_provider_configs
      SET ${updates.join(", ")}
      WHERE provider = ?
    `).bind(...params).run();
    const auth = c.get("auth");
    await db.prepare(`
      INSERT INTO admin_activity_logs (id, admin_id, action, resource_type, resource_id, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      auth.userId,
      "update_provider",
      "provider",
      provider,
      JSON.stringify({ updates: body }),
      now
    ).run();
    const updated = await db.prepare(
      "SELECT * FROM platform_provider_configs WHERE provider = ?"
    ).bind(provider).first();
    return c.json({
      message: "Provider updated successfully",
      provider: {
        ...updated,
        config: updated.config ? JSON.parse(updated.config) : null,
        is_enabled: Boolean(updated.is_enabled)
      }
    });
  } catch (error3) {
    console.error("Admin update provider error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "Failed to update provider"
    }, 500);
  }
});
providersRoutes.get("/health", async (c) => {
  const db = c.env.DB;
  try {
    const healthResult = await db.prepare(`
      SELECT
        provider,
        region,
        status,
        last_check,
        error_rate,
        avg_latency,
        details
      FROM provider_health_status
      ORDER BY provider ASC, region ASC
    `).all();
    const healthByProvider = healthResult.results.reduce((acc, row) => {
      if (!acc[row.provider]) {
        acc[row.provider] = {
          provider: row.provider,
          regions: []
        };
      }
      acc[row.provider].regions.push({
        region: row.region,
        status: row.status,
        last_check: row.last_check,
        error_rate: row.error_rate,
        avg_latency: row.avg_latency,
        details: row.details ? JSON.parse(row.details) : null
      });
      return acc;
    }, {});
    const providersHealth = Object.values(healthByProvider).map((provider) => {
      const statuses = provider.regions.map((r) => r.status);
      let overallStatus = "healthy";
      if (statuses.includes("down")) {
        overallStatus = "down";
      } else if (statuses.includes("degraded")) {
        overallStatus = "degraded";
      }
      const avgErrorRate = provider.regions.reduce((sum, r) => sum + (r.error_rate || 0), 0) / provider.regions.length;
      const avgLatency = provider.regions.reduce((sum, r) => sum + (r.avg_latency || 0), 0) / provider.regions.length;
      return {
        ...provider,
        overall_status: overallStatus,
        avg_error_rate: Math.round(avgErrorRate * 100) / 100,
        avg_latency: Math.round(avgLatency)
      };
    });
    const allStatuses = healthResult.results.map((r) => r.status);
    let platformStatus = "healthy";
    if (allStatuses.includes("down")) {
      platformStatus = "degraded";
    } else if (allStatuses.includes("degraded")) {
      platformStatus = "degraded";
    }
    return c.json({
      platform_status: platformStatus,
      last_updated: Math.max(...healthResult.results.map((r) => r.last_check)),
      providers: providersHealth
    });
  } catch (error3) {
    console.error("Admin provider health error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "Failed to fetch provider health"
    }, 500);
  }
});
var providers_default = providersRoutes;

// src/routes/admin/index.ts
var adminRoutes = new Hono2();
adminRoutes.route("/auth", auth_default);
adminRoutes.route("/dashboard", dashboard_default);
adminRoutes.route("/workspaces", workspaces_default);
adminRoutes.route("/providers", providers_default);
adminRoutes.get("/", (c) => {
  return c.json({
    message: "Admin API",
    routes: [
      "/admin/auth/*",
      "/admin/dashboard/*",
      "/admin/workspaces/*",
      "/admin/providers/*"
      // Will be added:
      // '/admin/users/*',
      // '/admin/templates/*',
      // '/admin/integrations/*',
      // '/admin/calls/*',
      // '/admin/analytics/*',
      // '/admin/billing/*',
      // '/admin/config/*',
      // '/admin/logs/*',
    ]
  });
});
var admin_default = adminRoutes;

// src/routes/client/index.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/routes/client/auth.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_crypto();
var authRoutes2 = new Hono2();
authRoutes2.post("/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password || !name) {
      return c.json({
        error: "Validation Error",
        message: "Email, password, and name are required"
      }, 400);
    }
    if (password.length < 8) {
      return c.json({
        error: "Validation Error",
        message: "Password must be at least 8 characters long"
      }, 400);
    }
    const existingUser = await c.env.DB.prepare(
      "SELECT id FROM client_users WHERE email = ?"
    ).bind(email).first();
    if (existingUser) {
      return c.json({
        error: "Conflict",
        message: "Email already registered"
      }, 409);
    }
    const passwordHash = await hashPassword(password);
    const userId = generateId("usr");
    const now = Date.now();
    await c.env.DB.prepare(`
      INSERT INTO client_users
      (id, email, name, password_hash, is_active, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, 1, 0, ?, ?)
    `).bind(userId, email, name, passwordHash, now, now).run();
    const token = await signJWT(
      {
        sub: userId,
        email,
        type: "client"
      },
      c.env.JWT_SECRET,
      "24h"
    );
    const refreshToken = await signJWT(
      {
        sub: userId,
        type: "client_refresh"
      },
      c.env.JWT_SECRET,
      "7d"
    );
    return c.json({
      token,
      refresh_token: refreshToken,
      user: {
        id: userId,
        email,
        name
      }
    }, 201);
  } catch (error3) {
    console.error("Signup error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred during signup"
    }, 500);
  }
});
authRoutes2.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({
        error: "Validation Error",
        message: "Email and password are required"
      }, 400);
    }
    const user = await c.env.DB.prepare(
      "SELECT id, email, name, password_hash, is_active FROM client_users WHERE email = ?"
    ).bind(email).first();
    if (!user) {
      return c.json({
        error: "Authentication Failed",
        message: "Invalid credentials"
      }, 401);
    }
    if (!user.is_active) {
      return c.json({
        error: "Account Inactive",
        message: "Your account has been deactivated"
      }, 403);
    }
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return c.json({
        error: "Authentication Failed",
        message: "Invalid credentials"
      }, 401);
    }
    await c.env.DB.prepare(
      "UPDATE client_users SET last_login = ? WHERE id = ?"
    ).bind(Date.now(), user.id).run();
    const workspaces = await c.env.DB.prepare(`
      SELECT wm.workspace_id, w.name, wm.role, w.status, w.subscription_tier
      FROM workspace_members wm
      JOIN workspaces w ON wm.workspace_id = w.id
      WHERE wm.user_id = ?
      ORDER BY wm.joined_at DESC
    `).bind(user.id).all();
    const token = await signJWT(
      {
        sub: user.id,
        email: user.email,
        type: "client",
        workspace_ids: workspaces.results.map((w) => w.workspace_id)
      },
      c.env.JWT_SECRET,
      "24h"
    );
    const refreshToken = await signJWT(
      {
        sub: user.id,
        type: "client_refresh"
      },
      c.env.JWT_SECRET,
      "7d"
    );
    return c.json({
      token,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      workspaces: workspaces.results.map((w) => ({
        workspace_id: w.workspace_id,
        name: w.name,
        role: w.role,
        status: w.status,
        subscription_tier: w.subscription_tier
      }))
    });
  } catch (error3) {
    console.error("Login error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred during login"
    }, 500);
  }
});
authRoutes2.post("/logout", authenticate, async (c) => {
  return c.json({
    message: "Logged out successfully"
  });
});
authRoutes2.get("/me", authenticate, async (c) => {
  try {
    const auth = c.get("auth");
    const user = await c.env.DB.prepare(
      "SELECT id, email, name, email_verified, created_at, last_login FROM client_users WHERE id = ?"
    ).bind(auth.userId).first();
    if (!user) {
      return c.json({
        error: "Not Found",
        message: "User not found"
      }, 404);
    }
    const workspaces = await c.env.DB.prepare(`
      SELECT wm.workspace_id, w.name, wm.role, w.status, w.subscription_tier
      FROM workspace_members wm
      JOIN workspaces w ON wm.workspace_id = w.id
      WHERE wm.user_id = ?
      ORDER BY wm.joined_at DESC
    `).bind(user.id).all();
    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_verified: !!user.email_verified,
        created_at: user.created_at,
        last_login: user.last_login
      },
      workspaces: workspaces.results.map((w) => ({
        workspace_id: w.workspace_id,
        name: w.name,
        role: w.role,
        status: w.status,
        subscription_tier: w.subscription_tier
      }))
    });
  } catch (error3) {
    console.error("Get user error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching user details"
    }, 500);
  }
});
authRoutes2.post("/verify-email", async (c) => {
  try {
    const { token } = await c.req.json();
    if (!token) {
      return c.json({
        error: "Validation Error",
        message: "Verification token is required"
      }, 400);
    }
    const { verifyJWT: verifyJWT2 } = await Promise.resolve().then(() => (init_crypto(), crypto_exports));
    const payload = await verifyJWT2(token, c.env.JWT_SECRET);
    if (payload.type !== "email_verification") {
      return c.json({
        error: "Invalid Token",
        message: "Invalid verification token"
      }, 401);
    }
    await c.env.DB.prepare(
      "UPDATE client_users SET email_verified = 1, updated_at = ? WHERE id = ?"
    ).bind(Date.now(), payload.sub).run();
    return c.json({
      message: "Email verified successfully"
    });
  } catch (error3) {
    console.error("Email verification error:", error3);
    return c.json({
      error: "Invalid Token",
      message: "Invalid or expired verification token"
    }, 400);
  }
});
authRoutes2.post("/forgot-password", async (c) => {
  try {
    const { email } = await c.req.json();
    if (!email) {
      return c.json({
        error: "Validation Error",
        message: "Email is required"
      }, 400);
    }
    const user = await c.env.DB.prepare(
      "SELECT id, email FROM client_users WHERE email = ?"
    ).bind(email).first();
    if (!user) {
      return c.json({
        message: "If an account exists with that email, a password reset link has been sent"
      });
    }
    const resetToken = await signJWT(
      {
        sub: user.id,
        type: "password_reset"
      },
      c.env.JWT_SECRET,
      "15m"
    );
    console.log(`Password reset token for ${email}: ${resetToken}`);
    return c.json({
      message: "If an account exists with that email, a password reset link has been sent"
    });
  } catch (error3) {
    console.error("Forgot password error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while processing your request"
    }, 500);
  }
});
authRoutes2.post("/reset-password", async (c) => {
  try {
    const { token, new_password } = await c.req.json();
    if (!token || !new_password) {
      return c.json({
        error: "Validation Error",
        message: "Token and new password are required"
      }, 400);
    }
    if (new_password.length < 8) {
      return c.json({
        error: "Validation Error",
        message: "Password must be at least 8 characters long"
      }, 400);
    }
    const { verifyJWT: verifyJWT2 } = await Promise.resolve().then(() => (init_crypto(), crypto_exports));
    const payload = await verifyJWT2(token, c.env.JWT_SECRET);
    if (payload.type !== "password_reset") {
      return c.json({
        error: "Invalid Token",
        message: "Invalid reset token"
      }, 401);
    }
    const passwordHash = await hashPassword(new_password);
    await c.env.DB.prepare(
      "UPDATE client_users SET password_hash = ?, updated_at = ? WHERE id = ?"
    ).bind(passwordHash, Date.now(), payload.sub).run();
    return c.json({
      message: "Password reset successfully"
    });
  } catch (error3) {
    console.error("Reset password error:", error3);
    return c.json({
      error: "Invalid Token",
      message: "Invalid or expired reset token"
    }, 400);
  }
});
var auth_default2 = authRoutes2;

// src/routes/client/workspaces.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_crypto();

// src/routes/client/agents.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_crypto();
var agentsRoutes = new Hono2();
agentsRoutes.use("*", authenticate);
agentsRoutes.get("/:workspaceId/agents", requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const agents = await c.env.DB.prepare(`
      SELECT
        va.id, va.name, va.phone_number_id, va.template_id,
        va.voice_provider, va.status, va.created_at, va.updated_at, va.activated_at,
        pn.phone_number, pn.friendly_name as phone_friendly_name,
        at.name as template_name
      FROM voice_agents va
      LEFT JOIN phone_numbers pn ON va.phone_number_id = pn.id
      LEFT JOIN agent_templates at ON va.template_id = at.id
      WHERE va.workspace_id = ?
      ORDER BY va.created_at DESC
    `).bind(workspaceId).all();
    return c.json({
      agents: agents.results
    });
  } catch (error3) {
    console.error("List agents error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching agents"
    }, 500);
  }
});
agentsRoutes.post("/:workspaceId/agents", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin", "member"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const { name, phone_number_id, template_id, config: config2, voice_provider, voice_config } = await c.req.json();
    if (!name || !config2 || !voice_provider || !voice_config) {
      return c.json({
        error: "Validation Error",
        message: "name, config, voice_provider, and voice_config are required"
      }, 400);
    }
    const validProviders = ["elevenlabs", "vapi", "retell"];
    if (!validProviders.includes(voice_provider)) {
      return c.json({
        error: "Validation Error",
        message: "Invalid voice_provider. Must be one of: elevenlabs, vapi, retell"
      }, 400);
    }
    if (phone_number_id) {
      const phoneNumber = await c.env.DB.prepare(
        "SELECT id FROM phone_numbers WHERE id = ? AND workspace_id = ?"
      ).bind(phone_number_id, workspaceId).first();
      if (!phoneNumber) {
        return c.json({
          error: "Not Found",
          message: "Phone number not found or does not belong to this workspace"
        }, 404);
      }
    }
    if (template_id) {
      const template = await c.env.DB.prepare(
        "SELECT id FROM agent_templates WHERE id = ? AND is_public = 1"
      ).bind(template_id).first();
      if (!template) {
        return c.json({
          error: "Not Found",
          message: "Template not found or is not public"
        }, 404);
      }
    }
    const agentId = generateId("agt");
    const now = Date.now();
    await c.env.DB.prepare(`
      INSERT INTO voice_agents
      (id, workspace_id, phone_number_id, name, template_id, config, voice_provider, voice_config, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)
    `).bind(
      agentId,
      workspaceId,
      phone_number_id || null,
      name,
      template_id || null,
      typeof config2 === "string" ? config2 : JSON.stringify(config2),
      voice_provider,
      typeof voice_config === "string" ? voice_config : JSON.stringify(voice_config),
      now,
      now
    ).run();
    return c.json({
      agent: {
        id: agentId,
        workspace_id: workspaceId,
        phone_number_id: phone_number_id || null,
        name,
        template_id: template_id || null,
        config: config2,
        voice_provider,
        voice_config,
        status: "draft",
        created_at: now,
        updated_at: now
      }
    }, 201);
  } catch (error3) {
    console.error("Create agent error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while creating the agent"
    }, 500);
  }
});
agentsRoutes.get("/:workspaceId/agents/:agentId", requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const agentId = c.req.param("agentId");
    const agent = await c.env.DB.prepare(`
      SELECT
        va.*,
        pn.phone_number, pn.friendly_name as phone_friendly_name,
        at.name as template_name, at.description as template_description
      FROM voice_agents va
      LEFT JOIN phone_numbers pn ON va.phone_number_id = pn.id
      LEFT JOIN agent_templates at ON va.template_id = at.id
      WHERE va.id = ? AND va.workspace_id = ?
    `).bind(agentId, workspaceId).first();
    if (!agent) {
      return c.json({
        error: "Not Found",
        message: "Agent not found"
      }, 404);
    }
    const agentData = {
      ...agent,
      config: agent.config ? JSON.parse(agent.config) : null,
      voice_config: agent.voice_config ? JSON.parse(agent.voice_config) : null
    };
    return c.json({
      agent: agentData
    });
  } catch (error3) {
    console.error("Get agent error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching agent details"
    }, 500);
  }
});
agentsRoutes.put("/:workspaceId/agents/:agentId", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin", "member"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const agentId = c.req.param("agentId");
    const { name, phone_number_id, config: config2, voice_provider, voice_config } = await c.req.json();
    const existingAgent = await c.env.DB.prepare(
      "SELECT id, status FROM voice_agents WHERE id = ? AND workspace_id = ?"
    ).bind(agentId, workspaceId).first();
    if (!existingAgent) {
      return c.json({
        error: "Not Found",
        message: "Agent not found"
      }, 404);
    }
    const updates = [];
    const bindings = [];
    if (name !== void 0) {
      updates.push("name = ?");
      bindings.push(name);
    }
    if (phone_number_id !== void 0) {
      if (phone_number_id !== null) {
        const phoneNumber = await c.env.DB.prepare(
          "SELECT id FROM phone_numbers WHERE id = ? AND workspace_id = ?"
        ).bind(phone_number_id, workspaceId).first();
        if (!phoneNumber) {
          return c.json({
            error: "Not Found",
            message: "Phone number not found or does not belong to this workspace"
          }, 404);
        }
      }
      updates.push("phone_number_id = ?");
      bindings.push(phone_number_id);
    }
    if (config2 !== void 0) {
      updates.push("config = ?");
      bindings.push(typeof config2 === "string" ? config2 : JSON.stringify(config2));
    }
    if (voice_provider !== void 0) {
      const validProviders = ["elevenlabs", "vapi", "retell"];
      if (!validProviders.includes(voice_provider)) {
        return c.json({
          error: "Validation Error",
          message: "Invalid voice_provider. Must be one of: elevenlabs, vapi, retell"
        }, 400);
      }
      updates.push("voice_provider = ?");
      bindings.push(voice_provider);
    }
    if (voice_config !== void 0) {
      updates.push("voice_config = ?");
      bindings.push(typeof voice_config === "string" ? voice_config : JSON.stringify(voice_config));
    }
    if (updates.length === 0) {
      return c.json({
        error: "Validation Error",
        message: "At least one field must be provided for update"
      }, 400);
    }
    updates.push("updated_at = ?");
    bindings.push(Date.now());
    bindings.push(agentId);
    bindings.push(workspaceId);
    await c.env.DB.prepare(
      `UPDATE voice_agents SET ${updates.join(", ")} WHERE id = ? AND workspace_id = ?`
    ).bind(...bindings).run();
    return c.json({
      message: "Agent updated successfully"
    });
  } catch (error3) {
    console.error("Update agent error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while updating the agent"
    }, 500);
  }
});
agentsRoutes.delete("/:workspaceId/agents/:agentId", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin", "member"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const agentId = c.req.param("agentId");
    const agent = await c.env.DB.prepare(
      "SELECT id FROM voice_agents WHERE id = ? AND workspace_id = ?"
    ).bind(agentId, workspaceId).first();
    if (!agent) {
      return c.json({
        error: "Not Found",
        message: "Agent not found"
      }, 404);
    }
    await c.env.DB.prepare(
      "DELETE FROM voice_agents WHERE id = ? AND workspace_id = ?"
    ).bind(agentId, workspaceId).run();
    return c.json({
      message: "Agent deleted successfully"
    });
  } catch (error3) {
    console.error("Delete agent error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while deleting the agent"
    }, 500);
  }
});
agentsRoutes.post("/:workspaceId/agents/:agentId/activate", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin", "member"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const agentId = c.req.param("agentId");
    const agent = await c.env.DB.prepare(
      "SELECT id, status, phone_number_id FROM voice_agents WHERE id = ? AND workspace_id = ?"
    ).bind(agentId, workspaceId).first();
    if (!agent) {
      return c.json({
        error: "Not Found",
        message: "Agent not found"
      }, 404);
    }
    if (!agent.phone_number_id) {
      return c.json({
        error: "Validation Error",
        message: "Agent must have a phone number assigned before activation"
      }, 400);
    }
    const now = Date.now();
    await c.env.DB.prepare(
      "UPDATE voice_agents SET status = ?, activated_at = ?, updated_at = ? WHERE id = ? AND workspace_id = ?"
    ).bind("live", now, now, agentId, workspaceId).run();
    return c.json({
      message: "Agent activated successfully",
      status: "live",
      activated_at: now
    });
  } catch (error3) {
    console.error("Activate agent error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while activating the agent"
    }, 500);
  }
});
agentsRoutes.post("/:workspaceId/agents/:agentId/pause", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin", "member"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const agentId = c.req.param("agentId");
    const agent = await c.env.DB.prepare(
      "SELECT id, status FROM voice_agents WHERE id = ? AND workspace_id = ?"
    ).bind(agentId, workspaceId).first();
    if (!agent) {
      return c.json({
        error: "Not Found",
        message: "Agent not found"
      }, 404);
    }
    await c.env.DB.prepare(
      "UPDATE voice_agents SET status = ?, updated_at = ? WHERE id = ? AND workspace_id = ?"
    ).bind("paused", Date.now(), agentId, workspaceId).run();
    return c.json({
      message: "Agent paused successfully",
      status: "paused"
    });
  } catch (error3) {
    console.error("Pause agent error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while pausing the agent"
    }, 500);
  }
});
agentsRoutes.post("/:workspaceId/agents/:agentId/test", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin", "member"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const agentId = c.req.param("agentId");
    const agent = await c.env.DB.prepare(
      "SELECT id, status FROM voice_agents WHERE id = ? AND workspace_id = ?"
    ).bind(agentId, workspaceId).first();
    if (!agent) {
      return c.json({
        error: "Not Found",
        message: "Agent not found"
      }, 404);
    }
    await c.env.DB.prepare(
      "UPDATE voice_agents SET status = ?, updated_at = ? WHERE id = ? AND workspace_id = ?"
    ).bind("testing", Date.now(), agentId, workspaceId).run();
    return c.json({
      message: "Agent set to testing mode successfully",
      status: "testing"
    });
  } catch (error3) {
    console.error("Test agent error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while setting agent to testing mode"
    }, 500);
  }
});
var agents_default = agentsRoutes;

// src/routes/client/phone-numbers.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_crypto();
var phoneNumbersRoutes = new Hono2();
phoneNumbersRoutes.use("*", authenticate);
phoneNumbersRoutes.get("/:workspaceId/phone-numbers", requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const phoneNumbers = await c.env.DB.prepare(`
      SELECT
        pn.id, pn.phone_number, pn.provider, pn.provider_sid,
        pn.friendly_name, pn.status, pn.created_at,
        va.id as assigned_agent_id, va.name as assigned_agent_name
      FROM phone_numbers pn
      LEFT JOIN voice_agents va ON pn.id = va.phone_number_id
      WHERE pn.workspace_id = ?
      ORDER BY pn.created_at DESC
    `).bind(workspaceId).all();
    return c.json({
      phone_numbers: phoneNumbers.results
    });
  } catch (error3) {
    console.error("List phone numbers error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching phone numbers"
    }, 500);
  }
});
phoneNumbersRoutes.get("/:workspaceId/phone-numbers/available", requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const { area_code, country = "US", provider = "twilio" } = c.req.query();
    const workspace = await c.env.DB.prepare(
      "SELECT id FROM workspaces WHERE id = ?"
    ).bind(workspaceId).first();
    if (!workspace) {
      return c.json({
        error: "Not Found",
        message: "Workspace not found"
      }, 404);
    }
    const validProviders = ["twilio", "telnyx"];
    if (!validProviders.includes(provider)) {
      return c.json({
        error: "Validation Error",
        message: "Invalid provider. Must be one of: twilio, telnyx"
      }, 400);
    }
    const mockNumbers = [
      {
        phone_number: `+1${area_code || "415"}5551001`,
        provider,
        friendly_name: `${country} Number`,
        region: area_code || "CA",
        capabilities: ["voice", "sms"]
      },
      {
        phone_number: `+1${area_code || "415"}5551002`,
        provider,
        friendly_name: `${country} Number`,
        region: area_code || "CA",
        capabilities: ["voice", "sms"]
      },
      {
        phone_number: `+1${area_code || "415"}5551003`,
        provider,
        friendly_name: `${country} Number`,
        region: area_code || "CA",
        capabilities: ["voice", "sms"]
      }
    ];
    return c.json({
      available_numbers: mockNumbers,
      provider,
      country,
      area_code: area_code || null
    });
  } catch (error3) {
    console.error("Search available numbers error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while searching for available numbers"
    }, 500);
  }
});
phoneNumbersRoutes.post("/:workspaceId/phone-numbers", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const { phone_number, provider, friendly_name } = await c.req.json();
    if (!phone_number || !provider) {
      return c.json({
        error: "Validation Error",
        message: "phone_number and provider are required"
      }, 400);
    }
    const validProviders = ["twilio", "telnyx"];
    if (!validProviders.includes(provider)) {
      return c.json({
        error: "Validation Error",
        message: "Invalid provider. Must be one of: twilio, telnyx"
      }, 400);
    }
    if (!phone_number.match(/^\+[1-9]\d{1,14}$/)) {
      return c.json({
        error: "Validation Error",
        message: "Phone number must be in E.164 format (e.g., +14155551234)"
      }, 400);
    }
    const existing = await c.env.DB.prepare(
      "SELECT id FROM phone_numbers WHERE phone_number = ?"
    ).bind(phone_number).first();
    if (existing) {
      return c.json({
        error: "Conflict",
        message: "This phone number is already in use"
      }, 409);
    }
    const phoneNumberId = generateId("phn");
    const now = Date.now();
    const providerSid = `${provider === "twilio" ? "PN" : "TN"}${Math.random().toString(36).substring(2, 15)}`;
    await c.env.DB.prepare(`
      INSERT INTO phone_numbers
      (id, workspace_id, phone_number, provider, provider_sid, friendly_name, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', ?)
    `).bind(
      phoneNumberId,
      workspaceId,
      phone_number,
      provider,
      providerSid,
      friendly_name || phone_number,
      now
    ).run();
    return c.json({
      phone_number: {
        id: phoneNumberId,
        workspace_id: workspaceId,
        phone_number,
        provider,
        provider_sid: providerSid,
        friendly_name: friendly_name || phone_number,
        status: "active",
        created_at: now
      }
    }, 201);
  } catch (error3) {
    console.error("Purchase phone number error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while purchasing the phone number"
    }, 500);
  }
});
phoneNumbersRoutes.put("/:workspaceId/phone-numbers/:phoneNumberId", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const phoneNumberId = c.req.param("phoneNumberId");
    const { friendly_name, status } = await c.req.json();
    const phoneNumber = await c.env.DB.prepare(
      "SELECT id FROM phone_numbers WHERE id = ? AND workspace_id = ?"
    ).bind(phoneNumberId, workspaceId).first();
    if (!phoneNumber) {
      return c.json({
        error: "Not Found",
        message: "Phone number not found"
      }, 404);
    }
    const updates = [];
    const bindings = [];
    if (friendly_name !== void 0) {
      updates.push("friendly_name = ?");
      bindings.push(friendly_name);
    }
    if (status !== void 0) {
      const validStatuses = ["active", "inactive", "porting"];
      if (!validStatuses.includes(status)) {
        return c.json({
          error: "Validation Error",
          message: "Invalid status. Must be one of: active, inactive, porting"
        }, 400);
      }
      updates.push("status = ?");
      bindings.push(status);
    }
    if (updates.length === 0) {
      return c.json({
        error: "Validation Error",
        message: "At least one field (friendly_name or status) must be provided"
      }, 400);
    }
    bindings.push(phoneNumberId);
    bindings.push(workspaceId);
    await c.env.DB.prepare(
      `UPDATE phone_numbers SET ${updates.join(", ")} WHERE id = ? AND workspace_id = ?`
    ).bind(...bindings).run();
    return c.json({
      message: "Phone number updated successfully"
    });
  } catch (error3) {
    console.error("Update phone number error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while updating the phone number"
    }, 500);
  }
});
phoneNumbersRoutes.delete("/:workspaceId/phone-numbers/:phoneNumberId", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const phoneNumberId = c.req.param("phoneNumberId");
    const phoneNumber = await c.env.DB.prepare(
      "SELECT id, phone_number, provider FROM phone_numbers WHERE id = ? AND workspace_id = ?"
    ).bind(phoneNumberId, workspaceId).first();
    if (!phoneNumber) {
      return c.json({
        error: "Not Found",
        message: "Phone number not found"
      }, 404);
    }
    const assignedAgent = await c.env.DB.prepare(
      "SELECT id, name FROM voice_agents WHERE phone_number_id = ? AND workspace_id = ?"
    ).bind(phoneNumberId, workspaceId).first();
    if (assignedAgent) {
      return c.json({
        error: "Conflict",
        message: `Cannot delete phone number. It is currently assigned to agent "${assignedAgent.name}". Please unassign it first.`
      }, 409);
    }
    await c.env.DB.prepare(
      "DELETE FROM phone_numbers WHERE id = ? AND workspace_id = ?"
    ).bind(phoneNumberId, workspaceId).run();
    return c.json({
      message: "Phone number released successfully"
    });
  } catch (error3) {
    console.error("Delete phone number error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while releasing the phone number"
    }, 500);
  }
});
var phone_numbers_default = phoneNumbersRoutes;

// src/routes/client/calls.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_crypto();
var callsRoutes = new Hono2();
callsRoutes.use("*", authenticate);
callsRoutes.get("/:workspaceId/calls", requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const {
      status,
      direction,
      agent_id,
      limit = "50",
      offset = "0",
      start_date,
      end_date
    } = c.req.query();
    let query = `
      SELECT
        c.id, c.caller_number, c.caller_name, c.direction, c.status,
        c.duration_seconds, c.started_at, c.ended_at, c.cost_total,
        c.sentiment, c.voice_provider_used,
        va.name as agent_name, va.id as agent_id,
        pn.phone_number, pn.friendly_name as phone_friendly_name
      FROM calls c
      JOIN voice_agents va ON c.agent_id = va.id
      JOIN phone_numbers pn ON c.phone_number_id = pn.id
      WHERE c.workspace_id = ?
    `;
    const bindings = [workspaceId];
    if (status) {
      query += " AND c.status = ?";
      bindings.push(status);
    }
    if (direction) {
      query += " AND c.direction = ?";
      bindings.push(direction);
    }
    if (agent_id) {
      query += " AND c.agent_id = ?";
      bindings.push(agent_id);
    }
    if (start_date) {
      query += " AND c.started_at >= ?";
      bindings.push(parseInt(start_date));
    }
    if (end_date) {
      query += " AND c.started_at <= ?";
      bindings.push(parseInt(end_date));
    }
    query += " ORDER BY c.started_at DESC LIMIT ? OFFSET ?";
    bindings.push(parseInt(limit), parseInt(offset));
    const calls = await c.env.DB.prepare(query).bind(...bindings).all();
    let countQuery = "SELECT COUNT(*) as total FROM calls WHERE workspace_id = ?";
    const countBindings = [workspaceId];
    if (status) {
      countQuery += " AND status = ?";
      countBindings.push(status);
    }
    if (direction) {
      countQuery += " AND direction = ?";
      countBindings.push(direction);
    }
    if (agent_id) {
      countQuery += " AND agent_id = ?";
      countBindings.push(agent_id);
    }
    const totalResult = await c.env.DB.prepare(countQuery).bind(...countBindings).first();
    const total = totalResult?.total || 0;
    return c.json({
      calls: calls.results,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        has_more: parseInt(offset) + calls.results.length < total
      }
    });
  } catch (error3) {
    console.error("List calls error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching calls"
    }, 500);
  }
});
callsRoutes.get("/:workspaceId/calls/live", requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const liveCalls = await c.env.DB.prepare(`
      SELECT
        c.id, c.caller_number, c.caller_name, c.direction, c.status,
        c.started_at, c.voice_provider_used,
        va.name as agent_name, va.id as agent_id,
        pn.phone_number, pn.friendly_name as phone_friendly_name
      FROM calls c
      JOIN voice_agents va ON c.agent_id = va.id
      JOIN phone_numbers pn ON c.phone_number_id = pn.id
      WHERE c.workspace_id = ?
        AND c.status IN ('queued', 'ringing', 'in-progress')
      ORDER BY c.started_at DESC
    `).bind(workspaceId).all();
    return c.json({
      live_calls: liveCalls.results,
      count: liveCalls.results.length
    });
  } catch (error3) {
    console.error("Get live calls error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching live calls"
    }, 500);
  }
});
callsRoutes.get("/:workspaceId/calls/:callId", requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const callId = c.req.param("callId");
    const call = await c.env.DB.prepare(`
      SELECT
        c.*,
        va.name as agent_name, va.voice_provider as agent_voice_provider,
        pn.phone_number, pn.friendly_name as phone_friendly_name, pn.provider as phone_provider
      FROM calls c
      JOIN voice_agents va ON c.agent_id = va.id
      JOIN phone_numbers pn ON c.phone_number_id = pn.id
      WHERE c.id = ? AND c.workspace_id = ?
    `).bind(callId, workspaceId).first();
    if (!call) {
      return c.json({
        error: "Not Found",
        message: "Call not found"
      }, 404);
    }
    const events = await c.env.DB.prepare(`
      SELECT id, event_type, event_data, timestamp
      FROM call_events
      WHERE call_id = ?
      ORDER BY timestamp ASC
    `).bind(callId).all();
    const callData = {
      ...call,
      metadata: call.metadata ? JSON.parse(call.metadata) : null,
      events: events.results.map((e) => ({
        ...e,
        event_data: e.event_data ? JSON.parse(e.event_data) : null
      }))
    };
    return c.json({
      call: callData
    });
  } catch (error3) {
    console.error("Get call details error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching call details"
    }, 500);
  }
});
callsRoutes.get("/:workspaceId/calls/:callId/recording", requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const callId = c.req.param("callId");
    const call = await c.env.DB.prepare(
      "SELECT id, recording_url, status FROM calls WHERE id = ? AND workspace_id = ?"
    ).bind(callId, workspaceId).first();
    if (!call) {
      return c.json({
        error: "Not Found",
        message: "Call not found"
      }, 404);
    }
    if (!call.recording_url) {
      return c.json({
        error: "Not Found",
        message: "Recording not available for this call"
      }, 404);
    }
    return c.json({
      recording_url: call.recording_url,
      call_id: call.id
      // expires_at: Date.now() + (3600 * 1000), // 1 hour from now
    });
  } catch (error3) {
    console.error("Get call recording error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching the call recording"
    }, 500);
  }
});
callsRoutes.get("/:workspaceId/calls/:callId/transcription", requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const callId = c.req.param("callId");
    const call = await c.env.DB.prepare(
      "SELECT id, transcription, summary, sentiment FROM calls WHERE id = ? AND workspace_id = ?"
    ).bind(callId, workspaceId).first();
    if (!call) {
      return c.json({
        error: "Not Found",
        message: "Call not found"
      }, 404);
    }
    if (!call.transcription) {
      return c.json({
        error: "Not Found",
        message: "Transcription not available for this call"
      }, 404);
    }
    return c.json({
      call_id: call.id,
      transcription: call.transcription,
      summary: call.summary || null,
      sentiment: call.sentiment || null
    });
  } catch (error3) {
    console.error("Get call transcription error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching the call transcription"
    }, 500);
  }
});
callsRoutes.post("/:workspaceId/calls/outbound", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin", "member"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const { agent_id, to_number, caller_id } = await c.req.json();
    if (!agent_id || !to_number) {
      return c.json({
        error: "Validation Error",
        message: "agent_id and to_number are required"
      }, 400);
    }
    if (!to_number.match(/^\+[1-9]\d{1,14}$/)) {
      return c.json({
        error: "Validation Error",
        message: "to_number must be in E.164 format (e.g., +14155551234)"
      }, 400);
    }
    const agent = await c.env.DB.prepare(`
      SELECT va.id, va.name, va.status, va.phone_number_id, va.voice_provider,
             pn.phone_number, pn.provider
      FROM voice_agents va
      LEFT JOIN phone_numbers pn ON va.phone_number_id = pn.id
      WHERE va.id = ? AND va.workspace_id = ?
    `).bind(agent_id, workspaceId).first();
    if (!agent) {
      return c.json({
        error: "Not Found",
        message: "Agent not found"
      }, 404);
    }
    if (agent.status !== "live") {
      return c.json({
        error: "Validation Error",
        message: "Agent must be in live status to make outbound calls"
      }, 400);
    }
    if (!agent.phone_number_id) {
      return c.json({
        error: "Validation Error",
        message: "Agent must have a phone number assigned"
      }, 400);
    }
    const callId = generateId("call");
    const now = Date.now();
    const fromNumber = caller_id || agent.phone_number;
    await c.env.DB.prepare(`
      INSERT INTO calls
      (id, workspace_id, agent_id, phone_number_id, caller_number, direction, status,
       provider_call_sid, voice_provider_used, started_at)
      VALUES (?, ?, ?, ?, ?, 'outbound', 'queued', ?, ?, ?)
    `).bind(
      callId,
      workspaceId,
      agent_id,
      agent.phone_number_id,
      to_number,
      `MOCK_${Math.random().toString(36).substring(2, 15)}`,
      // Mock provider SID
      agent.voice_provider,
      now
    ).run();
    await c.env.DB.prepare(`
      INSERT INTO call_events
      (id, call_id, event_type, event_data, timestamp)
      VALUES (?, ?, 'initiated', ?, ?)
    `).bind(
      generateId("evt"),
      callId,
      JSON.stringify({ to: to_number, from: fromNumber }),
      now
    ).run();
    return c.json({
      call: {
        id: callId,
        agent_id,
        agent_name: agent.name,
        to_number,
        from_number: fromNumber,
        status: "queued",
        started_at: now
      },
      message: "Outbound call initiated. Note: This is a mock implementation. Production would integrate with Twilio/Telnyx."
    }, 201);
  } catch (error3) {
    console.error("Initiate outbound call error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while initiating the call"
    }, 500);
  }
});
var calls_default = callsRoutes;

// src/routes/client/workspaces.ts
var workspacesRoutes2 = new Hono2();
workspacesRoutes2.use("*", authenticate);
workspacesRoutes2.route("/", agents_default);
workspacesRoutes2.route("/", phone_numbers_default);
workspacesRoutes2.route("/", calls_default);
workspacesRoutes2.post("/", async (c) => {
  try {
    const auth = c.get("auth");
    const { name, industry, timezone } = await c.req.json();
    if (!name) {
      return c.json({
        error: "Validation Error",
        message: "Workspace name is required"
      }, 400);
    }
    const workspaceId = generateId("wks");
    const now = Date.now();
    await c.env.DB.prepare(`
      INSERT INTO workspaces
      (id, name, industry, owner_id, status, subscription_tier, timezone, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'trial', 'starter', ?, ?, ?)
    `).bind(
      workspaceId,
      name,
      industry || null,
      auth.userId,
      timezone || "UTC",
      now,
      now
    ).run();
    await c.env.DB.prepare(`
      INSERT INTO workspace_members
      (workspace_id, user_id, role, invited_by, joined_at)
      VALUES (?, ?, 'owner', ?, ?)
    `).bind(workspaceId, auth.userId, auth.userId, now).run();
    const trialEndsAt = now + 14 * 24 * 60 * 60 * 1e3;
    await c.env.DB.prepare(
      "UPDATE workspaces SET trial_ends_at = ? WHERE id = ?"
    ).bind(trialEndsAt, workspaceId).run();
    return c.json({
      workspace: {
        id: workspaceId,
        name,
        industry,
        owner_id: auth.userId,
        status: "trial",
        subscription_tier: "starter",
        timezone: timezone || "UTC",
        trial_ends_at: trialEndsAt,
        created_at: now
      }
    }, 201);
  } catch (error3) {
    console.error("Create workspace error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while creating the workspace"
    }, 500);
  }
});
workspacesRoutes2.get("/", async (c) => {
  try {
    const auth = c.get("auth");
    const workspaces = await c.env.DB.prepare(`
      SELECT
        w.id, w.name, w.industry, w.status, w.subscription_tier, w.timezone,
        w.trial_ends_at, w.created_at, wm.role
      FROM workspaces w
      JOIN workspace_members wm ON w.id = wm.workspace_id
      WHERE wm.user_id = ?
      ORDER BY wm.joined_at DESC
    `).bind(auth.userId).all();
    return c.json({
      workspaces: workspaces.results
    });
  } catch (error3) {
    console.error("List workspaces error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching workspaces"
    }, 500);
  }
});
workspacesRoutes2.get("/:workspaceId", requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const workspace = await c.env.DB.prepare(`
      SELECT
        w.*, u.name as owner_name, u.email as owner_email
      FROM workspaces w
      JOIN client_users u ON w.owner_id = u.id
      WHERE w.id = ?
    `).bind(workspaceId).first();
    if (!workspace) {
      return c.json({
        error: "Not Found",
        message: "Workspace not found"
      }, 404);
    }
    const members = await c.env.DB.prepare(`
      SELECT
        wm.user_id, wm.role, wm.joined_at,
        u.name, u.email
      FROM workspace_members wm
      JOIN client_users u ON wm.user_id = u.id
      WHERE wm.workspace_id = ?
      ORDER BY wm.joined_at ASC
    `).bind(workspaceId).all();
    const tier = await c.env.DB.prepare(
      "SELECT * FROM subscription_tiers WHERE tier_name = ?"
    ).bind(workspace.subscription_tier).first();
    return c.json({
      workspace: {
        id: workspace.id,
        name: workspace.name,
        industry: workspace.industry,
        owner_id: workspace.owner_id,
        owner_name: workspace.owner_name,
        owner_email: workspace.owner_email,
        status: workspace.status,
        subscription_tier: workspace.subscription_tier,
        timezone: workspace.timezone,
        trial_ends_at: workspace.trial_ends_at,
        created_at: workspace.created_at,
        updated_at: workspace.updated_at
      },
      members: members.results,
      subscription: tier || null
    });
  } catch (error3) {
    console.error("Get workspace error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching workspace details"
    }, 500);
  }
});
workspacesRoutes2.put("/:workspaceId", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const { name, timezone } = await c.req.json();
    if (!name && !timezone) {
      return c.json({
        error: "Validation Error",
        message: "At least one field (name or timezone) is required"
      }, 400);
    }
    const updates = [];
    const bindings = [];
    if (name) {
      updates.push("name = ?");
      bindings.push(name);
    }
    if (timezone) {
      updates.push("timezone = ?");
      bindings.push(timezone);
    }
    updates.push("updated_at = ?");
    bindings.push(Date.now());
    bindings.push(workspaceId);
    await c.env.DB.prepare(
      `UPDATE workspaces SET ${updates.join(", ")} WHERE id = ?`
    ).bind(...bindings).run();
    return c.json({
      message: "Workspace updated successfully"
    });
  } catch (error3) {
    console.error("Update workspace error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while updating the workspace"
    }, 500);
  }
});
workspacesRoutes2.delete("/:workspaceId", requireWorkspaceAccess, requireWorkspaceRole("owner"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    await c.env.DB.prepare(
      "DELETE FROM workspaces WHERE id = ?"
    ).bind(workspaceId).run();
    return c.json({
      message: "Workspace deleted successfully"
    });
  } catch (error3) {
    console.error("Delete workspace error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while deleting the workspace"
    }, 500);
  }
});
workspacesRoutes2.get("/:workspaceId/members", requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const members = await c.env.DB.prepare(`
      SELECT
        wm.user_id, wm.role, wm.joined_at,
        u.name, u.email, u.last_login
      FROM workspace_members wm
      JOIN client_users u ON wm.user_id = u.id
      WHERE wm.workspace_id = ?
      ORDER BY wm.joined_at ASC
    `).bind(workspaceId).all();
    return c.json({
      members: members.results
    });
  } catch (error3) {
    console.error("Get members error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while fetching members"
    }, 500);
  }
});
workspacesRoutes2.post("/:workspaceId/members", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin"), async (c) => {
  try {
    const auth = c.get("auth");
    const workspaceId = c.req.param("workspaceId");
    const { email, role } = await c.req.json();
    if (!email || !role) {
      return c.json({
        error: "Validation Error",
        message: "Email and role are required"
      }, 400);
    }
    const validRoles = ["admin", "member", "viewer"];
    if (!validRoles.includes(role)) {
      return c.json({
        error: "Validation Error",
        message: "Invalid role. Must be one of: admin, member, viewer"
      }, 400);
    }
    const user = await c.env.DB.prepare(
      "SELECT id FROM client_users WHERE email = ?"
    ).bind(email).first();
    if (!user) {
      return c.json({
        error: "Not Found",
        message: "User with this email not found"
      }, 404);
    }
    const existingMember = await c.env.DB.prepare(
      "SELECT user_id FROM workspace_members WHERE workspace_id = ? AND user_id = ?"
    ).bind(workspaceId, user.id).first();
    if (existingMember) {
      return c.json({
        error: "Conflict",
        message: "User is already a member of this workspace"
      }, 409);
    }
    await c.env.DB.prepare(`
      INSERT INTO workspace_members
      (workspace_id, user_id, role, invited_by, joined_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(workspaceId, user.id, role, auth.userId, Date.now()).run();
    return c.json({
      message: "Member invited successfully"
    }, 201);
  } catch (error3) {
    console.error("Invite member error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while inviting the member"
    }, 500);
  }
});
workspacesRoutes2.put("/:workspaceId/members/:userId", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const userId = c.req.param("userId");
    const { role } = await c.req.json();
    const validRoles = ["admin", "member", "viewer"];
    if (!role || !validRoles.includes(role)) {
      return c.json({
        error: "Validation Error",
        message: "Invalid role. Must be one of: admin, member, viewer"
      }, 400);
    }
    const member = await c.env.DB.prepare(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?"
    ).bind(workspaceId, userId).first();
    if (!member) {
      return c.json({
        error: "Not Found",
        message: "Member not found"
      }, 404);
    }
    if (member.role === "owner") {
      return c.json({
        error: "Forbidden",
        message: "Cannot change the role of the workspace owner"
      }, 403);
    }
    await c.env.DB.prepare(
      "UPDATE workspace_members SET role = ? WHERE workspace_id = ? AND user_id = ?"
    ).bind(role, workspaceId, userId).run();
    return c.json({
      message: "Member role updated successfully"
    });
  } catch (error3) {
    console.error("Update member error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while updating the member"
    }, 500);
  }
});
workspacesRoutes2.delete("/:workspaceId/members/:userId", requireWorkspaceAccess, requireWorkspaceRole("owner", "admin"), async (c) => {
  try {
    const workspaceId = c.req.param("workspaceId");
    const userId = c.req.param("userId");
    const member = await c.env.DB.prepare(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?"
    ).bind(workspaceId, userId).first();
    if (!member) {
      return c.json({
        error: "Not Found",
        message: "Member not found"
      }, 404);
    }
    if (member.role === "owner") {
      return c.json({
        error: "Forbidden",
        message: "Cannot remove the workspace owner"
      }, 403);
    }
    await c.env.DB.prepare(
      "DELETE FROM workspace_members WHERE workspace_id = ? AND user_id = ?"
    ).bind(workspaceId, userId).run();
    return c.json({
      message: "Member removed successfully"
    });
  } catch (error3) {
    console.error("Remove member error:", error3);
    return c.json({
      error: "Internal Server Error",
      message: "An error occurred while removing the member"
    }, 500);
  }
});
var workspaces_default2 = workspacesRoutes2;

// src/routes/client/index.ts
var clientRoutes = new Hono2();
clientRoutes.route("/auth", auth_default2);
clientRoutes.route("/workspaces", workspaces_default2);
clientRoutes.get("/", (c) => {
  return c.json({
    message: "Vocalized API",
    version: "1.0.0",
    routes: [
      "/auth/*",
      "/workspaces/*",
      "/templates/*",
      "/webhooks/*"
    ]
  });
});
var client_default = clientRoutes;

// src/index.ts
var app = new Hono2();
app.use("*", logger());
app.use("*", cors({
  origin: [
    "http://localhost:5173",
    // Customer app dev
    "http://localhost:4173",
    // Admin app dev
    "https://app.vocalized.app",
    // Customer app production
    "https://admin.vocalized.app"
    // Admin app production
  ],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Content-Length", "X-Request-Id"],
  maxAge: 86400,
  // 24 hours
  credentials: true
}));
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    environment: c.env.ENVIRONMENT,
    timestamp: Date.now()
  });
});
app.route("/admin", admin_default);
app.route("/", client_default);
app.notFound((c) => {
  return c.json({
    error: "Not Found",
    message: "The requested resource was not found",
    path: c.req.path
  }, 404);
});
app.onError((err, c) => {
  console.error("Global error:", err);
  if (err.message.includes("Unauthorized")) {
    return c.json({
      error: "Unauthorized",
      message: "Authentication required"
    }, 401);
  }
  if (err.message.includes("Forbidden")) {
    return c.json({
      error: "Forbidden",
      message: "You do not have permission to access this resource"
    }, 403);
  }
  return c.json({
    error: "Internal Server Error",
    message: c.env.ENVIRONMENT === "production" ? "An unexpected error occurred" : err.message
  }, 500);
});
var src_default = app;

// ../../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-X1FbDe/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-X1FbDe/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map

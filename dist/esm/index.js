var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/exponential-backoff/dist/options.js
var require_options = __commonJS({
  "node_modules/exponential-backoff/dist/options.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultOptions = {
      delayFirstAttempt: false,
      jitter: "none",
      maxDelay: Infinity,
      numOfAttempts: 10,
      retry: function() {
        return true;
      },
      startingDelay: 100,
      timeMultiple: 2
    };
    function getSanitizedOptions(options) {
      var sanitized = __assign(__assign({}, defaultOptions), options);
      if (sanitized.numOfAttempts < 1) {
        sanitized.numOfAttempts = 1;
      }
      return sanitized;
    }
    exports.getSanitizedOptions = getSanitizedOptions;
  }
});

// node_modules/exponential-backoff/dist/jitter/full/full.jitter.js
var require_full_jitter = __commonJS({
  "node_modules/exponential-backoff/dist/jitter/full/full.jitter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function fullJitter(delay) {
      var jitteredDelay = Math.random() * delay;
      return Math.round(jitteredDelay);
    }
    exports.fullJitter = fullJitter;
  }
});

// node_modules/exponential-backoff/dist/jitter/no/no.jitter.js
var require_no_jitter = __commonJS({
  "node_modules/exponential-backoff/dist/jitter/no/no.jitter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function noJitter(delay) {
      return delay;
    }
    exports.noJitter = noJitter;
  }
});

// node_modules/exponential-backoff/dist/jitter/jitter.factory.js
var require_jitter_factory = __commonJS({
  "node_modules/exponential-backoff/dist/jitter/jitter.factory.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var full_jitter_1 = require_full_jitter();
    var no_jitter_1 = require_no_jitter();
    function JitterFactory(options) {
      switch (options.jitter) {
        case "full":
          return full_jitter_1.fullJitter;
        case "none":
        default:
          return no_jitter_1.noJitter;
      }
    }
    exports.JitterFactory = JitterFactory;
  }
});

// node_modules/exponential-backoff/dist/delay/delay.base.js
var require_delay_base = __commonJS({
  "node_modules/exponential-backoff/dist/delay/delay.base.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var jitter_factory_1 = require_jitter_factory();
    var Delay = (
      /** @class */
      function() {
        function Delay2(options) {
          this.options = options;
          this.attempt = 0;
        }
        Delay2.prototype.apply = function() {
          var _this = this;
          return new Promise(function(resolve) {
            return setTimeout(resolve, _this.jitteredDelay);
          });
        };
        Delay2.prototype.setAttemptNumber = function(attempt) {
          this.attempt = attempt;
        };
        Object.defineProperty(Delay2.prototype, "jitteredDelay", {
          get: function() {
            var jitter = jitter_factory_1.JitterFactory(this.options);
            return jitter(this.delay);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Delay2.prototype, "delay", {
          get: function() {
            var constant = this.options.startingDelay;
            var base = this.options.timeMultiple;
            var power = this.numOfDelayedAttempts;
            var delay = constant * Math.pow(base, power);
            return Math.min(delay, this.options.maxDelay);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Delay2.prototype, "numOfDelayedAttempts", {
          get: function() {
            return this.attempt;
          },
          enumerable: true,
          configurable: true
        });
        return Delay2;
      }()
    );
    exports.Delay = Delay;
  }
});

// node_modules/exponential-backoff/dist/delay/skip-first/skip-first.delay.js
var require_skip_first_delay = __commonJS({
  "node_modules/exponential-backoff/dist/delay/skip-first/skip-first.delay.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var delay_base_1 = require_delay_base();
    var SkipFirstDelay = (
      /** @class */
      function(_super) {
        __extends(SkipFirstDelay2, _super);
        function SkipFirstDelay2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        SkipFirstDelay2.prototype.apply = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, this.isFirstAttempt ? true : _super.prototype.apply.call(this)];
            });
          });
        };
        Object.defineProperty(SkipFirstDelay2.prototype, "isFirstAttempt", {
          get: function() {
            return this.attempt === 0;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(SkipFirstDelay2.prototype, "numOfDelayedAttempts", {
          get: function() {
            return this.attempt - 1;
          },
          enumerable: true,
          configurable: true
        });
        return SkipFirstDelay2;
      }(delay_base_1.Delay)
    );
    exports.SkipFirstDelay = SkipFirstDelay;
  }
});

// node_modules/exponential-backoff/dist/delay/always/always.delay.js
var require_always_delay = __commonJS({
  "node_modules/exponential-backoff/dist/delay/always/always.delay.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    var delay_base_1 = require_delay_base();
    var AlwaysDelay = (
      /** @class */
      function(_super) {
        __extends(AlwaysDelay2, _super);
        function AlwaysDelay2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        return AlwaysDelay2;
      }(delay_base_1.Delay)
    );
    exports.AlwaysDelay = AlwaysDelay;
  }
});

// node_modules/exponential-backoff/dist/delay/delay.factory.js
var require_delay_factory = __commonJS({
  "node_modules/exponential-backoff/dist/delay/delay.factory.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var skip_first_delay_1 = require_skip_first_delay();
    var always_delay_1 = require_always_delay();
    function DelayFactory(options, attempt) {
      var delay = initDelayClass(options);
      delay.setAttemptNumber(attempt);
      return delay;
    }
    exports.DelayFactory = DelayFactory;
    function initDelayClass(options) {
      if (!options.delayFirstAttempt) {
        return new skip_first_delay_1.SkipFirstDelay(options);
      }
      return new always_delay_1.AlwaysDelay(options);
    }
  }
});

// node_modules/exponential-backoff/dist/backoff.js
var require_backoff = __commonJS({
  "node_modules/exponential-backoff/dist/backoff.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var options_1 = require_options();
    var delay_factory_1 = require_delay_factory();
    function backOff2(request, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var sanitizedOptions, backOff3;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              sanitizedOptions = options_1.getSanitizedOptions(options);
              backOff3 = new BackOff(request, sanitizedOptions);
              return [4, backOff3.execute()];
            case 1:
              return [2, _a.sent()];
          }
        });
      });
    }
    exports.backOff = backOff2;
    var BackOff = (
      /** @class */
      function() {
        function BackOff2(request, options) {
          this.request = request;
          this.options = options;
          this.attemptNumber = 0;
        }
        BackOff2.prototype.execute = function() {
          return __awaiter(this, void 0, void 0, function() {
            var e_1, shouldRetry;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!!this.attemptLimitReached) return [3, 7];
                  _a.label = 1;
                case 1:
                  _a.trys.push([1, 4, , 6]);
                  return [4, this.applyDelay()];
                case 2:
                  _a.sent();
                  return [4, this.request()];
                case 3:
                  return [2, _a.sent()];
                case 4:
                  e_1 = _a.sent();
                  this.attemptNumber++;
                  return [4, this.options.retry(e_1, this.attemptNumber)];
                case 5:
                  shouldRetry = _a.sent();
                  if (!shouldRetry || this.attemptLimitReached) {
                    throw e_1;
                  }
                  return [3, 6];
                case 6:
                  return [3, 0];
                case 7:
                  throw new Error("Something went wrong.");
              }
            });
          });
        };
        Object.defineProperty(BackOff2.prototype, "attemptLimitReached", {
          get: function() {
            return this.attemptNumber >= this.options.numOfAttempts;
          },
          enumerable: true,
          configurable: true
        });
        BackOff2.prototype.applyDelay = function() {
          return __awaiter(this, void 0, void 0, function() {
            var delay;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  delay = delay_factory_1.DelayFactory(this.options, this.attemptNumber);
                  return [4, delay.apply()];
                case 1:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return BackOff2;
      }()
    );
  }
});

// src/ari-client/baseClient.ts
import axios, {
  isAxiosError
} from "axios";
var HTTPError = class extends Error {
  constructor(message, status, method, url) {
    super(message);
    this.status = status;
    this.method = method;
    this.url = url;
    this.name = "HTTPError";
  }
};
var BaseClient = class {
  /**
   * Creates a new BaseClient instance.
   *
   * @param {string} baseUrl - The base URL for the API
   * @param {string} username - Username for authentication
   * @param {string} password - Password for authentication
   * @param {number} [timeout=5000] - Request timeout in milliseconds
   * @throws {Error} If the base URL format is invalid
   */
  constructor(baseUrl, username, password, timeout = 5e3) {
    this.baseUrl = baseUrl;
    this.username = username;
    this.password = password;
    if (!/^https?:\/\/.+/.test(baseUrl)) {
      throw new Error("Invalid base URL. It must start with http:// or https://");
    }
    this.client = axios.create({
      baseURL: baseUrl,
      auth: { username, password },
      timeout,
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.addInterceptors();
    console.log(`BaseClient initialized for ${baseUrl}`);
  }
  client;
  /**
   * Gets the base URL of the client.
   */
  getBaseUrl() {
    return this.baseUrl;
  }
  /**
   * Gets the configured credentials.
   */
  getCredentials() {
    return {
      baseUrl: this.baseUrl,
      username: this.username,
      password: this.password
    };
  }
  /**
   * Adds request and response interceptors to the Axios instance.
   */
  addInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        const message = this.getErrorMessage(error);
        console.error("[Request Error]", message);
        return Promise.reject(new HTTPError(message));
      }
    );
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[Response] ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status ?? 0;
          const method = error.config?.method?.toUpperCase() ?? "UNKNOWN";
          const url = error.config?.url ?? "unknown-url";
          const message2 = error.response?.data?.message || error.message || "Unknown error";
          if (status === 404) {
            console.warn(`[404] Not Found: ${url}`);
          } else if (status >= 500) {
            console.error(`[${status}] Server Error: ${url}`);
          } else if (status > 0) {
            console.warn(`[${status}] ${method} ${url}: ${message2}`);
          } else {
            console.error(`[Network] Request failed: ${message2}`);
          }
          throw new HTTPError(message2, status || void 0, method, url);
        }
        const message = this.getErrorMessage(error);
        console.error("[Unexpected Error]", message);
        throw new Error(message);
      }
    );
  }
  /**
   * Executes a GET request.
   *
   * @param path - API endpoint path
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  async get(path, config) {
    try {
      const response = await this.client.get(path, config);
      return response.data;
    } catch (error) {
      throw this.handleRequestError(error);
    }
  }
  /**
   * Executes a POST request.
   *
   * @param path - API endpoint path
   * @param data - Request payload
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  async post(path, data, config) {
    try {
      const response = await this.client.post(path, data, config);
      return response.data;
    } catch (error) {
      throw this.handleRequestError(error);
    }
  }
  /**
   * Executes a PUT request.
   *
   * @param path - API endpoint path
   * @param data - Request payload
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  async put(path, data, config) {
    try {
      const response = await this.client.put(path, data, config);
      return response.data;
    } catch (error) {
      throw this.handleRequestError(error);
    }
  }
  /**
   * Executes a DELETE request.
   *
   * @param path - API endpoint path
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  async delete(path, config) {
    try {
      const response = await this.client.delete(path, config);
      return response.data;
    } catch (error) {
      throw this.handleRequestError(error);
    }
  }
  /**
   * Handles and formats error messages from various error types.
   */
  getErrorMessage(error) {
    if (isAxiosError(error)) {
      return error.response?.data?.message || error.message || "HTTP Error";
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred";
  }
  /**
   * Handles errors from HTTP requests.
   */
  handleRequestError(error) {
    const message = this.getErrorMessage(error);
    if (isAxiosError(error)) {
      throw new HTTPError(
        message,
        error.response?.status,
        error.config?.method?.toUpperCase(),
        error.config?.url
      );
    }
    throw new Error(message);
  }
  /**
   * Sets custom headers for the client instance.
   */
  setHeaders(headers) {
    this.client.defaults.headers.common = {
      ...this.client.defaults.headers.common,
      ...headers
    };
    console.log("Updated client headers");
  }
  /**
   * Gets the current request timeout setting.
   */
  getTimeout() {
    return this.client.defaults.timeout || 5e3;
  }
  /**
   * Updates the request timeout setting.
   */
  setTimeout(timeout) {
    this.client.defaults.timeout = timeout;
    console.log(`Updated timeout to ${timeout}ms`);
  }
};

// src/ari-client/resources/applications.ts
var Applications = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Lists all applications.
   * 
   * @returns A promise that resolves to an array of Application objects.
   * @throws {Error} If the API response is not an array.
   */
  async list() {
    const applications = await this.client.get("/applications");
    if (!Array.isArray(applications)) {
      throw new Error("Resposta da API /applications n\xE3o \xE9 um array.");
    }
    return applications;
  }
  /**
   * Retrieves details of a specific application.
   * 
   * @param appName - The name of the application to retrieve details for.
   * @returns A promise that resolves to an ApplicationDetails object.
   * @throws {Error} If there's an error fetching the application details.
   */
  async getDetails(appName) {
    try {
      return await this.client.get(
        `/applications/${appName}`
      );
    } catch (error) {
      console.error(`Erro ao obter detalhes do aplicativo ${appName}:`, error);
      throw error;
    }
  }
  /**
   * Sends a message to a specific application.
   * 
   * @param appName - The name of the application to send the message to.
   * @param body - The message to be sent, containing an event and optional data.
   * @returns A promise that resolves when the message is successfully sent.
   */
  async sendMessage(appName, body) {
    await this.client.post(`/applications/${appName}/messages`, body);
  }
};

// src/ari-client/resources/asterisk.ts
function toQueryParams(options) {
  return new URLSearchParams(
    Object.entries(options).filter(([, value]) => value !== void 0).map(([key, value]) => [key, String(value)])
  ).toString();
}
var Asterisk = class {
  constructor(client) {
    this.client = client;
  }
  async ping() {
    return this.client.get("/asterisk/ping");
  }
  /**
   * Retrieves information about the Asterisk server.
   */
  async get() {
    return this.client.get("/asterisk/info");
  }
  /**
   * Lists all loaded modules in the Asterisk server.
   */
  async list() {
    return this.client.get("/asterisk/modules");
  }
  /**
   * Manages a specific module in the Asterisk server.
   *
   * @param moduleName - The name of the module to manage.
   * @param action - The action to perform on the module: "load", "unload", or "reload".
   * @returns A promise that resolves when the action is completed successfully.
   * @throws {Error} Throws an error if the HTTP method or action is invalid.
   */
  async manage(moduleName, action) {
    const url = `/asterisk/modules/${moduleName}`;
    switch (action) {
      case "load":
        await this.client.post(`${url}?action=load`);
        break;
      case "unload":
        await this.client.delete(url);
        break;
      case "reload":
        await this.client.put(url, {});
        break;
      default:
        throw new Error(`A\xE7\xE3o inv\xE1lida: ${action}`);
    }
  }
  /**
   * Retrieves all configured logging channels.
   */
  async listLoggingChannels() {
    return this.client.get("/asterisk/logging");
  }
  /**
   * Adds or removes a log channel in the Asterisk server.
   */
  async manageLogChannel(logChannelName, action, configuration) {
    const queryParams = toQueryParams(configuration || {});
    return this.client.post(
      `/asterisk/logging/${logChannelName}?action=${encodeURIComponent(action)}&${queryParams}`
    );
  }
  /**
   * Retrieves the value of a global variable.
   */
  async getGlobalVariable(variableName) {
    return this.client.get(
      `/asterisk/variables?variable=${encodeURIComponent(variableName)}`
    );
  }
  /**
   * Sets a global variable.
   */
  async setGlobalVariable(variableName, value) {
    return this.client.post(
      `/asterisk/variables?variable=${encodeURIComponent(variableName)}&value=${encodeURIComponent(value)}`
    );
  }
};

// src/ari-client/resources/bridges.ts
var Bridges = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Lists all active bridges.
   */
  async list() {
    return this.client.get("/bridges");
  }
  /**
   * Creates a new bridge.
   */
  async createBridge(request) {
    return this.client.post("/bridges", request);
  }
  /**
   * Retrieves details of a specific bridge.
   */
  async getDetails(bridgeId) {
    return this.client.get(`/bridges/${bridgeId}`);
  }
  /**
   * Destroys (deletes) a specific bridge.
   */
  async destroy(bridgeId) {
    return this.client.delete(`/bridges/${bridgeId}`);
  }
  /**
   * Adds a channel or multiple channels to a bridge.
   */
  async addChannels(bridgeId, request) {
    const queryParams = new URLSearchParams({
      channel: Array.isArray(request.channel) ? request.channel.join(",") : request.channel,
      ...request.role && { role: request.role }
    }).toString();
    await this.client.post(
      `/bridges/${bridgeId}/addChannel?${queryParams}`
    );
  }
  /**
   * Removes a channel or multiple channels from a bridge.
   */
  async removeChannels(bridgeId, request) {
    const queryParams = new URLSearchParams({
      channel: Array.isArray(request.channel) ? request.channel.join(",") : request.channel
    }).toString();
    await this.client.post(
      `/bridges/${bridgeId}/removeChannel?${queryParams}`
    );
  }
  /**
   * Plays media to a bridge.
   */
  async playMedia(bridgeId, request) {
    const queryParams = new URLSearchParams({
      ...request.lang && { lang: request.lang },
      ...request.offsetms && { offsetms: request.offsetms.toString() },
      ...request.skipms && { skipms: request.skipms.toString() },
      ...request.playbackId && { playbackId: request.playbackId }
    }).toString();
    return this.client.post(
      `/bridges/${bridgeId}/play?${queryParams}`,
      { media: request.media }
    );
  }
  /**
   * Stops media playback on a bridge.
   */
  async stopPlayback(bridgeId, playbackId) {
    await this.client.delete(`/bridges/${bridgeId}/play/${playbackId}`);
  }
  /**
   * Sets the video source for a bridge.
   */
  async setVideoSource(bridgeId, channelId) {
    await this.client.post(
      `/bridges/${bridgeId}/videoSource?channelId=${encodeURIComponent(channelId)}`
    );
  }
  /**
   * Clears the video source for a bridge.
   */
  async clearVideoSource(bridgeId) {
    await this.client.delete(`/bridges/${bridgeId}/videoSource`);
  }
};

// src/ari-client/resources/channels.ts
import { EventEmitter } from "events";

// node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm/rng.js
import { randomFillSync } from "crypto";
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm/native.js
import { randomUUID } from "crypto";
var native_default = { randomUUID };

// node_modules/uuid/dist/esm/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/ari-client/utils.ts
function toQueryParams2(options) {
  return new URLSearchParams(
    Object.entries(options).filter(([, value]) => value !== void 0).map(([key, value]) => [key, value])
  ).toString();
}

// src/ari-client/resources/channels.ts
import { isAxiosError as isAxiosError2 } from "axios";
var getErrorMessage = (error) => {
  if (isAxiosError2(error)) {
    return error.response?.data?.message || error.message || "An axios error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};
var ChannelInstance = class {
  constructor(client, baseClient, channelId) {
    this.client = client;
    this.baseClient = baseClient;
    this.id = channelId || `channel-${Date.now()}`;
    console.log(`Channel instance initialized with ID: ${this.id}`);
  }
  eventEmitter = new EventEmitter();
  channelData = null;
  id;
  /**
   * Registers an event listener for specific channel events
   */
  on(event, listener) {
    if (!event) {
      throw new Error("Event type is required");
    }
    const wrappedListener = (data) => {
      if ("channel" in data && data.channel?.id === this.id) {
        listener(data);
      }
    };
    this.eventEmitter.on(event, wrappedListener);
    console.log(`Event listener registered for ${event} on channel ${this.id}`);
  }
  /**
   * Registers a one-time event listener
   */
  once(event, listener) {
    if (!event) {
      throw new Error("Event type is required");
    }
    const wrappedListener = (data) => {
      if ("channel" in data && data.channel?.id === this.id) {
        listener(data);
      }
    };
    this.eventEmitter.once(event, wrappedListener);
    console.log(`One-time event listener registered for ${event} on channel ${this.id}`);
  }
  /**
   * Removes event listener(s) for a specific WebSocket event type.
   * If a specific listener is provided, only that listener is removed.
   * Otherwise, all listeners for the given event type are removed.
   *
   * @param {T} event - The type of WebSocket event to remove listener(s) for
   * @param {Function} [listener] - Optional specific listener to remove
   * @throws {Error} If no event type is provided
   */
  off(event, listener) {
    if (!event) {
      throw new Error("Event type is required");
    }
    if (listener) {
      this.eventEmitter.off(event, listener);
      console.log(`Specific listener removed for ${event} on channel ${this.id}`);
    } else {
      this.eventEmitter.removeAllListeners(event);
      console.log(`All listeners removed for ${event} on channel ${this.id}`);
    }
  }
  /**
   * Emits an event if it matches the current channel
   */
  emitEvent(event) {
    if (!event) {
      console.warn("Received invalid event");
      return;
    }
    if ("channel" in event && event.channel?.id === this.id) {
      this.eventEmitter.emit(event.type, event);
      console.log(`Event ${event.type} emitted for channel ${this.id}`);
    }
  }
  /**
   * Removes all event listeners associated with the current instance.
   * This ensures that there are no lingering event handlers for the channel.
   *
   * @return {void} This method does not return a value.
   */
  removeAllListeners() {
    console.log(`Removendo todos os listeners para o canal ${this.id}`);
    this.eventEmitter.removeAllListeners();
  }
  /**
   * Answers the channel
   */
  async answer() {
    try {
      await this.baseClient.post(`/channels/${this.id}/answer`);
      console.log(`Channel ${this.id} answered`);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Error answering channel ${this.id}:`, message);
      throw new Error(`Failed to answer channel: ${message}`);
    }
  }
  /**
   * Originates a new channel
   *
   * @param data - Channel origination configuration
   * @returns Promise resolving to the created channel
   * @throws Error if channel already exists or origination fails
   */
  async originate(data) {
    if (this.channelData) {
      throw new Error("Channel has already been created");
    }
    try {
      this.channelData = await this.baseClient.post("/channels", data);
      console.log(`Channel originated successfully with ID: ${this.channelData.id}`);
      return this.channelData;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Error originating channel:`, message);
      throw new Error(`Failed to originate channel: ${message}`);
    }
  }
  /**
   * Plays media on the channel
   */
  async play(options, playbackId) {
    if (!options.media) {
      throw new Error("Media URL is required");
    }
    try {
      if (!this.channelData) {
        console.log("Initializing channel details...");
        this.channelData = await this.getDetails();
      }
      const playback = this.client.Playback(playbackId || v4_default());
      await this.baseClient.post(
        `/channels/${this.id}/play/${playback.id}`,
        options
      );
      console.log(`Media playback started on channel ${this.id}`);
      return playback;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Error playing media on channel ${this.id}:`, message);
      throw new Error(`Failed to play media: ${message}`);
    }
  }
  /**
   * Gets the current channel details
   */
  async getDetails() {
    try {
      if (this.channelData) {
        return this.channelData;
      }
      if (!this.id) {
        throw new Error("No channel ID associated with this instance");
      }
      const details = await this.baseClient.get(`/channels/${this.id}`);
      this.channelData = details;
      console.log(`Retrieved channel details for ${this.id}`);
      return details;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Error retrieving channel details for ${this.id}:`, message);
      throw new Error(`Failed to get channel details: ${message}`);
    }
  }
  /**
   * Checks if the channel has any listeners for a specific event
   */
  hasListeners(event) {
    return this.eventEmitter.listenerCount(event) > 0;
  }
  /**
   * Gets the count of listeners for a specific event
   */
  getListenerCount(event) {
    return this.eventEmitter.listenerCount(event);
  }
  /**
   * Fetches a specific channel variable.
   *
   * @param {string} variable - The name of the variable to retrieve. This parameter is required.
   * @return {Promise<ChannelVar>} A promise that resolves with the value of the requested channel variable.
   * @throws {Error} If the 'variable' parameter is not provided.
   */
  async getVariable(variable) {
    if (!variable) {
      throw new Error("The 'variable' parameter is required.");
    }
    return this.baseClient.get(
      `/channels/${this.id}/variable?variable=${encodeURIComponent(variable)}`
    );
  }
  /**
   * Terminates the active call associated with the current channel.
   * This method ensures that channel details are initialized before attempting to hang up.
   * If the channel ID is invalid or cannot be determined, an error is thrown.
   *
   * @return {Promise<void>} A promise that resolves when the call is successfully terminated.
   */
  async hangup() {
    if (!this.channelData) {
      console.log("Canal n\xE3o inicializado, buscando detalhes...");
      this.channelData = await this.getDetails();
    }
    if (!this.channelData?.id) {
      throw new Error("N\xE3o foi poss\xEDvel inicializar o canal. ID inv\xE1lido.");
    }
    await this.baseClient.delete(`/channels/${this.channelData.id}`);
  }
  /**
   * Plays media on the specified channel using the provided media URL and optional playback options.
   *
   * @param {string} media - The URL or identifier of the media to be played.
   * @param {PlaybackOptions} [options] - Optional playback settings such as volume, playback speed, etc.
   * @return {Promise<ChannelPlayback>} A promise that resolves with the playback details for the channel.
   * @throws {Error} Throws an error if the channel has not been created.
   */
  async playMedia(media, options) {
    if (!this.channelData) {
      throw new Error("O canal ainda n\xE3o foi criado.");
    }
    const queryParams = options ? `?${new URLSearchParams(options).toString()}` : "";
    return this.baseClient.post(
      `/channels/${this.channelData.id}/play${queryParams}`,
      { media }
    );
  }
  /**
   * Stops the playback for the given playback ID.
   *
   * @param {string} playbackId - The unique identifier for the playback to be stopped.
   * @return {Promise<void>} A promise that resolves when the playback is successfully stopped.
   * @throws {Error} Throws an error if the instance is not associated with a channel.
   */
  async stopPlayback(playbackId) {
    if (!this.channelData?.id) {
      throw new Error("Canal n\xE3o associado a esta inst\xE2ncia.");
    }
    await this.baseClient.delete(
      `/channels/${this.channelData.id}/play/${playbackId}`
    );
  }
  /**
   * Pauses the playback of the specified media on a channel.
   *
   * @param {string} playbackId - The unique identifier of the playback to be paused.
   * @return {Promise<void>} A promise that resolves when the playback has been successfully paused.
   * @throws {Error} Throws an error if the channel is not associated with the current instance.
   */
  async pausePlayback(playbackId) {
    if (!this.channelData?.id) {
      throw new Error("Canal n\xE3o associado a esta inst\xE2ncia.");
    }
    await this.baseClient.post(
      `/channels/${this.channelData.id}/play/${playbackId}/pause`
    );
  }
  /**
   * Resumes playback of the specified playback session on the associated channel.
   *
   * @param {string} playbackId - The unique identifier of the playback session to be resumed.
   * @return {Promise<void>} A promise that resolves when the playback has been successfully resumed.
   * @throws {Error} Throws an error if the channel is not associated with this instance.
   */
  async resumePlayback(playbackId) {
    if (!this.channelData?.id) {
      throw new Error("Canal n\xE3o associado a esta inst\xE2ncia.");
    }
    await this.baseClient.delete(
      `/channels/${this.channelData.id}/play/${playbackId}/pause`
    );
  }
  /**
   * Rewinds the playback of a media by a specified amount of milliseconds.
   *
   * @param {string} playbackId - The unique identifier for the playback session to be rewound.
   * @param {number} skipMs - The number of milliseconds to rewind the playback.
   * @return {Promise<void>} A promise that resolves when the rewind operation is complete.
   */
  async rewindPlayback(playbackId, skipMs) {
    if (!this.channelData?.id) {
      throw new Error("Canal n\xE3o associado a esta inst\xE2ncia.");
    }
    await this.baseClient.post(
      `/channels/${this.channelData.id}/play/${playbackId}/rewind`,
      { skipMs }
    );
  }
  /**
   * Fast forwards the playback by a specific duration in milliseconds.
   *
   * @param {string} playbackId - The unique identifier of the playback to be fast-forwarded.
   * @param {number} skipMs - The number of milliseconds to fast forward the playback.
   * @return {Promise<void>} A Promise that resolves when the fast-forward operation is complete.
   * @throws {Error} If no channel is associated with this instance.
   */
  async fastForwardPlayback(playbackId, skipMs) {
    if (!this.channelData?.id) {
      throw new Error("Canal n\xE3o associado a esta inst\xE2ncia.");
    }
    await this.baseClient.post(
      `/channels/${this.channelData.id}/play/${playbackId}/forward`,
      { skipMs }
    );
  }
  /**
   * Mutes the specified channel for the given direction.
   *
   * @param {("both" | "in" | "out")} [direction="both"] - The direction to mute the channel. It can be "both" to mute incoming and outgoing, "in" to mute incoming, or "out" to mute outgoing.
   * @return {Promise<void>} A promise that resolves when the channel is successfully muted.
   * @throws {Error} If the channel is not associated with this instance.
   */
  async muteChannel(direction = "both") {
    if (!this.channelData?.id) {
      throw new Error("Canal n\xE3o associado a esta inst\xE2ncia.");
    }
    await this.baseClient.post(
      `/channels/${this.channelData.id}/mute?direction=${direction}`
    );
  }
  /**
   * Unmutes a previously muted channel in the specified direction.
   *
   * @param {"both" | "in" | "out"} direction - The direction in which to unmute the channel.
   *        Defaults to "both", which unmutes both incoming and outgoing communication.
   * @return {Promise<void>} A promise that resolves once the channel has been successfully unmuted.
   * @throws {Error} If the channel is not associated with the current instance.
   */
  async unmuteChannel(direction = "both") {
    if (!this.channelData?.id) {
      throw new Error("Canal n\xE3o associado a esta inst\xE2ncia.");
    }
    await this.baseClient.delete(
      `/channels/${this.channelData.id}/mute?direction=${direction}`
    );
  }
  /**
   * Places the associated channel on hold if the channel is valid and linked to this instance.
   *
   * @return {Promise<void>} A promise that resolves when the hold action is successfully executed.
   * @throws {Error} Throws an error if the channel is not associated with this instance.
   */
  async holdChannel() {
    if (!this.channelData?.id) {
      throw new Error("Canal n\xE3o associado a esta inst\xE2ncia.");
    }
    await this.baseClient.post(`/channels/${this.channelData.id}/hold`);
  }
  /**
   * Removes the hold status from a specific channel associated with this instance.
   * The method sends a delete request to the server to release the hold on the channel.
   * If no channel is associated with this instance, an error will be thrown.
   *
   * @return {Promise<void>} A promise that resolves when the channel hold has been successfully removed.
   * @throws {Error} If no channel is associated with this instance.
   */
  async unholdChannel() {
    if (!this.channelData?.id) {
      throw new Error("Canal n\xE3o associado a esta inst\xE2ncia.");
    }
    await this.baseClient.delete(`/channels/${this.channelData.id}/hold`);
  }
};
var Channels = class {
  constructor(baseClient, client) {
    this.baseClient = baseClient;
    this.client = client;
  }
  channelInstances = /* @__PURE__ */ new Map();
  /**
   * Creates or retrieves a ChannelInstance based on the provided id.
   */
  Channel({ id }) {
    try {
      if (!id) {
        const instance = new ChannelInstance(this.client, this.baseClient);
        this.channelInstances.set(instance.id, instance);
        console.log(`New channel instance created with ID: ${instance.id}`);
        return instance;
      }
      if (!this.channelInstances.has(id)) {
        const instance = new ChannelInstance(this.client, this.baseClient, id);
        this.channelInstances.set(id, instance);
        console.log(`New channel instance created with provided ID: ${id}`);
        return instance;
      }
      console.log(`Returning existing channel instance: ${id}`);
      return this.channelInstances.get(id);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Error creating/retrieving channel instance:`, message);
      throw new Error(`Failed to manage channel instance: ${message}`);
    }
  }
  /**
   * Removes a channel instance from the collection.
   */
  removeChannelInstance(channelId) {
    if (!channelId) {
      throw new Error("Channel ID is required");
    }
    if (this.channelInstances.has(channelId)) {
      const instance = this.channelInstances.get(channelId);
      instance?.removeAllListeners();
      this.channelInstances.delete(channelId);
      console.log(`Channel instance removed: ${channelId}`);
    } else {
      console.warn(`Attempt to remove non-existent instance: ${channelId}`);
    }
  }
  /**
   * Propagates a WebSocket event to a specific channel.
   */
  propagateEventToChannel(event) {
    if (!event) {
      console.warn("Invalid WebSocket event received");
      return;
    }
    if ("channel" in event && event.channel?.id) {
      const instance = this.channelInstances.get(event.channel.id);
      if (instance) {
        instance.emitEvent(event);
        console.log(`Event propagated to channel ${event.channel.id}: ${event.type}`);
      } else {
        console.warn(`No instance found for channel ${event.channel.id}`);
      }
    }
  }
  /**
   * Initiates a new channel.
   */
  async originate(data) {
    if (!data.endpoint) {
      throw new Error("Endpoint is required for channel origination");
    }
    try {
      const channel = await this.baseClient.post("/channels", data);
      console.log(`Channel originated successfully with ID: ${channel.id}`);
      return channel;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Error originating channel:`, message);
      throw new Error(`Failed to originate channel: ${message}`);
    }
  }
  /**
   * Lists all active channels.
   */
  async list() {
    try {
      const channels = await this.baseClient.get("/channels");
      if (!Array.isArray(channels)) {
        throw new Error("API response for /channels is not an array");
      }
      console.log(`Retrieved ${channels.length} active channels`);
      return channels;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Error listing channels:`, message);
      throw new Error(`Failed to list channels: ${message}`);
    }
  }
  /**
   * Gets the count of active channel instances.
   */
  getInstanceCount() {
    return this.channelInstances.size;
  }
  /**
   * Checks if a channel instance exists.
   */
  hasInstance(channelId) {
    return this.channelInstances.has(channelId);
  }
  /**
   * Gets all active channel instances.
   */
  getAllInstances() {
    return new Map(this.channelInstances);
  }
  /**
   * Terminates an active call on the specified channel.
   *
   * @param {string} channelId - The unique identifier of the channel to hang up.
   * @param {Object} [options] - Optional parameters for the hangup request.
   * @param {string} [options.reason_code] - A code indicating the reason for the hangup.
   * @param {string} [options.reason] - A descriptive reason for the hangup.
   * @return {Promise<void>} A promise that resolves when the call has been successfully terminated.
   */
  async hangup(channelId, options) {
    const queryParams = new URLSearchParams({
      ...options?.reason_code && { reason_code: options.reason_code },
      ...options?.reason && { reason: options.reason }
    });
    return this.baseClient.delete(
      `/channels/${channelId}?${queryParams.toString()}`
    );
  }
  /**
   * Initiates snooping on a specified channel with the provided options.
   *
   * @param {string} channelId - The unique identifier of the channel to snoop on.
   * @param {SnoopOptions} options - Configuration options for the snooping operation.
   * @return {Promise<Channel>} A promise that resolves to the snooped channel data.
   */
  async snoopChannel(channelId, options) {
    const queryParams = toQueryParams2(options);
    return this.baseClient.post(
      `/channels/${channelId}/snoop?${queryParams}`
    );
  }
  /**
   * Starts a silence mode for the specified channel.
   *
   * @param {string} channelId - The unique identifier of the channel where silence mode should be started.
   * @return {Promise<void>} A promise that resolves when the silence mode is successfully started.
   */
  async startSilence(channelId) {
    return this.baseClient.post(`/channels/${channelId}/silence`);
  }
  /**
   * Stops the silence mode for a specific channel.
   *
   * @param {string} channelId - The unique identifier of the channel for which silence mode should be stopped.
   * @return {Promise<void>} A promise that resolves when the operation is complete.
   */
  async stopSilence(channelId) {
    return this.baseClient.delete(`/channels/${channelId}/silence`);
  }
  /**
   * Retrieves the Real-Time Protocol (RTP) statistics for a specific channel.
   *
   * @param {string} channelId - The unique identifier of the channel for which RTP statistics are fetched.
   * @return {Promise<RTPStats>} A promise that resolves to the RTP statistics for the specified channel.
   */
  async getRTPStatistics(channelId) {
    return this.baseClient.get(
      `/channels/${channelId}/rtp_statistics`
    );
  }
  /**
   * Creates an external media channel with the given options.
   *
   * @param {ExternalMediaOptions} options - The configuration options for creating the external media channel.
   * @return {Promise<Channel>} A promise that resolves with the created external media channel.
   */
  async createExternalMedia(options) {
    const queryParams = toQueryParams2(options);
    return this.baseClient.post(
      `/channels/externalMedia?${queryParams}`
    );
  }
  /**
   * Initiates playback of a specific media item on a channel using the provided playback ID.
   *
   * @param {string} channelId - The unique identifier of the channel where playback will occur.
   * @param {string} playbackId - The unique identifier for the specific playback session.
   * @param {string} media - The media content to be played.
   * @param {PlaybackOptions} [options] - Optional playback configuration parameters.
   * @return {Promise<ChannelPlayback>} A promise that resolves with the playback details for the channel.
   */
  async playWithId(channelId, playbackId, media, options) {
    const queryParams = options ? `?${toQueryParams2(options)}` : "";
    return this.baseClient.post(
      `/channels/${channelId}/play/${playbackId}${queryParams}`,
      { media }
    );
  }
  /**
   * Initiates a snoop operation on a specific channel using the provided channel ID and snoop ID.
   *
   * @param {string} channelId - The unique identifier of the channel to snoop on.
   * @param {string} snoopId - The unique identifier for the snoop operation.
   * @param {SnoopOptions} options - Additional options and parameters for the snoop operation.
   * @return {Promise<Channel>} A promise that resolves to the channel details after the snoop operation is initiated.
   */
  async snoopChannelWithId(channelId, snoopId, options) {
    const queryParams = toQueryParams2(options);
    return this.baseClient.post(
      `/channels/${channelId}/snoop/${snoopId}?${queryParams}`
    );
  }
  /**
   * Starts Music on Hold for the specified channel with the provided Music on Hold class.
   *
   * @param {string} channelId - The unique identifier of the channel.
   * @param {string} mohClass - The Music on Hold class to be applied.
   * @return {Promise<void>} A promise that resolves when the operation is complete.
   */
  async startMohWithClass(channelId, mohClass) {
    const queryParams = `mohClass=${encodeURIComponent(mohClass)}`;
    await this.baseClient.post(
      `/channels/${channelId}/moh?${queryParams}`
    );
  }
  /**
   * Retrieves the value of a specified variable for a given channel.
   *
   * @param {string} channelId - The unique identifier of the channel.
   * @param {string} variable - The name of the variable to retrieve.
   * @return {Promise<ChannelVar>} A promise that resolves to the value of the channel variable.
   * @throws {Error} Throws an error if the 'variable' parameter is not provided.
   */
  async getChannelVariable(channelId, variable) {
    if (!variable) {
      throw new Error("The 'variable' parameter is required.");
    }
    return this.baseClient.get(
      `/channels/${channelId}/variable?variable=${encodeURIComponent(variable)}`
    );
  }
  /**
   * Sets a variable for a specific channel.
   *
   * @param {string} channelId - The unique identifier of the channel.
   * @param {string} variable - The name of the variable to be set. This parameter is required.
   * @param {string} [value] - The value of the variable to be set. This parameter is optional.
   * @return {Promise<void>} A promise that resolves when the variable is successfully set.
   * @throws {Error} Throws an error if the `variable` parameter is not provided.
   */
  async setChannelVariable(channelId, variable, value) {
    if (!variable) {
      throw new Error("The 'variable' parameter is required.");
    }
    const queryParams = new URLSearchParams({
      variable,
      ...value && { value }
    });
    await this.baseClient.post(
      `/channels/${channelId}/variable?${queryParams}`
    );
  }
  /**
   * Moves a specified channel to the given application with optional arguments.
   *
   * @param {string} channelId - The unique identifier of the channel to be moved.
   * @param {string} app - The target application to which the channel will be moved.
   * @param {string} [appArgs] - Optional arguments to be passed to the target application.
   * @return {Promise<void>} A promise that resolves when the operation is completed.
   */
  async moveToApplication(channelId, app, appArgs) {
    await this.baseClient.post(`/channels/${channelId}/move`, {
      app,
      appArgs
    });
  }
  /**
   * Continues the execution of a dialplan for a specific channel.
   *
   * @param {string} channelId - The unique identifier of the channel.
   * @param {string} [context] - The dialplan context to continue execution in, if specified.
   * @param {string} [extension] - The dialplan extension to proceed with, if provided.
   * @param {number} [priority] - The priority within the dialplan extension to resume at, if specified.
   * @param {string} [label] - The label to start from within the dialplan, if given.
   * @return {Promise<void>} Resolves when the dialplan is successfully continued.
   */
  async continueDialplan(channelId, context, extension, priority, label) {
    await this.baseClient.post(`/channels/${channelId}/continue`, {
      context,
      extension,
      priority,
      label
    });
  }
  /**
   * Stops the music on hold for the specified channel.
   *
   * @param {string} channelId - The unique identifier of the channel where music on hold should be stopped.
   * @return {Promise<void>} Resolves when the music on hold is successfully stopped.
   */
  async stopMusicOnHold(channelId) {
    await this.baseClient.delete(`/channels/${channelId}/moh`);
  }
  /**
   * Initiates the music on hold for the specified channel.
   *
   * @param {string} channelId - The unique identifier of the channel where the music on hold will be started.
   * @return {Promise<void>} A promise that resolves when the operation has been successfully invoked.
   */
  async startMusicOnHold(channelId) {
    await this.baseClient.post(`/channels/${channelId}/moh`);
  }
  /**
   * Starts recording for a specific channel based on the provided options.
   *
   * @param {string} channelId - The unique identifier of the channel to start recording.
   * @param {RecordingOptions} options - The recording options to configure the recording process.
   * @return {Promise<Channel>} A promise that resolves to the channel object with updated recording state.
   */
  async record(channelId, options) {
    const queryParams = toQueryParams2(options);
    return this.baseClient.post(
      `/channels/${channelId}/record?${queryParams}`
    );
  }
  /**
   * Initiates a call on the specified channel with optional parameters for caller identification and timeout duration.
   *
   * @param {string} channelId - The ID of the channel where the call will be initiated.
   * @param {string} [caller] - Optional parameter specifying the name or identifier of the caller.
   * @param {number} [timeout] - Optional parameter defining the timeout duration for the call in seconds.
   * @return {Promise<void>} A promise that resolves when the call has been successfully initiated.
   */
  async dial(channelId, caller, timeout) {
    const queryParams = new URLSearchParams({
      ...caller && { caller },
      ...timeout && { timeout: timeout.toString() }
    });
    await this.baseClient.post(
      `/channels/${channelId}/dial?${queryParams}`
    );
  }
  /**
   * Redirects a channel to the specified endpoint.
   *
   * This method sends a POST request to update the redirect endpoint for the given channel.
   *
   * @param {string} channelId - The unique identifier of the channel to be redirected.
   * @param {string} endpoint - The new endpoint to redirect the channel to.
   * @return {Promise<void>} A promise that resolves when the operation is complete.
   */
  async redirectChannel(channelId, endpoint) {
    await this.baseClient.post(
      `/channels/${channelId}/redirect?endpoint=${encodeURIComponent(endpoint)}`
    );
  }
  /**
   * Answers a specified channel by sending a POST request to the corresponding endpoint.
   *
   * @param {string} channelId - The unique identifier of the channel to be answered.
   * @return {Promise<void>} A promise that resolves when the channel has been successfully answered.
   */
  async answerChannel(channelId) {
    await this.baseClient.post(`/channels/${channelId}/answer`);
  }
  /**
   * Rings the specified channel by sending a POST request to the appropriate endpoint.
   *
   * @param {string} channelId - The unique identifier of the channel to be rung.
   * @return {Promise<void>} A promise that resolves when the operation completes successfully.
   */
  async ringChannel(channelId) {
    await this.baseClient.post(`/channels/${channelId}/ring`);
  }
  /**
   * Stops the ring channel for the specified channel ID.
   *
   * This method sends a DELETE request to the server to stop the ring action
   * associated with the provided channel ID.
   *
   * @param {string} channelId - The unique identifier of the channel for which the ring action should be stopped.
   * @return {Promise<void>} A promise that resolves when the ring channel is successfully stopped.
   */
  async stopRingChannel(channelId) {
    await this.baseClient.delete(`/channels/${channelId}/ring`);
  }
  /**
   * Sends DTMF (Dual-Tone Multi-Frequency) signals to a specified channel.
   *
   * @param {string} channelId - The ID of the channel to which the DTMF signals should be sent.
   * @param {string} dtmf - The DTMF tones to be sent, represented as a string. Each character corresponds to a specific tone.
   * @param {Object} [options] - Optional configuration for the DTMF signal timing.
   * @param {number} [options.before] - Time in milliseconds to wait before sending the first DTMF tone.
   * @param {number} [options.between] - Time in milliseconds to wait between sending successive DTMF tones.
   * @param {number} [options.duration] - Duration in milliseconds for each DTMF tone.
   * @param {number} [options.after] - Time in milliseconds to wait after sending the last DTMF tone.
   * @return {Promise<void>} A promise that resolves when the DTMF signals are successfully sent.
   */
  async sendDTMF(channelId, dtmf, options) {
    const queryParams = toQueryParams2({ dtmf, ...options });
    await this.baseClient.post(
      `/channels/${channelId}/dtmf?${queryParams}`
    );
  }
  /**
   * Mutes a specified channel in the given direction.
   *
   * @param {string} channelId - The unique identifier of the channel to be muted.
   * @param {"both" | "in" | "out"} [direction="both"] - The direction for muting, can be "both", "in", or "out". Default is "both".
   * @return {Promise<void>} A promise that resolves when the channel is successfully muted.
   */
  async muteChannel(channelId, direction = "both") {
    await this.baseClient.post(
      `/channels/${channelId}/mute?direction=${direction}`
    );
  }
  /**
   * Unmutes a previously muted channel, allowing communication in the specified direction(s).
   *
   * @param {string} channelId - The unique identifier of the channel to be unmuted.
   * @param {"both" | "in" | "out"} [direction="both"] - The direction of communication to unmute. Valid options are "both", "in" (incoming messages), or "out" (outgoing messages). Defaults to "both".
   * @return {Promise<void>} A promise that resolves when the channel is successfully unmuted.
   */
  async unmuteChannel(channelId, direction = "both") {
    await this.baseClient.delete(
      `/channels/${channelId}/mute?direction=${direction}`
    );
  }
  /**
   * Places a specific channel on hold by sending a POST request to the server.
   *
   * @param {string} channelId - The unique identifier of the channel to be placed on hold.
   * @return {Promise<void>} A promise that resolves when the channel hold operation is completed.
   */
  async holdChannel(channelId) {
    await this.baseClient.post(`/channels/${channelId}/hold`);
  }
  /**
   * Removes the hold status from a specific channel by its ID.
   *
   * @param {string} channelId - The unique identifier of the channel to unhold.
   * @return {Promise<void>} A promise that resolves when the channel hold is successfully removed.
   */
  async unholdChannel(channelId) {
    await this.baseClient.delete(`/channels/${channelId}/hold`);
  }
  /**
   * Creates a new communication channel with the specified configuration.
   *
   * @param {OriginateRequest} data - The configuration data required to create the channel, including relevant details such as endpoint and channel variables.
   * @return {Promise<Channel>} A promise that resolves with the details of the created channel.
   */
  async createChannel(data) {
    return this.baseClient.post("/channels/create", data);
  }
  /**
   * Initiates a new channel with the specified channel ID and originates a call using the provided data.
   *
   * @param {string} channelId - The unique identifier of the channel to be created.
   * @param {OriginateRequest} data - The data required to originate the call, including details such as endpoint and caller information.
   * @return {Promise<Channel>} A promise that resolves to the created Channel object.
   */
  async originateWithId(channelId, data) {
    return this.baseClient.post(`/channels/${channelId}`, data);
  }
};

// src/ari-client/resources/endpoints.ts
var Endpoints = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Lists all available endpoints.
   *
   * @returns A promise that resolves to an array of Endpoint objects representing all available endpoints.
   * @throws {Error} If the API response is not an array.
   */
  async list() {
    const endpoints = await this.client.get("/endpoints");
    if (!Array.isArray(endpoints)) {
      throw new Error("Resposta da API /endpoints n\xE3o \xE9 um array.");
    }
    return endpoints;
  }
  /**
   * Retrieves details of a specific endpoint.
   *
   * @param technology - The technology of the endpoint (e.g., "PJSIP").
   * @param resource - The specific resource name of the endpoint (e.g., "9001").
   * @returns A promise that resolves to an EndpointDetails object containing the details of the specified endpoint.
   */
  async getDetails(technology, resource) {
    return this.client.get(
      `/endpoints/${technology}/${resource}`
    );
  }
  /**
   * Sends a message to a specific endpoint.
   *
   * @param technology - The technology of the endpoint (e.g., "PJSIP").
   * @param resource - The specific resource name of the endpoint (e.g., "9001").
   * @param message - The message payload to send to the endpoint.
   * @returns A promise that resolves when the message has been successfully sent.
   */
  async sendMessage(technology, resource, message) {
    await this.client.post(
      `/endpoints/${technology}/${resource}/sendMessage`,
      message
    );
  }
};

// src/ari-client/resources/playbacks.ts
import { EventEmitter as EventEmitter2 } from "events";
import { isAxiosError as isAxiosError3 } from "axios";
var getErrorMessage2 = (error) => {
  if (isAxiosError3(error)) {
    return error.response?.data?.message || error.message || "An axios error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};
var PlaybackInstance = class {
  /**
   * Creates a new PlaybackInstance.
   *
   * @param {AriClient} client - ARI client for communication
   * @param {BaseClient} baseClient - Base client for HTTP requests
   * @param {string} [playbackId] - Optional playback ID, generates timestamp-based ID if not provided
   */
  constructor(client, baseClient, playbackId = `playback-${Date.now()}`) {
    this.client = client;
    this.baseClient = baseClient;
    this.playbackId = playbackId;
    this.id = playbackId;
    console.log(`PlaybackInstance initialized with ID: ${this.id}`);
  }
  eventEmitter = new EventEmitter2();
  playbackData = null;
  id;
  /**
   * Registers an event listener for a specific WebSocket event type.
   *
   * @param {T} event - Event type to listen for
   * @param {Function} listener - Callback function for the event
   */
  on(event, listener) {
    if (!event) {
      throw new Error("Event type is required");
    }
    const wrappedListener = (data) => {
      if ("playback" in data && data.playback?.id === this.id) {
        listener(data);
      }
    };
    this.eventEmitter.on(event, wrappedListener);
    console.log(`Event listener registered for ${event} on playback ${this.id}`);
  }
  /**
   * Registers a one-time event listener for a specific WebSocket event type.
   *
   * @param {T} event - Event type to listen for
   * @param {Function} listener - Callback function for the event
   */
  once(event, listener) {
    if (!event) {
      throw new Error("Event type is required");
    }
    const wrappedListener = (data) => {
      if ("playback" in data && data.playback?.id === this.id) {
        listener(data);
      }
    };
    this.eventEmitter.once(event, wrappedListener);
    console.log(`One-time event listener registered for ${event} on playback ${this.id}`);
  }
  /**
   * Removes event listener(s) for a specific WebSocket event type.
   *
   * @param {T} event - Event type to remove listener(s) for
   * @param {Function} [listener] - Optional specific listener to remove
   */
  off(event, listener) {
    if (!event) {
      throw new Error("Event type is required");
    }
    if (listener) {
      this.eventEmitter.off(event, listener);
      console.log(`Specific listener removed for ${event} on playback ${this.id}`);
    } else {
      this.eventEmitter.removeAllListeners(event);
      console.log(`All listeners removed for ${event} on playback ${this.id}`);
    }
  }
  /**
   * Emits a WebSocket event if it matches the current playback instance.
   *
   * @param {WebSocketEvent} event - Event to emit
   */
  emitEvent(event) {
    if (!event) {
      console.warn("Received invalid event");
      return;
    }
    if ("playback" in event && event.playback?.id === this.id) {
      this.eventEmitter.emit(event.type, event);
      console.log(`Event ${event.type} emitted for playback ${this.id}`);
    }
  }
  /**
   * Retrieves current playback data.
   *
   * @returns {Promise<Playback>} Current playback data
   * @throws {Error} If playback is not properly initialized
   */
  async get() {
    if (!this.id) {
      throw new Error("No playback associated with this instance");
    }
    try {
      this.playbackData = await this.baseClient.get(
        `/playbacks/${this.id}`
      );
      console.log(`Retrieved playback data for ${this.id}`);
      return this.playbackData;
    } catch (error) {
      const message = getErrorMessage2(error);
      console.error(`Error retrieving playback data for ${this.id}:`, message);
      throw new Error(`Failed to get playback data: ${message}`);
    }
  }
  /**
   * Controls playback with specified operation.
   *
   * @param {"pause" | "unpause" | "reverse" | "forward"} operation - Control operation to perform
   * @throws {Error} If playback is not properly initialized or operation fails
   */
  async control(operation) {
    if (!this.id) {
      throw new Error("No playback associated with this instance");
    }
    try {
      await this.baseClient.post(
        `/playbacks/${this.id}/control?operation=${operation}`
      );
      console.log(`Operation ${operation} executed successfully on playback ${this.id}`);
    } catch (error) {
      const message = getErrorMessage2(error);
      console.error(`Error controlling playback ${this.id}:`, message);
      throw new Error(`Failed to control playback: ${message}`);
    }
  }
  /**
   * Stops the current playback.
   *
   * @throws {Error} If playback is not properly initialized or stop operation fails
   */
  async stop() {
    if (!this.id) {
      throw new Error("No playback associated with this instance");
    }
    try {
      await this.baseClient.delete(`/playbacks/${this.id}`);
      console.log(`Playback ${this.id} stopped successfully`);
    } catch (error) {
      const message = getErrorMessage2(error);
      console.error(`Error stopping playback ${this.id}:`, message);
      throw new Error(`Failed to stop playback: ${message}`);
    }
  }
  /**
   * Removes all event listeners from this playback instance.
   */
  removeAllListeners() {
    this.eventEmitter.removeAllListeners();
    console.log(`All listeners removed from playback ${this.id}`);
  }
  /**
   * Checks if the playback instance has any listeners for a specific event.
   *
   * @param {string} event - Event type to check
   * @returns {boolean} True if there are listeners for the event
   */
  hasListeners(event) {
    return this.eventEmitter.listenerCount(event) > 0;
  }
  /**
   * Gets the current playback data without making an API call.
   *
   * @returns {Playback | null} Current playback data or null if not available
   */
  getCurrentData() {
    return this.playbackData;
  }
};
var Playbacks = class {
  constructor(baseClient, client) {
    this.baseClient = baseClient;
    this.client = client;
  }
  playbackInstances = /* @__PURE__ */ new Map();
  /**
   * Gets or creates a playback instance
   * @param {Object} params - Parameters for getting/creating a playback instance
   * @param {string} [params.id] - Optional ID of an existing playback
   * @returns {PlaybackInstance} The requested or new playback instance
   */
  Playback({ id }) {
    try {
      if (!id) {
        const instance = new PlaybackInstance(this.client, this.baseClient);
        this.playbackInstances.set(instance.id, instance);
        console.log(`New playback instance created with ID: ${instance.id}`);
        return instance;
      }
      if (!this.playbackInstances.has(id)) {
        const instance = new PlaybackInstance(this.client, this.baseClient, id);
        this.playbackInstances.set(id, instance);
        console.log(`New playback instance created with provided ID: ${id}`);
        return instance;
      }
      console.log(`Returning existing playback instance: ${id}`);
      return this.playbackInstances.get(id);
    } catch (error) {
      const message = getErrorMessage2(error);
      console.error(`Error creating/retrieving playback instance:`, message);
      throw new Error(`Failed to manage playback instance: ${message}`);
    }
  }
  /**
   * Removes a playback instance and cleans up its resources
   * @param {string} playbackId - ID of the playback instance to remove
   * @throws {Error} If the playback instance doesn't exist
   */
  removePlaybackInstance(playbackId) {
    if (!playbackId) {
      throw new Error("Playback ID is required");
    }
    if (this.playbackInstances.has(playbackId)) {
      const instance = this.playbackInstances.get(playbackId);
      instance?.removeAllListeners();
      this.playbackInstances.delete(playbackId);
      console.log(`Playback instance removed: ${playbackId}`);
    } else {
      console.warn(`Attempt to remove non-existent instance: ${playbackId}`);
    }
  }
  /**
   * Propagates WebSocket events to the corresponding playback instance
   * @param {WebSocketEvent} event - The WebSocket event to propagate
   */
  propagateEventToPlayback(event) {
    if (!event) {
      console.warn("Invalid WebSocket event received");
      return;
    }
    if ("playback" in event && event.playback?.id) {
      const instance = this.playbackInstances.get(event.playback.id);
      if (instance) {
        instance.emitEvent(event);
        console.log(`Event propagated to playback ${event.playback.id}: ${event.type}`);
      } else {
        console.warn(`No instance found for playback ${event.playback.id}`);
      }
    }
  }
  /**
   * Retrieves details of a specific playback
   * @param {string} playbackId - ID of the playback to get details for
   * @returns {Promise<Playback>} Promise resolving to playback details
   * @throws {Error} If the playback ID is invalid or the request fails
   */
  async getDetails(playbackId) {
    if (!playbackId) {
      throw new Error("Playback ID is required");
    }
    try {
      return await this.baseClient.get(`/playbacks/${playbackId}`);
    } catch (error) {
      const message = getErrorMessage2(error);
      console.error(`Error getting playback details ${playbackId}:`, message);
      throw new Error(`Failed to get playback details: ${message}`);
    }
  }
  /**
   * Controls a specific playback instance
   * @param {string} playbackId - ID of the playback to control
   * @param {"pause" | "unpause" | "reverse" | "forward"} operation - Operation to perform
   * @throws {Error} If the playback ID is invalid or the operation fails
   */
  async control(playbackId, operation) {
    if (!playbackId) {
      throw new Error("Playback ID is required");
    }
    try {
      const playback = this.Playback({ id: playbackId });
      await playback.control(operation);
      console.log(`Operation ${operation} executed on playback ${playbackId}`);
    } catch (error) {
      const message = getErrorMessage2(error);
      console.error(`Error controlling playback ${playbackId}:`, message);
      throw new Error(`Failed to control playback: ${message}`);
    }
  }
  /**
   * Stops a specific playback instance
   * @param {string} playbackId - ID of the playback to stop
   * @throws {Error} If the playback ID is invalid or the stop operation fails
   */
  async stop(playbackId) {
    if (!playbackId) {
      throw new Error("Playback ID is required");
    }
    try {
      const playback = this.Playback({ id: playbackId });
      await playback.stop();
      console.log(`Playback ${playbackId} stopped`);
    } catch (error) {
      const message = getErrorMessage2(error);
      console.error(`Error stopping playback ${playbackId}:`, message);
      throw new Error(`Failed to stop playback: ${message}`);
    }
  }
  /**
   * Gets the count of active playback instances
   * @returns {number} Number of active playback instances
   */
  getInstanceCount() {
    return this.playbackInstances.size;
  }
  /**
   * Checks if a playback instance exists
   * @param {string} playbackId - ID of the playback to check
   * @returns {boolean} True if the playback instance exists
   */
  hasInstance(playbackId) {
    return this.playbackInstances.has(playbackId);
  }
};

// src/ari-client/resources/sounds.ts
var Sounds = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Lists all available sounds.
   *
   * @param params - Optional parameters to filter the list of sounds.
   * @returns A promise that resolves to an array of Sound objects.
   * @throws {Error} If the API response is not an array.
   */
  async list(params) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    const sounds = await this.client.get(`/sounds${query}`);
    if (!Array.isArray(sounds)) {
      throw new Error("Resposta da API /sounds n\xE3o \xE9 um array.");
    }
    return sounds;
  }
  /**
   * Retrieves details of a specific sound.
   *
   * @param soundId - The unique identifier of the sound.
   * @returns A promise that resolves to a Sound object containing the details of the specified sound.
   */
  async getDetails(soundId) {
    return this.client.get(`/sounds/${soundId}`);
  }
};

// src/ari-client/websocketClient.ts
var import_exponential_backoff = __toESM(require_backoff(), 1);
import { EventEmitter as EventEmitter3 } from "events";
import WebSocket from "ws";
var DEFAULT_MAX_RECONNECT_ATTEMPTS = 10;
var DEFAULT_STARTING_DELAY = 500;
var DEFAULT_MAX_DELAY = 1e4;
var WebSocketClient = class extends EventEmitter3 {
  /**
   * Creates a new WebSocket client instance.
   *
   * @param {BaseClient} baseClient - The base client containing connection details
   * @param {string[]} apps - List of applications to connect to
   * @param {WebSocketEventType[]} [subscribedEvents] - Optional list of events to subscribe to
   * @param {AriClient} [ariClient] - Optional ARI client for handling channel and playback events
   */
  constructor(baseClient, apps, subscribedEvents, ariClient) {
    super();
    this.baseClient = baseClient;
    this.apps = apps;
    this.subscribedEvents = subscribedEvents;
    this.ariClient = ariClient;
    if (!apps.length) {
      throw new Error("At least one application name is required");
    }
  }
  ws;
  isReconnecting = false;
  maxReconnectAttempts = DEFAULT_MAX_RECONNECT_ATTEMPTS;
  backOffOptions = {
    numOfAttempts: DEFAULT_MAX_RECONNECT_ATTEMPTS,
    startingDelay: DEFAULT_STARTING_DELAY,
    maxDelay: DEFAULT_MAX_DELAY,
    timeMultiple: 2,
    jitter: "full",
    delayFirstAttempt: false,
    retry: (error, attemptNumber) => {
      console.warn(
        `Connection attempt #${attemptNumber} failed:`,
        error.message || "Unknown error"
      );
      return attemptNumber < this.maxReconnectAttempts;
    }
  };
  /**
   * Establishes a WebSocket connection.
   *
   * @returns {Promise<void>} Resolves when connection is established
   * @throws {Error} If connection fails
   */
  async connect() {
    const { baseUrl, username, password } = this.baseClient.getCredentials();
    const protocol = baseUrl.startsWith("https") ? "wss" : "ws";
    const normalizedHost = baseUrl.replace(/^https?:\/\//, "").replace(/\/ari$/, "");
    const queryParams = new URLSearchParams();
    queryParams.append("app", this.apps.join(","));
    if (this.subscribedEvents?.length) {
      this.subscribedEvents.forEach(
        (event) => queryParams.append("event", event)
      );
    } else {
      queryParams.append("subscribeAll", "true");
    }
    const wsUrl = `${protocol}://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${normalizedHost}/ari/events?${queryParams.toString()}`;
    console.log("Connecting to WebSocket...");
    return this.initializeWebSocket(wsUrl);
  }
  /**
   * Initializes WebSocket connection with reconnection logic.
   *
   * @param {string} wsUrl - The WebSocket URL to connect to
   * @returns {Promise<void>} Resolves when connection is established
   */
  async initializeWebSocket(wsUrl) {
    return (0, import_exponential_backoff.backOff)(async () => {
      return new Promise((resolve, reject) => {
        try {
          this.ws = new WebSocket(wsUrl);
          this.ws.on("open", () => {
            console.log("WebSocket connection established successfully");
            this.isReconnecting = false;
            this.emit("connected");
            resolve();
          });
          this.ws.on("message", (data) => this.handleMessage(data.toString()));
          this.ws.on("close", (code) => {
            console.warn(
              `WebSocket disconnected with code ${code}. Attempting to reconnect...`
            );
            if (!this.isReconnecting) {
              this.reconnect(wsUrl);
            }
          });
          this.ws.on("error", (err) => {
            console.error("WebSocket error:", err.message);
            if (!this.isReconnecting) {
              this.reconnect(wsUrl);
            }
            reject(err);
          });
        } catch (error) {
          reject(error);
        }
      });
    }, this.backOffOptions);
  }
  /**
   * Processes incoming WebSocket messages.
   *
   * @param {string} rawMessage - The raw message received from WebSocket
   */
  handleMessage(rawMessage) {
    try {
      const event = JSON.parse(rawMessage);
      if (this.subscribedEvents?.length && !this.subscribedEvents.includes(event.type)) {
        return;
      }
      if ("channel" in event && event.channel?.id && this.ariClient) {
        const instanceChannel = this.ariClient.Channel(event.channel.id);
        instanceChannel.emitEvent(event);
        event.instanceChannel = instanceChannel;
      }
      if ("playback" in event && event.playback?.id && this.ariClient) {
        const instancePlayback = this.ariClient.Playback(event.playback.id);
        instancePlayback.emitEvent(event);
        event.instancePlayback = instancePlayback;
      }
      this.emit(event.type, event);
      console.log(`Event processed: ${event.type}`);
    } catch (error) {
      console.error("Error processing WebSocket message:", error instanceof Error ? error.message : "Unknown error");
      this.emit("error", new Error("Failed to decode WebSocket message"));
    }
  }
  /**
   * Attempts to reconnect to the WebSocket.
   *
   * @param {string} wsUrl - The WebSocket URL to reconnect to
   */
  reconnect(wsUrl) {
    this.isReconnecting = true;
    console.log("Initiating reconnection attempt...");
    this.removeAllListeners();
    (0, import_exponential_backoff.backOff)(() => this.initializeWebSocket(wsUrl), this.backOffOptions).catch((error) => {
      console.error(
        "Failed to reconnect after multiple attempts:",
        error instanceof Error ? error.message : "Unknown error"
      );
      this.emit("reconnectFailed", error);
    });
  }
  /**
   * Manually closes the WebSocket connection.
   */
  close() {
    try {
      if (this.ws) {
        this.ws.close();
        this.ws = void 0;
        console.log("WebSocket connection closed");
      }
    } catch (error) {
      console.error(
        "Error closing WebSocket:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
  /**
   * Checks if the WebSocket is currently connected.
   *
   * @returns {boolean} True if connected, false otherwise
   */
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
  /**
   * Gets the current connection state.
   *
   * @returns {number} The WebSocket ready state
   */
  getState() {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
};

// src/ari-client/ariClient.ts
var AriClient = class {
  /**
   * Creates a new instance of the ARI client.
   *
   * @param {AriClientConfig} config - Configuration options for the ARI client
   * @throws {Error} If required configuration parameters are missing
   */
  constructor(config) {
    this.config = config;
    if (!config.host || !config.port || !config.username || !config.password) {
      throw new Error("Missing required configuration parameters");
    }
    const httpProtocol = config.secure ? "https" : "http";
    const normalizedHost = config.host.replace(/^https?:\/\//, "");
    const baseUrl = `${httpProtocol}://${normalizedHost}:${config.port}/ari`;
    this.baseClient = new BaseClient(baseUrl, config.username, config.password);
    this.channels = new Channels(this.baseClient, this);
    this.playbacks = new Playbacks(this.baseClient, this);
    this.endpoints = new Endpoints(this.baseClient);
    this.applications = new Applications(this.baseClient);
    this.sounds = new Sounds(this.baseClient);
    this.asterisk = new Asterisk(this.baseClient);
    this.bridges = new Bridges(this.baseClient);
    console.log(`ARI Client initialized with base URL: ${baseUrl}`);
  }
  baseClient;
  webSocketClient;
  channels;
  endpoints;
  applications;
  playbacks;
  sounds;
  asterisk;
  bridges;
  /**
   * Initializes a WebSocket connection for receiving events.
   *
   * @param {string[]} apps - List of application names to subscribe to
   * @param {WebSocketEventType[]} [subscribedEvents] - Optional list of specific event types to subscribe to
   * @returns {Promise<void>} Resolves when connection is established
   * @throws {Error} If connection fails or if WebSocket is already connected
   */
  async connectWebSocket(apps, subscribedEvents) {
    if (!apps.length) {
      throw new Error("At least one application name is required");
    }
    if (this.webSocketClient) {
      console.warn("WebSocket is already connected");
      return;
    }
    try {
      this.webSocketClient = new WebSocketClient(
        this.baseClient,
        apps,
        subscribedEvents,
        this
      );
      await this.webSocketClient.connect();
      console.log("WebSocket connection established successfully");
    } catch (error) {
      console.error("Failed to establish WebSocket connection:", error);
      this.webSocketClient = void 0;
      throw error;
    }
  }
  /**
   * Registers an event listener for WebSocket events.
   *
   * @param {T} event - The event type to listen for
   * @param {Function} listener - Callback function for handling the event
   * @throws {Error} If WebSocket is not connected
   */
  on(event, listener) {
    if (!this.webSocketClient) {
      throw new Error("WebSocket is not connected");
    }
    this.webSocketClient.on(event, listener);
    console.log(`Event listener registered for ${event}`);
  }
  /**
   * Registers a one-time event listener for WebSocket events.
   *
   * @param {T} event - The event type to listen for
   * @param {Function} listener - Callback function for handling the event
   * @throws {Error} If WebSocket is not connected
   */
  once(event, listener) {
    if (!this.webSocketClient) {
      throw new Error("WebSocket is not connected");
    }
    this.webSocketClient.once(event, listener);
    console.log(`One-time event listener registered for ${event}`);
  }
  /**
   * Removes an event listener for WebSocket events.
   *
   * @param {T} event - The event type to remove listener for
   * @param {Function} listener - The listener function to remove
   */
  off(event, listener) {
    if (!this.webSocketClient) {
      console.warn("No WebSocket connection to remove listener from");
      return;
    }
    this.webSocketClient.off(event, listener);
    console.log(`Event listener removed for ${event}`);
  }
  /**
   * Closes the WebSocket connection if one exists.
   */
  closeWebSocket() {
    if (!this.webSocketClient) {
      console.warn("No WebSocket connection to close");
      return;
    }
    this.webSocketClient.close();
    this.webSocketClient = void 0;
    console.log("WebSocket connection closed");
  }
  /**
   * Creates or retrieves a Channel instance.
   *
   * @param {string} [channelId] - Optional ID of an existing channel
   * @returns {ChannelInstance} A new or existing channel instance
   */
  Channel(channelId) {
    return this.channels.Channel({ id: channelId });
  }
  /**
   * Creates or retrieves a Playback instance.
   *
   * @param {string} [playbackId] - Optional ID of an existing playback
   * @param {string} [_app] - Optional application name (deprecated)
   * @returns {PlaybackInstance} A new or existing playback instance
   */
  Playback(playbackId, _app) {
    return this.playbacks.Playback({ id: playbackId });
  }
  /**
   * Gets the current WebSocket connection status.
   *
   * @returns {boolean} True if WebSocket is connected, false otherwise
   */
  isWebSocketConnected() {
    return !!this.webSocketClient;
  }
};
export {
  Applications,
  AriClient,
  Asterisk,
  Bridges,
  ChannelInstance,
  Channels,
  Endpoints,
  PlaybackInstance,
  Playbacks,
  Sounds
};
//# sourceMappingURL=index.js.map

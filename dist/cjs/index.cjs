"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/exponential-backoff/dist/options.js
var require_options = __commonJS({
  "node_modules/exponential-backoff/dist/options.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
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
    Object.defineProperty(exports2, "__esModule", { value: true });
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
    exports2.getSanitizedOptions = getSanitizedOptions;
  }
});

// node_modules/exponential-backoff/dist/jitter/full/full.jitter.js
var require_full_jitter = __commonJS({
  "node_modules/exponential-backoff/dist/jitter/full/full.jitter.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function fullJitter(delay) {
      var jitteredDelay = Math.random() * delay;
      return Math.round(jitteredDelay);
    }
    exports2.fullJitter = fullJitter;
  }
});

// node_modules/exponential-backoff/dist/jitter/no/no.jitter.js
var require_no_jitter = __commonJS({
  "node_modules/exponential-backoff/dist/jitter/no/no.jitter.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function noJitter(delay) {
      return delay;
    }
    exports2.noJitter = noJitter;
  }
});

// node_modules/exponential-backoff/dist/jitter/jitter.factory.js
var require_jitter_factory = __commonJS({
  "node_modules/exponential-backoff/dist/jitter/jitter.factory.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
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
    exports2.JitterFactory = JitterFactory;
  }
});

// node_modules/exponential-backoff/dist/delay/delay.base.js
var require_delay_base = __commonJS({
  "node_modules/exponential-backoff/dist/delay/delay.base.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
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
    exports2.Delay = Delay;
  }
});

// node_modules/exponential-backoff/dist/delay/skip-first/skip-first.delay.js
var require_skip_first_delay = __commonJS({
  "node_modules/exponential-backoff/dist/delay/skip-first/skip-first.delay.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
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
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
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
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
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
    Object.defineProperty(exports2, "__esModule", { value: true });
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
    exports2.SkipFirstDelay = SkipFirstDelay;
  }
});

// node_modules/exponential-backoff/dist/delay/always/always.delay.js
var require_always_delay = __commonJS({
  "node_modules/exponential-backoff/dist/delay/always/always.delay.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
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
    Object.defineProperty(exports2, "__esModule", { value: true });
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
    exports2.AlwaysDelay = AlwaysDelay;
  }
});

// node_modules/exponential-backoff/dist/delay/delay.factory.js
var require_delay_factory = __commonJS({
  "node_modules/exponential-backoff/dist/delay/delay.factory.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var skip_first_delay_1 = require_skip_first_delay();
    var always_delay_1 = require_always_delay();
    function DelayFactory(options, attempt) {
      var delay = initDelayClass(options);
      delay.setAttemptNumber(attempt);
      return delay;
    }
    exports2.DelayFactory = DelayFactory;
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
  "node_modules/exponential-backoff/dist/backoff.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
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
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
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
    Object.defineProperty(exports2, "__esModule", { value: true });
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
    exports2.backOff = backOff2;
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Applications: () => Applications,
  AriClient: () => AriClient,
  Asterisk: () => Asterisk,
  Bridges: () => Bridges,
  ChannelInstance: () => ChannelInstance,
  Channels: () => Channels,
  Endpoints: () => Endpoints,
  PlaybackInstance: () => PlaybackInstance,
  Playbacks: () => Playbacks,
  Sounds: () => Sounds
});
module.exports = __toCommonJS(src_exports);

// src/ari-client/baseClient.ts
var import_axios = __toESM(require("axios"), 1);
var BaseClient = class {
  constructor(baseUrl, username, password, timeout = 5e3) {
    this.baseUrl = baseUrl;
    this.username = username;
    this.password = password;
    if (!/^https?:\/\/.+/.test(baseUrl)) {
      throw new Error(
        "Invalid base URL. It must start with http:// or https://"
      );
    }
    this.client = import_axios.default.create({
      baseURL: baseUrl,
      auth: { username, password },
      timeout
    });
    this.addInterceptors();
  }
  client;
  getBaseUrl() {
    return this.baseUrl;
  }
  /**
   * Retorna as credenciais configuradas.
   */
  getCredentials() {
    return {
      baseUrl: this.baseUrl,
      username: this.username,
      password: this.password
    };
  }
  /**
   * Adds interceptors to the Axios instance.
   */
  addInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        console.error("[Request Error]", error.message);
        return Promise.reject(error);
      }
    );
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message || "Unknown error";
        const errorDetails = {
          status,
          message,
          url: error.config?.url || "Unknown URL",
          method: error.config?.method?.toUpperCase() || "Unknown Method"
        };
        if (status === 404) {
          console.warn(`[404] Not Found: ${errorDetails.url}`);
        } else if (status >= 500) {
          console.error(`[500] Server Error: ${errorDetails.url}`);
        } else {
          console.warn(
            `[Response Error] ${errorDetails.method} ${errorDetails.url}: ${message}`
          );
        }
        return Promise.reject(
          new Error(
            `[Error] ${errorDetails.method} ${errorDetails.url} - ${message} (Status: ${status})`
          )
        );
      }
    );
  }
  /**
   * Executes a GET request.
   * @param path - The API endpoint path.
   * @param config - Optional Axios request configuration.
   */
  async get(path, config) {
    try {
      const response = await this.client.get(path, config);
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
    }
  }
  /**
   * Executes a POST request.
   * @param path - The API endpoint path.
   * @param data - Optional payload to send with the request.
   * @param config - Optional Axios request configuration.
   */
  async post(path, data, config) {
    try {
      const response = await this.client.post(path, data, config);
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
    }
  }
  /**
   * Executes a PUT request.
   * @param path - The API endpoint path.
   * @param data - Payload to send with the request.
   * @param config - Optional Axios request configuration.
   */
  async put(path, data, config) {
    try {
      const response = await this.client.put(path, data, config);
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
    }
  }
  /**
   * Executes a DELETE request.
   * @param path - The API endpoint path.
   * @param config - Optional Axios request configuration.
   */
  async delete(path, config) {
    try {
      const response = await this.client.delete(path, config);
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
    }
  }
  /**
   * Handles errors for HTTP requests.
   * @param error - The error to handle.
   */
  handleRequestError(error) {
    if (import_axios.default.isAxiosError(error)) {
      console.error(`[HTTP Error] ${error.message}`);
      throw new Error(error.message || "HTTP Error");
    } else {
      console.error(`[Unexpected Error] ${error}`);
      throw error;
    }
  }
  /**
   * Sets custom headers for the client instance.
   * Useful for adding dynamic tokens or specific API headers.
   * @param headers - Headers to merge with existing configuration.
   */
  setHeaders(headers) {
    this.client.defaults.headers.common = {
      ...this.client.defaults.headers.common,
      ...headers
    };
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
var import_events = require("events");

// node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm/rng.js
var import_crypto = require("crypto");
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    (0, import_crypto.randomFillSync)(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm/native.js
var import_crypto2 = require("crypto");
var native_default = { randomUUID: import_crypto2.randomUUID };

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
var ChannelInstance = class {
  // ID do canal
  constructor(client, baseClient, channelId = `channel-${Date.now()}`) {
    this.client = client;
    this.baseClient = baseClient;
    this.channelId = channelId;
    this.id = channelId || `channel-${Date.now()}`;
  }
  eventEmitter = new import_events.EventEmitter();
  channelData = null;
  id;
  /**
   * Registra um listener para eventos específicos deste canal.
   */
  on(event, listener) {
    const wrappedListener = (data) => {
      if ("channel" in data && data.channel?.id === this.id) {
        listener(data);
      }
    };
    this.eventEmitter.on(event, wrappedListener);
  }
  /**
   * Registra um listener único para eventos específicos deste canal.
   */
  once(event, listener) {
    const wrappedListener = (data) => {
      if ("channel" in data && data.channel?.id === this.id) {
        listener(data);
      }
    };
    this.eventEmitter.once(event, wrappedListener);
  }
  /**
   * Remove um listener para eventos específicos deste canal.
   */
  off(event, listener) {
    if (listener) {
      this.eventEmitter.off(event, listener);
    } else {
      const listeners = this.eventEmitter.listeners(event);
      listeners.forEach((fn) => {
        this.eventEmitter.off(event, fn);
      });
    }
  }
  /**
   * Obtém a quantidade de listeners registrados para o evento especificado.
   */
  getListenerCount(event) {
    return this.eventEmitter.listenerCount(event);
  }
  /**
   * Emite eventos internamente para o canal.
   * Verifica o ID do canal antes de emitir.
   */
  emitEvent(event) {
    if ("channel" in event && event.channel?.id === this.id) {
      this.eventEmitter.emit(event.type, event);
    }
  }
  /**
   * Remove todos os listeners para este canal.
   */
  removeAllListeners() {
    console.log(`Removendo todos os listeners para o canal ${this.id}`);
    this.eventEmitter.removeAllListeners();
  }
  async answer() {
    await this.baseClient.post(`/channels/${this.id}/answer`);
  }
  /**
   * Origina um canal físico no Asterisk.
   */
  async originate(data) {
    if (this.channelData) {
      throw new Error("O canal j\xE1 foi criado.");
    }
    const channel = await this.baseClient.post("/channels", data);
    this.channelData = channel;
    return channel;
  }
  /**
   * Obtém os detalhes do canal.
   */
  async getDetails() {
    if (this.channelData) {
      return this.channelData;
    }
    if (!this.id) {
      throw new Error("Nenhum ID de canal associado a esta inst\xE2ncia.");
    }
    const details = await this.baseClient.get(`/channels/${this.id}`);
    this.channelData = details;
    return details;
  }
  async getVariable(variable) {
    if (!variable) {
      throw new Error("The 'variable' parameter is required.");
    }
    return this.baseClient.get(
      `/channels/${this.id}/variable?variable=${encodeURIComponent(variable)}`
    );
  }
  /**
   * Encerra o canal, se ele já foi criado.
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
   * Reproduz mídia no canal.
   */
  async play(options, playbackId) {
    if (!this.channelData) {
      console.log("Canal n\xE3o inicializado, buscando detalhes...");
      this.channelData = await this.getDetails();
    }
    const playback = this.client.Playback(playbackId || v4_default());
    if (!this.channelData?.id) {
      throw new Error("N\xE3o foi poss\xEDvel inicializar o canal. ID inv\xE1lido.");
    }
    await this.baseClient.post(
      `/channels/${this.channelData.id}/play/${playback.id}`,
      options
    );
    return playback;
  }
  /**
   * Reproduz mídia em um canal.
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
   * Para a reprodução de mídia.
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
   * Pausa a reprodução de mídia.
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
   * Retoma a reprodução de mídia.
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
   * Retrocede a reprodução de mídia.
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
   * Avança a reprodução de mídia.
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
   * Muta o canal.
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
   * Desmuta o canal.
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
   * Coloca o canal em espera.
   */
  async holdChannel() {
    if (!this.channelData?.id) {
      throw new Error("Canal n\xE3o associado a esta inst\xE2ncia.");
    }
    await this.baseClient.post(`/channels/${this.channelData.id}/hold`);
  }
  /**
   * Remove o canal da espera.
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
  Channel({ id }) {
    if (!id) {
      const instance = new ChannelInstance(this.client, this.baseClient);
      this.channelInstances.set(instance.id, instance);
      return instance;
    }
    if (!this.channelInstances.has(id)) {
      const instance = new ChannelInstance(this.client, this.baseClient, id);
      this.channelInstances.set(id, instance);
      return instance;
    }
    return this.channelInstances.get(id);
  }
  /**
   * Remove uma instância de canal.
   */
  removeChannelInstance(channelId) {
    if (this.channelInstances.has(channelId)) {
      const instance = this.channelInstances.get(channelId);
      instance?.removeAllListeners();
      this.channelInstances.delete(channelId);
      console.log(`Inst\xE2ncia do canal ${channelId} removida.`);
    } else {
      console.warn(
        `Tentativa de remover uma inst\xE2ncia inexistente: ${channelId}`
      );
    }
  }
  /**
   * Propaga eventos do WebSocket para o canal correspondente.
   */
  propagateEventToChannel(event) {
    if ("channel" in event && event.channel?.id) {
      const instance = this.channelInstances.get(event.channel.id);
      if (instance) {
        instance.emitEvent(event);
      } else {
        console.warn(
          `Nenhuma inst\xE2ncia encontrada para o canal ${event.channel.id}`
        );
      }
    }
  }
  /**
   * Origina um canal físico diretamente, sem uma instância de `ChannelInstance`.
   */
  async originate(data) {
    return this.baseClient.post("/channels", data);
  }
  /**
   * Obtém detalhes de um canal específico.
   */
  async getDetails(channelId) {
    return this.baseClient.get(`/channels/${channelId}`);
  }
  /**
   * Lista todos os canais ativos.
   */
  async list() {
    const channels = await this.baseClient.get("/channels");
    if (!Array.isArray(channels)) {
      throw new Error("Resposta da API /channels n\xE3o \xE9 um array.");
    }
    return channels;
  }
  /**
   * Encerra um canal específico.
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
   * Inicia a escuta em um canal.
   */
  async snoopChannel(channelId, options) {
    const queryParams = toQueryParams2(options);
    return this.baseClient.post(
      `/channels/${channelId}/snoop?${queryParams}`
    );
  }
  async startSilence(channelId) {
    return this.baseClient.post(`/channels/${channelId}/silence`);
  }
  async stopSilence(channelId) {
    return this.baseClient.delete(`/channels/${channelId}/silence`);
  }
  async getRTPStatistics(channelId) {
    return this.baseClient.get(
      `/channels/${channelId}/rtp_statistics`
    );
  }
  async createExternalMedia(options) {
    const queryParams = toQueryParams2(options);
    return this.baseClient.post(
      `/channels/externalMedia?${queryParams}`
    );
  }
  async playWithId(channelId, playbackId, media, options) {
    const queryParams = options ? `?${toQueryParams2(options)}` : "";
    return this.baseClient.post(
      `/channels/${channelId}/play/${playbackId}${queryParams}`,
      { media }
    );
  }
  async snoopChannelWithId(channelId, snoopId, options) {
    const queryParams = toQueryParams2(options);
    return this.baseClient.post(
      `/channels/${channelId}/snoop/${snoopId}?${queryParams}`
    );
  }
  async startMohWithClass(channelId, mohClass) {
    const queryParams = `mohClass=${encodeURIComponent(mohClass)}`;
    await this.baseClient.post(
      `/channels/${channelId}/moh?${queryParams}`
    );
  }
  async getChannelVariable(channelId, variable) {
    if (!variable) {
      throw new Error("The 'variable' parameter is required.");
    }
    return this.baseClient.get(
      `/channels/${channelId}/variable?variable=${encodeURIComponent(variable)}`
    );
  }
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
  async moveToApplication(channelId, app, appArgs) {
    await this.baseClient.post(`/channels/${channelId}/move`, {
      app,
      appArgs
    });
  }
  async continueDialplan(channelId, context, extension, priority, label) {
    await this.baseClient.post(`/channels/${channelId}/continue`, {
      context,
      extension,
      priority,
      label
    });
  }
  async stopMusicOnHold(channelId) {
    await this.baseClient.delete(`/channels/${channelId}/moh`);
  }
  async startMusicOnHold(channelId) {
    await this.baseClient.post(`/channels/${channelId}/moh`);
  }
  async record(channelId, options) {
    const queryParams = toQueryParams2(options);
    return this.baseClient.post(
      `/channels/${channelId}/record?${queryParams}`
    );
  }
  async dial(channelId, caller, timeout) {
    const queryParams = new URLSearchParams({
      ...caller && { caller },
      ...timeout && { timeout: timeout.toString() }
    });
    await this.baseClient.post(
      `/channels/${channelId}/dial?${queryParams}`
    );
  }
  async redirectChannel(channelId, endpoint) {
    await this.baseClient.post(
      `/channels/${channelId}/redirect?endpoint=${encodeURIComponent(endpoint)}`
    );
  }
  async answerChannel(channelId) {
    await this.baseClient.post(`/channels/${channelId}/answer`);
  }
  async ringChannel(channelId) {
    await this.baseClient.post(`/channels/${channelId}/ring`);
  }
  async stopRingChannel(channelId) {
    await this.baseClient.delete(`/channels/${channelId}/ring`);
  }
  async sendDTMF(channelId, dtmf, options) {
    const queryParams = toQueryParams2({ dtmf, ...options });
    await this.baseClient.post(
      `/channels/${channelId}/dtmf?${queryParams}`
    );
  }
  async muteChannel(channelId, direction = "both") {
    await this.baseClient.post(
      `/channels/${channelId}/mute?direction=${direction}`
    );
  }
  async unmuteChannel(channelId, direction = "both") {
    await this.baseClient.delete(
      `/channels/${channelId}/mute?direction=${direction}`
    );
  }
  async holdChannel(channelId) {
    await this.baseClient.post(`/channels/${channelId}/hold`);
  }
  async unholdChannel(channelId) {
    await this.baseClient.delete(`/channels/${channelId}/hold`);
  }
  async createChannel(data) {
    return this.baseClient.post("/channels/create", data);
  }
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
var import_events2 = require("events");
var PlaybackInstance = class {
  constructor(client, baseClient, playbackId = `playback-${Date.now()}`) {
    this.client = client;
    this.baseClient = baseClient;
    this.playbackId = playbackId;
    this.id = playbackId;
  }
  eventEmitter = new import_events2.EventEmitter();
  playbackData = null;
  id;
  /**
   * Registra um listener para eventos específicos deste playback.
   */
  on(event, listener) {
    const wrappedListener = (data) => {
      if ("playback" in data && data.playback?.id === this.id) {
        listener(data);
      }
    };
    this.eventEmitter.on(event, wrappedListener);
  }
  /**
   * Registra um listener único para eventos específicos deste playback.
   */
  once(event, listener) {
    const wrappedListener = (data) => {
      if ("playback" in data && data.playback?.id === this.id) {
        listener(data);
      }
    };
    this.eventEmitter.once(event, wrappedListener);
  }
  /**
   * Remove um listener para eventos específicos deste playback.
   */
  off(event, listener) {
    if (listener) {
      this.eventEmitter.off(event, listener);
    } else {
      this.eventEmitter.removeAllListeners(event);
    }
  }
  /**
   * Emite eventos internamente para o playback.
   */
  emitEvent(event) {
    if ("playback" in event && event.playback?.id === this.id) {
      this.eventEmitter.emit(event.type, event);
    }
  }
  /**
   * Obtém os detalhes do playback.
   */
  async get() {
    if (!this.id) {
      throw new Error("Nenhum playback associado a esta inst\xE2ncia.");
    }
    this.playbackData = await this.baseClient.get(
      `/playbacks/${this.id}`
    );
    return this.playbackData;
  }
  /**
   * Controla o playback.
   */
  async control(operation) {
    if (!this.id) {
      throw new Error("Nenhum playback associado para controlar.");
    }
    await this.baseClient.post(
      `/playbacks/${this.id}/control?operation=${operation}`
    );
  }
  /**
   * Encerra o playback.
   */
  async stop() {
    if (!this.id) {
      throw new Error("Nenhum playback associado para encerrar.");
    }
    await this.baseClient.delete(`/playbacks/${this.id}`);
  }
  /**
   * Remove todos os listeners para este playback.
   */
  removeAllListeners() {
    this.eventEmitter.removeAllListeners();
  }
};
var Playbacks = class {
  constructor(baseClient, client) {
    this.baseClient = baseClient;
    this.client = client;
  }
  playbackInstances = /* @__PURE__ */ new Map();
  /**
   * Gerencia instâncias de playback.
   */
  Playback({ id }) {
    if (!id) {
      const instance = new PlaybackInstance(this.client, this.baseClient);
      this.playbackInstances.set(instance.id, instance);
      return instance;
    }
    if (!this.playbackInstances.has(id)) {
      const instance = new PlaybackInstance(this.client, this.baseClient, id);
      this.playbackInstances.set(id, instance);
      return instance;
    }
    return this.playbackInstances.get(id);
  }
  /**
   * Remove uma instância de playback.
   */
  removePlaybackInstance(playbackId) {
    if (this.playbackInstances.has(playbackId)) {
      const instance = this.playbackInstances.get(playbackId);
      instance?.removeAllListeners();
      this.playbackInstances.delete(playbackId);
    }
  }
  /**
   * Propaga eventos do WebSocket para o playback correspondente.
   */
  propagateEventToPlayback(event) {
    if ("playback" in event && event.playback?.id) {
      const instance = this.playbackInstances.get(event.playback.id);
      if (instance) {
        instance.emitEvent(event);
      }
    }
  }
  /**
   * Obtém detalhes de um playback específico.
   */
  async getDetails(playbackId) {
    return this.baseClient.get(`/playbacks/${playbackId}`);
  }
  /**
   * Controla um playback específico.
   */
  async control(playbackId, operation) {
    const playback = this.Playback({ id: playbackId });
    await playback.control(operation);
  }
  /**
   * Encerra um playback específico.
   */
  async stop(playbackId) {
    const playback = this.Playback({ id: playbackId });
    await playback.stop();
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
var import_events3 = require("events");
var import_exponential_backoff = __toESM(require_backoff(), 1);
var import_ws = __toESM(require("ws"), 1);
var WebSocketClient = class extends import_events3.EventEmitter {
  constructor(baseClient, apps, subscribedEvents, ariClient) {
    super();
    this.baseClient = baseClient;
    this.apps = apps;
    this.subscribedEvents = subscribedEvents;
    this.ariClient = ariClient;
  }
  ws;
  isReconnecting = false;
  maxReconnectAttempts = 10;
  backOffOptions = {
    numOfAttempts: 10,
    // Máximo de tentativas de reconexão
    startingDelay: 500,
    // Início com 500ms de atraso
    maxDelay: 1e4,
    // Limite máximo de atraso de 10s
    timeMultiple: 2,
    // Atraso aumenta exponencialmente
    jitter: "full",
    // Randomização para evitar colisões
    delayFirstAttempt: false,
    // Não atrase a primeira tentativa
    retry: (error, attemptNumber) => {
      console.warn(
        `Tentativa #${attemptNumber} falhou:`,
        error.message || error
      );
      return true;
    }
  };
  /**
   * Conecta ao WebSocket.
   */
  async connect() {
    const { baseUrl, username, password } = this.baseClient.getCredentials();
    const protocol = baseUrl.startsWith("https") ? "wss" : "ws";
    const normalizedHost = baseUrl.replace(/^https?:\/\//, "").replace(/\/ari$/, "");
    const queryParams = new URLSearchParams();
    queryParams.append("app", this.apps.join(","));
    if (this.subscribedEvents && this.subscribedEvents.length > 0) {
      this.subscribedEvents.forEach(
        (event) => queryParams.append("event", event)
      );
    } else {
      queryParams.append("subscribeAll", "true");
    }
    const wsUrl = `${protocol}://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${normalizedHost}/ari/events?${queryParams.toString()}`;
    console.log("Conectando ao WebSocket em:", wsUrl);
    return this.initializeWebSocket(wsUrl);
  }
  /**
   * Inicializa a conexão WebSocket com lógica de reconexão.
   */
  async initializeWebSocket(wsUrl) {
    return (0, import_exponential_backoff.backOff)(async () => {
      return new Promise((resolve, reject) => {
        this.ws = new import_ws.default(wsUrl);
        this.ws.on("open", () => {
          console.log("WebSocket conectado com sucesso.");
          this.isReconnecting = false;
          this.emit("connected");
          resolve();
        });
        this.ws.on("message", (data) => this.handleMessage(data.toString()));
        this.ws.on("close", (code) => {
          console.warn(
            `WebSocket desconectado com c\xF3digo ${code}. Tentando reconectar...`
          );
          if (!this.isReconnecting) {
            this.reconnect(wsUrl);
          }
        });
        this.ws.on("error", (err) => {
          console.error("Erro no WebSocket:", err.message);
          if (!this.isReconnecting) {
            this.reconnect(wsUrl);
          }
          reject(err);
        });
      });
    }, this.backOffOptions);
  }
  /**
   * Processa as mensagens recebidas do WebSocket.
   */
  handleMessage(rawMessage) {
    try {
      const event = JSON.parse(rawMessage);
      if (this.subscribedEvents && !this.subscribedEvents.includes(event.type)) {
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
    } catch (err) {
      console.error("Erro ao processar mensagem WebSocket:", err);
      this.emit("error", new Error("Falha ao decodificar mensagem WebSocket."));
    }
  }
  /**
   * Tenta reconectar ao WebSocket.
   */
  reconnect(wsUrl) {
    this.isReconnecting = true;
    console.log("Iniciando tentativa de reconex\xE3o...");
    this.removeAllListeners();
    (0, import_exponential_backoff.backOff)(() => this.initializeWebSocket(wsUrl), this.backOffOptions).catch(
      (err) => {
        console.error(
          "Falha ao reconectar ap\xF3s v\xE1rias tentativas:",
          err.message || err
        );
      }
    );
  }
  /**
   * Fecha o WebSocket manualmente.
   */
  close() {
    this.ws?.close();
    this.ws = void 0;
  }
};

// src/ari-client/ariClient.ts
var AriClient = class {
  constructor(config) {
    this.config = config;
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
   * Inicializa uma conexão WebSocket.
   */
  async connectWebSocket(apps, subscribedEvents) {
    if (this.webSocketClient) {
      console.warn("WebSocket j\xE1 est\xE1 conectado.");
      return;
    }
    this.webSocketClient = new WebSocketClient(
      this.baseClient,
      apps,
      subscribedEvents,
      this
    );
    await this.webSocketClient.connect();
  }
  /**
   * Adiciona um listener para eventos do WebSocket.
   */
  on(event, listener) {
    this.webSocketClient?.on(event, listener);
  }
  /**
   * Adiciona um listener único para eventos do WebSocket.
   */
  once(event, listener) {
    this.webSocketClient?.once(event, listener);
  }
  /**
   * Remove um listener para eventos do WebSocket.
   */
  off(event, listener) {
    this.webSocketClient?.off(event, listener);
  }
  /**
   * Fecha a conexão WebSocket.
   */
  closeWebSocket() {
    this.webSocketClient?.close();
    this.webSocketClient = void 0;
  }
  /**
   * Inicializa uma nova instância de `ChannelInstance` para manipular canais localmente.
   */
  Channel(channelId) {
    return this.channels.Channel({ id: channelId });
  }
  /**
   * Inicializa uma nova instância de `PlaybackInstance` para manipular playbacks.
   */
  Playback(playbackId, _app) {
    return this.playbacks.Playback({ id: playbackId });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.cjs.map

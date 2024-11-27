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

// src/ari-client/ariClient.ts
var import_exponential_backoff = __toESM(require_backoff(), 1);

// src/ari-client/baseClient.ts
import axios from "axios";
var BaseClient = class {
  client;
  constructor(baseUrl, username, password) {
    this.client = axios.create({
      baseURL: baseUrl,
      auth: { username, password }
    });
  }
  /**
   * Executes a GET request.
   * @param path - The API endpoint path.
   */
  async get(path) {
    const response = await this.client.get(path);
    return response.data;
  }
  /**
   * Executes a POST request.
   * @param path - The API endpoint path.
   * @param data - Optional payload to send with the request.
   */
  async post(path, data) {
    const response = await this.client.post(path, data);
    return response.data;
  }
  /**
   * Executes a PUT request.
   * @param path - The API endpoint path.
   * @param data - Payload to send with the request.
   */
  async put(path, data) {
    const response = await this.client.put(path, data);
    return response.data;
  }
  /**
   * Executes a DELETE request.
   * @param path - The API endpoint path.
   */
  async delete(path) {
    const response = await this.client.delete(path);
    return response.data;
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
   * @returns A promise that resolves to an array of Application objects representing all registered applications.
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
   * @param appName - The unique name of the application.
   * @returns A promise that resolves to an ApplicationDetails object containing the details of the specified application.
   */
  async getDetails(appName) {
    return this.client.get(`/applications/${appName}`);
  }
  /**
   * Sends a message to a specific application.
   *
   * @param appName - The unique name of the application.
   * @param body - The message body to send.
   * @returns A promise that resolves when the message is sent successfully.
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
  async getInfo() {
    return this.client.get("/asterisk/info");
  }
  /**
   * Lists all loaded modules in the Asterisk server.
   */
  async listModules() {
    return this.client.get("/asterisk/modules");
  }
  /**
   * Manages a specific module in the Asterisk server.
   */
  async manageModule(moduleName, action) {
    return this.client.post(
      `/asterisk/modules/${moduleName}?action=${encodeURIComponent(action)}`
    );
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

// src/ari-client/resources/channels.ts
function toQueryParams2(options) {
  return new URLSearchParams(
    Object.entries(options).filter(([, value]) => value !== void 0).map(([key, value]) => [key, value])
    // Garante que value é string
  ).toString();
}
var Channels = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Lists all active channels.
   */
  async list() {
    const channels = await this.client.get("/channels");
    if (!Array.isArray(channels)) {
      throw new Error("Resposta da API /channels n\xE3o \xE9 um array.");
    }
    return channels;
  }
  /**
   * Creates a new channel.
   */
  async originate(data) {
    return this.client.post("/channels", data);
  }
  /**
   * Retrieves details of a specific channel.
   */
  async getDetails(channelId) {
    return this.client.get(`/channels/${channelId}`);
  }
  /**
   * Creates a channel and places it in a Stasis app without dialing it.
   */
  async createChannel(data) {
    return this.client.post("/channels/create", data);
  }
  /**
   * Creates a new channel with a specific ID and originates a call.
   */
  async originateWithId(channelId, data) {
    return this.client.post(`/channels/${channelId}`, data);
  }
  /**
   * Hangs up (terminates) a specific channel.
   */
  /**
   * Hangs up a specific channel with optional reason or reason code.
   */
  async hangup(channelId, options) {
    const queryParams = new URLSearchParams({
      ...options?.reason_code && { reason_code: options.reason_code },
      ...options?.reason && { reason: options.reason }
    });
    return this.client.delete(
      `/channels/${channelId}?${queryParams.toString()}`
    );
  }
  /**
   * Continues the dialplan for a specific channel.
   */
  async continueDialplan(channelId, context, extension, priority, label) {
    return this.client.post(`/channels/${channelId}/continue`, {
      context,
      extension,
      priority,
      label
    });
  }
  /**
   * Moves the channel to another Stasis application.
   */
  async moveToApplication(channelId, app, appArgs) {
    return this.client.post(`/channels/${channelId}/move`, {
      app,
      appArgs
    });
  }
  /**
   * Sets a channel variable.
   */
  async setVariable(channelId, variable, value) {
    return this.client.post(`/channels/${channelId}/variable`, {
      variable,
      value
    });
  }
  /**
   * Gets a channel variable.
   */
  async getVariable(channelId, variable) {
    return this.client.get(
      `/channels/${channelId}/variable?variable=${encodeURIComponent(variable)}`
    );
  }
  /**
   * Plays a media file to a channel.
   */
  async playMedia(channelId, media, options) {
    const queryParams = options ? `?${new URLSearchParams(options).toString()}` : "";
    return this.client.post(
      `/channels/${channelId}/play${queryParams}`,
      { media }
    );
  }
  /**
   * Starts music on hold (MOH) for a channel.
   */
  async startMusicOnHold(channelId) {
    return this.client.post(`/channels/${channelId}/moh`);
  }
  /**
   * Stops music on hold (MOH) for a channel.
   */
  async stopMusicOnHold(channelId) {
    return this.client.delete(`/channels/${channelId}/moh`);
  }
  /**
   * Starts playback of a media file on a channel.
   */
  async startPlayback(channelId, media, options) {
    const queryParams = options ? `?${new URLSearchParams(options).toString()}` : "";
    return this.client.post(
      `/channels/${channelId}/play${queryParams}`,
      { media }
    );
  }
  /**
   * Stops playback of a media file on a channel.
   */
  async stopPlayback(channelId, playbackId) {
    return this.client.delete(
      `/channels/${channelId}/play/${playbackId}`
    );
  }
  /**
   * Pauses playback of a media file on a channel.
   */
  async pausePlayback(channelId, playbackId) {
    return this.client.post(
      `/channels/${channelId}/play/${playbackId}/pause`
    );
  }
  /**
   * Resumes playback of a media file on a channel.
   */
  async resumePlayback(channelId, playbackId) {
    return this.client.delete(
      `/channels/${channelId}/play/${playbackId}/pause`
    );
  }
  /**
   * Rewinds playback of a media file on a channel.
   */
  async rewindPlayback(channelId, playbackId, skipMs) {
    return this.client.post(
      `/channels/${channelId}/play/${playbackId}/rewind`,
      { skipMs }
    );
  }
  /**
   * Fast-forwards playback of a media file on a channel.
   */
  async fastForwardPlayback(channelId, playbackId, skipMs) {
    return this.client.post(
      `/channels/${channelId}/play/${playbackId}/forward`,
      { skipMs }
    );
  }
  /**
   * Records audio from a channel.
   */
  async record(channelId, options) {
    const queryParams = new URLSearchParams(
      Object.entries(options).filter(
        ([, value]) => value !== void 0
      )
    );
    return this.client.post(
      `/channels/${channelId}/record?${queryParams.toString()}`
    );
  }
  /**
   * Starts snooping on a channel.
   */
  async snoopChannel(channelId, options) {
    const queryParams = toQueryParams2(options);
    return this.client.post(
      `/channels/${channelId}/snoop?${queryParams}`
    );
  }
  /**
   * Starts snooping on a channel with a specific snoop ID.
   */
  async snoopChannelWithId(channelId, snoopId, options) {
    const queryParams = new URLSearchParams(options);
    return this.client.post(
      `/channels/${channelId}/snoop/${snoopId}?${queryParams.toString()}`
    );
  }
  /**
   * Dials a created channel.
   */
  async dial(channelId, caller, timeout) {
    const queryParams = new URLSearchParams({
      ...caller && { caller },
      ...timeout && { timeout: timeout.toString() }
    });
    return this.client.post(
      `/channels/${channelId}/dial?${queryParams.toString()}`
    );
  }
  /**
   * Retrieves RTP statistics for a channel.
   */
  async getRTPStatistics(channelId) {
    return this.client.get(`/channels/${channelId}/rtp_statistics`);
  }
  /**
   * Creates a channel to an external media source/sink.
   */
  async createExternalMedia(options) {
    const queryParams = new URLSearchParams(options);
    return this.client.post(
      `/channels/externalMedia?${queryParams.toString()}`
    );
  }
  /**
   * Redirects the channel to a different location.
   */
  async redirectChannel(channelId, endpoint) {
    return this.client.post(
      `/channels/${channelId}/redirect?endpoint=${encodeURIComponent(endpoint)}`
    );
  }
  /**
   * Answers a channel.
   */
  async answerChannel(channelId) {
    return this.client.post(`/channels/${channelId}/answer`);
  }
  /**
   * Sends a ringing indication to a channel.
   */
  async ringChannel(channelId) {
    return this.client.post(`/channels/${channelId}/ring`);
  }
  /**
   * Stops ringing indication on a channel.
   */
  async stopRingChannel(channelId) {
    return this.client.delete(`/channels/${channelId}/ring`);
  }
  /**
   * Sends DTMF to a channel.
   */
  async sendDTMF(channelId, dtmf, options) {
    const queryParams = new URLSearchParams({
      dtmf,
      ...options?.before && { before: options.before.toString() },
      ...options?.between && { between: options.between.toString() },
      ...options?.duration && { duration: options.duration.toString() },
      ...options?.after && { after: options.after.toString() }
    });
    return this.client.post(
      `/channels/${channelId}/dtmf?${queryParams.toString()}`
    );
  }
  /**
   * Mutes a channel.
   */
  async muteChannel(channelId, direction = "both") {
    return this.client.post(
      `/channels/${channelId}/mute?direction=${direction}`
    );
  }
  /**
   * Unmutes a channel.
   */
  async unmuteChannel(channelId, direction = "both") {
    return this.client.delete(
      `/channels/${channelId}/mute?direction=${direction}`
    );
  }
  /**
   * Puts a channel on hold.
   */
  async holdChannel(channelId) {
    return this.client.post(`/channels/${channelId}/hold`);
  }
  /**
   * Removes a channel from hold.
   */
  async unholdChannel(channelId) {
    return this.client.delete(`/channels/${channelId}/hold`);
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
var Playbacks = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Retrieves details of a specific playback.
   *
   * @param playbackId - The unique identifier of the playback.
   * @returns A promise that resolves to a Playback object containing the details of the specified playback.
   */
  async getDetails(playbackId) {
    return this.client.get(`/playbacks/${playbackId}`);
  }
  /**
   * Controls a specific playback (e.g., pause, resume, rewind, forward, stop).
   *
   * @param playbackId - The unique identifier of the playback to control.
   * @param controlRequest - The PlaybackControlRequest containing the control operation.
   * @returns A promise that resolves when the control operation is successfully executed.
   */
  async control(playbackId, controlRequest) {
    await this.client.post(
      `/playbacks/${playbackId}/control`,
      controlRequest
    );
  }
  /**
   * Stops a specific playback.
   *
   * @param playbackId - The unique identifier of the playback to stop.
   * @returns A promise that resolves when the playback is successfully stopped.
   */
  async stop(playbackId) {
    await this.client.post(`/playbacks/${playbackId}/stop`);
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
import WebSocket from "ws";
var WebSocketClient = class {
  // Para evitar reconexões paralelas
  constructor(url) {
    this.url = url;
  }
  ws = null;
  isClosedManually = false;
  // Para evitar reconexões automáticas quando fechado manualmente
  isReconnecting = false;
  async connect() {
    if (this.isReconnecting) return;
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.on("open", () => {
        console.log("WebSocket conectado.");
        this.isClosedManually = false;
        this.isReconnecting = false;
        resolve();
      });
      this.ws.on("error", (err) => {
        console.error("Erro na conex\xE3o WebSocket:", err);
        reject(err);
      });
      this.ws.on("close", (code, reason) => {
        console.warn(`WebSocket desconectado: ${code} - ${reason}`);
        this.isReconnecting = false;
      });
    });
  }
  async reconnect() {
    if (this.isClosedManually || this.isReconnecting) return;
    console.log("Tentando reconectar ao WebSocket...");
    this.isReconnecting = true;
    try {
      await this.connect();
      console.log("Reconex\xE3o bem-sucedida.");
    } catch (err) {
      console.error("Erro ao tentar reconectar:", err);
    } finally {
      this.isReconnecting = false;
    }
  }
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
  on(event, callback) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket n\xE3o est\xE1 conectado.");
    }
    if (event === "message") {
      this.ws.on(event, (data) => {
        try {
          const decodedData = JSON.parse(data.toString());
          callback(decodedData);
        } catch (err) {
          console.error("Erro ao decodificar mensagem do WebSocket:", err);
          callback(data);
        }
      });
    } else {
      this.ws.on(event, callback);
    }
  }
  send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket n\xE3o est\xE1 conectado.");
    }
    this.ws.send(data, (err) => {
      if (err) {
        console.error("Erro ao enviar dados pelo WebSocket:", err);
      }
    });
  }
  close() {
    if (this.ws) {
      this.isClosedManually = true;
      this.ws.close();
      console.log("WebSocket fechado manualmente.");
    }
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
    this.channels = new Channels(this.baseClient);
    this.endpoints = new Endpoints(this.baseClient);
    this.applications = new Applications(this.baseClient);
    this.playbacks = new Playbacks(this.baseClient);
    this.sounds = new Sounds(this.baseClient);
    this.asterisk = new Asterisk(this.baseClient);
  }
  wsClient = null;
  baseClient;
  isReconnecting = false;
  channels;
  endpoints;
  applications;
  playbacks;
  sounds;
  asterisk;
  /**
   * Connects to the ARI WebSocket for a specific application.
   *
   * @param app - The application name to connect to.
   * @returns {Promise<void>} Resolves when the WebSocket connects successfully.
   */
  async connectWebSocket(app) {
    if (!app) {
      throw new Error(
        "The 'app' parameter is required to connect to the WebSocket."
      );
    }
    if (this.isReconnecting) {
      console.warn("Already attempting to reconnect. Skipping this attempt.");
      return;
    }
    this.isReconnecting = true;
    const protocol = this.config.secure ? "wss" : "ws";
    const wsUrl = `${protocol}://${encodeURIComponent(this.config.username)}:${encodeURIComponent(this.config.password)}@${this.config.host}:${this.config.port}/ari/events?app=${app}`;
    const backoffOptions = {
      delayFirstAttempt: false,
      startingDelay: 1e3,
      timeMultiple: 2,
      maxDelay: 3e4,
      numOfAttempts: 10,
      jitter: "full",
      retry: (error, attemptNumber) => {
        console.warn(`Tentativa ${attemptNumber} falhou: ${error.message}`);
        return !this.wsClient?.isConnected();
      }
    };
    this.wsClient = new WebSocketClient(wsUrl);
    try {
      await (0, import_exponential_backoff.backOff)(async () => {
        if (!this.wsClient) {
          throw new Error("WebSocketClient instance is null.");
        }
        await this.wsClient.connect();
        console.log(`WebSocket conectado para o app: ${app}`);
        await this.ensureAppRegistered(app);
      }, backoffOptions);
    } catch (err) {
      console.error(
        "N\xE3o foi poss\xEDvel conectar ao WebSocket ap\xF3s m\xFAltiplas tentativas:",
        err
      );
      throw err;
    } finally {
      this.isReconnecting = false;
    }
  }
  /**
   * Ensures the ARI application is registered.
   *
   * @param app - The application name to ensure is registered.
   * @returns {Promise<void>}
   */
  async ensureAppRegistered(app) {
    try {
      const apps = await this.baseClient.get("/applications");
      const appExists = apps.some((a) => a.name === app);
      if (!appExists) {
        console.log(`Registrando o aplicativo ARI: ${app}`);
        await this.baseClient.post("/applications", { app });
        console.log(`Aplicativo ${app} registrado com sucesso.`);
      } else {
        console.log(`Aplicativo ${app} j\xE1 est\xE1 registrado.`);
      }
    } catch (error) {
      console.error(`Erro ao garantir o registro do aplicativo ${app}:`, error);
      throw error;
    }
  }
  /**
   * Checks if the WebSocket connection is active.
   *
   * @returns {boolean} True if connected, false otherwise.
   */
  isWebSocketConnected() {
    return this.wsClient ? this.wsClient.isConnected() : false;
  }
  /**
   * Registers a callback for a specific WebSocket event.
   *
   * @param event - The WebSocket event to listen for.
   * @param callback - The callback function to execute when the event occurs.
   */
  onWebSocketEvent(event, callback) {
    if (!this.wsClient) {
      throw new Error("WebSocket is not connected.");
    }
    this.wsClient.on(event, callback);
  }
  /**
   * Closes the WebSocket connection.
   */
  closeWebSocket() {
    if (this.wsClient) {
      this.wsClient.close();
      this.wsClient = null;
    }
  }
  /**
   * Retrieves a list of active channels from the Asterisk ARI.
   *
   * @returns {Promise<Channel[]>} A promise resolving to the list of active channels.
   */
  /**
   * Lists all active channels.
   */
  async listChannels() {
    return this.channels.list();
  }
  /**
   * Creates a new channel.
   */
  async originateChannel(data) {
    return this.channels.originate(data);
  }
  /**
   * Retrieves details of a specific channel.
   */
  async getChannelDetails(channelId) {
    return this.channels.getDetails(channelId);
  }
  /**
   * Hangs up a specific channel.
   */
  async hangupChannel(channelId) {
    return this.channels.hangup(channelId);
  }
  /**
   * Continues the dialplan for a specific channel.
   */
  async continueChannelDialplan(channelId, context, extension, priority, label) {
    return this.channels.continueDialplan(
      channelId,
      context,
      extension,
      priority,
      label
    );
  }
  /**
   * Moves a channel to another Stasis application.
   */
  async moveChannelToApplication(channelId, app, appArgs) {
    return this.channels.moveToApplication(channelId, app, appArgs);
  }
  /**
   * Sets a channel variable.
   */
  async setChannelVariable(channelId, variable, value) {
    return this.channels.setVariable(channelId, variable, value);
  }
  /**
   * Gets a channel variable.
   */
  async getChannelVariable(channelId, variable) {
    return this.channels.getVariable(channelId, variable);
  }
  /**
   * Plays a media file to a channel.
   */
  async playMediaToChannel(channelId, media, options) {
    return this.channels.playMedia(channelId, media, options);
  }
  /**
   * Starts music on hold for a channel.
   */
  async startChannelMusicOnHold(channelId) {
    return this.channels.startMusicOnHold(channelId);
  }
  /**
   * Stops music on hold for a channel.
   */
  async stopChannelMusicOnHold(channelId) {
    return this.channels.stopMusicOnHold(channelId);
  }
  /**
   * Starts playback of a media file on a channel.
   */
  async startChannelPlayback(channelId, media, options) {
    return this.channels.startPlayback(channelId, media, options);
  }
  /**
   * Stops playback of a media file on a channel.
   */
  async stopChannelPlayback(channelId, playbackId) {
    return this.channels.stopPlayback(channelId, playbackId);
  }
  /**
   * Pauses playback of a media file on a channel.
   */
  async pauseChannelPlayback(channelId, playbackId) {
    return this.channels.pausePlayback(channelId, playbackId);
  }
  /**
   * Resumes playback of a media file on a channel.
   */
  async resumeChannelPlayback(channelId, playbackId) {
    return this.channels.resumePlayback(channelId, playbackId);
  }
  /**
   * Rewinds playback of a media file on a channel.
   */
  async rewindChannelPlayback(channelId, playbackId, skipMs) {
    return this.channels.rewindPlayback(channelId, playbackId, skipMs);
  }
  /**
   * Fast-forwards playback of a media file on a channel.
   */
  async fastForwardChannelPlayback(channelId, playbackId, skipMs) {
    return this.channels.fastForwardPlayback(channelId, playbackId, skipMs);
  }
  /**
   * Records audio from a channel.
   */
  async recordAudio(channelId, options) {
    return this.channels.record(channelId, options);
  }
  /**
   * Starts snooping on a channel.
   */
  async snoopChannel(channelId, options) {
    return this.channels.snoopChannel(channelId, options);
  }
  /**
   * Starts snooping on a channel with a specific snoop ID.
   */
  async snoopChannelWithId(channelId, snoopId, options) {
    return this.channels.snoopChannelWithId(channelId, snoopId, options);
  }
  /**
   * Dials a created channel.
   */
  async dialChannel(channelId, caller, timeout) {
    return this.channels.dial(channelId, caller, timeout);
  }
  /**
   * Retrieves RTP statistics for a channel.
   */
  async getRTPStatistics(channelId) {
    return this.channels.getRTPStatistics(channelId);
  }
  /**
   * Creates a channel to an external media source/sink.
   */
  async createExternalMedia(options) {
    return this.channels.createExternalMedia(options);
  }
  /**
   * Redirects a channel to a different location.
   */
  async redirectChannel(channelId, endpoint) {
    return this.channels.redirectChannel(channelId, endpoint);
  }
  /**
   * Answers a channel.
   */
  async answerChannel(channelId) {
    return this.channels.answerChannel(channelId);
  }
  /**
   * Sends a ringing indication to a channel.
   */
  async ringChannel(channelId) {
    return this.channels.ringChannel(channelId);
  }
  /**
   * Stops ringing indication on a channel.
   */
  async stopRingChannel(channelId) {
    return this.channels.stopRingChannel(channelId);
  }
  /**
   * Sends DTMF to a channel.
   */
  async sendDTMF(channelId, dtmf, options) {
    return this.channels.sendDTMF(channelId, dtmf, options);
  }
  /**
   * Mutes a channel.
   */
  async muteChannel(channelId, direction = "both") {
    return this.channels.muteChannel(channelId, direction);
  }
  /**
   * Unmutes a channel.
   */
  async unmuteChannel(channelId, direction = "both") {
    return this.channels.unmuteChannel(channelId, direction);
  }
  /**
   * Puts a channel on hold.
   */
  async holdChannel(channelId) {
    return this.channels.holdChannel(channelId);
  }
  /**
   * Removes a channel from hold.
   */
  async unholdChannel(channelId) {
    return this.channels.unholdChannel(channelId);
  }
  /**
   * Creates a new channel using the provided originate request data.
   *
   * @param data - The originate request data containing channel creation parameters.
   * @returns A promise that resolves to the created Channel object.
   */
  async createChannel(data) {
    return this.channels.createChannel(data);
  }
  /**
   * Hangs up a specific channel.
   *
   * @param channelId - The unique identifier of the channel to hang up.
   * @param options - Optional parameters for the hangup operation.
   * @param options.reason_code - An optional reason code for the hangup.
   * @param options.reason - An optional textual reason for the hangup.
   * @returns A promise that resolves when the hangup operation is complete.
   */
  async hangup(channelId, options) {
    return this.channels.hangup(channelId, options);
  }
  /**
   * Originates a new channel with a specified ID using the provided originate request data.
   *
   * @param channelId - The desired unique identifier for the new channel.
   * @param data - The originate request data containing channel creation parameters.
   * @returns A promise that resolves to the created Channel object.
   */
  async originateWithId(channelId, data) {
    return this.channels.originateWithId(channelId, data);
  }
  // Métodos relacionados a endpoints:
  /**
   * Lists all endpoints.
   *
   * @returns {Promise<Endpoint[]>} A promise resolving to the list of endpoints.
   */
  async listEndpoints() {
    return this.endpoints.list();
  }
  /**
   * Retrieves details of a specific endpoint.
   *
   * @param technology - The technology of the endpoint.
   * @param resource - The resource name of the endpoint.
   * @returns {Promise<EndpointDetails>} A promise resolving to the details of the endpoint.
   */
  async getEndpointDetails(technology, resource) {
    return this.endpoints.getDetails(technology, resource);
  }
  /**
   * Sends a message to an endpoint.
   *
   * @param technology - The technology of the endpoint.
   * @param resource - The resource name of the endpoint.
   * @param body - The message body to send.
   * @returns {Promise<void>} A promise resolving when the message is sent.
   */
  async sendMessageToEndpoint(technology, resource, body) {
    return this.endpoints.sendMessage(technology, resource, body);
  }
  // Métodos relacionados a applications
  /**
   * Lists all applications.
   *
   * @returns {Promise<Application[]>} A promise resolving to the list of applications.
   */
  async listApplications() {
    return this.applications.list();
  }
  /**
   * Retrieves details of a specific application.
   *
   * @param appName - The name of the application.
   * @returns {Promise<ApplicationDetails>} A promise resolving to the application details.
   */
  async getApplicationDetails(appName) {
    return this.applications.getDetails(appName);
  }
  /**
   * Sends a message to a specific application.
   *
   * @param appName - The name of the application.
   * @param body - The message body to send.
   * @returns {Promise<void>} A promise resolving when the message is sent successfully.
   */
  async sendMessageToApplication(appName, body) {
    return this.applications.sendMessage(appName, body);
  }
  // Métodos relacionados a playbacks
  /**
   * Retrieves details of a specific playback.
   *
   * @param playbackId - The unique identifier of the playback.
   * @returns {Promise<Playback>} A promise resolving to the playback details.
   */
  async getPlaybackDetails(playbackId) {
    return this.playbacks.getDetails(playbackId);
  }
  /**
   * Controls a specific playback.
   *
   * @param playbackId - The unique identifier of the playback.
   * @param controlRequest - The PlaybackControlRequest containing the control operation.
   * @returns {Promise<void>} A promise resolving when the control operation is successfully executed.
   */
  async controlPlayback(playbackId, controlRequest) {
    return this.playbacks.control(playbackId, controlRequest);
  }
  /**
   * Stops a specific playback.
   *
   * @param playbackId - The unique identifier of the playback.
   * @returns {Promise<void>} A promise resolving when the playback is successfully stopped.
   */
  async stopPlayback(playbackId) {
    return this.playbacks.stop(playbackId);
  }
  /**
   * Lists all available sounds.
   *
   * @param params - Optional parameters to filter the list of sounds.
   * @returns {Promise<Sound[]>} A promise resolving to the list of sounds.
   */
  async listSounds(params) {
    return this.sounds.list(params);
  }
  /**
   * Retrieves details of a specific sound.
   *
   * @param soundId - The unique identifier of the sound.
   * @returns {Promise<Sound>} A promise resolving to the sound details.
   */
  async getSoundDetails(soundId) {
    return this.sounds.getDetails(soundId);
  }
  /**
   * Retrieves information about the Asterisk server.
   */
  async getAsteriskInfo() {
    return this.asterisk.getInfo();
  }
  /**
   * Lists all loaded modules in the Asterisk server.
   */
  async listModules() {
    return this.asterisk.listModules();
  }
  /**
   * Manages a specific module in the Asterisk server.
   */
  async manageModule(moduleName, action) {
    return this.asterisk.manageModule(moduleName, action);
  }
  /**
   * Retrieves all configured logging channels.
   */
  async listLoggingChannels() {
    return this.asterisk.listLoggingChannels();
  }
  /**
   * Adds or removes a log channel in the Asterisk server.
   */
  async manageLogChannel(logChannelName, action, configuration) {
    return this.asterisk.manageLogChannel(
      logChannelName,
      action,
      configuration
    );
  }
  /**
   * Retrieves the value of a global variable.
   */
  async getGlobalVariable(variableName) {
    return this.asterisk.getGlobalVariable(variableName);
  }
  /**
   * Sets a global variable.
   */
  async setGlobalVariable(variableName, value) {
    return this.asterisk.setGlobalVariable(variableName, value);
  }
};
export {
  Applications,
  AriClient,
  Channels,
  Endpoints,
  Playbacks,
  Sounds
};
//# sourceMappingURL=index.js.map

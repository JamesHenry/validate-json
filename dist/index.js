import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(9925);
const auth_1 = __nccwpck_require__(3702);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3702:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' +
                Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;


/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(3685);
const https = __nccwpck_require__(5687);
const pm = __nccwpck_require__(6443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(4294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 6443:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 5211:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.rf = codeFrameColumns;
__webpack_unused_export__ = _default;

var _highlight = __nccwpck_require__(6860);

let deprecationWarningShown = false;

function getDefs(chalk) {
  return {
    gutter: chalk.grey,
    marker: chalk.red.bold,
    message: chalk.red.bold
  };
}

const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

function getMarkerLines(loc, source, opts) {
  const startLoc = Object.assign({
    column: 0,
    line: -1
  }, loc.start);
  const endLoc = Object.assign({}, startLoc, loc.end);
  const {
    linesAbove = 2,
    linesBelow = 3
  } = opts || {};
  const startLine = startLoc.line;
  const startColumn = startLoc.column;
  const endLine = endLoc.line;
  const endColumn = endLoc.column;
  let start = Math.max(startLine - (linesAbove + 1), 0);
  let end = Math.min(source.length, endLine + linesBelow);

  if (startLine === -1) {
    start = 0;
  }

  if (endLine === -1) {
    end = source.length;
  }

  const lineDiff = endLine - startLine;
  const markerLines = {};

  if (lineDiff) {
    for (let i = 0; i <= lineDiff; i++) {
      const lineNumber = i + startLine;

      if (!startColumn) {
        markerLines[lineNumber] = true;
      } else if (i === 0) {
        const sourceLength = source[lineNumber - 1].length;
        markerLines[lineNumber] = [startColumn, sourceLength - startColumn + 1];
      } else if (i === lineDiff) {
        markerLines[lineNumber] = [0, endColumn];
      } else {
        const sourceLength = source[lineNumber - i].length;
        markerLines[lineNumber] = [0, sourceLength];
      }
    }
  } else {
    if (startColumn === endColumn) {
      if (startColumn) {
        markerLines[startLine] = [startColumn, 0];
      } else {
        markerLines[startLine] = true;
      }
    } else {
      markerLines[startLine] = [startColumn, endColumn - startColumn];
    }
  }

  return {
    start,
    end,
    markerLines
  };
}

function codeFrameColumns(rawLines, loc, opts = {}) {
  const highlighted = (opts.highlightCode || opts.forceColor) && (0, _highlight.shouldHighlight)(opts);
  const chalk = (0, _highlight.getChalk)(opts);
  const defs = getDefs(chalk);

  const maybeHighlight = (chalkFn, string) => {
    return highlighted ? chalkFn(string) : string;
  };

  const lines = rawLines.split(NEWLINE);
  const {
    start,
    end,
    markerLines
  } = getMarkerLines(loc, lines, opts);
  const hasColumns = loc.start && typeof loc.start.column === "number";
  const numberMaxWidth = String(end).length;
  const highlightedLines = highlighted ? (0, _highlight.default)(rawLines, opts) : rawLines;
  let frame = highlightedLines.split(NEWLINE, end).slice(start, end).map((line, index) => {
    const number = start + 1 + index;
    const paddedNumber = ` ${number}`.slice(-numberMaxWidth);
    const gutter = ` ${paddedNumber} |`;
    const hasMarker = markerLines[number];
    const lastMarkerLine = !markerLines[number + 1];

    if (hasMarker) {
      let markerLine = "";

      if (Array.isArray(hasMarker)) {
        const markerSpacing = line.slice(0, Math.max(hasMarker[0] - 1, 0)).replace(/[^\t]/g, " ");
        const numberOfMarkers = hasMarker[1] || 1;
        markerLine = ["\n ", maybeHighlight(defs.gutter, gutter.replace(/\d/g, " ")), " ", markerSpacing, maybeHighlight(defs.marker, "^").repeat(numberOfMarkers)].join("");

        if (lastMarkerLine && opts.message) {
          markerLine += " " + maybeHighlight(defs.message, opts.message);
        }
      }

      return [maybeHighlight(defs.marker, ">"), maybeHighlight(defs.gutter, gutter), line.length > 0 ? ` ${line}` : "", markerLine].join("");
    } else {
      return ` ${maybeHighlight(defs.gutter, gutter)}${line.length > 0 ? ` ${line}` : ""}`;
    }
  }).join("\n");

  if (opts.message && !hasColumns) {
    frame = `${" ".repeat(numberMaxWidth + 1)}${opts.message}\n${frame}`;
  }

  if (highlighted) {
    return chalk.reset(frame);
  } else {
    return frame;
  }
}

function _default(rawLines, lineNumber, colNumber, opts = {}) {
  if (!deprecationWarningShown) {
    deprecationWarningShown = true;
    const message = "Passing lineNumber and colNumber is deprecated to @babel/code-frame. Please use `codeFrameColumns`.";

    if (process.emitWarning) {
      process.emitWarning(message, "DeprecationWarning");
    } else {
      const deprecationError = new Error(message);
      deprecationError.name = "DeprecationWarning";
      console.warn(new Error(message));
    }
  }

  colNumber = Math.max(colNumber, 0);
  const location = {
    start: {
      column: colNumber,
      line: lineNumber
    }
  };
  return codeFrameColumns(rawLines, location, opts);
}

/***/ }),

/***/ 6396:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isIdentifierChar = isIdentifierChar;
exports.isIdentifierName = isIdentifierName;
exports.isIdentifierStart = isIdentifierStart;
let nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u0870-\u0887\u0889-\u088e\u08a0-\u08c9\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c5d\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cdd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d04-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u1711\u171f-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4c\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1cfa\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ca\ua7d0\ua7d1\ua7d3\ua7d5-\ua7d9\ua7f2-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab69\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
let nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0898-\u089f\u08ca-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b55-\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3c\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d81-\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u180f-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1abf-\u1ace\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf4\u1cf7-\u1cf9\u1dc0-\u1dff\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua82c\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
const nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
const nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
const astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 190, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1070, 4050, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 46, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 482, 44, 11, 6, 17, 0, 322, 29, 19, 43, 1269, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4152, 8, 221, 3, 5761, 15, 7472, 3104, 541, 1507, 4938];
const astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 154, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 357, 0, 62, 13, 1495, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];

function isInAstralSet(code, set) {
  let pos = 0x10000;

  for (let i = 0, length = set.length; i < length; i += 2) {
    pos += set[i];
    if (pos > code) return false;
    pos += set[i + 1];
    if (pos >= code) return true;
  }

  return false;
}

function isIdentifierStart(code) {
  if (code < 65) return code === 36;
  if (code <= 90) return true;
  if (code < 97) return code === 95;
  if (code <= 122) return true;

  if (code <= 0xffff) {
    return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
  }

  return isInAstralSet(code, astralIdentifierStartCodes);
}

function isIdentifierChar(code) {
  if (code < 48) return code === 36;
  if (code < 58) return true;
  if (code < 65) return false;
  if (code <= 90) return true;
  if (code < 97) return code === 95;
  if (code <= 122) return true;

  if (code <= 0xffff) {
    return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
  }

  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}

function isIdentifierName(name) {
  let isFirst = true;

  for (let i = 0; i < name.length; i++) {
    let cp = name.charCodeAt(i);

    if ((cp & 0xfc00) === 0xd800 && i + 1 < name.length) {
      const trail = name.charCodeAt(++i);

      if ((trail & 0xfc00) === 0xdc00) {
        cp = 0x10000 + ((cp & 0x3ff) << 10) + (trail & 0x3ff);
      }
    }

    if (isFirst) {
      isFirst = false;

      if (!isIdentifierStart(cp)) {
        return false;
      }
    } else if (!isIdentifierChar(cp)) {
      return false;
    }
  }

  return !isFirst;
}

/***/ }),

/***/ 6607:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "isIdentifierChar", ({
  enumerable: true,
  get: function () {
    return _identifier.isIdentifierChar;
  }
}));
Object.defineProperty(exports, "isIdentifierName", ({
  enumerable: true,
  get: function () {
    return _identifier.isIdentifierName;
  }
}));
Object.defineProperty(exports, "isIdentifierStart", ({
  enumerable: true,
  get: function () {
    return _identifier.isIdentifierStart;
  }
}));
Object.defineProperty(exports, "isKeyword", ({
  enumerable: true,
  get: function () {
    return _keyword.isKeyword;
  }
}));
Object.defineProperty(exports, "isReservedWord", ({
  enumerable: true,
  get: function () {
    return _keyword.isReservedWord;
  }
}));
Object.defineProperty(exports, "isStrictBindOnlyReservedWord", ({
  enumerable: true,
  get: function () {
    return _keyword.isStrictBindOnlyReservedWord;
  }
}));
Object.defineProperty(exports, "isStrictBindReservedWord", ({
  enumerable: true,
  get: function () {
    return _keyword.isStrictBindReservedWord;
  }
}));
Object.defineProperty(exports, "isStrictReservedWord", ({
  enumerable: true,
  get: function () {
    return _keyword.isStrictReservedWord;
  }
}));

var _identifier = __nccwpck_require__(6396);

var _keyword = __nccwpck_require__(7249);

/***/ }),

/***/ 7249:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isKeyword = isKeyword;
exports.isReservedWord = isReservedWord;
exports.isStrictBindOnlyReservedWord = isStrictBindOnlyReservedWord;
exports.isStrictBindReservedWord = isStrictBindReservedWord;
exports.isStrictReservedWord = isStrictReservedWord;
const reservedWords = {
  keyword: ["break", "case", "catch", "continue", "debugger", "default", "do", "else", "finally", "for", "function", "if", "return", "switch", "throw", "try", "var", "const", "while", "with", "new", "this", "super", "class", "extends", "export", "import", "null", "true", "false", "in", "instanceof", "typeof", "void", "delete"],
  strict: ["implements", "interface", "let", "package", "private", "protected", "public", "static", "yield"],
  strictBind: ["eval", "arguments"]
};
const keywords = new Set(reservedWords.keyword);
const reservedWordsStrictSet = new Set(reservedWords.strict);
const reservedWordsStrictBindSet = new Set(reservedWords.strictBind);

function isReservedWord(word, inModule) {
  return inModule && word === "await" || word === "enum";
}

function isStrictReservedWord(word, inModule) {
  return isReservedWord(word, inModule) || reservedWordsStrictSet.has(word);
}

function isStrictBindOnlyReservedWord(word) {
  return reservedWordsStrictBindSet.has(word);
}

function isStrictBindReservedWord(word, inModule) {
  return isStrictReservedWord(word, inModule) || isStrictBindOnlyReservedWord(word);
}

function isKeyword(word) {
  return keywords.has(word);
}

/***/ }),

/***/ 6860:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = highlight;
exports.getChalk = getChalk;
exports.shouldHighlight = shouldHighlight;

var _jsTokens = __nccwpck_require__(1531);

var _helperValidatorIdentifier = __nccwpck_require__(6607);

var _chalk = __nccwpck_require__(7658);

const sometimesKeywords = new Set(["as", "async", "from", "get", "of", "set"]);

function getDefs(chalk) {
  return {
    keyword: chalk.cyan,
    capitalized: chalk.yellow,
    jsxIdentifier: chalk.yellow,
    punctuator: chalk.yellow,
    number: chalk.magenta,
    string: chalk.green,
    regex: chalk.magenta,
    comment: chalk.grey,
    invalid: chalk.white.bgRed.bold
  };
}

const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
const BRACKET = /^[()[\]{}]$/;
let tokenize;
{
  const JSX_TAG = /^[a-z][\w-]*$/i;

  const getTokenType = function (token, offset, text) {
    if (token.type === "name") {
      if ((0, _helperValidatorIdentifier.isKeyword)(token.value) || (0, _helperValidatorIdentifier.isStrictReservedWord)(token.value, true) || sometimesKeywords.has(token.value)) {
        return "keyword";
      }

      if (JSX_TAG.test(token.value) && (text[offset - 1] === "<" || text.substr(offset - 2, 2) == "</")) {
        return "jsxIdentifier";
      }

      if (token.value[0] !== token.value[0].toLowerCase()) {
        return "capitalized";
      }
    }

    if (token.type === "punctuator" && BRACKET.test(token.value)) {
      return "bracket";
    }

    if (token.type === "invalid" && (token.value === "@" || token.value === "#")) {
      return "punctuator";
    }

    return token.type;
  };

  tokenize = function* (text) {
    let match;

    while (match = _jsTokens.default.exec(text)) {
      const token = _jsTokens.matchToToken(match);

      yield {
        type: getTokenType(token, match.index, text),
        value: token.value
      };
    }
  };
}

function highlightTokens(defs, text) {
  let highlighted = "";

  for (const {
    type,
    value
  } of tokenize(text)) {
    const colorize = defs[type];

    if (colorize) {
      highlighted += value.split(NEWLINE).map(str => colorize(str)).join("\n");
    } else {
      highlighted += value;
    }
  }

  return highlighted;
}

function shouldHighlight(options) {
  return !!_chalk.supportsColor || options.forceColor;
}

function getChalk(options) {
  return options.forceColor ? new _chalk.constructor({
    enabled: true,
    level: 1
  }) : _chalk;
}

function highlight(code, options = {}) {
  if (code !== "" && shouldHighlight(options)) {
    const chalk = getChalk(options);
    const defs = getDefs(chalk);
    return highlightTokens(defs, code);
  } else {
    return code;
  }
}

/***/ }),

/***/ 6538:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* module decorator */ module = __nccwpck_require__.nmd(module);

const colorConvert = __nccwpck_require__(6931);

const wrapAnsi16 = (fn, offset) => function () {
	const code = fn.apply(colorConvert, arguments);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => function () {
	const code = fn.apply(colorConvert, arguments);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => function () {
	const rgb = fn.apply(colorConvert, arguments);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39],

			// Bright color
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Fix humans
	styles.color.grey = styles.color.gray;

	for (const groupName of Object.keys(styles)) {
		const group = styles[groupName];

		for (const styleName of Object.keys(group)) {
			const style = group[styleName];

			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});

		Object.defineProperty(styles, 'codes', {
			value: codes,
			enumerable: false
		});
	}

	const ansi2ansi = n => n;
	const rgb2rgb = (r, g, b) => [r, g, b];

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi = {
		ansi: wrapAnsi16(ansi2ansi, 0)
	};
	styles.color.ansi256 = {
		ansi256: wrapAnsi256(ansi2ansi, 0)
	};
	styles.color.ansi16m = {
		rgb: wrapAnsi16m(rgb2rgb, 0)
	};

	styles.bgColor.ansi = {
		ansi: wrapAnsi16(ansi2ansi, 10)
	};
	styles.bgColor.ansi256 = {
		ansi256: wrapAnsi256(ansi2ansi, 10)
	};
	styles.bgColor.ansi16m = {
		rgb: wrapAnsi16m(rgb2rgb, 10)
	};

	for (let key of Object.keys(colorConvert)) {
		if (typeof colorConvert[key] !== 'object') {
			continue;
		}

		const suite = colorConvert[key];

		if (key === 'ansi16') {
			key = 'ansi';
		}

		if ('ansi16' in suite) {
			styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
			styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
		}

		if ('ansi256' in suite) {
			styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
			styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
		}

		if ('rgb' in suite) {
			styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
			styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
		}
	}

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});


/***/ }),

/***/ 7658:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const escapeStringRegexp = __nccwpck_require__(8691);
const ansiStyles = __nccwpck_require__(6538);
const stdoutColor = (__nccwpck_require__(5317).stdout);

const template = __nccwpck_require__(2558);

const isSimpleWindowsTerm = process.platform === 'win32' && !(process.env.TERM || '').toLowerCase().startsWith('xterm');

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'];

// `color-convert` models to exclude from the Chalk API due to conflicts and such
const skipModels = new Set(['gray']);

const styles = Object.create(null);

function applyOptions(obj, options) {
	options = options || {};

	// Detect level if not set manually
	const scLevel = stdoutColor ? stdoutColor.level : 0;
	obj.level = options.level === undefined ? scLevel : options.level;
	obj.enabled = 'enabled' in options ? options.enabled : obj.level > 0;
}

function Chalk(options) {
	// We check for this.template here since calling `chalk.constructor()`
	// by itself will have a `this` of a previously constructed chalk object
	if (!this || !(this instanceof Chalk) || this.template) {
		const chalk = {};
		applyOptions(chalk, options);

		chalk.template = function () {
			const args = [].slice.call(arguments);
			return chalkTag.apply(null, [chalk.template].concat(args));
		};

		Object.setPrototypeOf(chalk, Chalk.prototype);
		Object.setPrototypeOf(chalk.template, chalk);

		chalk.template.constructor = Chalk;

		return chalk.template;
	}

	applyOptions(this, options);
}

// Use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001B[94m';
}

for (const key of Object.keys(ansiStyles)) {
	ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

	styles[key] = {
		get() {
			const codes = ansiStyles[key];
			return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, key);
		}
	};
}

styles.visible = {
	get() {
		return build.call(this, this._styles || [], true, 'visible');
	}
};

ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), 'g');
for (const model of Object.keys(ansiStyles.color.ansi)) {
	if (skipModels.has(model)) {
		continue;
	}

	styles[model] = {
		get() {
			const level = this.level;
			return function () {
				const open = ansiStyles.color[levelMapping[level]][model].apply(null, arguments);
				const codes = {
					open,
					close: ansiStyles.color.close,
					closeRe: ansiStyles.color.closeRe
				};
				return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
			};
		}
	};
}

ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), 'g');
for (const model of Object.keys(ansiStyles.bgColor.ansi)) {
	if (skipModels.has(model)) {
		continue;
	}

	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const level = this.level;
			return function () {
				const open = ansiStyles.bgColor[levelMapping[level]][model].apply(null, arguments);
				const codes = {
					open,
					close: ansiStyles.bgColor.close,
					closeRe: ansiStyles.bgColor.closeRe
				};
				return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, styles);

function build(_styles, _empty, key) {
	const builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	builder._styles = _styles;
	builder._empty = _empty;

	const self = this;

	Object.defineProperty(builder, 'level', {
		enumerable: true,
		get() {
			return self.level;
		},
		set(level) {
			self.level = level;
		}
	});

	Object.defineProperty(builder, 'enabled', {
		enumerable: true,
		get() {
			return self.enabled;
		},
		set(enabled) {
			self.enabled = enabled;
		}
	});

	// See below for fix regarding invisible grey/dim combination on Windows
	builder.hasGrey = this.hasGrey || key === 'gray' || key === 'grey';

	// `__proto__` is used because we must return a function, but there is
	// no way to create a function with a different prototype
	builder.__proto__ = proto; // eslint-disable-line no-proto

	return builder;
}

function applyStyle() {
	// Support varags, but simply cast to string in case there's only one arg
	const args = arguments;
	const argsLen = args.length;
	let str = String(arguments[0]);

	if (argsLen === 0) {
		return '';
	}

	if (argsLen > 1) {
		// Don't slice `arguments`, it prevents V8 optimizations
		for (let a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || this.level <= 0 || !str) {
		return this._empty ? '' : str;
	}

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	const originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && this.hasGrey) {
		ansiStyles.dim.open = '';
	}

	for (const code of this._styles.slice().reverse()) {
		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;

		// Close the styling before a linebreak and reopen
		// after next line to fix a bleed issue on macOS
		// https://github.com/chalk/chalk/pull/92
		str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
	}

	// Reset the original `dim` if we changed it to work around the Windows dimmed gray issue
	ansiStyles.dim.open = originalDim;

	return str;
}

function chalkTag(chalk, strings) {
	if (!Array.isArray(strings)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return [].slice.call(arguments, 1).join(' ');
	}

	const args = [].slice.call(arguments, 2);
	const parts = [strings.raw[0]];

	for (let i = 1; i < strings.length; i++) {
		parts.push(String(args[i - 1]).replace(/[{}\\]/g, '\\$&'));
		parts.push(String(strings.raw[i]));
	}

	return template(chalk, parts.join(''));
}

Object.defineProperties(Chalk.prototype, styles);

module.exports = Chalk(); // eslint-disable-line new-cap
module.exports.supportsColor = stdoutColor;
module.exports["default"] = module.exports; // For TypeScript


/***/ }),

/***/ 2558:
/***/ ((module) => {


const TEMPLATE_REGEX = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi;

const ESCAPES = new Map([
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
	['b', '\b'],
	['f', '\f'],
	['v', '\v'],
	['0', '\0'],
	['\\', '\\'],
	['e', '\u001B'],
	['a', '\u0007']
]);

function unescape(c) {
	if ((c[0] === 'u' && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
		return String.fromCharCode(parseInt(c.slice(1), 16));
	}

	return ESCAPES.get(c) || c;
}

function parseArguments(name, args) {
	const results = [];
	const chunks = args.trim().split(/\s*,\s*/g);
	let matches;

	for (const chunk of chunks) {
		if (!isNaN(chunk)) {
			results.push(Number(chunk));
		} else if ((matches = chunk.match(STRING_REGEX))) {
			results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, chr) => escape ? unescape(escape) : chr));
		} else {
			throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
		}
	}

	return results;
}

function parseStyle(style) {
	STYLE_REGEX.lastIndex = 0;

	const results = [];
	let matches;

	while ((matches = STYLE_REGEX.exec(style)) !== null) {
		const name = matches[1];

		if (matches[2]) {
			const args = parseArguments(name, matches[2]);
			results.push([name].concat(args));
		} else {
			results.push([name]);
		}
	}

	return results;
}

function buildStyle(chalk, styles) {
	const enabled = {};

	for (const layer of styles) {
		for (const style of layer.styles) {
			enabled[style[0]] = layer.inverse ? null : style.slice(1);
		}
	}

	let current = chalk;
	for (const styleName of Object.keys(enabled)) {
		if (Array.isArray(enabled[styleName])) {
			if (!(styleName in current)) {
				throw new Error(`Unknown Chalk style: ${styleName}`);
			}

			if (enabled[styleName].length > 0) {
				current = current[styleName].apply(current, enabled[styleName]);
			} else {
				current = current[styleName];
			}
		}
	}

	return current;
}

module.exports = (chalk, tmp) => {
	const styles = [];
	const chunks = [];
	let chunk = [];

	// eslint-disable-next-line max-params
	tmp.replace(TEMPLATE_REGEX, (m, escapeChar, inverse, style, close, chr) => {
		if (escapeChar) {
			chunk.push(unescape(escapeChar));
		} else if (style) {
			const str = chunk.join('');
			chunk = [];
			chunks.push(styles.length === 0 ? str : buildStyle(chalk, styles)(str));
			styles.push({inverse, styles: parseStyle(style)});
		} else if (close) {
			if (styles.length === 0) {
				throw new Error('Found extraneous } in Chalk template literal');
			}

			chunks.push(buildStyle(chalk, styles)(chunk.join('')));
			chunk = [];
			styles.pop();
		} else {
			chunk.push(chr);
		}
	});

	chunks.push(chunk.join(''));

	if (styles.length > 0) {
		const errMsg = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
		throw new Error(errMsg);
	}

	return chunks.join('');
};


/***/ }),

/***/ 3226:
/***/ ((module) => {


module.exports = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),

/***/ 5317:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const os = __nccwpck_require__(2037);
const hasFlag = __nccwpck_require__(3226);

const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};


/***/ }),

/***/ 2426:
/***/ ((module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
const core_1 = __nccwpck_require__(2685);
const draft7_1 = __nccwpck_require__(691);
const discriminator_1 = __nccwpck_require__(4025);
const draft7MetaSchema = __nccwpck_require__(98);
const META_SUPPORT_DATA = ["/properties"];
const META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
class Ajv extends core_1.default {
    _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
            this.addKeyword(discriminator_1.default);
    }
    _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta)
            return;
        const metaSchema = this.opts.$data
            ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA)
            : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
    }
    defaultMeta() {
        return (this.opts.defaultMeta =
            super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : undefined));
    }
}
module.exports = exports = Ajv;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = Ajv;
var validate_1 = __nccwpck_require__(8955);
Object.defineProperty(exports, "KeywordCxt", ({ enumerable: true, get: function () { return validate_1.KeywordCxt; } }));
var codegen_1 = __nccwpck_require__(9179);
Object.defineProperty(exports, "_", ({ enumerable: true, get: function () { return codegen_1._; } }));
Object.defineProperty(exports, "str", ({ enumerable: true, get: function () { return codegen_1.str; } }));
Object.defineProperty(exports, "stringify", ({ enumerable: true, get: function () { return codegen_1.stringify; } }));
Object.defineProperty(exports, "nil", ({ enumerable: true, get: function () { return codegen_1.nil; } }));
Object.defineProperty(exports, "Name", ({ enumerable: true, get: function () { return codegen_1.Name; } }));
Object.defineProperty(exports, "CodeGen", ({ enumerable: true, get: function () { return codegen_1.CodeGen; } }));
//# sourceMappingURL=ajv.js.map

/***/ }),

/***/ 8358:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
class _CodeOrName {
}
exports._CodeOrName = _CodeOrName;
exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
class Name extends _CodeOrName {
    constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s))
            throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
    }
    toString() {
        return this.str;
    }
    emptyStr() {
        return false;
    }
    get names() {
        return { [this.str]: 1 };
    }
}
exports.Name = Name;
class _Code extends _CodeOrName {
    constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
    }
    toString() {
        return this.str;
    }
    emptyStr() {
        if (this._items.length > 1)
            return false;
        const item = this._items[0];
        return item === "" || item === '""';
    }
    get str() {
        var _a;
        return ((_a = this._str) !== null && _a !== void 0 ? _a : (this._str = this._items.reduce((s, c) => `${s}${c}`, "")));
    }
    get names() {
        var _a;
        return ((_a = this._names) !== null && _a !== void 0 ? _a : (this._names = this._items.reduce((names, c) => {
            if (c instanceof Name)
                names[c.str] = (names[c.str] || 0) + 1;
            return names;
        }, {})));
    }
}
exports._Code = _Code;
exports.nil = new _Code("");
function _(strs, ...args) {
    const code = [strs[0]];
    let i = 0;
    while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
    }
    return new _Code(code);
}
exports._ = _;
const plus = new _Code("+");
function str(strs, ...args) {
    const expr = [safeStringify(strs[0])];
    let i = 0;
    while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
    }
    optimize(expr);
    return new _Code(expr);
}
exports.str = str;
function addCodeArg(code, arg) {
    if (arg instanceof _Code)
        code.push(...arg._items);
    else if (arg instanceof Name)
        code.push(arg);
    else
        code.push(interpolate(arg));
}
exports.addCodeArg = addCodeArg;
function optimize(expr) {
    let i = 1;
    while (i < expr.length - 1) {
        if (expr[i] === plus) {
            const res = mergeExprItems(expr[i - 1], expr[i + 1]);
            if (res !== undefined) {
                expr.splice(i - 1, 3, res);
                continue;
            }
            expr[i++] = "+";
        }
        i++;
    }
}
function mergeExprItems(a, b) {
    if (b === '""')
        return a;
    if (a === '""')
        return b;
    if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
            return;
        if (typeof b != "string")
            return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
            return a.slice(0, -1) + b.slice(1);
        return;
    }
    if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
    return;
}
function strConcat(c1, c2) {
    return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str `${c1}${c2}`;
}
exports.strConcat = strConcat;
// TODO do not allow arrays here
function interpolate(x) {
    return typeof x == "number" || typeof x == "boolean" || x === null
        ? x
        : safeStringify(Array.isArray(x) ? x.join(",") : x);
}
function stringify(x) {
    return new _Code(safeStringify(x));
}
exports.stringify = stringify;
function safeStringify(x) {
    return JSON.stringify(x)
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}
exports.safeStringify = safeStringify;
function getProperty(key) {
    return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _ `[${key}]`;
}
exports.getProperty = getProperty;
//Does best effort to format the name properly
function getEsmExportName(key) {
    if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
    }
    throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
}
exports.getEsmExportName = getEsmExportName;
function regexpCode(rx) {
    return new _Code(rx.toString());
}
exports.regexpCode = regexpCode;
//# sourceMappingURL=code.js.map

/***/ }),

/***/ 9179:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
const code_1 = __nccwpck_require__(8358);
const scope_1 = __nccwpck_require__(2893);
var code_2 = __nccwpck_require__(8358);
Object.defineProperty(exports, "_", ({ enumerable: true, get: function () { return code_2._; } }));
Object.defineProperty(exports, "str", ({ enumerable: true, get: function () { return code_2.str; } }));
Object.defineProperty(exports, "strConcat", ({ enumerable: true, get: function () { return code_2.strConcat; } }));
Object.defineProperty(exports, "nil", ({ enumerable: true, get: function () { return code_2.nil; } }));
Object.defineProperty(exports, "getProperty", ({ enumerable: true, get: function () { return code_2.getProperty; } }));
Object.defineProperty(exports, "stringify", ({ enumerable: true, get: function () { return code_2.stringify; } }));
Object.defineProperty(exports, "regexpCode", ({ enumerable: true, get: function () { return code_2.regexpCode; } }));
Object.defineProperty(exports, "Name", ({ enumerable: true, get: function () { return code_2.Name; } }));
var scope_2 = __nccwpck_require__(2893);
Object.defineProperty(exports, "Scope", ({ enumerable: true, get: function () { return scope_2.Scope; } }));
Object.defineProperty(exports, "ValueScope", ({ enumerable: true, get: function () { return scope_2.ValueScope; } }));
Object.defineProperty(exports, "ValueScopeName", ({ enumerable: true, get: function () { return scope_2.ValueScopeName; } }));
Object.defineProperty(exports, "varKinds", ({ enumerable: true, get: function () { return scope_2.varKinds; } }));
exports.operators = {
    GT: new code_1._Code(">"),
    GTE: new code_1._Code(">="),
    LT: new code_1._Code("<"),
    LTE: new code_1._Code("<="),
    EQ: new code_1._Code("==="),
    NEQ: new code_1._Code("!=="),
    NOT: new code_1._Code("!"),
    OR: new code_1._Code("||"),
    AND: new code_1._Code("&&"),
    ADD: new code_1._Code("+"),
};
class Node {
    optimizeNodes() {
        return this;
    }
    optimizeNames(_names, _constants) {
        return this;
    }
}
class Def extends Node {
    constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
    }
    render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === undefined ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
    }
    optimizeNames(names, constants) {
        if (!names[this.name.str])
            return;
        if (this.rhs)
            this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
    }
    get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
    }
}
class Assign extends Node {
    constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
    }
    render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
    }
    optimizeNames(names, constants) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
            return;
        this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
    }
    get names() {
        const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
        return addExprNames(names, this.rhs);
    }
}
class AssignOp extends Assign {
    constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
    }
    render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
    }
}
class Label extends Node {
    constructor(label) {
        super();
        this.label = label;
        this.names = {};
    }
    render({ _n }) {
        return `${this.label}:` + _n;
    }
}
class Break extends Node {
    constructor(label) {
        super();
        this.label = label;
        this.names = {};
    }
    render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
    }
}
class Throw extends Node {
    constructor(error) {
        super();
        this.error = error;
    }
    render({ _n }) {
        return `throw ${this.error};` + _n;
    }
    get names() {
        return this.error.names;
    }
}
class AnyCode extends Node {
    constructor(code) {
        super();
        this.code = code;
    }
    render({ _n }) {
        return `${this.code};` + _n;
    }
    optimizeNodes() {
        return `${this.code}` ? this : undefined;
    }
    optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants);
        return this;
    }
    get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
    }
}
class ParentNode extends Node {
    constructor(nodes = []) {
        super();
        this.nodes = nodes;
    }
    render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
    }
    optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
            const n = nodes[i].optimizeNodes();
            if (Array.isArray(n))
                nodes.splice(i, 1, ...n);
            else if (n)
                nodes[i] = n;
            else
                nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : undefined;
    }
    optimizeNames(names, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
            // iterating backwards improves 1-pass optimization
            const n = nodes[i];
            if (n.optimizeNames(names, constants))
                continue;
            subtractNames(names, n.names);
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : undefined;
    }
    get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
    }
}
class BlockNode extends ParentNode {
    render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
    }
}
class Root extends ParentNode {
}
class Else extends BlockNode {
}
Else.kind = "else";
class If extends BlockNode {
    constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
    }
    render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
            code += "else " + this.else.render(opts);
        return code;
    }
    optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
            return this.nodes; // else is ignored here
        let e = this.else;
        if (e) {
            const ns = e.optimizeNodes();
            e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
            if (cond === false)
                return e instanceof If ? e : e.nodes;
            if (this.nodes.length)
                return this;
            return new If(not(cond), e instanceof If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
            return undefined;
        return this;
    }
    optimizeNames(names, constants) {
        var _a;
        this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        if (!(super.optimizeNames(names, constants) || this.else))
            return;
        this.condition = optimizeExpr(this.condition, names, constants);
        return this;
    }
    get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
            addNames(names, this.else.names);
        return names;
    }
}
If.kind = "if";
class For extends BlockNode {
}
For.kind = "for";
class ForLoop extends For {
    constructor(iteration) {
        super();
        this.iteration = iteration;
    }
    render(opts) {
        return `for(${this.iteration})` + super.render(opts);
    }
    optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
            return;
        this.iteration = optimizeExpr(this.iteration, names, constants);
        return this;
    }
    get names() {
        return addNames(super.names, this.iteration.names);
    }
}
class ForRange extends For {
    constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
    }
    render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
    }
    get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
    }
}
class ForIter extends For {
    constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
    }
    render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
    }
    optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
            return;
        this.iterable = optimizeExpr(this.iterable, names, constants);
        return this;
    }
    get names() {
        return addNames(super.names, this.iterable.names);
    }
}
class Func extends BlockNode {
    constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
    }
    render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
    }
}
Func.kind = "func";
class Return extends ParentNode {
    render(opts) {
        return "return " + super.render(opts);
    }
}
Return.kind = "return";
class Try extends BlockNode {
    render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
            code += this.catch.render(opts);
        if (this.finally)
            code += this.finally.render(opts);
        return code;
    }
    optimizeNodes() {
        var _a, _b;
        super.optimizeNodes();
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
    }
    optimizeNames(names, constants) {
        var _a, _b;
        super.optimizeNames(names, constants);
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
        return this;
    }
    get names() {
        const names = super.names;
        if (this.catch)
            addNames(names, this.catch.names);
        if (this.finally)
            addNames(names, this.finally.names);
        return names;
    }
}
class Catch extends BlockNode {
    constructor(error) {
        super();
        this.error = error;
    }
    render(opts) {
        return `catch(${this.error})` + super.render(opts);
    }
}
Catch.kind = "catch";
class Finally extends BlockNode {
    render(opts) {
        return "finally" + super.render(opts);
    }
}
Finally.kind = "finally";
class CodeGen {
    constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
    }
    toString() {
        return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(prefix) {
        return this._scope.name(prefix);
    }
    // reserves unique name in the external scope
    scopeName(prefix) {
        return this._extScope.name(prefix);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = new Set());
        vs.add(name);
        return name;
    }
    getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
    }
    scopeCode() {
        return this._extScope.scopeCode(this._values);
    }
    _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== undefined && constant)
            this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
    }
    // `const` declaration (`var` in es5 mode)
    const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
    }
    // `var` declaration with optional assignment
    var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
    }
    // assignment code
    assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
    }
    // `+=` code
    add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
    }
    // appends passed SafeExpr to code or executes Block
    code(c) {
        if (typeof c == "function")
            c();
        else if (c !== code_1.nil)
            this._leafNode(new AnyCode(c));
        return this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
            if (code.length > 1)
                code.push(",");
            code.push(key);
            if (key !== value || this.opts.es5) {
                code.push(":");
                (0, code_1.addCodeArg)(code, value);
            }
        }
        code.push("}");
        return new code_1._Code(code);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
            this.code(thenBody).else().code(elseBody).endIf();
        }
        else if (thenBody) {
            this.code(thenBody).endIf();
        }
        else if (elseBody) {
            throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(condition) {
        return this._elseNode(new If(condition));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
        return this._elseNode(new Else());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
        return this._endBlockNode(If, Else);
    }
    _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
            this.code(forBody).endFor();
        return this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
    }
    // `for` statement for a range of values
    forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
            const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
            return this.forRange("_i", 0, (0, code_1._) `${arr}.length`, (i) => {
                this.var(name, (0, code_1._) `${arr}[${i}]`);
                forBody(name);
            });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
            return this.forOf(nameOrPrefix, (0, code_1._) `Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
    }
    // end `for` loop
    endFor() {
        return this._endBlockNode(For);
    }
    // `label` statement
    label(label) {
        return this._leafNode(new Label(label));
    }
    // `break` statement
    break(label) {
        return this._leafNode(new Break(label));
    }
    // `return` statement
    return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
            throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
    }
    // `try` statement
    try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
            throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
            const error = this.name("e");
            this._currNode = node.catch = new Catch(error);
            catchCode(error);
        }
        if (finallyCode) {
            this._currNode = node.finally = new Finally();
            this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
    }
    // `throw` statement
    throw(error) {
        return this._leafNode(new Throw(error));
    }
    // start self-balancing block
    block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
            this.code(body).endBlock(nodeCount);
        return this;
    }
    // end the current self-balancing block
    endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === undefined)
            throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || (nodeCount !== undefined && toClose !== nodeCount)) {
            throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
            this.code(funcBody).endFunc();
        return this;
    }
    // end function definition
    endFunc() {
        return this._endBlockNode(Func);
    }
    optimize(n = 1) {
        while (n-- > 0) {
            this._root.optimizeNodes();
            this._root.optimizeNames(this._root.names, this._constants);
        }
    }
    _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
    }
    _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
    }
    _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || (N2 && n instanceof N2)) {
            this._nodes.pop();
            return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
    }
    _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
            throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
    }
    get _root() {
        return this._nodes[0];
    }
    get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
    }
    set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
    }
}
exports.CodeGen = CodeGen;
function addNames(names, from) {
    for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
    return names;
}
function addExprNames(names, from) {
    return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
}
function optimizeExpr(expr, names, constants) {
    if (expr instanceof code_1.Name)
        return replaceName(expr);
    if (!canOptimize(expr))
        return expr;
    return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
            c = replaceName(c);
        if (c instanceof code_1._Code)
            items.push(...c._items);
        else
            items.push(c);
        return items;
    }, []));
    function replaceName(n) {
        const c = constants[n.str];
        if (c === undefined || names[n.str] !== 1)
            return n;
        delete names[n.str];
        return c;
    }
    function canOptimize(e) {
        return (e instanceof code_1._Code &&
            e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== undefined));
    }
}
function subtractNames(names, from) {
    for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
}
function not(x) {
    return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._) `!${par(x)}`;
}
exports.not = not;
const andCode = mappend(exports.operators.AND);
// boolean AND (&&) expression with the passed arguments
function and(...args) {
    return args.reduce(andCode);
}
exports.and = and;
const orCode = mappend(exports.operators.OR);
// boolean OR (||) expression with the passed arguments
function or(...args) {
    return args.reduce(orCode);
}
exports.or = or;
function mappend(op) {
    return (x, y) => (x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._) `${par(x)} ${op} ${par(y)}`);
}
function par(x) {
    return x instanceof code_1.Name ? x : (0, code_1._) `(${x})`;
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2893:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
const code_1 = __nccwpck_require__(8358);
class ValueError extends Error {
    constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
    }
}
var UsedValueState;
(function (UsedValueState) {
    UsedValueState[UsedValueState["Started"] = 0] = "Started";
    UsedValueState[UsedValueState["Completed"] = 1] = "Completed";
})(UsedValueState = exports.UsedValueState || (exports.UsedValueState = {}));
exports.varKinds = {
    const: new code_1.Name("const"),
    let: new code_1.Name("let"),
    var: new code_1.Name("var"),
};
class Scope {
    constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
    }
    toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
    }
    name(prefix) {
        return new code_1.Name(this._newName(prefix));
    }
    _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
    }
    _nameGroup(prefix) {
        var _a, _b;
        if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || (this._prefixes && !this._prefixes.has(prefix))) {
            throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return (this._names[prefix] = { prefix, index: 0 });
    }
}
exports.Scope = Scope;
class ValueScopeName extends code_1.Name {
    constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
    }
    setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._) `.${new code_1.Name(property)}[${itemIndex}]`;
    }
}
exports.ValueScopeName = ValueScopeName;
const line = (0, code_1._) `\n`;
class ValueScope extends Scope {
    constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
    }
    get() {
        return this._scope;
    }
    name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
    }
    value(nameOrPrefix, value) {
        var _a;
        if (value.ref === undefined)
            throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
        let vs = this._values[prefix];
        if (vs) {
            const _name = vs.get(valueKey);
            if (_name)
                return _name;
        }
        else {
            vs = this._values[prefix] = new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
    }
    getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
            return;
        return vs.get(keyOrRef);
    }
    scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
            if (name.scopePath === undefined)
                throw new Error(`CodeGen: name "${name}" has no value`);
            return (0, code_1._) `${scopeName}${name.scopePath}`;
        });
    }
    scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
            if (name.value === undefined)
                throw new Error(`CodeGen: name "${name}" has no value`);
            return name.value.code;
        }, usedValues, getCode);
    }
    _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
            const vs = values[prefix];
            if (!vs)
                continue;
            const nameSet = (usedValues[prefix] = usedValues[prefix] || new Map());
            vs.forEach((name) => {
                if (nameSet.has(name))
                    return;
                nameSet.set(name, UsedValueState.Started);
                let c = valueCode(name);
                if (c) {
                    const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
                    code = (0, code_1._) `${code}${def} ${name} = ${c};${this.opts._n}`;
                }
                else if ((c = getCode === null || getCode === void 0 ? void 0 : getCode(name))) {
                    code = (0, code_1._) `${code}${c}${this.opts._n}`;
                }
                else {
                    throw new ValueError(name);
                }
                nameSet.set(name, UsedValueState.Completed);
            });
        }
        return code;
    }
}
exports.ValueScope = ValueScope;
//# sourceMappingURL=scope.js.map

/***/ }),

/***/ 6150:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const names_1 = __nccwpck_require__(50);
exports.keywordError = {
    message: ({ keyword }) => (0, codegen_1.str) `must pass "${keyword}" keyword validation`,
};
exports.keyword$DataError = {
    message: ({ keyword, schemaType }) => schemaType
        ? (0, codegen_1.str) `"${keyword}" keyword must be ${schemaType} ($data)`
        : (0, codegen_1.str) `"${keyword}" keyword is invalid ($data)`,
};
function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
    const { it } = cxt;
    const { gen, compositeRule, allErrors } = it;
    const errObj = errorObjectCode(cxt, error, errorPaths);
    if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : (compositeRule || allErrors)) {
        addError(gen, errObj);
    }
    else {
        returnErrors(it, (0, codegen_1._) `[${errObj}]`);
    }
}
exports.reportError = reportError;
function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
    const { it } = cxt;
    const { gen, compositeRule, allErrors } = it;
    const errObj = errorObjectCode(cxt, error, errorPaths);
    addError(gen, errObj);
    if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
    }
}
exports.reportExtraError = reportExtraError;
function resetErrorsCount(gen, errsCount) {
    gen.assign(names_1.default.errors, errsCount);
    gen.if((0, codegen_1._) `${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._) `${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
}
exports.resetErrorsCount = resetErrorsCount;
function extendErrors({ gen, keyword, schemaValue, data, errsCount, it, }) {
    /* istanbul ignore if */
    if (errsCount === undefined)
        throw new Error("ajv implementation error");
    const err = gen.name("err");
    gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._) `${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._) `${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._) `${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._) `${err}.schemaPath`, (0, codegen_1.str) `${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
            gen.assign((0, codegen_1._) `${err}.schema`, schemaValue);
            gen.assign((0, codegen_1._) `${err}.data`, data);
        }
    });
}
exports.extendErrors = extendErrors;
function addError(gen, errObj) {
    const err = gen.const("err", errObj);
    gen.if((0, codegen_1._) `${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._) `[${err}]`), (0, codegen_1._) `${names_1.default.vErrors}.push(${err})`);
    gen.code((0, codegen_1._) `${names_1.default.errors}++`);
}
function returnErrors(it, errs) {
    const { gen, validateName, schemaEnv } = it;
    if (schemaEnv.$async) {
        gen.throw((0, codegen_1._) `new ${it.ValidationError}(${errs})`);
    }
    else {
        gen.assign((0, codegen_1._) `${validateName}.errors`, errs);
        gen.return(false);
    }
}
const E = {
    keyword: new codegen_1.Name("keyword"),
    schemaPath: new codegen_1.Name("schemaPath"),
    params: new codegen_1.Name("params"),
    propertyName: new codegen_1.Name("propertyName"),
    message: new codegen_1.Name("message"),
    schema: new codegen_1.Name("schema"),
    parentSchema: new codegen_1.Name("parentSchema"),
};
function errorObjectCode(cxt, error, errorPaths) {
    const { createErrors } = cxt.it;
    if (createErrors === false)
        return (0, codegen_1._) `{}`;
    return errorObject(cxt, error, errorPaths);
}
function errorObject(cxt, error, errorPaths = {}) {
    const { gen, it } = cxt;
    const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths),
    ];
    extraErrorProps(cxt, error, keyValues);
    return gen.object(...keyValues);
}
function errorInstancePath({ errorPath }, { instancePath }) {
    const instPath = instancePath
        ? (0, codegen_1.str) `${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}`
        : errorPath;
    return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
}
function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
    let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str) `${errSchemaPath}/${keyword}`;
    if (schemaPath) {
        schPath = (0, codegen_1.str) `${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
    }
    return [E.schemaPath, schPath];
}
function extraErrorProps(cxt, { params, message }, keyValues) {
    const { keyword, data, schemaValue, it } = cxt;
    const { opts, propertyName, topSchemaRef, schemaPath } = it;
    keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._) `{}`]);
    if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
    }
    if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._) `${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
    }
    if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
}
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ 813:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
const codegen_1 = __nccwpck_require__(9179);
const validation_error_1 = __nccwpck_require__(7616);
const names_1 = __nccwpck_require__(50);
const resolve_1 = __nccwpck_require__(6646);
const util_1 = __nccwpck_require__(3439);
const validate_1 = __nccwpck_require__(8955);
class SchemaEnv {
    constructor(env) {
        var _a;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object")
            schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
    }
}
exports.SchemaEnv = SchemaEnv;
// let codeSize = 0
// let nodeCount = 0
// Compiles schema in SchemaEnv
function compileSchema(sch) {
    // TODO refactor - remove compilations
    const _sch = getCompilingSchema.call(this, sch);
    if (_sch)
        return _sch;
    const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId); // TODO if getFullPath removed 1 tests fails
    const { es5, lines } = this.opts.code;
    const { ownProperties } = this.opts;
    const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
    let _ValidationError;
    if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
            ref: validation_error_1.default,
            code: (0, codegen_1._) `require("ajv/dist/runtime/validation_error").default`,
        });
    }
    const validateName = gen.scopeName("validate");
    sch.validateName = validateName;
    const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        dataLevel: 0,
        dataTypes: [],
        definedProperties: new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true
            ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) }
            : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._) `""`,
        opts: this.opts,
        self: this,
    };
    let sourceCode;
    try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        // gen.optimize(1)
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        // console.log((codeSize += sourceCode.length), (nodeCount += gen.nodeCount))
        if (this.opts.code.process)
            sourceCode = this.opts.code.process(sourceCode, sch);
        // console.log("\n\n\n *** \n", sourceCode)
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate });
        validate.errors = null;
        validate.schema = sch.schema;
        validate.schemaEnv = sch;
        if (sch.$async)
            validate.$async = true;
        if (this.opts.code.source === true) {
            validate.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
            const { props, items } = schemaCxt;
            validate.evaluated = {
                props: props instanceof codegen_1.Name ? undefined : props,
                items: items instanceof codegen_1.Name ? undefined : items,
                dynamicProps: props instanceof codegen_1.Name,
                dynamicItems: items instanceof codegen_1.Name,
            };
            if (validate.source)
                validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
        }
        sch.validate = validate;
        return sch;
    }
    catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
            this.logger.error("Error compiling schema, function code:", sourceCode);
        // console.log("\n\n\n *** \n", sourceCode, this.opts)
        throw e;
    }
    finally {
        this._compilations.delete(sch);
    }
}
exports.compileSchema = compileSchema;
function resolveRef(root, baseId, ref) {
    var _a;
    ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
    const schOrFunc = root.refs[ref];
    if (schOrFunc)
        return schOrFunc;
    let _sch = resolve.call(this, root, ref);
    if (_sch === undefined) {
        const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref]; // TODO maybe localRefs should hold SchemaEnv
        const { schemaId } = this.opts;
        if (schema)
            _sch = new SchemaEnv({ schema, schemaId, root, baseId });
    }
    if (_sch === undefined)
        return;
    return (root.refs[ref] = inlineOrCompile.call(this, _sch));
}
exports.resolveRef = resolveRef;
function inlineOrCompile(sch) {
    if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
    return sch.validate ? sch : compileSchema.call(this, sch);
}
// Index of schema compilation in the currently compiled list
function getCompilingSchema(schEnv) {
    for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
            return sch;
    }
}
exports.getCompilingSchema = getCompilingSchema;
function sameSchemaEnv(s1, s2) {
    return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
}
// resolve and compile the references ($ref)
// TODO returns AnySchemaObject (if the schema can be inlined) or validation function
function resolve(root, // information about the root schema for the current schema
ref // reference to resolve
) {
    let sch;
    while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
    return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
}
// Resolve schema, its root and baseId
function resolveSchema(root, // root object with properties schema, refs TODO below SchemaEnv is assigned to it
ref // reference to resolve
) {
    const p = this.opts.uriResolver.parse(ref);
    const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
    let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, undefined);
    // TODO `Object.keys(root.schema).length > 0` should not be needed - but removing breaks 2 tests
    if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
    }
    const id = (0, resolve_1.normalizeId)(refPath);
    const schOrRef = this.refs[id] || this.schemas[id];
    if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
            return;
        return getJsonPointer.call(this, p, sch);
    }
    if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
    if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
    if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
            baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema, schemaId, root, baseId });
    }
    return getJsonPointer.call(this, p, schOrRef);
}
exports.resolveSchema = resolveSchema;
const PREVENT_SCOPE_CHANGE = new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions",
]);
function getJsonPointer(parsedRef, { baseId, schema, root }) {
    var _a;
    if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
        return;
    for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
            return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === undefined)
            return;
        schema = partSchema;
        // TODO PREVENT_SCOPE_CHANGE could be defined in keyword def?
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
            baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
    }
    let env;
    if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env = resolveSchema.call(this, root, $ref);
    }
    // even though resolution failed we need to return SchemaEnv to throw exception
    // so that compileAsync loads missing schema.
    const { schemaId } = this.opts;
    env = env || new SchemaEnv({ schema, schemaId, root, baseId });
    if (env.schema !== env.root.schema)
        return env;
    return undefined;
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 50:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const names = {
    // validation function arguments
    data: new codegen_1.Name("data"),
    // args passed from referencing schema
    valCxt: new codegen_1.Name("valCxt"),
    instancePath: new codegen_1.Name("instancePath"),
    parentData: new codegen_1.Name("parentData"),
    parentDataProperty: new codegen_1.Name("parentDataProperty"),
    rootData: new codegen_1.Name("rootData"),
    dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
    // function scoped variables
    vErrors: new codegen_1.Name("vErrors"),
    errors: new codegen_1.Name("errors"),
    this: new codegen_1.Name("this"),
    // "globals"
    self: new codegen_1.Name("self"),
    scope: new codegen_1.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new codegen_1.Name("json"),
    jsonPos: new codegen_1.Name("jsonPos"),
    jsonLen: new codegen_1.Name("jsonLen"),
    jsonPart: new codegen_1.Name("jsonPart"),
};
exports["default"] = names;
//# sourceMappingURL=names.js.map

/***/ }),

/***/ 8190:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const resolve_1 = __nccwpck_require__(6646);
class MissingRefError extends Error {
    constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
    }
}
exports["default"] = MissingRefError;
//# sourceMappingURL=ref_error.js.map

/***/ }),

/***/ 6646:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
const util_1 = __nccwpck_require__(3439);
const equal = __nccwpck_require__(8206);
const traverse = __nccwpck_require__(2533);
// TODO refactor to use keyword definitions
const SIMPLE_INLINED = new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const",
]);
function inlineRef(schema, limit = true) {
    if (typeof schema == "boolean")
        return true;
    if (limit === true)
        return !hasRef(schema);
    if (!limit)
        return false;
    return countKeys(schema) <= limit;
}
exports.inlineRef = inlineRef;
const REF_KEYWORDS = new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor",
]);
function hasRef(schema) {
    for (const key in schema) {
        if (REF_KEYWORDS.has(key))
            return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
            return true;
        if (typeof sch == "object" && hasRef(sch))
            return true;
    }
    return false;
}
function countKeys(schema) {
    let count = 0;
    for (const key in schema) {
        if (key === "$ref")
            return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
            continue;
        if (typeof schema[key] == "object") {
            (0, util_1.eachItem)(schema[key], (sch) => (count += countKeys(sch)));
        }
        if (count === Infinity)
            return Infinity;
    }
    return count;
}
function getFullPath(resolver, id = "", normalize) {
    if (normalize !== false)
        id = normalizeId(id);
    const p = resolver.parse(id);
    return _getFullPath(resolver, p);
}
exports.getFullPath = getFullPath;
function _getFullPath(resolver, p) {
    const serialized = resolver.serialize(p);
    return serialized.split("#")[0] + "#";
}
exports._getFullPath = _getFullPath;
const TRAILING_SLASH_HASH = /#\/?$/;
function normalizeId(id) {
    return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
}
exports.normalizeId = normalizeId;
function resolveUrl(resolver, baseId, id) {
    id = normalizeId(id);
    return resolver.resolve(baseId, id);
}
exports.resolveUrl = resolveUrl;
const ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
function getSchemaRefs(schema, baseId) {
    if (typeof schema == "boolean")
        return {};
    const { schemaId, uriResolver } = this.opts;
    const schId = normalizeId(schema[schemaId] || baseId);
    const baseIds = { "": schId };
    const pathPrefix = getFullPath(uriResolver, schId, false);
    const localRefs = {};
    const schemaRefs = new Set();
    traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === undefined)
            return;
        const fullPath = pathPrefix + jsonPtr;
        let baseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
            baseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = baseId;
        function addRef(ref) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const _resolve = this.opts.uriResolver.resolve;
            ref = normalizeId(baseId ? _resolve(baseId, ref) : ref);
            if (schemaRefs.has(ref))
                throw ambiguos(ref);
            schemaRefs.add(ref);
            let schOrRef = this.refs[ref];
            if (typeof schOrRef == "string")
                schOrRef = this.refs[schOrRef];
            if (typeof schOrRef == "object") {
                checkAmbiguosRef(sch, schOrRef.schema, ref);
            }
            else if (ref !== normalizeId(fullPath)) {
                if (ref[0] === "#") {
                    checkAmbiguosRef(sch, localRefs[ref], ref);
                    localRefs[ref] = sch;
                }
                else {
                    this.refs[ref] = fullPath;
                }
            }
            return ref;
        }
        function addAnchor(anchor) {
            if (typeof anchor == "string") {
                if (!ANCHOR.test(anchor))
                    throw new Error(`invalid anchor "${anchor}"`);
                addRef.call(this, `#${anchor}`);
            }
        }
    });
    return localRefs;
    function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== undefined && !equal(sch1, sch2))
            throw ambiguos(ref);
    }
    function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
    }
}
exports.getSchemaRefs = getSchemaRefs;
//# sourceMappingURL=resolve.js.map

/***/ }),

/***/ 1785:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRules = exports.isJSONType = void 0;
const _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
const jsonTypes = new Set(_jsonTypes);
function isJSONType(x) {
    return typeof x == "string" && jsonTypes.has(x);
}
exports.isJSONType = isJSONType;
function getRules() {
    const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] },
    };
    return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {},
    };
}
exports.getRules = getRules;
//# sourceMappingURL=rules.js.map

/***/ }),

/***/ 3439:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
const codegen_1 = __nccwpck_require__(9179);
const code_1 = __nccwpck_require__(8358);
// TODO refactor to use Set
function toHash(arr) {
    const hash = {};
    for (const item of arr)
        hash[item] = true;
    return hash;
}
exports.toHash = toHash;
function alwaysValidSchema(it, schema) {
    if (typeof schema == "boolean")
        return schema;
    if (Object.keys(schema).length === 0)
        return true;
    checkUnknownRules(it, schema);
    return !schemaHasRules(schema, it.self.RULES.all);
}
exports.alwaysValidSchema = alwaysValidSchema;
function checkUnknownRules(it, schema = it.schema) {
    const { opts, self } = it;
    if (!opts.strictSchema)
        return;
    if (typeof schema === "boolean")
        return;
    const rules = self.RULES.keywords;
    for (const key in schema) {
        if (!rules[key])
            checkStrictMode(it, `unknown keyword: "${key}"`);
    }
}
exports.checkUnknownRules = checkUnknownRules;
function schemaHasRules(schema, rules) {
    if (typeof schema == "boolean")
        return !schema;
    for (const key in schema)
        if (rules[key])
            return true;
    return false;
}
exports.schemaHasRules = schemaHasRules;
function schemaHasRulesButRef(schema, RULES) {
    if (typeof schema == "boolean")
        return !schema;
    for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
            return true;
    return false;
}
exports.schemaHasRulesButRef = schemaHasRulesButRef;
function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
    if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
            return schema;
        if (typeof schema == "string")
            return (0, codegen_1._) `${schema}`;
    }
    return (0, codegen_1._) `${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
}
exports.schemaRefOrVal = schemaRefOrVal;
function unescapeFragment(str) {
    return unescapeJsonPointer(decodeURIComponent(str));
}
exports.unescapeFragment = unescapeFragment;
function escapeFragment(str) {
    return encodeURIComponent(escapeJsonPointer(str));
}
exports.escapeFragment = escapeFragment;
function escapeJsonPointer(str) {
    if (typeof str == "number")
        return `${str}`;
    return str.replace(/~/g, "~0").replace(/\//g, "~1");
}
exports.escapeJsonPointer = escapeJsonPointer;
function unescapeJsonPointer(str) {
    return str.replace(/~1/g, "/").replace(/~0/g, "~");
}
exports.unescapeJsonPointer = unescapeJsonPointer;
function eachItem(xs, f) {
    if (Array.isArray(xs)) {
        for (const x of xs)
            f(x);
    }
    else {
        f(xs);
    }
}
exports.eachItem = eachItem;
function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName, }) {
    return (gen, from, to, toName) => {
        const res = to === undefined
            ? from
            : to instanceof codegen_1.Name
                ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to)
                : from instanceof codegen_1.Name
                    ? (mergeToName(gen, to, from), from)
                    : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
    };
}
exports.mergeEvaluated = {
    props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._) `${to} !== true && ${from} !== undefined`, () => {
            gen.if((0, codegen_1._) `${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._) `${to} || {}`).code((0, codegen_1._) `Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._) `${to} !== true`, () => {
            if (from === true) {
                gen.assign(to, true);
            }
            else {
                gen.assign(to, (0, codegen_1._) `${to} || {}`);
                setEvaluated(gen, to, from);
            }
        }),
        mergeValues: (from, to) => (from === true ? true : { ...from, ...to }),
        resultToName: evaluatedPropsToName,
    }),
    items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._) `${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._) `${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._) `${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._) `${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => (from === true ? true : Math.max(from, to)),
        resultToName: (gen, items) => gen.var("items", items),
    }),
};
function evaluatedPropsToName(gen, ps) {
    if (ps === true)
        return gen.var("props", true);
    const props = gen.var("props", (0, codegen_1._) `{}`);
    if (ps !== undefined)
        setEvaluated(gen, props, ps);
    return props;
}
exports.evaluatedPropsToName = evaluatedPropsToName;
function setEvaluated(gen, props, ps) {
    Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._) `${props}${(0, codegen_1.getProperty)(p)}`, true));
}
exports.setEvaluated = setEvaluated;
const snippets = {};
function useFunc(gen, f) {
    return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code)),
    });
}
exports.useFunc = useFunc;
var Type;
(function (Type) {
    Type[Type["Num"] = 0] = "Num";
    Type[Type["Str"] = 1] = "Str";
})(Type = exports.Type || (exports.Type = {}));
function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
    // let path
    if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax
            ? isNumber
                ? (0, codegen_1._) `"[" + ${dataProp} + "]"`
                : (0, codegen_1._) `"['" + ${dataProp} + "']"`
            : isNumber
                ? (0, codegen_1._) `"/" + ${dataProp}`
                : (0, codegen_1._) `"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`; // TODO maybe use global escapePointer
    }
    return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
}
exports.getErrorPath = getErrorPath;
function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
    if (!mode)
        return;
    msg = `strict mode: ${msg}`;
    if (mode === true)
        throw new Error(msg);
    it.self.logger.warn(msg);
}
exports.checkStrictMode = checkStrictMode;
//# sourceMappingURL=util.js.map

/***/ }),

/***/ 3627:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
function schemaHasRulesForType({ schema, self }, type) {
    const group = self.RULES.types[type];
    return group && group !== true && shouldUseGroup(schema, group);
}
exports.schemaHasRulesForType = schemaHasRulesForType;
function shouldUseGroup(schema, group) {
    return group.rules.some((rule) => shouldUseRule(schema, rule));
}
exports.shouldUseGroup = shouldUseGroup;
function shouldUseRule(schema, rule) {
    var _a;
    return (schema[rule.keyword] !== undefined ||
        ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== undefined)));
}
exports.shouldUseRule = shouldUseRule;
//# sourceMappingURL=applicability.js.map

/***/ }),

/***/ 6214:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
const errors_1 = __nccwpck_require__(6150);
const codegen_1 = __nccwpck_require__(9179);
const names_1 = __nccwpck_require__(50);
const boolError = {
    message: "boolean schema is false",
};
function topBoolOrEmptySchema(it) {
    const { gen, schema, validateName } = it;
    if (schema === false) {
        falseSchemaError(it, false);
    }
    else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
    }
    else {
        gen.assign((0, codegen_1._) `${validateName}.errors`, null);
        gen.return(true);
    }
}
exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
function boolOrEmptySchema(it, valid) {
    const { gen, schema } = it;
    if (schema === false) {
        gen.var(valid, false); // TODO var
        falseSchemaError(it);
    }
    else {
        gen.var(valid, true); // TODO var
    }
}
exports.boolOrEmptySchema = boolOrEmptySchema;
function falseSchemaError(it, overrideAllErrors) {
    const { gen, data } = it;
    // TODO maybe some other interface should be used for non-keyword validation errors...
    const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it,
    };
    (0, errors_1.reportError)(cxt, boolError, undefined, overrideAllErrors);
}
//# sourceMappingURL=boolSchema.js.map

/***/ }),

/***/ 7725:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
const rules_1 = __nccwpck_require__(1785);
const applicability_1 = __nccwpck_require__(3627);
const errors_1 = __nccwpck_require__(6150);
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
var DataType;
(function (DataType) {
    DataType[DataType["Correct"] = 0] = "Correct";
    DataType[DataType["Wrong"] = 1] = "Wrong";
})(DataType = exports.DataType || (exports.DataType = {}));
function getSchemaTypes(schema) {
    const types = getJSONTypes(schema.type);
    const hasNull = types.includes("null");
    if (hasNull) {
        if (schema.nullable === false)
            throw new Error("type: null contradicts nullable: false");
    }
    else {
        if (!types.length && schema.nullable !== undefined) {
            throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
            types.push("null");
    }
    return types;
}
exports.getSchemaTypes = getSchemaTypes;
function getJSONTypes(ts) {
    const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
    if (types.every(rules_1.isJSONType))
        return types;
    throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
}
exports.getJSONTypes = getJSONTypes;
function coerceAndCheckDataType(it, types) {
    const { gen, data, opts } = it;
    const coerceTo = coerceToTypes(types, opts.coerceTypes);
    const checkTypes = types.length > 0 &&
        !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
    if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
            if (coerceTo.length)
                coerceData(it, types, coerceTo);
            else
                reportTypeError(it);
        });
    }
    return checkTypes;
}
exports.coerceAndCheckDataType = coerceAndCheckDataType;
const COERCIBLE = new Set(["string", "number", "integer", "boolean", "null"]);
function coerceToTypes(types, coerceTypes) {
    return coerceTypes
        ? types.filter((t) => COERCIBLE.has(t) || (coerceTypes === "array" && t === "array"))
        : [];
}
function coerceData(it, types, coerceTo) {
    const { gen, data, opts } = it;
    const dataType = gen.let("dataType", (0, codegen_1._) `typeof ${data}`);
    const coerced = gen.let("coerced", (0, codegen_1._) `undefined`);
    if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._) `${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen
            .assign(data, (0, codegen_1._) `${data}[0]`)
            .assign(dataType, (0, codegen_1._) `typeof ${data}`)
            .if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
    }
    gen.if((0, codegen_1._) `${coerced} !== undefined`);
    for (const t of coerceTo) {
        if (COERCIBLE.has(t) || (t === "array" && opts.coerceTypes === "array")) {
            coerceSpecificType(t);
        }
    }
    gen.else();
    reportTypeError(it);
    gen.endIf();
    gen.if((0, codegen_1._) `${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
    });
    function coerceSpecificType(t) {
        switch (t) {
            case "string":
                gen
                    .elseIf((0, codegen_1._) `${dataType} == "number" || ${dataType} == "boolean"`)
                    .assign(coerced, (0, codegen_1._) `"" + ${data}`)
                    .elseIf((0, codegen_1._) `${data} === null`)
                    .assign(coerced, (0, codegen_1._) `""`);
                return;
            case "number":
                gen
                    .elseIf((0, codegen_1._) `${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`)
                    .assign(coerced, (0, codegen_1._) `+${data}`);
                return;
            case "integer":
                gen
                    .elseIf((0, codegen_1._) `${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`)
                    .assign(coerced, (0, codegen_1._) `+${data}`);
                return;
            case "boolean":
                gen
                    .elseIf((0, codegen_1._) `${data} === "false" || ${data} === 0 || ${data} === null`)
                    .assign(coerced, false)
                    .elseIf((0, codegen_1._) `${data} === "true" || ${data} === 1`)
                    .assign(coerced, true);
                return;
            case "null":
                gen.elseIf((0, codegen_1._) `${data} === "" || ${data} === 0 || ${data} === false`);
                gen.assign(coerced, null);
                return;
            case "array":
                gen
                    .elseIf((0, codegen_1._) `${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`)
                    .assign(coerced, (0, codegen_1._) `[${data}]`);
        }
    }
}
function assignParentData({ gen, parentData, parentDataProperty }, expr) {
    // TODO use gen.property
    gen.if((0, codegen_1._) `${parentData} !== undefined`, () => gen.assign((0, codegen_1._) `${parentData}[${parentDataProperty}]`, expr));
}
function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
    const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
    let cond;
    switch (dataType) {
        case "null":
            return (0, codegen_1._) `${data} ${EQ} null`;
        case "array":
            cond = (0, codegen_1._) `Array.isArray(${data})`;
            break;
        case "object":
            cond = (0, codegen_1._) `${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
            break;
        case "integer":
            cond = numCond((0, codegen_1._) `!(${data} % 1) && !isNaN(${data})`);
            break;
        case "number":
            cond = numCond();
            break;
        default:
            return (0, codegen_1._) `typeof ${data} ${EQ} ${dataType}`;
    }
    return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
    function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._) `typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._) `isFinite(${data})` : codegen_1.nil);
    }
}
exports.checkDataType = checkDataType;
function checkDataTypes(dataTypes, data, strictNums, correct) {
    if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
    }
    let cond;
    const types = (0, util_1.toHash)(dataTypes);
    if (types.array && types.object) {
        const notObj = (0, codegen_1._) `typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._) `!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
    }
    else {
        cond = codegen_1.nil;
    }
    if (types.number)
        delete types.integer;
    for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
    return cond;
}
exports.checkDataTypes = checkDataTypes;
const typeError = {
    message: ({ schema }) => `must be ${schema}`,
    params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._) `{type: ${schema}}` : (0, codegen_1._) `{type: ${schemaValue}}`,
};
function reportTypeError(it) {
    const cxt = getTypeErrorContext(it);
    (0, errors_1.reportError)(cxt, typeError);
}
exports.reportTypeError = reportTypeError;
function getTypeErrorContext(it) {
    const { gen, data, schema } = it;
    const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
    return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it,
    };
}
//# sourceMappingURL=dataType.js.map

/***/ }),

/***/ 9593:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assignDefaults = void 0;
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
function assignDefaults(it, ty) {
    const { properties, items } = it.schema;
    if (ty === "object" && properties) {
        for (const key in properties) {
            assignDefault(it, key, properties[key].default);
        }
    }
    else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
    }
}
exports.assignDefaults = assignDefaults;
function assignDefault(it, prop, defaultValue) {
    const { gen, compositeRule, data, opts } = it;
    if (defaultValue === undefined)
        return;
    const childData = (0, codegen_1._) `${data}${(0, codegen_1.getProperty)(prop)}`;
    if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
    }
    let condition = (0, codegen_1._) `${childData} === undefined`;
    if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._) `${condition} || ${childData} === null || ${childData} === ""`;
    }
    // `${childData} === undefined` +
    // (opts.useDefaults === "empty" ? ` || ${childData} === null || ${childData} === ""` : "")
    gen.if(condition, (0, codegen_1._) `${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
}
//# sourceMappingURL=defaults.js.map

/***/ }),

/***/ 8955:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
const boolSchema_1 = __nccwpck_require__(6214);
const dataType_1 = __nccwpck_require__(7725);
const applicability_1 = __nccwpck_require__(3627);
const dataType_2 = __nccwpck_require__(7725);
const defaults_1 = __nccwpck_require__(9593);
const keyword_1 = __nccwpck_require__(8732);
const subschema_1 = __nccwpck_require__(3896);
const codegen_1 = __nccwpck_require__(9179);
const names_1 = __nccwpck_require__(50);
const resolve_1 = __nccwpck_require__(6646);
const util_1 = __nccwpck_require__(3439);
const errors_1 = __nccwpck_require__(6150);
// schema compilation - generates validation function, subschemaCode (below) is used for subschemas
function validateFunctionCode(it) {
    if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
            topSchemaObjCode(it);
            return;
        }
    }
    validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
}
exports.validateFunctionCode = validateFunctionCode;
function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
    if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._) `${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
            gen.code((0, codegen_1._) `"use strict"; ${funcSourceUrl(schema, opts)}`);
            destructureValCxtES5(gen, opts);
            gen.code(body);
        });
    }
    else {
        gen.func(validateName, (0, codegen_1._) `${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
    }
}
function destructureValCxt(opts) {
    return (0, codegen_1._) `{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._) `, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
}
function destructureValCxtES5(gen, opts) {
    gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._) `${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._) `${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._) `${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._) `${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
            gen.var(names_1.default.dynamicAnchors, (0, codegen_1._) `${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
    }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._) `""`);
        gen.var(names_1.default.parentData, (0, codegen_1._) `undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._) `undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
            gen.var(names_1.default.dynamicAnchors, (0, codegen_1._) `{}`);
    });
}
function topSchemaObjCode(it) {
    const { schema, opts, gen } = it;
    validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
            commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
            resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
    });
    return;
}
function resetEvaluated(it) {
    // TODO maybe some hook to execute it in the end to check whether props/items are Name, as in assignEvaluated
    const { gen, validateName } = it;
    it.evaluated = gen.const("evaluated", (0, codegen_1._) `${validateName}.evaluated`);
    gen.if((0, codegen_1._) `${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._) `${it.evaluated}.props`, (0, codegen_1._) `undefined`));
    gen.if((0, codegen_1._) `${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._) `${it.evaluated}.items`, (0, codegen_1._) `undefined`));
}
function funcSourceUrl(schema, opts) {
    const schId = typeof schema == "object" && schema[opts.schemaId];
    return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._) `/*# sourceURL=${schId} */` : codegen_1.nil;
}
// schema compilation - this function is used recursively to generate code for sub-schemas
function subschemaCode(it, valid) {
    if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
            subSchemaObjCode(it, valid);
            return;
        }
    }
    (0, boolSchema_1.boolOrEmptySchema)(it, valid);
}
function schemaCxtHasRules({ schema, self }) {
    if (typeof schema == "boolean")
        return !schema;
    for (const key in schema)
        if (self.RULES.all[key])
            return true;
    return false;
}
function isSchemaObj(it) {
    return typeof it.schema != "boolean";
}
function subSchemaObjCode(it, valid) {
    const { schema, gen, opts } = it;
    if (opts.$comment && schema.$comment)
        commentKeyword(it);
    updateContext(it);
    checkAsyncSchema(it);
    const errsCount = gen.const("_errs", names_1.default.errors);
    typeAndKeywords(it, errsCount);
    // TODO var
    gen.var(valid, (0, codegen_1._) `${errsCount} === ${names_1.default.errors}`);
}
function checkKeywords(it) {
    (0, util_1.checkUnknownRules)(it);
    checkRefsAndKeywords(it);
}
function typeAndKeywords(it, errsCount) {
    if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
    const types = (0, dataType_1.getSchemaTypes)(it.schema);
    const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
    schemaKeywords(it, types, !checkedTypes, errsCount);
}
function checkRefsAndKeywords(it) {
    const { schema, errSchemaPath, opts, self } = it;
    if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
    }
}
function checkNoDefault(it) {
    const { schema, opts } = it;
    if (schema.default !== undefined && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
    }
}
function updateContext(it) {
    const schId = it.schema[it.opts.schemaId];
    if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
}
function checkAsyncSchema(it) {
    if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
}
function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
    const msg = schema.$comment;
    if (opts.$comment === true) {
        gen.code((0, codegen_1._) `${names_1.default.self}.logger.log(${msg})`);
    }
    else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str) `${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._) `${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
    }
}
function returnResults(it) {
    const { gen, schemaEnv, validateName, ValidationError, opts } = it;
    if (schemaEnv.$async) {
        // TODO assign unevaluated
        gen.if((0, codegen_1._) `${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._) `new ${ValidationError}(${names_1.default.vErrors})`));
    }
    else {
        gen.assign((0, codegen_1._) `${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
            assignEvaluated(it);
        gen.return((0, codegen_1._) `${names_1.default.errors} === 0`);
    }
}
function assignEvaluated({ gen, evaluated, props, items }) {
    if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._) `${evaluated}.props`, props);
    if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._) `${evaluated}.items`, items);
}
function schemaKeywords(it, types, typeErrors, errsCount) {
    const { gen, schema, data, allErrors, opts, self } = it;
    const { RULES } = self;
    if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition)); // TODO typecast
        return;
    }
    if (!opts.jtd)
        checkStrictTypes(it, types);
    gen.block(() => {
        for (const group of RULES.rules)
            groupKeywords(group);
        groupKeywords(RULES.post);
    });
    function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
            return;
        if (group.type) {
            gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
            iterateKeywords(it, group);
            if (types.length === 1 && types[0] === group.type && typeErrors) {
                gen.else();
                (0, dataType_2.reportTypeError)(it);
            }
            gen.endIf();
        }
        else {
            iterateKeywords(it, group);
        }
        // TODO make it "ok" call?
        if (!allErrors)
            gen.if((0, codegen_1._) `${names_1.default.errors} === ${errsCount || 0}`);
    }
}
function iterateKeywords(it, group) {
    const { gen, schema, opts: { useDefaults }, } = it;
    if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
    gen.block(() => {
        for (const rule of group.rules) {
            if ((0, applicability_1.shouldUseRule)(schema, rule)) {
                keywordCode(it, rule.keyword, rule.definition, group.type);
            }
        }
    });
}
function checkStrictTypes(it, types) {
    if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
    checkContextTypes(it, types);
    if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types);
    checkKeywordTypes(it, it.dataTypes);
}
function checkContextTypes(it, types) {
    if (!types.length)
        return;
    if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
    }
    types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
            strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
    });
    it.dataTypes = it.dataTypes.filter((t) => includesType(types, t));
}
function checkMultipleTypes(it, ts) {
    if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
    }
}
function checkKeywordTypes(it, ts) {
    const rules = it.self.RULES.all;
    for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
            const { type } = rule.definition;
            if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
                strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
            }
        }
    }
}
function hasApplicableType(schTs, kwdT) {
    return schTs.includes(kwdT) || (kwdT === "number" && schTs.includes("integer"));
}
function includesType(ts, t) {
    return ts.includes(t) || (t === "integer" && ts.includes("number"));
}
function strictTypesError(it, msg) {
    const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
    msg += ` at "${schemaPath}" (strictTypes)`;
    (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
}
class KeywordCxt {
    constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
            this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        }
        else {
            this.schemaCode = this.schemaValue;
            if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
                throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
            }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
            this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
    }
    result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
    }
    failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
            failAction();
        else
            this.error();
        if (successAction) {
            this.gen.else();
            successAction();
            if (this.allErrors)
                this.gen.endIf();
        }
        else {
            if (this.allErrors)
                this.gen.endIf();
            else
                this.gen.else();
        }
    }
    pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), undefined, failAction);
    }
    fail(condition) {
        if (condition === undefined) {
            this.error();
            if (!this.allErrors)
                this.gen.if(false); // this branch will be removed by gen.optimize
            return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
            this.gen.endIf();
        else
            this.gen.else();
    }
    fail$data(condition) {
        if (!this.$data)
            return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._) `${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
    }
    error(append, errorParams, errorPaths) {
        if (errorParams) {
            this.setParams(errorParams);
            this._error(append, errorPaths);
            this.setParams({});
            return;
        }
        this._error(append, errorPaths);
    }
    _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
    }
    $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
    }
    reset() {
        if (this.errsCount === undefined)
            throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(cond) {
        if (!this.allErrors)
            this.gen.if(cond);
    }
    setParams(obj, assign) {
        if (assign)
            Object.assign(this.params, obj);
        else
            this.params = obj;
    }
    block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
            this.check$data(valid, $dataValid);
            codeBlock();
        });
    }
    check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
            return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._) `${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
            gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
            gen.elseIf(this.invalid$data());
            this.$dataError();
            if (valid !== codegen_1.nil)
                gen.assign(valid, false);
        }
        gen.else();
    }
    invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
            if (schemaType.length) {
                /* istanbul ignore if */
                if (!(schemaCode instanceof codegen_1.Name))
                    throw new Error("ajv implementation error");
                const st = Array.isArray(schemaType) ? schemaType : [schemaType];
                return (0, codegen_1._) `${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
            }
            return codegen_1.nil;
        }
        function invalid$DataSchema() {
            if (def.validateSchema) {
                const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema }); // TODO value.code for standalone
                return (0, codegen_1._) `!${validateSchemaRef}(${schemaCode})`;
            }
            return codegen_1.nil;
        }
    }
    subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = { ...this.it, ...subschema, items: undefined, props: undefined };
        subschemaCode(nextContext, valid);
        return nextContext;
    }
    mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
            return;
        if (it.props !== true && schemaCxt.props !== undefined) {
            it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== undefined) {
            it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
    }
    mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
            gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
            return true;
        }
    }
}
exports.KeywordCxt = KeywordCxt;
function keywordCode(it, keyword, def, ruleType) {
    const cxt = new KeywordCxt(it, def, keyword);
    if ("code" in def) {
        def.code(cxt, ruleType);
    }
    else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
    }
    else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
    }
    else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
    }
}
const JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
const RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function getData($data, { dataLevel, dataNames, dataPathArr }) {
    let jsonPointer;
    let data;
    if ($data === "")
        return names_1.default.rootData;
    if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
            throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
    }
    else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
            throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
            if (up >= dataLevel)
                throw new Error(errorMsg("property/index", up));
            return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
            throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
            return data;
    }
    let expr = data;
    const segments = jsonPointer.split("/");
    for (const segment of segments) {
        if (segment) {
            data = (0, codegen_1._) `${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
            expr = (0, codegen_1._) `${expr} && ${data}`;
        }
    }
    return expr;
    function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
    }
}
exports.getData = getData;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8732:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
const codegen_1 = __nccwpck_require__(9179);
const names_1 = __nccwpck_require__(50);
const code_1 = __nccwpck_require__(4205);
const errors_1 = __nccwpck_require__(6150);
function macroKeywordCode(cxt, def) {
    const { gen, keyword, schema, parentSchema, it } = cxt;
    const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
    const schemaRef = useKeyword(gen, keyword, macroSchema);
    if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
    const valid = gen.name("valid");
    cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true,
    }, valid);
    cxt.pass(valid, () => cxt.error(true));
}
exports.macroKeywordCode = macroKeywordCode;
function funcKeywordCode(cxt, def) {
    var _a;
    const { gen, keyword, schema, parentSchema, $data, it } = cxt;
    checkAsyncKeyword(it, def);
    const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
    const validateRef = useKeyword(gen, keyword, validate);
    const valid = gen.let("valid");
    cxt.block$data(valid, validateKeyword);
    cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
    function validateKeyword() {
        if (def.errors === false) {
            assignValid();
            if (def.modifying)
                modifyData(cxt);
            reportErrs(() => cxt.error());
        }
        else {
            const ruleErrs = def.async ? validateAsync() : validateSync();
            if (def.modifying)
                modifyData(cxt);
            reportErrs(() => addErrs(cxt, ruleErrs));
        }
    }
    function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._) `await `), (e) => gen.assign(valid, false).if((0, codegen_1._) `${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._) `${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
    }
    function validateSync() {
        const validateErrs = (0, codegen_1._) `${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
    }
    function assignValid(_await = def.async ? (0, codegen_1._) `await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !(("compile" in def && !$data) || def.schema === false);
        gen.assign(valid, (0, codegen_1._) `${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
    }
    function reportErrs(errors) {
        var _a;
        gen.if((0, codegen_1.not)((_a = def.valid) !== null && _a !== void 0 ? _a : valid), errors);
    }
}
exports.funcKeywordCode = funcKeywordCode;
function modifyData(cxt) {
    const { gen, data, it } = cxt;
    gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._) `${it.parentData}[${it.parentDataProperty}]`));
}
function addErrs(cxt, errs) {
    const { gen } = cxt;
    gen.if((0, codegen_1._) `Array.isArray(${errs})`, () => {
        gen
            .assign(names_1.default.vErrors, (0, codegen_1._) `${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`)
            .assign(names_1.default.errors, (0, codegen_1._) `${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
    }, () => cxt.error());
}
function checkAsyncKeyword({ schemaEnv }, def) {
    if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
}
function useKeyword(gen, keyword, result) {
    if (result === undefined)
        throw new Error(`keyword "${keyword}" failed to compile`);
    return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
}
function validSchemaType(schema, schemaType, allowUndefined = false) {
    // TODO add tests
    return (!schemaType.length ||
        schemaType.some((st) => st === "array"
            ? Array.isArray(schema)
            : st === "object"
                ? schema && typeof schema == "object" && !Array.isArray(schema)
                : typeof schema == st || (allowUndefined && typeof schema == "undefined")));
}
exports.validSchemaType = validSchemaType;
function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
    /* istanbul ignore if */
    if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
    }
    const deps = def.dependencies;
    if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
    }
    if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
            const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` +
                self.errorsText(def.validateSchema.errors);
            if (opts.validateSchema === "log")
                self.logger.error(msg);
            else
                throw new Error(msg);
        }
    }
}
exports.validateKeywordUsage = validateKeywordUsage;
//# sourceMappingURL=keyword.js.map

/***/ }),

/***/ 3896:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
    if (keyword !== undefined && schema !== undefined) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
    }
    if (keyword !== undefined) {
        const sch = it.schema[keyword];
        return schemaProp === undefined
            ? {
                schema: sch,
                schemaPath: (0, codegen_1._) `${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
                errSchemaPath: `${it.errSchemaPath}/${keyword}`,
            }
            : {
                schema: sch[schemaProp],
                schemaPath: (0, codegen_1._) `${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
                errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`,
            };
    }
    if (schema !== undefined) {
        if (schemaPath === undefined || errSchemaPath === undefined || topSchemaRef === undefined) {
            throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
            schema,
            schemaPath,
            topSchemaRef,
            errSchemaPath,
        };
    }
    throw new Error('either "keyword" or "schema" must be passed');
}
exports.getSubschema = getSubschema;
function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
    if (data !== undefined && dataProp !== undefined) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
    }
    const { gen } = it;
    if (dataProp !== undefined) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._) `${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str) `${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._) `${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
    }
    if (data !== undefined) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true); // replaceable if used once?
        dataContextProps(nextData);
        if (propertyName !== undefined)
            subschema.propertyName = propertyName;
        // TODO something is possibly wrong here with not changing parentDataProperty and not appending dataPathArr
    }
    if (dataTypes)
        subschema.dataTypes = dataTypes;
    function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
    }
}
exports.extendSubschemaData = extendSubschemaData;
function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
    if (compositeRule !== undefined)
        subschema.compositeRule = compositeRule;
    if (createErrors !== undefined)
        subschema.createErrors = createErrors;
    if (allErrors !== undefined)
        subschema.allErrors = allErrors;
    subschema.jtdDiscriminator = jtdDiscriminator; // not inherited
    subschema.jtdMetadata = jtdMetadata; // not inherited
}
exports.extendSubschemaMode = extendSubschemaMode;
//# sourceMappingURL=subschema.js.map

/***/ }),

/***/ 2685:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
var validate_1 = __nccwpck_require__(8955);
Object.defineProperty(exports, "KeywordCxt", ({ enumerable: true, get: function () { return validate_1.KeywordCxt; } }));
var codegen_1 = __nccwpck_require__(9179);
Object.defineProperty(exports, "_", ({ enumerable: true, get: function () { return codegen_1._; } }));
Object.defineProperty(exports, "str", ({ enumerable: true, get: function () { return codegen_1.str; } }));
Object.defineProperty(exports, "stringify", ({ enumerable: true, get: function () { return codegen_1.stringify; } }));
Object.defineProperty(exports, "nil", ({ enumerable: true, get: function () { return codegen_1.nil; } }));
Object.defineProperty(exports, "Name", ({ enumerable: true, get: function () { return codegen_1.Name; } }));
Object.defineProperty(exports, "CodeGen", ({ enumerable: true, get: function () { return codegen_1.CodeGen; } }));
const validation_error_1 = __nccwpck_require__(7616);
const ref_error_1 = __nccwpck_require__(8190);
const rules_1 = __nccwpck_require__(1785);
const compile_1 = __nccwpck_require__(813);
const codegen_2 = __nccwpck_require__(9179);
const resolve_1 = __nccwpck_require__(6646);
const dataType_1 = __nccwpck_require__(7725);
const util_1 = __nccwpck_require__(3439);
const $dataRefSchema = __nccwpck_require__(4775);
const uri_1 = __nccwpck_require__(661);
const defaultRegExp = (str, flags) => new RegExp(str, flags);
defaultRegExp.code = "new RegExp";
const META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
const EXT_SCOPE_NAMES = new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error",
]);
const removedOptions = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now.",
};
const deprecatedOptions = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.',
};
const MAX_EXPRESSION = 200;
// eslint-disable-next-line complexity
function requiredOptions(o) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    const s = o.strict;
    const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
    const optimize = _optz === true || _optz === undefined ? 1 : _optz || 0;
    const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
    const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
    return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver: uriResolver,
    };
}
class Ajv {
    constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = {};
        this._compilations = new Set();
        this._loading = {};
        this._cache = new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
            addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
            addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
            this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
    }
    _addVocabularies() {
        this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
            _dataRefSchema = { ...$dataRefSchema };
            _dataRefSchema.id = _dataRefSchema.$id;
            delete _dataRefSchema.$id;
        }
        if (meta && $data)
            this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
    }
    defaultMeta() {
        const { meta, schemaId } = this.opts;
        return (this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : undefined);
    }
    validate(schemaKeyRef, // key, ref or schema object
    data // to be validated
    ) {
        let v;
        if (typeof schemaKeyRef == "string") {
            v = this.getSchema(schemaKeyRef);
            if (!v)
                throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        }
        else {
            v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
            this.errors = v.errors;
        return valid;
    }
    compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return (sch.validate || this._compileSchemaEnv(sch));
    }
    compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
            throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
            await loadMetaSchema.call(this, _schema.$schema);
            const sch = this._addSchema(_schema, _meta);
            return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
            if ($ref && !this.getSchema($ref)) {
                await runCompileAsync.call(this, { $ref }, true);
            }
        }
        async function _compileAsync(sch) {
            try {
                return this._compileSchemaEnv(sch);
            }
            catch (e) {
                if (!(e instanceof ref_error_1.default))
                    throw e;
                checkLoaded.call(this, e);
                await loadMissingSchema.call(this, e.missingSchema);
                return _compileAsync.call(this, sch);
            }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
            if (this.refs[ref]) {
                throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
            }
        }
        async function loadMissingSchema(ref) {
            const _schema = await _loadSchema.call(this, ref);
            if (!this.refs[ref])
                await loadMetaSchema.call(this, _schema.$schema);
            if (!this.refs[ref])
                this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
            const p = this._loading[ref];
            if (p)
                return p;
            try {
                return await (this._loading[ref] = loadSchema(ref));
            }
            finally {
                delete this._loading[ref];
            }
        }
    }
    // Adds schema to the instance
    addSchema(schema, // If array is passed, `key` will be ignored
    key, // Optional schema key. Can be passed to `validate` method instead of schema object or id/ref. One schema per instance can have empty `id` and `key`.
    _meta, // true if schema is a meta-schema. Used internally, addMetaSchema should be used instead.
    _validateSchema = this.opts.validateSchema // false to skip schema validation. Used internally, option validateSchema should be used instead.
    ) {
        if (Array.isArray(schema)) {
            for (const sch of schema)
                this.addSchema(sch, undefined, _meta, _validateSchema);
            return this;
        }
        let id;
        if (typeof schema === "object") {
            const { schemaId } = this.opts;
            id = schema[schemaId];
            if (id !== undefined && typeof id != "string") {
                throw new Error(`schema ${schemaId} must be string`);
            }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(schema, key, // schema key
    _validateSchema = this.opts.validateSchema // false to skip schema validation, can be used to override validateSchema option for meta-schema
    ) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
    }
    //  Validate schema against its meta-schema
    validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
            return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== undefined && typeof $schema != "string") {
            throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
            this.logger.warn("meta-schema not available");
            this.errors = null;
            return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
            const message = "schema is invalid: " + this.errorsText();
            if (this.opts.validateSchema === "log")
                this.logger.error(message);
            else
                throw new Error(message);
        }
        return valid;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
            keyRef = sch;
        if (sch === undefined) {
            const { schemaId } = this.opts;
            const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
            sch = compile_1.resolveSchema.call(this, root, keyRef);
            if (!sch)
                return;
            this.refs[keyRef] = sch;
        }
        return (sch.validate || this._compileSchemaEnv(sch));
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
            this._removeAllSchemas(this.schemas, schemaKeyRef);
            this._removeAllSchemas(this.refs, schemaKeyRef);
            return this;
        }
        switch (typeof schemaKeyRef) {
            case "undefined":
                this._removeAllSchemas(this.schemas);
                this._removeAllSchemas(this.refs);
                this._cache.clear();
                return this;
            case "string": {
                const sch = getSchEnv.call(this, schemaKeyRef);
                if (typeof sch == "object")
                    this._cache.delete(sch.schema);
                delete this.schemas[schemaKeyRef];
                delete this.refs[schemaKeyRef];
                return this;
            }
            case "object": {
                const cacheKey = schemaKeyRef;
                this._cache.delete(cacheKey);
                let id = schemaKeyRef[this.opts.schemaId];
                if (id) {
                    id = (0, resolve_1.normalizeId)(id);
                    delete this.schemas[id];
                    delete this.refs[id];
                }
                return this;
            }
            default:
                throw new Error("ajv.removeSchema: invalid parameter");
        }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(definitions) {
        for (const def of definitions)
            this.addKeyword(def);
        return this;
    }
    addKeyword(kwdOrDef, def // deprecated
    ) {
        let keyword;
        if (typeof kwdOrDef == "string") {
            keyword = kwdOrDef;
            if (typeof def == "object") {
                this.logger.warn("these parameters are deprecated, see docs for addKeyword");
                def.keyword = keyword;
            }
        }
        else if (typeof kwdOrDef == "object" && def === undefined) {
            def = kwdOrDef;
            keyword = def.keyword;
            if (Array.isArray(keyword) && !keyword.length) {
                throw new Error("addKeywords: keyword must be string or non-empty array");
            }
        }
        else {
            throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
            (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
            return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
            ...def,
            type: (0, dataType_1.getJSONTypes)(def.type),
            schemaType: (0, dataType_1.getJSONTypes)(def.schemaType),
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0
            ? (k) => addRule.call(this, k, definition)
            : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
    }
    getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
    }
    // Remove keyword
    removeKeyword(keyword) {
        // TODO return type should be Ajv
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
            const i = group.rules.findIndex((rule) => rule.keyword === keyword);
            if (i >= 0)
                group.rules.splice(i, 1);
        }
        return this;
    }
    // Add format
    addFormat(name, format) {
        if (typeof format == "string")
            format = new RegExp(format);
        this.formats[name] = format;
        return this;
    }
    errorsText(errors = this.errors, // optional array of validation errors
    { separator = ", ", dataVar = "data" } = {} // optional options with properties `separator` and `dataVar`
    ) {
        if (!errors || errors.length === 0)
            return "No errors";
        return errors
            .map((e) => `${dataVar}${e.instancePath} ${e.message}`)
            .reduce((text, msg) => text + separator + msg);
    }
    $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
            const segments = jsonPointer.split("/").slice(1); // first segment is an empty string
            let keywords = metaSchema;
            for (const seg of segments)
                keywords = keywords[seg];
            for (const key in rules) {
                const rule = rules[key];
                if (typeof rule != "object")
                    continue;
                const { $data } = rule.definition;
                const schema = keywords[key];
                if ($data && schema)
                    keywords[key] = schemaOrData(schema);
            }
        }
        return metaSchema;
    }
    _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
            const sch = schemas[keyRef];
            if (!regex || regex.test(keyRef)) {
                if (typeof sch == "string") {
                    delete schemas[keyRef];
                }
                else if (sch && !sch.meta) {
                    this._cache.delete(sch.schema);
                    delete schemas[keyRef];
                }
            }
        }
    }
    _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
            id = schema[schemaId];
        }
        else {
            if (this.opts.jtd)
                throw new Error("schema must be object");
            else if (typeof schema != "boolean")
                throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== undefined)
            return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
            // TODO atm it is allowed to overwrite schemas without id (instead of not adding them)
            if (baseId)
                this._checkUnique(baseId);
            this.refs[baseId] = sch;
        }
        if (validateSchema)
            this.validateSchema(schema, true);
        return sch;
    }
    _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
            throw new Error(`schema with key or id "${id}" already exists`);
        }
    }
    _compileSchemaEnv(sch) {
        if (sch.meta)
            this._compileMetaSchema(sch);
        else
            compile_1.compileSchema.call(this, sch);
        /* istanbul ignore if */
        if (!sch.validate)
            throw new Error("ajv implementation error");
        return sch.validate;
    }
    _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
            compile_1.compileSchema.call(this, sch);
        }
        finally {
            this.opts = currentOpts;
        }
    }
}
exports["default"] = Ajv;
Ajv.ValidationError = validation_error_1.default;
Ajv.MissingRefError = ref_error_1.default;
function checkOptions(checkOpts, options, msg, log = "error") {
    for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
            this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
    }
}
function getSchEnv(keyRef) {
    keyRef = (0, resolve_1.normalizeId)(keyRef); // TODO tests fail without this line
    return this.schemas[keyRef] || this.refs[keyRef];
}
function addInitialSchemas() {
    const optsSchemas = this.opts.schemas;
    if (!optsSchemas)
        return;
    if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
    else
        for (const key in optsSchemas)
            this.addSchema(optsSchemas[key], key);
}
function addInitialFormats() {
    for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
            this.addFormat(name, format);
    }
}
function addInitialKeywords(defs) {
    if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
            def.keyword = keyword;
        this.addKeyword(def);
    }
}
function getMetaSchemaOptions() {
    const metaOpts = { ...this.opts };
    for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
    return metaOpts;
}
const noLogs = { log() { }, warn() { }, error() { } };
function getLogger(logger) {
    if (logger === false)
        return noLogs;
    if (logger === undefined)
        return console;
    if (logger.log && logger.warn && logger.error)
        return logger;
    throw new Error("logger must implement log, warn and error methods");
}
const KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
function checkKeyword(keyword, def) {
    const { RULES } = this;
    (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
            throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
            throw new Error(`Keyword ${kwd} has invalid name`);
    });
    if (!def)
        return;
    if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
    }
}
function addRule(keyword, definition, dataType) {
    var _a;
    const post = definition === null || definition === void 0 ? void 0 : definition.post;
    if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES } = this;
    let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
    if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
    }
    RULES.keywords[keyword] = true;
    if (!definition)
        return;
    const rule = {
        keyword,
        definition: {
            ...definition,
            type: (0, dataType_1.getJSONTypes)(definition.type),
            schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType),
        },
    };
    if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
    else
        ruleGroup.rules.push(rule);
    RULES.all[keyword] = rule;
    (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
}
function addBeforeRule(ruleGroup, rule, before) {
    const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
    if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
    }
    else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
    }
}
function keywordMetaschema(def) {
    let { metaSchema } = def;
    if (metaSchema === undefined)
        return;
    if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
    def.validateSchema = this.compile(metaSchema, true);
}
const $dataRef = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
};
function schemaOrData(schema) {
    return { anyOf: [schema, $dataRef] };
}
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 3809:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
// https://github.com/ajv-validator/ajv/issues/889
const equal = __nccwpck_require__(8206);
equal.code = 'require("ajv/dist/runtime/equal").default';
exports["default"] = equal;
//# sourceMappingURL=equal.js.map

/***/ }),

/***/ 2470:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
// https://mathiasbynens.be/notes/javascript-encoding
// https://github.com/bestiejs/punycode.js - punycode.ucs2.decode
function ucs2length(str) {
    const len = str.length;
    let length = 0;
    let pos = 0;
    let value;
    while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 0xd800 && value <= 0xdbff && pos < len) {
            // high surrogate, and there is a next character
            value = str.charCodeAt(pos);
            if ((value & 0xfc00) === 0xdc00)
                pos++; // low surrogate
        }
    }
    return length;
}
exports["default"] = ucs2length;
ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
//# sourceMappingURL=ucs2length.js.map

/***/ }),

/***/ 661:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const uri = __nccwpck_require__(20);
uri.code = 'require("ajv/dist/runtime/uri").default';
exports["default"] = uri;
//# sourceMappingURL=uri.js.map

/***/ }),

/***/ 7616:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ValidationError extends Error {
    constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
    }
}
exports["default"] = ValidationError;
//# sourceMappingURL=validation_error.js.map

/***/ }),

/***/ 4720:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateAdditionalItems = void 0;
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const error = {
    message: ({ params: { len } }) => (0, codegen_1.str) `must NOT have more than ${len} items`,
    params: ({ params: { len } }) => (0, codegen_1._) `{limit: ${len}}`,
};
const def = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error,
    code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
            (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
            return;
        }
        validateAdditionalItems(cxt, items);
    },
};
function validateAdditionalItems(cxt, items) {
    const { gen, schema, data, keyword, it } = cxt;
    it.items = true;
    const len = gen.const("len", (0, codegen_1._) `${data}.length`);
    if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._) `${len} <= ${items.length}`);
    }
    else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._) `${len} <= ${items.length}`); // TODO var
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
    }
    function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
            cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
            if (!it.allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
    }
}
exports.validateAdditionalItems = validateAdditionalItems;
exports["default"] = def;
//# sourceMappingURL=additionalItems.js.map

/***/ }),

/***/ 3481:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const code_1 = __nccwpck_require__(4205);
const codegen_1 = __nccwpck_require__(9179);
const names_1 = __nccwpck_require__(50);
const util_1 = __nccwpck_require__(3439);
const error = {
    message: "must NOT have additional properties",
    params: ({ params }) => (0, codegen_1._) `{additionalProperty: ${params.additionalProperty}}`,
};
const def = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: true,
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        /* istanbul ignore if */
        if (!errsCount)
            throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
            return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._) `${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
            gen.forIn("key", data, (key) => {
                if (!props.length && !patProps.length)
                    additionalPropertyCode(key);
                else
                    gen.if(isAdditional(key), () => additionalPropertyCode(key));
            });
        }
        function isAdditional(key) {
            let definedProp;
            if (props.length > 8) {
                // TODO maybe an option instead of hard-coded 8?
                const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
                definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
            }
            else if (props.length) {
                definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._) `${key} === ${p}`));
            }
            else {
                definedProp = codegen_1.nil;
            }
            if (patProps.length) {
                definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._) `${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
            }
            return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
            gen.code((0, codegen_1._) `delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
            if (opts.removeAdditional === "all" || (opts.removeAdditional && schema === false)) {
                deleteAdditional(key);
                return;
            }
            if (schema === false) {
                cxt.setParams({ additionalProperty: key });
                cxt.error();
                if (!allErrors)
                    gen.break();
                return;
            }
            if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
                const valid = gen.name("valid");
                if (opts.removeAdditional === "failing") {
                    applyAdditionalSchema(key, valid, false);
                    gen.if((0, codegen_1.not)(valid), () => {
                        cxt.reset();
                        deleteAdditional(key);
                    });
                }
                else {
                    applyAdditionalSchema(key, valid);
                    if (!allErrors)
                        gen.if((0, codegen_1.not)(valid), () => gen.break());
                }
            }
        }
        function applyAdditionalSchema(key, valid, errors) {
            const subschema = {
                keyword: "additionalProperties",
                dataProp: key,
                dataPropType: util_1.Type.Str,
            };
            if (errors === false) {
                Object.assign(subschema, {
                    compositeRule: true,
                    createErrors: false,
                    allErrors: false,
                });
            }
            cxt.subschema(subschema, valid);
        }
    },
};
exports["default"] = def;
//# sourceMappingURL=additionalProperties.js.map

/***/ }),

/***/ 8406:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const util_1 = __nccwpck_require__(3439);
const def = {
    keyword: "allOf",
    schemaType: "array",
    code(cxt) {
        const { gen, schema, it } = cxt;
        /* istanbul ignore if */
        if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
            if ((0, util_1.alwaysValidSchema)(it, sch))
                return;
            const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
            cxt.ok(valid);
            cxt.mergeEvaluated(schCxt);
        });
    },
};
exports["default"] = def;
//# sourceMappingURL=allOf.js.map

/***/ }),

/***/ 8168:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const code_1 = __nccwpck_require__(4205);
const def = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: true,
    code: code_1.validateUnion,
    error: { message: "must match a schema in anyOf" },
};
exports["default"] = def;
//# sourceMappingURL=anyOf.js.map

/***/ }),

/***/ 9535:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const error = {
    message: ({ params: { min, max } }) => max === undefined
        ? (0, codegen_1.str) `must contain at least ${min} valid item(s)`
        : (0, codegen_1.str) `must contain at least ${min} and no more than ${max} valid item(s)`,
    params: ({ params: { min, max } }) => max === undefined ? (0, codegen_1._) `{minContains: ${min}}` : (0, codegen_1._) `{minContains: ${min}, maxContains: ${max}}`,
};
const def = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
            min = minContains === undefined ? 1 : minContains;
            max = maxContains;
        }
        else {
            min = 1;
        }
        const len = gen.const("len", (0, codegen_1._) `${data}.length`);
        cxt.setParams({ min, max });
        if (max === undefined && min === 0) {
            (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
            return;
        }
        if (max !== undefined && min > max) {
            (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
            cxt.fail();
            return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
            let cond = (0, codegen_1._) `${len} >= ${min}`;
            if (max !== undefined)
                cond = (0, codegen_1._) `${cond} && ${len} <= ${max}`;
            cxt.pass(cond);
            return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === undefined && min === 1) {
            validateItems(valid, () => gen.if(valid, () => gen.break()));
        }
        else if (min === 0) {
            gen.let(valid, true);
            if (max !== undefined)
                gen.if((0, codegen_1._) `${data}.length > 0`, validateItemsWithCount);
        }
        else {
            gen.let(valid, false);
            validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
            const schValid = gen.name("_valid");
            const count = gen.let("count", 0);
            validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
            gen.forRange("i", 0, len, (i) => {
                cxt.subschema({
                    keyword: "contains",
                    dataProp: i,
                    dataPropType: util_1.Type.Num,
                    compositeRule: true,
                }, _valid);
                block();
            });
        }
        function checkLimits(count) {
            gen.code((0, codegen_1._) `${count}++`);
            if (max === undefined) {
                gen.if((0, codegen_1._) `${count} >= ${min}`, () => gen.assign(valid, true).break());
            }
            else {
                gen.if((0, codegen_1._) `${count} > ${max}`, () => gen.assign(valid, false).break());
                if (min === 1)
                    gen.assign(valid, true);
                else
                    gen.if((0, codegen_1._) `${count} >= ${min}`, () => gen.assign(valid, true));
            }
        }
    },
};
exports["default"] = def;
//# sourceMappingURL=contains.js.map

/***/ }),

/***/ 4611:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const code_1 = __nccwpck_require__(4205);
exports.error = {
    message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str) `must have ${property_ies} ${deps} when property ${property} is present`;
    },
    params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._) `{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`, // TODO change to reference
};
const def = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: exports.error,
    code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
    },
};
function splitDependencies({ schema }) {
    const propertyDeps = {};
    const schemaDeps = {};
    for (const key in schema) {
        if (key === "__proto__")
            continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
    }
    return [propertyDeps, schemaDeps];
}
function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
    const { gen, data, it } = cxt;
    if (Object.keys(propertyDeps).length === 0)
        return;
    const missing = gen.let("missing");
    for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
            continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
            property: prop,
            depsCount: deps.length,
            deps: deps.join(", "),
        });
        if (it.allErrors) {
            gen.if(hasProperty, () => {
                for (const depProp of deps) {
                    (0, code_1.checkReportMissingProp)(cxt, depProp);
                }
            });
        }
        else {
            gen.if((0, codegen_1._) `${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
        }
    }
}
exports.validatePropertyDeps = validatePropertyDeps;
function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
    const { gen, data, keyword, it } = cxt;
    const valid = gen.name("valid");
    for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
            continue;
        gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
        }, () => gen.var(valid, true) // TODO var
        );
        cxt.ok(valid);
    }
}
exports.validateSchemaDeps = validateSchemaDeps;
exports["default"] = def;
//# sourceMappingURL=dependencies.js.map

/***/ }),

/***/ 7701:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const error = {
    message: ({ params }) => (0, codegen_1.str) `must match "${params.ifClause}" schema`,
    params: ({ params }) => (0, codegen_1._) `{failingKeyword: ${params.ifClause}}`,
};
const def = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === undefined && parentSchema.else === undefined) {
            (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
            return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
            const ifClause = gen.let("ifClause");
            cxt.setParams({ ifClause });
            gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        }
        else if (hasThen) {
            gen.if(schValid, validateClause("then"));
        }
        else {
            gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
            const schCxt = cxt.subschema({
                keyword: "if",
                compositeRule: true,
                createErrors: false,
                allErrors: false,
            }, schValid);
            cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
            return () => {
                const schCxt = cxt.subschema({ keyword }, schValid);
                gen.assign(valid, schValid);
                cxt.mergeValidEvaluated(schCxt, valid);
                if (ifClause)
                    gen.assign(ifClause, (0, codegen_1._) `${keyword}`);
                else
                    cxt.setParams({ ifClause: keyword });
            };
        }
    },
};
function hasSchema(it, keyword) {
    const schema = it.schema[keyword];
    return schema !== undefined && !(0, util_1.alwaysValidSchema)(it, schema);
}
exports["default"] = def;
//# sourceMappingURL=if.js.map

/***/ }),

/***/ 3048:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const additionalItems_1 = __nccwpck_require__(4720);
const prefixItems_1 = __nccwpck_require__(9498);
const items_1 = __nccwpck_require__(8008);
const items2020_1 = __nccwpck_require__(9084);
const contains_1 = __nccwpck_require__(9535);
const dependencies_1 = __nccwpck_require__(4611);
const propertyNames_1 = __nccwpck_require__(2554);
const additionalProperties_1 = __nccwpck_require__(3481);
const properties_1 = __nccwpck_require__(7666);
const patternProperties_1 = __nccwpck_require__(5157);
const not_1 = __nccwpck_require__(8720);
const anyOf_1 = __nccwpck_require__(8168);
const oneOf_1 = __nccwpck_require__(6434);
const allOf_1 = __nccwpck_require__(8406);
const if_1 = __nccwpck_require__(7701);
const thenElse_1 = __nccwpck_require__(7680);
function getApplicator(draft2020 = false) {
    const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default,
    ];
    // array
    if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
    else
        applicator.push(additionalItems_1.default, items_1.default);
    applicator.push(contains_1.default);
    return applicator;
}
exports["default"] = getApplicator;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8008:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateTuple = void 0;
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const code_1 = __nccwpck_require__(4205);
const def = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
            return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
            return;
        cxt.ok((0, code_1.validateArray)(cxt));
    },
};
function validateTuple(cxt, extraItems, schArr = cxt.schema) {
    const { gen, parentSchema, data, keyword, it } = cxt;
    checkStrictTuple(parentSchema);
    if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
    }
    const valid = gen.name("valid");
    const len = gen.const("len", (0, codegen_1._) `${data}.length`);
    schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
        gen.if((0, codegen_1._) `${len} > ${i}`, () => cxt.subschema({
            keyword,
            schemaProp: i,
            dataProp: i,
        }, valid));
        cxt.ok(valid);
    });
    function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
            const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
            (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
    }
}
exports.validateTuple = validateTuple;
exports["default"] = def;
//# sourceMappingURL=items.js.map

/***/ }),

/***/ 9084:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const code_1 = __nccwpck_require__(4205);
const additionalItems_1 = __nccwpck_require__(4720);
const error = {
    message: ({ params: { len } }) => (0, codegen_1.str) `must NOT have more than ${len} items`,
    params: ({ params: { len } }) => (0, codegen_1._) `{limit: ${len}}`,
};
const def = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error,
    code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
            return;
        if (prefixItems)
            (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
            cxt.ok((0, code_1.validateArray)(cxt));
    },
};
exports["default"] = def;
//# sourceMappingURL=items2020.js.map

/***/ }),

/***/ 8720:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const util_1 = __nccwpck_require__(3439);
const def = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: true,
    code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
            cxt.fail();
            return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
            keyword: "not",
            compositeRule: true,
            createErrors: false,
            allErrors: false,
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
    },
    error: { message: "must NOT be valid" },
};
exports["default"] = def;
//# sourceMappingURL=not.js.map

/***/ }),

/***/ 6434:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const error = {
    message: "must match exactly one schema in oneOf",
    params: ({ params }) => (0, codegen_1._) `{passingSchemas: ${params.passing}}`,
};
const def = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        /* istanbul ignore if */
        if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
            return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        // TODO possibly fail straight away (with warning or exception) if there are two empty always valid schemas
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
            schArr.forEach((sch, i) => {
                let schCxt;
                if ((0, util_1.alwaysValidSchema)(it, sch)) {
                    gen.var(schValid, true);
                }
                else {
                    schCxt = cxt.subschema({
                        keyword: "oneOf",
                        schemaProp: i,
                        compositeRule: true,
                    }, schValid);
                }
                if (i > 0) {
                    gen
                        .if((0, codegen_1._) `${schValid} && ${valid}`)
                        .assign(valid, false)
                        .assign(passing, (0, codegen_1._) `[${passing}, ${i}]`)
                        .else();
                }
                gen.if(schValid, () => {
                    gen.assign(valid, true);
                    gen.assign(passing, i);
                    if (schCxt)
                        cxt.mergeEvaluated(schCxt, codegen_1.Name);
                });
            });
        }
    },
};
exports["default"] = def;
//# sourceMappingURL=oneOf.js.map

/***/ }),

/***/ 5157:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const code_1 = __nccwpck_require__(4205);
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const util_2 = __nccwpck_require__(3439);
const def = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 ||
            (alwaysValidPatterns.length === patterns.length &&
                (!it.opts.unevaluated || it.props === true))) {
            return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
            it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
            for (const pat of patterns) {
                if (checkProperties)
                    checkMatchingProperties(pat);
                if (it.allErrors) {
                    validateProperties(pat);
                }
                else {
                    gen.var(valid, true); // TODO var
                    validateProperties(pat);
                    gen.if(valid);
                }
            }
        }
        function checkMatchingProperties(pat) {
            for (const prop in checkProperties) {
                if (new RegExp(pat).test(prop)) {
                    (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
                }
            }
        }
        function validateProperties(pat) {
            gen.forIn("key", data, (key) => {
                gen.if((0, codegen_1._) `${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
                    const alwaysValid = alwaysValidPatterns.includes(pat);
                    if (!alwaysValid) {
                        cxt.subschema({
                            keyword: "patternProperties",
                            schemaProp: pat,
                            dataProp: key,
                            dataPropType: util_2.Type.Str,
                        }, valid);
                    }
                    if (it.opts.unevaluated && props !== true) {
                        gen.assign((0, codegen_1._) `${props}[${key}]`, true);
                    }
                    else if (!alwaysValid && !it.allErrors) {
                        // can short-circuit if `unevaluatedProperties` is not supported (opts.next === false)
                        // or if all properties were evaluated (props === true)
                        gen.if((0, codegen_1.not)(valid), () => gen.break());
                    }
                });
            });
        }
    },
};
exports["default"] = def;
//# sourceMappingURL=patternProperties.js.map

/***/ }),

/***/ 9498:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const items_1 = __nccwpck_require__(8008);
const def = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (cxt) => (0, items_1.validateTuple)(cxt, "items"),
};
exports["default"] = def;
//# sourceMappingURL=prefixItems.js.map

/***/ }),

/***/ 7666:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const validate_1 = __nccwpck_require__(8955);
const code_1 = __nccwpck_require__(4205);
const util_1 = __nccwpck_require__(3439);
const additionalProperties_1 = __nccwpck_require__(3481);
const def = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === undefined) {
            additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
            it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
            it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
            return;
        const valid = gen.name("valid");
        for (const prop of properties) {
            if (hasDefault(prop)) {
                applyPropertySchema(prop);
            }
            else {
                gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
                applyPropertySchema(prop);
                if (!it.allErrors)
                    gen.else().var(valid, true);
                gen.endIf();
            }
            cxt.it.definedProperties.add(prop);
            cxt.ok(valid);
        }
        function hasDefault(prop) {
            return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== undefined;
        }
        function applyPropertySchema(prop) {
            cxt.subschema({
                keyword: "properties",
                schemaProp: prop,
                dataProp: prop,
            }, valid);
        }
    },
};
exports["default"] = def;
//# sourceMappingURL=properties.js.map

/***/ }),

/***/ 2554:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const error = {
    message: "property name must be valid",
    params: ({ params }) => (0, codegen_1._) `{propertyName: ${params.propertyName}}`,
};
const def = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error,
    code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
            return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
            cxt.setParams({ propertyName: key });
            cxt.subschema({
                keyword: "propertyNames",
                data: key,
                dataTypes: ["string"],
                propertyName: key,
                compositeRule: true,
            }, valid);
            gen.if((0, codegen_1.not)(valid), () => {
                cxt.error(true);
                if (!it.allErrors)
                    gen.break();
            });
        });
        cxt.ok(valid);
    },
};
exports["default"] = def;
//# sourceMappingURL=propertyNames.js.map

/***/ }),

/***/ 7680:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const util_1 = __nccwpck_require__(3439);
const def = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword, parentSchema, it }) {
        if (parentSchema.if === undefined)
            (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
    },
};
exports["default"] = def;
//# sourceMappingURL=thenElse.js.map

/***/ }),

/***/ 4205:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const names_1 = __nccwpck_require__(50);
const util_2 = __nccwpck_require__(3439);
function checkReportMissingProp(cxt, prop) {
    const { gen, data, it } = cxt;
    gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._) `${prop}` }, true);
        cxt.error();
    });
}
exports.checkReportMissingProp = checkReportMissingProp;
function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
    return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._) `${missing} = ${prop}`)));
}
exports.checkMissingProp = checkMissingProp;
function reportMissingProp(cxt, missing) {
    cxt.setParams({ missingProperty: missing }, true);
    cxt.error();
}
exports.reportMissingProp = reportMissingProp;
function hasPropFunc(gen) {
    return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._) `Object.prototype.hasOwnProperty`,
    });
}
exports.hasPropFunc = hasPropFunc;
function isOwnProperty(gen, data, property) {
    return (0, codegen_1._) `${hasPropFunc(gen)}.call(${data}, ${property})`;
}
exports.isOwnProperty = isOwnProperty;
function propertyInData(gen, data, property, ownProperties) {
    const cond = (0, codegen_1._) `${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
    return ownProperties ? (0, codegen_1._) `${cond} && ${isOwnProperty(gen, data, property)}` : cond;
}
exports.propertyInData = propertyInData;
function noPropertyInData(gen, data, property, ownProperties) {
    const cond = (0, codegen_1._) `${data}${(0, codegen_1.getProperty)(property)} === undefined`;
    return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
}
exports.noPropertyInData = noPropertyInData;
function allSchemaProperties(schemaMap) {
    return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
}
exports.allSchemaProperties = allSchemaProperties;
function schemaProperties(it, schemaMap) {
    return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
}
exports.schemaProperties = schemaProperties;
function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
    const dataAndSchema = passSchema ? (0, codegen_1._) `${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
    const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData],
    ];
    if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
    const args = (0, codegen_1._) `${dataAndSchema}, ${gen.object(...valCxt)}`;
    return context !== codegen_1.nil ? (0, codegen_1._) `${func}.call(${context}, ${args})` : (0, codegen_1._) `${func}(${args})`;
}
exports.callValidateCode = callValidateCode;
const newRegExp = (0, codegen_1._) `new RegExp`;
function usePattern({ gen, it: { opts } }, pattern) {
    const u = opts.unicodeRegExp ? "u" : "";
    const { regExp } = opts.code;
    const rx = regExp(pattern, u);
    return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._) `${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`,
    });
}
exports.usePattern = usePattern;
function validateArray(cxt) {
    const { gen, data, keyword, it } = cxt;
    const valid = gen.name("valid");
    if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
    }
    gen.var(valid, true);
    validateItems(() => gen.break());
    return valid;
    function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._) `${data}.length`);
        gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
                keyword,
                dataProp: i,
                dataPropType: util_1.Type.Num,
            }, valid);
            gen.if((0, codegen_1.not)(valid), notValid);
        });
    }
}
exports.validateArray = validateArray;
function validateUnion(cxt) {
    const { gen, schema, keyword, it } = cxt;
    /* istanbul ignore if */
    if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
    const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
    if (alwaysValid && !it.opts.unevaluated)
        return;
    const valid = gen.let("valid", false);
    const schValid = gen.name("_valid");
    gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
            keyword,
            schemaProp: i,
            compositeRule: true,
        }, schValid);
        gen.assign(valid, (0, codegen_1._) `${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        // can short-circuit if `unevaluatedProperties/Items` not supported (opts.unevaluated !== true)
        // or if all properties and items were evaluated (it.props === true && it.items === true)
        if (!merged)
            gen.if((0, codegen_1.not)(valid));
    }));
    cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
}
exports.validateUnion = validateUnion;
//# sourceMappingURL=code.js.map

/***/ }),

/***/ 1674:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const def = {
    keyword: "id",
    code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    },
};
exports["default"] = def;
//# sourceMappingURL=id.js.map

/***/ }),

/***/ 3707:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const id_1 = __nccwpck_require__(1674);
const ref_1 = __nccwpck_require__(6532);
const core = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    id_1.default,
    ref_1.default,
];
exports["default"] = core;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6532:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.callRef = exports.getValidate = void 0;
const ref_error_1 = __nccwpck_require__(8190);
const code_1 = __nccwpck_require__(4205);
const codegen_1 = __nccwpck_require__(9179);
const names_1 = __nccwpck_require__(50);
const compile_1 = __nccwpck_require__(813);
const util_1 = __nccwpck_require__(3439);
const def = {
    keyword: "$ref",
    schemaType: "string",
    code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
            return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === undefined)
            throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
            return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
            if (env === root)
                return callRef(cxt, validateName, env, env.$async);
            const rootName = gen.scopeValue("root", { ref: root });
            return callRef(cxt, (0, codegen_1._) `${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
            const v = getValidate(cxt, sch);
            callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
            const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
            const valid = gen.name("valid");
            const schCxt = cxt.subschema({
                schema: sch,
                dataTypes: [],
                schemaPath: codegen_1.nil,
                topSchemaRef: schName,
                errSchemaPath: $ref,
            }, valid);
            cxt.mergeEvaluated(schCxt);
            cxt.ok(valid);
        }
    },
};
function getValidate(cxt, sch) {
    const { gen } = cxt;
    return sch.validate
        ? gen.scopeValue("validate", { ref: sch.validate })
        : (0, codegen_1._) `${gen.scopeValue("wrapper", { ref: sch })}.validate`;
}
exports.getValidate = getValidate;
function callRef(cxt, v, sch, $async) {
    const { gen, it } = cxt;
    const { allErrors, schemaEnv: env, opts } = it;
    const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
    if ($async)
        callAsyncRef();
    else
        callSyncRef();
    function callAsyncRef() {
        if (!env.$async)
            throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
            gen.code((0, codegen_1._) `await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
            addEvaluatedFrom(v); // TODO will not work with async, it has to be returned with the result
            if (!allErrors)
                gen.assign(valid, true);
        }, (e) => {
            gen.if((0, codegen_1._) `!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
            addErrorsFrom(e);
            if (!allErrors)
                gen.assign(valid, false);
        });
        cxt.ok(valid);
    }
    function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
    }
    function addErrorsFrom(source) {
        const errs = (0, codegen_1._) `${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._) `${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`); // TODO tagged
        gen.assign(names_1.default.errors, (0, codegen_1._) `${names_1.default.vErrors}.length`);
    }
    function addEvaluatedFrom(source) {
        var _a;
        if (!it.opts.unevaluated)
            return;
        const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
        // TODO refactor
        if (it.props !== true) {
            if (schEvaluated && !schEvaluated.dynamicProps) {
                if (schEvaluated.props !== undefined) {
                    it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
                }
            }
            else {
                const props = gen.var("props", (0, codegen_1._) `${source}.evaluated.props`);
                it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
            }
        }
        if (it.items !== true) {
            if (schEvaluated && !schEvaluated.dynamicItems) {
                if (schEvaluated.items !== undefined) {
                    it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
                }
            }
            else {
                const items = gen.var("items", (0, codegen_1._) `${source}.evaluated.items`);
                it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
            }
        }
    }
}
exports.callRef = callRef;
exports["default"] = def;
//# sourceMappingURL=ref.js.map

/***/ }),

/***/ 4025:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const types_1 = __nccwpck_require__(8374);
const compile_1 = __nccwpck_require__(813);
const util_1 = __nccwpck_require__(3439);
const error = {
    message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag
        ? `tag "${tagName}" must be string`
        : `value of tag "${tagName}" must be in oneOf`,
    params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._) `{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`,
};
const def = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error,
    code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
            throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
            throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
            throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
            throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._) `${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._) `typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
            const mapping = getMapping();
            gen.if(false);
            for (const tagValue in mapping) {
                gen.elseIf((0, codegen_1._) `${tag} === ${tagValue}`);
                gen.assign(valid, applyTagSchema(mapping[tagValue]));
            }
            gen.else();
            cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
            gen.endIf();
        }
        function applyTagSchema(schemaProp) {
            const _valid = gen.name("valid");
            const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
            cxt.mergeEvaluated(schCxt, codegen_1.Name);
            return _valid;
        }
        function getMapping() {
            var _a;
            const oneOfMapping = {};
            const topRequired = hasRequired(parentSchema);
            let tagRequired = true;
            for (let i = 0; i < oneOf.length; i++) {
                let sch = oneOf[i];
                if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
                    sch = compile_1.resolveRef.call(it.self, it.schemaEnv, it.baseId, sch === null || sch === void 0 ? void 0 : sch.$ref);
                    if (sch instanceof compile_1.SchemaEnv)
                        sch = sch.schema;
                }
                const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
                if (typeof propSch != "object") {
                    throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
                }
                tagRequired = tagRequired && (topRequired || hasRequired(sch));
                addMappings(propSch, i);
            }
            if (!tagRequired)
                throw new Error(`discriminator: "${tagName}" must be required`);
            return oneOfMapping;
            function hasRequired({ required }) {
                return Array.isArray(required) && required.includes(tagName);
            }
            function addMappings(sch, i) {
                if (sch.const) {
                    addMapping(sch.const, i);
                }
                else if (sch.enum) {
                    for (const tagValue of sch.enum) {
                        addMapping(tagValue, i);
                    }
                }
                else {
                    throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
                }
            }
            function addMapping(tagValue, i) {
                if (typeof tagValue != "string" || tagValue in oneOfMapping) {
                    throw new Error(`discriminator: "${tagName}" values must be unique strings`);
                }
                oneOfMapping[tagValue] = i;
            }
        }
    },
};
exports["default"] = def;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8374:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DiscrError = void 0;
var DiscrError;
(function (DiscrError) {
    DiscrError["Tag"] = "tag";
    DiscrError["Mapping"] = "mapping";
})(DiscrError = exports.DiscrError || (exports.DiscrError = {}));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 691:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __nccwpck_require__(3707);
const validation_1 = __nccwpck_require__(9805);
const applicator_1 = __nccwpck_require__(3048);
const format_1 = __nccwpck_require__(9841);
const metadata_1 = __nccwpck_require__(5799);
const draft7Vocabularies = [
    core_1.default,
    validation_1.default,
    (0, applicator_1.default)(),
    format_1.default,
    metadata_1.metadataVocabulary,
    metadata_1.contentVocabulary,
];
exports["default"] = draft7Vocabularies;
//# sourceMappingURL=draft7.js.map

/***/ }),

/***/ 3691:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const error = {
    message: ({ schemaCode }) => (0, codegen_1.str) `must match format "${schemaCode}"`,
    params: ({ schemaCode }) => (0, codegen_1._) `{format: ${schemaCode}}`,
};
const def = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: true,
    error,
    code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
            return;
        if ($data)
            validate$DataFormat();
        else
            validateFormat();
        function validate$DataFormat() {
            const fmts = gen.scopeValue("formats", {
                ref: self.formats,
                code: opts.code.formats,
            });
            const fDef = gen.const("fDef", (0, codegen_1._) `${fmts}[${schemaCode}]`);
            const fType = gen.let("fType");
            const format = gen.let("format");
            // TODO simplify
            gen.if((0, codegen_1._) `typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._) `${fDef}.type || "string"`).assign(format, (0, codegen_1._) `${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._) `"string"`).assign(format, fDef));
            cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
            function unknownFmt() {
                if (opts.strictSchema === false)
                    return codegen_1.nil;
                return (0, codegen_1._) `${schemaCode} && !${format}`;
            }
            function invalidFmt() {
                const callFormat = schemaEnv.$async
                    ? (0, codegen_1._) `(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))`
                    : (0, codegen_1._) `${format}(${data})`;
                const validData = (0, codegen_1._) `(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
                return (0, codegen_1._) `${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
            }
        }
        function validateFormat() {
            const formatDef = self.formats[schema];
            if (!formatDef) {
                unknownFormat();
                return;
            }
            if (formatDef === true)
                return;
            const [fmtType, format, fmtRef] = getFormat(formatDef);
            if (fmtType === ruleType)
                cxt.pass(validCondition());
            function unknownFormat() {
                if (opts.strictSchema === false) {
                    self.logger.warn(unknownMsg());
                    return;
                }
                throw new Error(unknownMsg());
                function unknownMsg() {
                    return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
                }
            }
            function getFormat(fmtDef) {
                const code = fmtDef instanceof RegExp
                    ? (0, codegen_1.regexpCode)(fmtDef)
                    : opts.code.formats
                        ? (0, codegen_1._) `${opts.code.formats}${(0, codegen_1.getProperty)(schema)}`
                        : undefined;
                const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
                if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
                    return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._) `${fmt}.validate`];
                }
                return ["string", fmtDef, fmt];
            }
            function validCondition() {
                if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
                    if (!schemaEnv.$async)
                        throw new Error("async format in sync schema");
                    return (0, codegen_1._) `await ${fmtRef}(${data})`;
                }
                return typeof format == "function" ? (0, codegen_1._) `${fmtRef}(${data})` : (0, codegen_1._) `${fmtRef}.test(${data})`;
            }
        }
    },
};
exports["default"] = def;
//# sourceMappingURL=format.js.map

/***/ }),

/***/ 9841:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const format_1 = __nccwpck_require__(3691);
const format = [format_1.default];
exports["default"] = format;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5799:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.contentVocabulary = exports.metadataVocabulary = void 0;
exports.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples",
];
exports.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema",
];
//# sourceMappingURL=metadata.js.map

/***/ }),

/***/ 3694:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const equal_1 = __nccwpck_require__(3809);
const error = {
    message: "must be equal to constant",
    params: ({ schemaCode }) => (0, codegen_1._) `{allowedValue: ${schemaCode}}`,
};
const def = {
    keyword: "const",
    $data: true,
    error,
    code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || (schema && typeof schema == "object")) {
            cxt.fail$data((0, codegen_1._) `!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        }
        else {
            cxt.fail((0, codegen_1._) `${schema} !== ${data}`);
        }
    },
};
exports["default"] = def;
//# sourceMappingURL=const.js.map

/***/ }),

/***/ 5529:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const equal_1 = __nccwpck_require__(3809);
const error = {
    message: "must be equal to one of the allowed values",
    params: ({ schemaCode }) => (0, codegen_1._) `{allowedValues: ${schemaCode}}`,
};
const def = {
    keyword: "enum",
    schemaType: "array",
    $data: true,
    error,
    code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
            throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        const eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
            valid = gen.let("valid");
            cxt.block$data(valid, loopEnum);
        }
        else {
            /* istanbul ignore if */
            if (!Array.isArray(schema))
                throw new Error("ajv implementation error");
            const vSchema = gen.const("vSchema", schemaCode);
            valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
            gen.assign(valid, false);
            gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._) `${eql}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
            const sch = schema[i];
            return typeof sch === "object" && sch !== null
                ? (0, codegen_1._) `${eql}(${data}, ${vSchema}[${i}])`
                : (0, codegen_1._) `${data} === ${sch}`;
        }
    },
};
exports["default"] = def;
//# sourceMappingURL=enum.js.map

/***/ }),

/***/ 9805:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const limitNumber_1 = __nccwpck_require__(345);
const multipleOf_1 = __nccwpck_require__(3201);
const limitLength_1 = __nccwpck_require__(7598);
const pattern_1 = __nccwpck_require__(4960);
const limitProperties_1 = __nccwpck_require__(3470);
const required_1 = __nccwpck_require__(3602);
const limitItems_1 = __nccwpck_require__(3924);
const uniqueItems_1 = __nccwpck_require__(9351);
const const_1 = __nccwpck_require__(3694);
const enum_1 = __nccwpck_require__(5529);
const validation = [
    // number
    limitNumber_1.default,
    multipleOf_1.default,
    // string
    limitLength_1.default,
    pattern_1.default,
    // object
    limitProperties_1.default,
    required_1.default,
    // array
    limitItems_1.default,
    uniqueItems_1.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    const_1.default,
    enum_1.default,
];
exports["default"] = validation;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3924:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const error = {
    message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str) `must NOT have ${comp} than ${schemaCode} items`;
    },
    params: ({ schemaCode }) => (0, codegen_1._) `{limit: ${schemaCode}}`,
};
const def = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: true,
    error,
    code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._) `${data}.length ${op} ${schemaCode}`);
    },
};
exports["default"] = def;
//# sourceMappingURL=limitItems.js.map

/***/ }),

/***/ 7598:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const ucs2length_1 = __nccwpck_require__(2470);
const error = {
    message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str) `must NOT have ${comp} than ${schemaCode} characters`;
    },
    params: ({ schemaCode }) => (0, codegen_1._) `{limit: ${schemaCode}}`,
};
const def = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: true,
    error,
    code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._) `${data}.length` : (0, codegen_1._) `${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._) `${len} ${op} ${schemaCode}`);
    },
};
exports["default"] = def;
//# sourceMappingURL=limitLength.js.map

/***/ }),

/***/ 345:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const ops = codegen_1.operators;
const KWDs = {
    maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
    minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
    exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
    exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE },
};
const error = {
    message: ({ keyword, schemaCode }) => (0, codegen_1.str) `must be ${KWDs[keyword].okStr} ${schemaCode}`,
    params: ({ keyword, schemaCode }) => (0, codegen_1._) `{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`,
};
const def = {
    keyword: Object.keys(KWDs),
    type: "number",
    schemaType: "number",
    $data: true,
    error,
    code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._) `${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
    },
};
exports["default"] = def;
//# sourceMappingURL=limitNumber.js.map

/***/ }),

/***/ 3470:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const error = {
    message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str) `must NOT have ${comp} than ${schemaCode} items`;
    },
    params: ({ schemaCode }) => (0, codegen_1._) `{limit: ${schemaCode}}`,
};
const def = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: true,
    error,
    code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._) `Object.keys(${data}).length ${op} ${schemaCode}`);
    },
};
exports["default"] = def;
//# sourceMappingURL=limitProperties.js.map

/***/ }),

/***/ 3201:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const codegen_1 = __nccwpck_require__(9179);
const error = {
    message: ({ schemaCode }) => (0, codegen_1.str) `must be multiple of ${schemaCode}`,
    params: ({ schemaCode }) => (0, codegen_1._) `{multipleOf: ${schemaCode}}`,
};
const def = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: true,
    error,
    code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        // const bdt = bad$DataType(schemaCode, <string>def.schemaType, $data)
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec
            ? (0, codegen_1._) `Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}`
            : (0, codegen_1._) `${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._) `(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
    },
};
exports["default"] = def;
//# sourceMappingURL=multipleOf.js.map

/***/ }),

/***/ 4960:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const code_1 = __nccwpck_require__(4205);
const codegen_1 = __nccwpck_require__(9179);
const error = {
    message: ({ schemaCode }) => (0, codegen_1.str) `must match pattern "${schemaCode}"`,
    params: ({ schemaCode }) => (0, codegen_1._) `{pattern: ${schemaCode}}`,
};
const def = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: true,
    error,
    code(cxt) {
        const { data, $data, schema, schemaCode, it } = cxt;
        // TODO regexp should be wrapped in try/catchs
        const u = it.opts.unicodeRegExp ? "u" : "";
        const regExp = $data ? (0, codegen_1._) `(new RegExp(${schemaCode}, ${u}))` : (0, code_1.usePattern)(cxt, schema);
        cxt.fail$data((0, codegen_1._) `!${regExp}.test(${data})`);
    },
};
exports["default"] = def;
//# sourceMappingURL=pattern.js.map

/***/ }),

/***/ 3602:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const code_1 = __nccwpck_require__(4205);
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const error = {
    message: ({ params: { missingProperty } }) => (0, codegen_1.str) `must have required property '${missingProperty}'`,
    params: ({ params: { missingProperty } }) => (0, codegen_1._) `{missingProperty: ${missingProperty}}`,
};
const def = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: true,
    error,
    code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
            return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
            allErrorsMode();
        else
            exitOnErrorMode();
        if (opts.strictRequired) {
            const props = cxt.parentSchema.properties;
            const { definedProperties } = cxt.it;
            for (const requiredKey of schema) {
                if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === undefined && !definedProperties.has(requiredKey)) {
                    const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
                    const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
                    (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
                }
            }
        }
        function allErrorsMode() {
            if (useLoop || $data) {
                cxt.block$data(codegen_1.nil, loopAllRequired);
            }
            else {
                for (const prop of schema) {
                    (0, code_1.checkReportMissingProp)(cxt, prop);
                }
            }
        }
        function exitOnErrorMode() {
            const missing = gen.let("missing");
            if (useLoop || $data) {
                const valid = gen.let("valid", true);
                cxt.block$data(valid, () => loopUntilMissing(missing, valid));
                cxt.ok(valid);
            }
            else {
                gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
                (0, code_1.reportMissingProp)(cxt, missing);
                gen.else();
            }
        }
        function loopAllRequired() {
            gen.forOf("prop", schemaCode, (prop) => {
                cxt.setParams({ missingProperty: prop });
                gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
            });
        }
        function loopUntilMissing(missing, valid) {
            cxt.setParams({ missingProperty: missing });
            gen.forOf(missing, schemaCode, () => {
                gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
                gen.if((0, codegen_1.not)(valid), () => {
                    cxt.error();
                    gen.break();
                });
            }, codegen_1.nil);
        }
    },
};
exports["default"] = def;
//# sourceMappingURL=required.js.map

/***/ }),

/***/ 9351:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const dataType_1 = __nccwpck_require__(7725);
const codegen_1 = __nccwpck_require__(9179);
const util_1 = __nccwpck_require__(3439);
const equal_1 = __nccwpck_require__(3809);
const error = {
    message: ({ params: { i, j } }) => (0, codegen_1.str) `must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
    params: ({ params: { i, j } }) => (0, codegen_1._) `{i: ${i}, j: ${j}}`,
};
const def = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: true,
    error,
    code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
            return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._) `${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
            const i = gen.let("i", (0, codegen_1._) `${data}.length`);
            const j = gen.let("j");
            cxt.setParams({ i, j });
            gen.assign(valid, true);
            gen.if((0, codegen_1._) `${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
            return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
            const item = gen.name("item");
            const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
            const indices = gen.const("indices", (0, codegen_1._) `{}`);
            gen.for((0, codegen_1._) `;${i}--;`, () => {
                gen.let(item, (0, codegen_1._) `${data}[${i}]`);
                gen.if(wrongType, (0, codegen_1._) `continue`);
                if (itemTypes.length > 1)
                    gen.if((0, codegen_1._) `typeof ${item} == "string"`, (0, codegen_1._) `${item} += "_"`);
                gen
                    .if((0, codegen_1._) `typeof ${indices}[${item}] == "number"`, () => {
                    gen.assign(j, (0, codegen_1._) `${indices}[${item}]`);
                    cxt.error();
                    gen.assign(valid, false).break();
                })
                    .code((0, codegen_1._) `${indices}[${item}] = ${i}`);
            });
        }
        function loopN2(i, j) {
            const eql = (0, util_1.useFunc)(gen, equal_1.default);
            const outer = gen.name("outer");
            gen.label(outer).for((0, codegen_1._) `;${i}--;`, () => gen.for((0, codegen_1._) `${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._) `${eql}(${data}[${i}], ${data}[${j}])`, () => {
                cxt.error();
                gen.assign(valid, false).break(outer);
            })));
        }
    },
};
exports["default"] = def;
//# sourceMappingURL=uniqueItems.js.map

/***/ }),

/***/ 6734:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* module decorator */ module = __nccwpck_require__.nmd(module);


const wrapAnsi16 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => (...args) => {
	const rgb = fn(...args);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

const ansi2ansi = n => n;
const rgb2rgb = (r, g, b) => [r, g, b];

const setLazyProperty = (object, property, get) => {
	Object.defineProperty(object, property, {
		get: () => {
			const value = get();

			Object.defineProperty(object, property, {
				value,
				enumerable: true,
				configurable: true
			});

			return value;
		},
		enumerable: true,
		configurable: true
	});
};

/** @type {typeof import('color-convert')} */
let colorConvert;
const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
	if (colorConvert === undefined) {
		colorConvert = __nccwpck_require__(5121);
	}

	const offset = isBackground ? 10 : 0;
	const styles = {};

	for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
		const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
		if (sourceSpace === targetSpace) {
			styles[name] = wrap(identity, offset);
		} else if (typeof suite === 'object') {
			styles[name] = wrap(suite[targetSpace], offset);
		}
	}

	return styles;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
	setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});


/***/ }),

/***/ 8159:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __nccwpck_require__(4057);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

module.exports = convert;

// Hide .channels and .labels properties
for (const model of Object.keys(convert)) {
	if (!('channels' in convert[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert[model].labels.length !== convert[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert[model];
	delete convert[model].channels;
	delete convert[model].labels;
	Object.defineProperty(convert[model], 'channels', {value: channels});
	Object.defineProperty(convert[model], 'labels', {value: labels});
}

convert.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	const xyz = convert.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hsv = convert.gray.hsl;

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),

/***/ 5121:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const conversions = __nccwpck_require__(8159);
const route = __nccwpck_require__(4663);

const convert = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),

/***/ 4663:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const conversions = __nccwpck_require__(8159);

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),

/***/ 4057:
/***/ ((module) => {



module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),

/***/ 8818:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const ansiStyles = __nccwpck_require__(6734);
const {stdout: stdoutColor, stderr: stderrColor} = __nccwpck_require__(9318);
const {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
} = __nccwpck_require__(2415);

const {isArray} = Array;

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m'
];

const styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
};

class ChalkClass {
	constructor(options) {
		// eslint-disable-next-line no-constructor-return
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = {};
	applyOptions(chalk, options);

	chalk.template = (...arguments_) => chalkTag(chalk.template, ...arguments_);

	Object.setPrototypeOf(chalk, Chalk.prototype);
	Object.setPrototypeOf(chalk.template, chalk);

	chalk.template.constructor = () => {
		throw new Error('`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');
	};

	chalk.template.Instance = ChalkClass;

	return chalk.template;
};

function Chalk(options) {
	return chalkFactory(options);
}

for (const [styleName, style] of Object.entries(ansiStyles)) {
	styles[styleName] = {
		get() {
			const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
			Object.defineProperty(this, styleName, {value: builder});
			return builder;
		}
	};
}

styles.visible = {
	get() {
		const builder = createBuilder(this, this._styler, true);
		Object.defineProperty(this, 'visible', {value: builder});
		return builder;
	}
};

const usedModels = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256'];

for (const model of usedModels) {
	styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

for (const model of usedModels) {
	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, {
	...styles,
	level: {
		enumerable: true,
		get() {
			return this._generator.level;
		},
		set(level) {
			this._generator.level = level;
		}
	}
});

const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === undefined) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}

	return {
		open,
		close,
		openAll,
		closeAll,
		parent
	};
};

const createBuilder = (self, _styler, _isEmpty) => {
	const builder = (...arguments_) => {
		if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
			// Called as a template literal, for example: chalk.red`2 + 3 = {bold ${2+3}}`
			return applyStyle(builder, chalkTag(builder, ...arguments_));
		}

		// Single argument is hot path, implicit coercion is faster than anything
		// eslint-disable-next-line no-implicit-coercion
		return applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));
	};

	// We alter the prototype because we must return a function, but there is
	// no way to create a function with a different prototype
	Object.setPrototypeOf(builder, proto);

	builder._generator = self;
	builder._styler = _styler;
	builder._isEmpty = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) {
		return self._isEmpty ? '' : string;
	}

	let styler = self._styler;

	if (styler === undefined) {
		return string;
	}

	const {openAll, closeAll} = styler;
	if (string.indexOf('\u001B') !== -1) {
		while (styler !== undefined) {
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			string = stringReplaceAll(string, styler.close, styler.open);

			styler = styler.parent;
		}
	}

	// We can move both next actions out of loop, because remaining actions in loop won't have
	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	const lfIndex = string.indexOf('\n');
	if (lfIndex !== -1) {
		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
	}

	return openAll + string + closeAll;
};

let template;
const chalkTag = (chalk, ...strings) => {
	const [firstString] = strings;

	if (!isArray(firstString) || !isArray(firstString.raw)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return strings.join(' ');
	}

	const arguments_ = strings.slice(1);
	const parts = [firstString.raw[0]];

	for (let i = 1; i < firstString.length; i++) {
		parts.push(
			String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
			String(firstString.raw[i])
		);
	}

	if (template === undefined) {
		template = __nccwpck_require__(500);
	}

	return template(chalk, parts.join(''));
};

Object.defineProperties(Chalk.prototype, styles);

const chalk = Chalk(); // eslint-disable-line new-cap
chalk.supportsColor = stdoutColor;
chalk.stderr = Chalk({level: stderrColor ? stderrColor.level : 0}); // eslint-disable-line new-cap
chalk.stderr.supportsColor = stderrColor;

module.exports = chalk;


/***/ }),

/***/ 500:
/***/ ((module) => {


const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;

const ESCAPES = new Map([
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
	['b', '\b'],
	['f', '\f'],
	['v', '\v'],
	['0', '\0'],
	['\\', '\\'],
	['e', '\u001B'],
	['a', '\u0007']
]);

function unescape(c) {
	const u = c[0] === 'u';
	const bracket = c[1] === '{';

	if ((u && !bracket && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
		return String.fromCharCode(parseInt(c.slice(1), 16));
	}

	if (u && bracket) {
		return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
	}

	return ESCAPES.get(c) || c;
}

function parseArguments(name, arguments_) {
	const results = [];
	const chunks = arguments_.trim().split(/\s*,\s*/g);
	let matches;

	for (const chunk of chunks) {
		const number = Number(chunk);
		if (!Number.isNaN(number)) {
			results.push(number);
		} else if ((matches = chunk.match(STRING_REGEX))) {
			results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
		} else {
			throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
		}
	}

	return results;
}

function parseStyle(style) {
	STYLE_REGEX.lastIndex = 0;

	const results = [];
	let matches;

	while ((matches = STYLE_REGEX.exec(style)) !== null) {
		const name = matches[1];

		if (matches[2]) {
			const args = parseArguments(name, matches[2]);
			results.push([name].concat(args));
		} else {
			results.push([name]);
		}
	}

	return results;
}

function buildStyle(chalk, styles) {
	const enabled = {};

	for (const layer of styles) {
		for (const style of layer.styles) {
			enabled[style[0]] = layer.inverse ? null : style.slice(1);
		}
	}

	let current = chalk;
	for (const [styleName, styles] of Object.entries(enabled)) {
		if (!Array.isArray(styles)) {
			continue;
		}

		if (!(styleName in current)) {
			throw new Error(`Unknown Chalk style: ${styleName}`);
		}

		current = styles.length > 0 ? current[styleName](...styles) : current[styleName];
	}

	return current;
}

module.exports = (chalk, temporary) => {
	const styles = [];
	const chunks = [];
	let chunk = [];

	// eslint-disable-next-line max-params
	temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
		if (escapeCharacter) {
			chunk.push(unescape(escapeCharacter));
		} else if (style) {
			const string = chunk.join('');
			chunk = [];
			chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
			styles.push({inverse, styles: parseStyle(style)});
		} else if (close) {
			if (styles.length === 0) {
				throw new Error('Found extraneous } in Chalk template literal');
			}

			chunks.push(buildStyle(chalk, styles)(chunk.join('')));
			chunk = [];
			styles.pop();
		} else {
			chunk.push(character);
		}
	});

	chunks.push(chunk.join(''));

	if (styles.length > 0) {
		const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
		throw new Error(errMessage);
	}

	return chunks.join('');
};


/***/ }),

/***/ 2415:
/***/ ((module) => {



const stringReplaceAll = (string, substring, replacer) => {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
	do {
		returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

const stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

module.exports = {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
};


/***/ }),

/***/ 7391:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* MIT license */
var cssKeywords = __nccwpck_require__(8510);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

var reverseKeywords = {};
for (var key in cssKeywords) {
	if (cssKeywords.hasOwnProperty(key)) {
		reverseKeywords[cssKeywords[key]] = key;
	}
}

var convert = module.exports = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

// hide .channels and .labels properties
for (var model in convert) {
	if (convert.hasOwnProperty(model)) {
		if (!('channels' in convert[model])) {
			throw new Error('missing channels property: ' + model);
		}

		if (!('labels' in convert[model])) {
			throw new Error('missing channel labels property: ' + model);
		}

		if (convert[model].labels.length !== convert[model].channels) {
			throw new Error('channel and label counts mismatch: ' + model);
		}

		var channels = convert[model].channels;
		var labels = convert[model].labels;
		delete convert[model].channels;
		delete convert[model].labels;
		Object.defineProperty(convert[model], 'channels', {value: channels});
		Object.defineProperty(convert[model], 'labels', {value: labels});
	}
}

convert.rgb.hsl = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var l;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	var rdif;
	var gdif;
	var bdif;
	var h;
	var s;

	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var v = Math.max(r, g, b);
	var diff = v - Math.min(r, g, b);
	var diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}
		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var h = convert.rgb.hsl(rgb)[0];
	var w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var c;
	var m;
	var y;
	var k;

	k = Math.min(1 - r, 1 - g, 1 - b);
	c = (1 - r - k) / (1 - k) || 0;
	m = (1 - g - k) / (1 - k) || 0;
	y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

/**
 * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
 * */
function comparativeDistance(x, y) {
	return (
		Math.pow(x[0] - y[0], 2) +
		Math.pow(x[1] - y[1], 2) +
		Math.pow(x[2] - y[2], 2)
	);
}

convert.rgb.keyword = function (rgb) {
	var reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	var currentClosestDistance = Infinity;
	var currentClosestKeyword;

	for (var keyword in cssKeywords) {
		if (cssKeywords.hasOwnProperty(keyword)) {
			var value = cssKeywords[keyword];

			// Compute comparative distance
			var distance = comparativeDistance(rgb, value);

			// Check if its less, if so set as closest
			if (distance < currentClosestDistance) {
				currentClosestDistance = distance;
				currentClosestKeyword = keyword;
			}
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;

	// assume sRGB
	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	var xyz = convert.rgb.xyz(rgb);
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	var h = hsl[0] / 360;
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var t1;
	var t2;
	var t3;
	var rgb;
	var val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	t1 = 2 * l - t2;

	rgb = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}
		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	var h = hsl[0];
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var smin = s;
	var lmin = Math.max(l, 0.01);
	var sv;
	var v;

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	v = (l + s) / 2;
	sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	var h = hsv[0] / 60;
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var hi = Math.floor(h) % 6;

	var f = h - Math.floor(h);
	var p = 255 * v * (1 - s);
	var q = 255 * v * (1 - (s * f));
	var t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	var h = hsv[0];
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var vmin = Math.max(v, 0.01);
	var lmin;
	var sl;
	var l;

	l = (2 - s) * v;
	lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	var h = hwb[0] / 360;
	var wh = hwb[1] / 100;
	var bl = hwb[2] / 100;
	var ratio = wh + bl;
	var i;
	var v;
	var f;
	var n;

	// wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	i = Math.floor(6 * h);
	v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	n = wh + f * (v - wh); // linear interpolation

	var r;
	var g;
	var b;
	switch (i) {
		default:
		case 6:
		case 0: r = v; g = n; b = wh; break;
		case 1: r = n; g = v; b = wh; break;
		case 2: r = wh; g = v; b = n; break;
		case 3: r = wh; g = n; b = v; break;
		case 4: r = n; g = wh; b = v; break;
		case 5: r = v; g = wh; b = n; break;
	}

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	var c = cmyk[0] / 100;
	var m = cmyk[1] / 100;
	var y = cmyk[2] / 100;
	var k = cmyk[3] / 100;
	var r;
	var g;
	var b;

	r = 1 - Math.min(1, c * (1 - k) + k);
	g = 1 - Math.min(1, m * (1 - k) + k);
	b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	var x = xyz[0] / 100;
	var y = xyz[1] / 100;
	var z = xyz[2] / 100;
	var r;
	var g;
	var b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// assume sRGB
	r = r > 0.0031308
		? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var x;
	var y;
	var z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	var y2 = Math.pow(y, 3);
	var x2 = Math.pow(x, 3);
	var z2 = Math.pow(z, 3);
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var hr;
	var h;
	var c;

	hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	var l = lch[0];
	var c = lch[1];
	var h = lch[2];
	var a;
	var b;
	var hr;

	hr = h / 360 * 2 * Math.PI;
	a = c * Math.cos(hr);
	b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];
	var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	var ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];

	// we use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	var ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	var color = args % 10;

	// handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	var mult = (~~(args > 50) + 1) * 0.5;
	var r = ((color & 1) * mult) * 255;
	var g = (((color >> 1) & 1) * mult) * 255;
	var b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// handle greyscale
	if (args >= 232) {
		var c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	var rem;
	var r = Math.floor(args / 36) / 5 * 255;
	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	var b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	var integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	var colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(function (char) {
			return char + char;
		}).join('');
	}

	var integer = parseInt(colorString, 16);
	var r = (integer >> 16) & 0xFF;
	var g = (integer >> 8) & 0xFF;
	var b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var max = Math.max(Math.max(r, g), b);
	var min = Math.min(Math.min(r, g), b);
	var chroma = (max - min);
	var grayscale;
	var hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma + 4;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var c = 1;
	var f = 0;

	if (l < 0.5) {
		c = 2.0 * s * l;
	} else {
		c = 2.0 * s * (1.0 - l);
	}

	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;

	var c = s * v;
	var f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	var h = hcg[0] / 360;
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	var pure = [0, 0, 0];
	var hi = (h % 1) * 6;
	var v = hi % 1;
	var w = 1 - v;
	var mg = 0;

	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var v = c + g * (1.0 - c);
	var f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var l = g * (1.0 - c) + 0.5 * c;
	var s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;
	var v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	var w = hwb[1] / 100;
	var b = hwb[2] / 100;
	var v = 1 - b;
	var c = v - w;
	var g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = convert.gray.hsv = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
	var integer = (val << 16) + (val << 8) + val;

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),

/***/ 6931:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var conversions = __nccwpck_require__(7391);
var route = __nccwpck_require__(880);

var convert = {};

var models = Object.keys(conversions);

function wrapRaw(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		return fn(args);
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		var result = fn(args);

		// we're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (var len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(function (fromModel) {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	var routes = route(fromModel);
	var routeModels = Object.keys(routes);

	routeModels.forEach(function (toModel) {
		var fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),

/***/ 880:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var conversions = __nccwpck_require__(7391);

/*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	var graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	var models = Object.keys(conversions);

	for (var len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	var graph = buildGraph();
	var queue = [fromModel]; // unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		var current = queue.pop();
		var adjacents = Object.keys(conversions[current]);

		for (var len = adjacents.length, i = 0; i < len; i++) {
			var adjacent = adjacents[i];
			var node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	var path = [graph[toModel].parent, toModel];
	var fn = conversions[graph[toModel].parent][toModel];

	var cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	var graph = deriveBFS(fromModel);
	var conversion = {};

	var models = Object.keys(graph);
	for (var len = models.length, i = 0; i < len; i++) {
		var toModel = models[i];
		var node = graph[toModel];

		if (node.parent === null) {
			// no possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),

/***/ 8510:
/***/ ((module) => {



module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),

/***/ 3505:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var util = __nccwpck_require__(3837);
var isArrayish = __nccwpck_require__(7604);

var errorEx = function errorEx(name, properties) {
	if (!name || name.constructor !== String) {
		properties = name || {};
		name = Error.name;
	}

	var errorExError = function ErrorEXError(message) {
		if (!this) {
			return new ErrorEXError(message);
		}

		message = message instanceof Error
			? message.message
			: (message || this.message);

		Error.call(this, message);
		Error.captureStackTrace(this, errorExError);

		this.name = name;

		Object.defineProperty(this, 'message', {
			configurable: true,
			enumerable: false,
			get: function () {
				var newMessage = message.split(/\r?\n/g);

				for (var key in properties) {
					if (!properties.hasOwnProperty(key)) {
						continue;
					}

					var modifier = properties[key];

					if ('message' in modifier) {
						newMessage = modifier.message(this[key], newMessage) || newMessage;
						if (!isArrayish(newMessage)) {
							newMessage = [newMessage];
						}
					}
				}

				return newMessage.join('\n');
			},
			set: function (v) {
				message = v;
			}
		});

		var overwrittenStack = null;

		var stackDescriptor = Object.getOwnPropertyDescriptor(this, 'stack');
		var stackGetter = stackDescriptor.get;
		var stackValue = stackDescriptor.value;
		delete stackDescriptor.value;
		delete stackDescriptor.writable;

		stackDescriptor.set = function (newstack) {
			overwrittenStack = newstack;
		};

		stackDescriptor.get = function () {
			var stack = (overwrittenStack || ((stackGetter)
				? stackGetter.call(this)
				: stackValue)).split(/\r?\n+/g);

			// starting in Node 7, the stack builder caches the message.
			// just replace it.
			if (!overwrittenStack) {
				stack[0] = this.name + ': ' + this.message;
			}

			var lineCount = 1;
			for (var key in properties) {
				if (!properties.hasOwnProperty(key)) {
					continue;
				}

				var modifier = properties[key];

				if ('line' in modifier) {
					var line = modifier.line(this[key]);
					if (line) {
						stack.splice(lineCount++, 0, '    ' + line);
					}
				}

				if ('stack' in modifier) {
					modifier.stack(this[key], stack);
				}
			}

			return stack.join('\n');
		};

		Object.defineProperty(this, 'stack', stackDescriptor);
	};

	if (Object.setPrototypeOf) {
		Object.setPrototypeOf(errorExError.prototype, Error.prototype);
		Object.setPrototypeOf(errorExError, Error);
	} else {
		util.inherits(errorExError, Error);
	}

	return errorExError;
};

errorEx.append = function (str, def) {
	return {
		message: function (v, message) {
			v = v || def;

			if (v) {
				message[0] += ' ' + str.replace('%s', v.toString());
			}

			return message;
		}
	};
};

errorEx.line = function (str, def) {
	return {
		line: function (v) {
			v = v || def;

			if (v) {
				return str.replace('%s', v.toString());
			}

			return null;
		}
	};
};

module.exports = errorEx;


/***/ }),

/***/ 8691:
/***/ ((module) => {



var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};


/***/ }),

/***/ 8206:
/***/ ((module) => {



// do not edit .js files directly - edit src/index.jst



module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};


/***/ }),

/***/ 1621:
/***/ ((module) => {



module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 7604:
/***/ ((module) => {



module.exports = function isArrayish(obj) {
	if (!obj) {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && obj.splice instanceof Function);
};


/***/ }),

/***/ 1531:
/***/ ((__unused_webpack_module, exports) => {

// Copyright 2014, 2015, 2016, 2017, 2018 Simon Lydell
// License: MIT. (See LICENSE.)

Object.defineProperty(exports, "__esModule", ({
  value: true
}))

// This regex comes from regex.coffee, and is inserted here by generate-index.js
// (run `npm run build`).
exports["default"] = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyus]{1,6}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g

exports.matchToToken = function(match) {
  var token = {type: "invalid", value: match[0], closed: undefined}
       if (match[ 1]) token.type = "string" , token.closed = !!(match[3] || match[4])
  else if (match[ 5]) token.type = "comment"
  else if (match[ 6]) token.type = "comment", token.closed = !!match[7]
  else if (match[ 8]) token.type = "regex"
  else if (match[ 9]) token.type = "number"
  else if (match[10]) token.type = "name"
  else if (match[11]) token.type = "punctuator"
  else if (match[12]) token.type = "whitespace"
  return token
}


/***/ }),

/***/ 9062:
/***/ ((module) => {



const hexify = char => {
  const h = char.charCodeAt(0).toString(16).toUpperCase()
  return '0x' + (h.length % 2 ? '0' : '') + h
}

const parseError = (e, txt, context) => {
  if (!txt) {
    return {
      message: e.message + ' while parsing empty string',
      position: 0,
    }
  }
  const badToken = e.message.match(/^Unexpected token (.) .*position\s+(\d+)/i)
  const errIdx = badToken ? +badToken[2]
    : e.message.match(/^Unexpected end of JSON.*/i) ? txt.length - 1
    : null

  const msg = badToken ? e.message.replace(/^Unexpected token ./, `Unexpected token ${
      JSON.stringify(badToken[1])
    } (${hexify(badToken[1])})`)
    : e.message

  if (errIdx !== null && errIdx !== undefined) {
    const start = errIdx <= context ? 0
      : errIdx - context

    const end = errIdx + context >= txt.length ? txt.length
      : errIdx + context

    const slice = (start === 0 ? '' : '...') +
      txt.slice(start, end) +
      (end === txt.length ? '' : '...')

    const near = txt === slice ? '' : 'near '

    return {
      message: msg + ` while parsing ${near}${JSON.stringify(slice)}`,
      position: errIdx,
    }
  } else {
    return {
      message: msg + ` while parsing '${txt.slice(0, context * 2)}'`,
      position: 0,
    }
  }
}

class JSONParseError extends SyntaxError {
  constructor (er, txt, context, caller) {
    context = context || 20
    const metadata = parseError(er, txt, context)
    super(metadata.message)
    Object.assign(this, metadata)
    this.code = 'EJSONPARSE'
    this.systemError = er
    Error.captureStackTrace(this, caller || this.constructor)
  }
  get name () { return this.constructor.name }
  set name (n) {}
  get [Symbol.toStringTag] () { return this.constructor.name }
}

const kIndent = Symbol.for('indent')
const kNewline = Symbol.for('newline')
// only respect indentation if we got a line break, otherwise squash it
// things other than objects and arrays aren't indented, so ignore those
// Important: in both of these regexps, the $1 capture group is the newline
// or undefined, and the $2 capture group is the indent, or undefined.
const formatRE = /^\s*[{\[]((?:\r?\n)+)([\s\t]*)/
const emptyRE = /^(?:\{\}|\[\])((?:\r?\n)+)?$/

const parseJson = (txt, reviver, context) => {
  const parseText = stripBOM(txt)
  context = context || 20
  try {
    // get the indentation so that we can save it back nicely
    // if the file starts with {" then we have an indent of '', ie, none
    // otherwise, pick the indentation of the next line after the first \n
    // If the pattern doesn't match, then it means no indentation.
    // JSON.stringify ignores symbols, so this is reasonably safe.
    // if the string is '{}' or '[]', then use the default 2-space indent.
    const [, newline = '\n', indent = '  '] = parseText.match(emptyRE) ||
      parseText.match(formatRE) ||
      [, '', '']

    const result = JSON.parse(parseText, reviver)
    if (result && typeof result === 'object') {
      result[kNewline] = newline
      result[kIndent] = indent
    }
    return result
  } catch (e) {
    if (typeof txt !== 'string' && !Buffer.isBuffer(txt)) {
      const isEmptyArray = Array.isArray(txt) && txt.length === 0
      throw Object.assign(new TypeError(
        `Cannot parse ${isEmptyArray ? 'an empty array' : String(txt)}`
      ), {
        code: 'EJSONPARSE',
        systemError: e,
      })
    }

    throw new JSONParseError(e, parseText, context, parseJson)
  }
}

// Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
// because the buffer-to-string conversion in `fs.readFileSync()`
// translates it to FEFF, the UTF-16 BOM.
const stripBOM = txt => String(txt).replace(/^\uFEFF/, '')

module.exports = parseJson
parseJson.JSONParseError = JSONParseError

parseJson.noExceptions = (txt, reviver) => {
  try {
    return JSON.parse(stripBOM(txt), reviver)
  } catch (e) {}
}


/***/ }),

/***/ 2533:
/***/ ((module) => {



var traverse = module.exports = function (schema, opts, cb) {
  // Legacy support for v0.3.1 and earlier.
  if (typeof opts == 'function') {
    cb = opts;
    opts = {};
  }

  cb = opts.cb || cb;
  var pre = (typeof cb == 'function') ? cb : cb.pre || function() {};
  var post = cb.post || function() {};

  _traverse(opts, pre, post, schema, '', schema);
};


traverse.keywords = {
  additionalItems: true,
  items: true,
  contains: true,
  additionalProperties: true,
  propertyNames: true,
  not: true,
  if: true,
  then: true,
  else: true
};

traverse.arrayKeywords = {
  items: true,
  allOf: true,
  anyOf: true,
  oneOf: true
};

traverse.propsKeywords = {
  $defs: true,
  definitions: true,
  properties: true,
  patternProperties: true,
  dependencies: true
};

traverse.skipKeywords = {
  default: true,
  enum: true,
  const: true,
  required: true,
  maximum: true,
  minimum: true,
  exclusiveMaximum: true,
  exclusiveMinimum: true,
  multipleOf: true,
  maxLength: true,
  minLength: true,
  pattern: true,
  format: true,
  maxItems: true,
  minItems: true,
  uniqueItems: true,
  maxProperties: true,
  minProperties: true
};


function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
  if (schema && typeof schema == 'object' && !Array.isArray(schema)) {
    pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
    for (var key in schema) {
      var sch = schema[key];
      if (Array.isArray(sch)) {
        if (key in traverse.arrayKeywords) {
          for (var i=0; i<sch.length; i++)
            _traverse(opts, pre, post, sch[i], jsonPtr + '/' + key + '/' + i, rootSchema, jsonPtr, key, schema, i);
        }
      } else if (key in traverse.propsKeywords) {
        if (sch && typeof sch == 'object') {
          for (var prop in sch)
            _traverse(opts, pre, post, sch[prop], jsonPtr + '/' + key + '/' + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
        }
      } else if (key in traverse.keywords || (opts.allKeys && !(key in traverse.skipKeywords))) {
        _traverse(opts, pre, post, sch, jsonPtr + '/' + key, rootSchema, jsonPtr, key, schema);
      }
    }
    post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
  }
}


function escapeJsonPtr(str) {
  return str.replace(/~/g, '~0').replace(/\//g, '~1');
}


/***/ }),

/***/ 6675:
/***/ (function(module) {

(function (global, factory) {
	 true ? module.exports = factory() :
	0;
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var graphemeSplitter = createCommonjsModule(function (module) {
	/*
 Breaks a Javascript string into individual user-perceived "characters" 
 called extended grapheme clusters by implementing the Unicode UAX-29 standard, version 10.0.0
 
 Usage:
 var splitter = new GraphemeSplitter();
 //returns an array of strings, one string for each grapheme cluster
 var graphemes = splitter.splitGraphemes(string); 
 
 */
	function GraphemeSplitter() {
		var CR = 0,
		    LF = 1,
		    Control = 2,
		    Extend = 3,
		    Regional_Indicator = 4,
		    SpacingMark = 5,
		    L = 6,
		    V = 7,
		    T = 8,
		    LV = 9,
		    LVT = 10,
		    Other = 11,
		    Prepend = 12,
		    E_Base = 13,
		    E_Modifier = 14,
		    ZWJ = 15,
		    Glue_After_Zwj = 16,
		    E_Base_GAZ = 17;

		// BreakTypes
		var NotBreak = 0,
		    BreakStart = 1,
		    Break = 2,
		    BreakLastRegional = 3,
		    BreakPenultimateRegional = 4;

		function isSurrogate(str, pos) {
			return 0xd800 <= str.charCodeAt(pos) && str.charCodeAt(pos) <= 0xdbff && 0xdc00 <= str.charCodeAt(pos + 1) && str.charCodeAt(pos + 1) <= 0xdfff;
		}

		// Private function, gets a Unicode code point from a JavaScript UTF-16 string
		// handling surrogate pairs appropriately
		function codePointAt(str, idx) {
			if (idx === undefined) {
				idx = 0;
			}
			var code = str.charCodeAt(idx);

			// if a high surrogate
			if (0xD800 <= code && code <= 0xDBFF && idx < str.length - 1) {
				var hi = code;
				var low = str.charCodeAt(idx + 1);
				if (0xDC00 <= low && low <= 0xDFFF) {
					return (hi - 0xD800) * 0x400 + (low - 0xDC00) + 0x10000;
				}
				return hi;
			}

			// if a low surrogate
			if (0xDC00 <= code && code <= 0xDFFF && idx >= 1) {
				var hi = str.charCodeAt(idx - 1);
				var low = code;
				if (0xD800 <= hi && hi <= 0xDBFF) {
					return (hi - 0xD800) * 0x400 + (low - 0xDC00) + 0x10000;
				}
				return low;
			}

			//just return the char if an unmatched surrogate half or a 
			//single-char codepoint
			return code;
		}

		// Private function, returns whether a break is allowed between the 
		// two given grapheme breaking classes
		function shouldBreak(start, mid, end) {
			var all = [start].concat(mid).concat([end]);
			var previous = all[all.length - 2];
			var next = end;

			// Lookahead termintor for:
			// GB10. (E_Base | EBG) Extend* ?	E_Modifier
			var eModifierIndex = all.lastIndexOf(E_Modifier);
			if (eModifierIndex > 1 && all.slice(1, eModifierIndex).every(function (c) {
				return c == Extend;
			}) && [Extend, E_Base, E_Base_GAZ].indexOf(start) == -1) {
				return Break;
			}

			// Lookahead termintor for:
			// GB12. ^ (RI RI)* RI	?	RI
			// GB13. [^RI] (RI RI)* RI	?	RI
			var rIIndex = all.lastIndexOf(Regional_Indicator);
			if (rIIndex > 0 && all.slice(1, rIIndex).every(function (c) {
				return c == Regional_Indicator;
			}) && [Prepend, Regional_Indicator].indexOf(previous) == -1) {
				if (all.filter(function (c) {
					return c == Regional_Indicator;
				}).length % 2 == 1) {
					return BreakLastRegional;
				} else {
					return BreakPenultimateRegional;
				}
			}

			// GB3. CR X LF
			if (previous == CR && next == LF) {
				return NotBreak;
			}
			// GB4. (Control|CR|LF) ÷
			else if (previous == Control || previous == CR || previous == LF) {
					if (next == E_Modifier && mid.every(function (c) {
						return c == Extend;
					})) {
						return Break;
					} else {
						return BreakStart;
					}
				}
				// GB5. ÷ (Control|CR|LF)
				else if (next == Control || next == CR || next == LF) {
						return BreakStart;
					}
					// GB6. L X (L|V|LV|LVT)
					else if (previous == L && (next == L || next == V || next == LV || next == LVT)) {
							return NotBreak;
						}
						// GB7. (LV|V) X (V|T)
						else if ((previous == LV || previous == V) && (next == V || next == T)) {
								return NotBreak;
							}
							// GB8. (LVT|T) X (T)
							else if ((previous == LVT || previous == T) && next == T) {
									return NotBreak;
								}
								// GB9. X (Extend|ZWJ)
								else if (next == Extend || next == ZWJ) {
										return NotBreak;
									}
									// GB9a. X SpacingMark
									else if (next == SpacingMark) {
											return NotBreak;
										}
										// GB9b. Prepend X
										else if (previous == Prepend) {
												return NotBreak;
											}

			// GB10. (E_Base | EBG) Extend* ?	E_Modifier
			var previousNonExtendIndex = all.indexOf(Extend) != -1 ? all.lastIndexOf(Extend) - 1 : all.length - 2;
			if ([E_Base, E_Base_GAZ].indexOf(all[previousNonExtendIndex]) != -1 && all.slice(previousNonExtendIndex + 1, -1).every(function (c) {
				return c == Extend;
			}) && next == E_Modifier) {
				return NotBreak;
			}

			// GB11. ZWJ ? (Glue_After_Zwj | EBG)
			if (previous == ZWJ && [Glue_After_Zwj, E_Base_GAZ].indexOf(next) != -1) {
				return NotBreak;
			}

			// GB12. ^ (RI RI)* RI ? RI
			// GB13. [^RI] (RI RI)* RI ? RI
			if (mid.indexOf(Regional_Indicator) != -1) {
				return Break;
			}
			if (previous == Regional_Indicator && next == Regional_Indicator) {
				return NotBreak;
			}

			// GB999. Any ? Any
			return BreakStart;
		}

		// Returns the next grapheme break in the string after the given index
		this.nextBreak = function (string, index) {
			if (index === undefined) {
				index = 0;
			}
			if (index < 0) {
				return 0;
			}
			if (index >= string.length - 1) {
				return string.length;
			}
			var prev = getGraphemeBreakProperty(codePointAt(string, index));
			var mid = [];
			for (var i = index + 1; i < string.length; i++) {
				// check for already processed low surrogates
				if (isSurrogate(string, i - 1)) {
					continue;
				}

				var next = getGraphemeBreakProperty(codePointAt(string, i));
				if (shouldBreak(prev, mid, next)) {
					return i;
				}

				mid.push(next);
			}
			return string.length;
		};

		// Breaks the given string into an array of grapheme cluster strings
		this.splitGraphemes = function (str) {
			var res = [];
			var index = 0;
			var brk;
			while ((brk = this.nextBreak(str, index)) < str.length) {
				res.push(str.slice(index, brk));
				index = brk;
			}
			if (index < str.length) {
				res.push(str.slice(index));
			}
			return res;
		};

		// Returns the iterator of grapheme clusters there are in the given string
		this.iterateGraphemes = function (str) {
			var index = 0;
			var res = {
				next: function () {
					var value;
					var brk;
					if ((brk = this.nextBreak(str, index)) < str.length) {
						value = str.slice(index, brk);
						index = brk;
						return { value: value, done: false };
					}
					if (index < str.length) {
						value = str.slice(index);
						index = str.length;
						return { value: value, done: false };
					}
					return { value: undefined, done: true };
				}.bind(this)
			};
			// ES2015 @@iterator method (iterable) for spread syntax and for...of statement
			if (typeof Symbol !== 'undefined' && Symbol.iterator) {
				res[Symbol.iterator] = function () {
					return res;
				};
			}
			return res;
		};

		// Returns the number of grapheme clusters there are in the given string
		this.countGraphemes = function (str) {
			var count = 0;
			var index = 0;
			var brk;
			while ((brk = this.nextBreak(str, index)) < str.length) {
				index = brk;
				count++;
			}
			if (index < str.length) {
				count++;
			}
			return count;
		};

		//given a Unicode code point, determines this symbol's grapheme break property
		function getGraphemeBreakProperty(code) {

			//grapheme break property for Unicode 10.0.0, 
			//taken from http://www.unicode.org/Public/10.0.0/ucd/auxiliary/GraphemeBreakProperty.txt
			//and adapted to JavaScript rules

			if (0x0600 <= code && code <= 0x0605 || // Cf   [6] ARABIC NUMBER SIGN..ARABIC NUMBER MARK ABOVE
			0x06DD == code || // Cf       ARABIC END OF AYAH
			0x070F == code || // Cf       SYRIAC ABBREVIATION MARK
			0x08E2 == code || // Cf       ARABIC DISPUTED END OF AYAH
			0x0D4E == code || // Lo       MALAYALAM LETTER DOT REPH
			0x110BD == code || // Cf       KAITHI NUMBER SIGN
			0x111C2 <= code && code <= 0x111C3 || // Lo   [2] SHARADA SIGN JIHVAMULIYA..SHARADA SIGN UPADHMANIYA
			0x11A3A == code || // Lo       ZANABAZAR SQUARE CLUSTER-INITIAL LETTER RA
			0x11A86 <= code && code <= 0x11A89 || // Lo   [4] SOYOMBO CLUSTER-INITIAL LETTER RA..SOYOMBO CLUSTER-INITIAL LETTER SA
			0x11D46 == code // Lo       MASARAM GONDI REPHA
			) {
					return Prepend;
				}
			if (0x000D == code // Cc       <control-000D>
			) {
					return CR;
				}

			if (0x000A == code // Cc       <control-000A>
			) {
					return LF;
				}

			if (0x0000 <= code && code <= 0x0009 || // Cc  [10] <control-0000>..<control-0009>
			0x000B <= code && code <= 0x000C || // Cc   [2] <control-000B>..<control-000C>
			0x000E <= code && code <= 0x001F || // Cc  [18] <control-000E>..<control-001F>
			0x007F <= code && code <= 0x009F || // Cc  [33] <control-007F>..<control-009F>
			0x00AD == code || // Cf       SOFT HYPHEN
			0x061C == code || // Cf       ARABIC LETTER MARK

			0x180E == code || // Cf       MONGOLIAN VOWEL SEPARATOR
			0x200B == code || // Cf       ZERO WIDTH SPACE
			0x200E <= code && code <= 0x200F || // Cf   [2] LEFT-TO-RIGHT MARK..RIGHT-TO-LEFT MARK
			0x2028 == code || // Zl       LINE SEPARATOR
			0x2029 == code || // Zp       PARAGRAPH SEPARATOR
			0x202A <= code && code <= 0x202E || // Cf   [5] LEFT-TO-RIGHT EMBEDDING..RIGHT-TO-LEFT OVERRIDE
			0x2060 <= code && code <= 0x2064 || // Cf   [5] WORD JOINER..INVISIBLE PLUS
			0x2065 == code || // Cn       <reserved-2065>
			0x2066 <= code && code <= 0x206F || // Cf  [10] LEFT-TO-RIGHT ISOLATE..NOMINAL DIGIT SHAPES
			0xD800 <= code && code <= 0xDFFF || // Cs [2048] <surrogate-D800>..<surrogate-DFFF>
			0xFEFF == code || // Cf       ZERO WIDTH NO-BREAK SPACE
			0xFFF0 <= code && code <= 0xFFF8 || // Cn   [9] <reserved-FFF0>..<reserved-FFF8>
			0xFFF9 <= code && code <= 0xFFFB || // Cf   [3] INTERLINEAR ANNOTATION ANCHOR..INTERLINEAR ANNOTATION TERMINATOR
			0x1BCA0 <= code && code <= 0x1BCA3 || // Cf   [4] SHORTHAND FORMAT LETTER OVERLAP..SHORTHAND FORMAT UP STEP
			0x1D173 <= code && code <= 0x1D17A || // Cf   [8] MUSICAL SYMBOL BEGIN BEAM..MUSICAL SYMBOL END PHRASE
			0xE0000 == code || // Cn       <reserved-E0000>
			0xE0001 == code || // Cf       LANGUAGE TAG
			0xE0002 <= code && code <= 0xE001F || // Cn  [30] <reserved-E0002>..<reserved-E001F>
			0xE0080 <= code && code <= 0xE00FF || // Cn [128] <reserved-E0080>..<reserved-E00FF>
			0xE01F0 <= code && code <= 0xE0FFF // Cn [3600] <reserved-E01F0>..<reserved-E0FFF>
			) {
					return Control;
				}

			if (0x0300 <= code && code <= 0x036F || // Mn [112] COMBINING GRAVE ACCENT..COMBINING LATIN SMALL LETTER X
			0x0483 <= code && code <= 0x0487 || // Mn   [5] COMBINING CYRILLIC TITLO..COMBINING CYRILLIC POKRYTIE
			0x0488 <= code && code <= 0x0489 || // Me   [2] COMBINING CYRILLIC HUNDRED THOUSANDS SIGN..COMBINING CYRILLIC MILLIONS SIGN
			0x0591 <= code && code <= 0x05BD || // Mn  [45] HEBREW ACCENT ETNAHTA..HEBREW POINT METEG
			0x05BF == code || // Mn       HEBREW POINT RAFE
			0x05C1 <= code && code <= 0x05C2 || // Mn   [2] HEBREW POINT SHIN DOT..HEBREW POINT SIN DOT
			0x05C4 <= code && code <= 0x05C5 || // Mn   [2] HEBREW MARK UPPER DOT..HEBREW MARK LOWER DOT
			0x05C7 == code || // Mn       HEBREW POINT QAMATS QATAN
			0x0610 <= code && code <= 0x061A || // Mn  [11] ARABIC SIGN SALLALLAHOU ALAYHE WASSALLAM..ARABIC SMALL KASRA
			0x064B <= code && code <= 0x065F || // Mn  [21] ARABIC FATHATAN..ARABIC WAVY HAMZA BELOW
			0x0670 == code || // Mn       ARABIC LETTER SUPERSCRIPT ALEF
			0x06D6 <= code && code <= 0x06DC || // Mn   [7] ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA..ARABIC SMALL HIGH SEEN
			0x06DF <= code && code <= 0x06E4 || // Mn   [6] ARABIC SMALL HIGH ROUNDED ZERO..ARABIC SMALL HIGH MADDA
			0x06E7 <= code && code <= 0x06E8 || // Mn   [2] ARABIC SMALL HIGH YEH..ARABIC SMALL HIGH NOON
			0x06EA <= code && code <= 0x06ED || // Mn   [4] ARABIC EMPTY CENTRE LOW STOP..ARABIC SMALL LOW MEEM
			0x0711 == code || // Mn       SYRIAC LETTER SUPERSCRIPT ALAPH
			0x0730 <= code && code <= 0x074A || // Mn  [27] SYRIAC PTHAHA ABOVE..SYRIAC BARREKH
			0x07A6 <= code && code <= 0x07B0 || // Mn  [11] THAANA ABAFILI..THAANA SUKUN
			0x07EB <= code && code <= 0x07F3 || // Mn   [9] NKO COMBINING SHORT HIGH TONE..NKO COMBINING DOUBLE DOT ABOVE
			0x0816 <= code && code <= 0x0819 || // Mn   [4] SAMARITAN MARK IN..SAMARITAN MARK DAGESH
			0x081B <= code && code <= 0x0823 || // Mn   [9] SAMARITAN MARK EPENTHETIC YUT..SAMARITAN VOWEL SIGN A
			0x0825 <= code && code <= 0x0827 || // Mn   [3] SAMARITAN VOWEL SIGN SHORT A..SAMARITAN VOWEL SIGN U
			0x0829 <= code && code <= 0x082D || // Mn   [5] SAMARITAN VOWEL SIGN LONG I..SAMARITAN MARK NEQUDAA
			0x0859 <= code && code <= 0x085B || // Mn   [3] MANDAIC AFFRICATION MARK..MANDAIC GEMINATION MARK
			0x08D4 <= code && code <= 0x08E1 || // Mn  [14] ARABIC SMALL HIGH WORD AR-RUB..ARABIC SMALL HIGH SIGN SAFHA
			0x08E3 <= code && code <= 0x0902 || // Mn  [32] ARABIC TURNED DAMMA BELOW..DEVANAGARI SIGN ANUSVARA
			0x093A == code || // Mn       DEVANAGARI VOWEL SIGN OE
			0x093C == code || // Mn       DEVANAGARI SIGN NUKTA
			0x0941 <= code && code <= 0x0948 || // Mn   [8] DEVANAGARI VOWEL SIGN U..DEVANAGARI VOWEL SIGN AI
			0x094D == code || // Mn       DEVANAGARI SIGN VIRAMA
			0x0951 <= code && code <= 0x0957 || // Mn   [7] DEVANAGARI STRESS SIGN UDATTA..DEVANAGARI VOWEL SIGN UUE
			0x0962 <= code && code <= 0x0963 || // Mn   [2] DEVANAGARI VOWEL SIGN VOCALIC L..DEVANAGARI VOWEL SIGN VOCALIC LL
			0x0981 == code || // Mn       BENGALI SIGN CANDRABINDU
			0x09BC == code || // Mn       BENGALI SIGN NUKTA
			0x09BE == code || // Mc       BENGALI VOWEL SIGN AA
			0x09C1 <= code && code <= 0x09C4 || // Mn   [4] BENGALI VOWEL SIGN U..BENGALI VOWEL SIGN VOCALIC RR
			0x09CD == code || // Mn       BENGALI SIGN VIRAMA
			0x09D7 == code || // Mc       BENGALI AU LENGTH MARK
			0x09E2 <= code && code <= 0x09E3 || // Mn   [2] BENGALI VOWEL SIGN VOCALIC L..BENGALI VOWEL SIGN VOCALIC LL
			0x0A01 <= code && code <= 0x0A02 || // Mn   [2] GURMUKHI SIGN ADAK BINDI..GURMUKHI SIGN BINDI
			0x0A3C == code || // Mn       GURMUKHI SIGN NUKTA
			0x0A41 <= code && code <= 0x0A42 || // Mn   [2] GURMUKHI VOWEL SIGN U..GURMUKHI VOWEL SIGN UU
			0x0A47 <= code && code <= 0x0A48 || // Mn   [2] GURMUKHI VOWEL SIGN EE..GURMUKHI VOWEL SIGN AI
			0x0A4B <= code && code <= 0x0A4D || // Mn   [3] GURMUKHI VOWEL SIGN OO..GURMUKHI SIGN VIRAMA
			0x0A51 == code || // Mn       GURMUKHI SIGN UDAAT
			0x0A70 <= code && code <= 0x0A71 || // Mn   [2] GURMUKHI TIPPI..GURMUKHI ADDAK
			0x0A75 == code || // Mn       GURMUKHI SIGN YAKASH
			0x0A81 <= code && code <= 0x0A82 || // Mn   [2] GUJARATI SIGN CANDRABINDU..GUJARATI SIGN ANUSVARA
			0x0ABC == code || // Mn       GUJARATI SIGN NUKTA
			0x0AC1 <= code && code <= 0x0AC5 || // Mn   [5] GUJARATI VOWEL SIGN U..GUJARATI VOWEL SIGN CANDRA E
			0x0AC7 <= code && code <= 0x0AC8 || // Mn   [2] GUJARATI VOWEL SIGN E..GUJARATI VOWEL SIGN AI
			0x0ACD == code || // Mn       GUJARATI SIGN VIRAMA
			0x0AE2 <= code && code <= 0x0AE3 || // Mn   [2] GUJARATI VOWEL SIGN VOCALIC L..GUJARATI VOWEL SIGN VOCALIC LL
			0x0AFA <= code && code <= 0x0AFF || // Mn   [6] GUJARATI SIGN SUKUN..GUJARATI SIGN TWO-CIRCLE NUKTA ABOVE
			0x0B01 == code || // Mn       ORIYA SIGN CANDRABINDU
			0x0B3C == code || // Mn       ORIYA SIGN NUKTA
			0x0B3E == code || // Mc       ORIYA VOWEL SIGN AA
			0x0B3F == code || // Mn       ORIYA VOWEL SIGN I
			0x0B41 <= code && code <= 0x0B44 || // Mn   [4] ORIYA VOWEL SIGN U..ORIYA VOWEL SIGN VOCALIC RR
			0x0B4D == code || // Mn       ORIYA SIGN VIRAMA
			0x0B56 == code || // Mn       ORIYA AI LENGTH MARK
			0x0B57 == code || // Mc       ORIYA AU LENGTH MARK
			0x0B62 <= code && code <= 0x0B63 || // Mn   [2] ORIYA VOWEL SIGN VOCALIC L..ORIYA VOWEL SIGN VOCALIC LL
			0x0B82 == code || // Mn       TAMIL SIGN ANUSVARA
			0x0BBE == code || // Mc       TAMIL VOWEL SIGN AA
			0x0BC0 == code || // Mn       TAMIL VOWEL SIGN II
			0x0BCD == code || // Mn       TAMIL SIGN VIRAMA
			0x0BD7 == code || // Mc       TAMIL AU LENGTH MARK
			0x0C00 == code || // Mn       TELUGU SIGN COMBINING CANDRABINDU ABOVE
			0x0C3E <= code && code <= 0x0C40 || // Mn   [3] TELUGU VOWEL SIGN AA..TELUGU VOWEL SIGN II
			0x0C46 <= code && code <= 0x0C48 || // Mn   [3] TELUGU VOWEL SIGN E..TELUGU VOWEL SIGN AI
			0x0C4A <= code && code <= 0x0C4D || // Mn   [4] TELUGU VOWEL SIGN O..TELUGU SIGN VIRAMA
			0x0C55 <= code && code <= 0x0C56 || // Mn   [2] TELUGU LENGTH MARK..TELUGU AI LENGTH MARK
			0x0C62 <= code && code <= 0x0C63 || // Mn   [2] TELUGU VOWEL SIGN VOCALIC L..TELUGU VOWEL SIGN VOCALIC LL
			0x0C81 == code || // Mn       KANNADA SIGN CANDRABINDU
			0x0CBC == code || // Mn       KANNADA SIGN NUKTA
			0x0CBF == code || // Mn       KANNADA VOWEL SIGN I
			0x0CC2 == code || // Mc       KANNADA VOWEL SIGN UU
			0x0CC6 == code || // Mn       KANNADA VOWEL SIGN E
			0x0CCC <= code && code <= 0x0CCD || // Mn   [2] KANNADA VOWEL SIGN AU..KANNADA SIGN VIRAMA
			0x0CD5 <= code && code <= 0x0CD6 || // Mc   [2] KANNADA LENGTH MARK..KANNADA AI LENGTH MARK
			0x0CE2 <= code && code <= 0x0CE3 || // Mn   [2] KANNADA VOWEL SIGN VOCALIC L..KANNADA VOWEL SIGN VOCALIC LL
			0x0D00 <= code && code <= 0x0D01 || // Mn   [2] MALAYALAM SIGN COMBINING ANUSVARA ABOVE..MALAYALAM SIGN CANDRABINDU
			0x0D3B <= code && code <= 0x0D3C || // Mn   [2] MALAYALAM SIGN VERTICAL BAR VIRAMA..MALAYALAM SIGN CIRCULAR VIRAMA
			0x0D3E == code || // Mc       MALAYALAM VOWEL SIGN AA
			0x0D41 <= code && code <= 0x0D44 || // Mn   [4] MALAYALAM VOWEL SIGN U..MALAYALAM VOWEL SIGN VOCALIC RR
			0x0D4D == code || // Mn       MALAYALAM SIGN VIRAMA
			0x0D57 == code || // Mc       MALAYALAM AU LENGTH MARK
			0x0D62 <= code && code <= 0x0D63 || // Mn   [2] MALAYALAM VOWEL SIGN VOCALIC L..MALAYALAM VOWEL SIGN VOCALIC LL
			0x0DCA == code || // Mn       SINHALA SIGN AL-LAKUNA
			0x0DCF == code || // Mc       SINHALA VOWEL SIGN AELA-PILLA
			0x0DD2 <= code && code <= 0x0DD4 || // Mn   [3] SINHALA VOWEL SIGN KETTI IS-PILLA..SINHALA VOWEL SIGN KETTI PAA-PILLA
			0x0DD6 == code || // Mn       SINHALA VOWEL SIGN DIGA PAA-PILLA
			0x0DDF == code || // Mc       SINHALA VOWEL SIGN GAYANUKITTA
			0x0E31 == code || // Mn       THAI CHARACTER MAI HAN-AKAT
			0x0E34 <= code && code <= 0x0E3A || // Mn   [7] THAI CHARACTER SARA I..THAI CHARACTER PHINTHU
			0x0E47 <= code && code <= 0x0E4E || // Mn   [8] THAI CHARACTER MAITAIKHU..THAI CHARACTER YAMAKKAN
			0x0EB1 == code || // Mn       LAO VOWEL SIGN MAI KAN
			0x0EB4 <= code && code <= 0x0EB9 || // Mn   [6] LAO VOWEL SIGN I..LAO VOWEL SIGN UU
			0x0EBB <= code && code <= 0x0EBC || // Mn   [2] LAO VOWEL SIGN MAI KON..LAO SEMIVOWEL SIGN LO
			0x0EC8 <= code && code <= 0x0ECD || // Mn   [6] LAO TONE MAI EK..LAO NIGGAHITA
			0x0F18 <= code && code <= 0x0F19 || // Mn   [2] TIBETAN ASTROLOGICAL SIGN -KHYUD PA..TIBETAN ASTROLOGICAL SIGN SDONG TSHUGS
			0x0F35 == code || // Mn       TIBETAN MARK NGAS BZUNG NYI ZLA
			0x0F37 == code || // Mn       TIBETAN MARK NGAS BZUNG SGOR RTAGS
			0x0F39 == code || // Mn       TIBETAN MARK TSA -PHRU
			0x0F71 <= code && code <= 0x0F7E || // Mn  [14] TIBETAN VOWEL SIGN AA..TIBETAN SIGN RJES SU NGA RO
			0x0F80 <= code && code <= 0x0F84 || // Mn   [5] TIBETAN VOWEL SIGN REVERSED I..TIBETAN MARK HALANTA
			0x0F86 <= code && code <= 0x0F87 || // Mn   [2] TIBETAN SIGN LCI RTAGS..TIBETAN SIGN YANG RTAGS
			0x0F8D <= code && code <= 0x0F97 || // Mn  [11] TIBETAN SUBJOINED SIGN LCE TSA CAN..TIBETAN SUBJOINED LETTER JA
			0x0F99 <= code && code <= 0x0FBC || // Mn  [36] TIBETAN SUBJOINED LETTER NYA..TIBETAN SUBJOINED LETTER FIXED-FORM RA
			0x0FC6 == code || // Mn       TIBETAN SYMBOL PADMA GDAN
			0x102D <= code && code <= 0x1030 || // Mn   [4] MYANMAR VOWEL SIGN I..MYANMAR VOWEL SIGN UU
			0x1032 <= code && code <= 0x1037 || // Mn   [6] MYANMAR VOWEL SIGN AI..MYANMAR SIGN DOT BELOW
			0x1039 <= code && code <= 0x103A || // Mn   [2] MYANMAR SIGN VIRAMA..MYANMAR SIGN ASAT
			0x103D <= code && code <= 0x103E || // Mn   [2] MYANMAR CONSONANT SIGN MEDIAL WA..MYANMAR CONSONANT SIGN MEDIAL HA
			0x1058 <= code && code <= 0x1059 || // Mn   [2] MYANMAR VOWEL SIGN VOCALIC L..MYANMAR VOWEL SIGN VOCALIC LL
			0x105E <= code && code <= 0x1060 || // Mn   [3] MYANMAR CONSONANT SIGN MON MEDIAL NA..MYANMAR CONSONANT SIGN MON MEDIAL LA
			0x1071 <= code && code <= 0x1074 || // Mn   [4] MYANMAR VOWEL SIGN GEBA KAREN I..MYANMAR VOWEL SIGN KAYAH EE
			0x1082 == code || // Mn       MYANMAR CONSONANT SIGN SHAN MEDIAL WA
			0x1085 <= code && code <= 0x1086 || // Mn   [2] MYANMAR VOWEL SIGN SHAN E ABOVE..MYANMAR VOWEL SIGN SHAN FINAL Y
			0x108D == code || // Mn       MYANMAR SIGN SHAN COUNCIL EMPHATIC TONE
			0x109D == code || // Mn       MYANMAR VOWEL SIGN AITON AI
			0x135D <= code && code <= 0x135F || // Mn   [3] ETHIOPIC COMBINING GEMINATION AND VOWEL LENGTH MARK..ETHIOPIC COMBINING GEMINATION MARK
			0x1712 <= code && code <= 0x1714 || // Mn   [3] TAGALOG VOWEL SIGN I..TAGALOG SIGN VIRAMA
			0x1732 <= code && code <= 0x1734 || // Mn   [3] HANUNOO VOWEL SIGN I..HANUNOO SIGN PAMUDPOD
			0x1752 <= code && code <= 0x1753 || // Mn   [2] BUHID VOWEL SIGN I..BUHID VOWEL SIGN U
			0x1772 <= code && code <= 0x1773 || // Mn   [2] TAGBANWA VOWEL SIGN I..TAGBANWA VOWEL SIGN U
			0x17B4 <= code && code <= 0x17B5 || // Mn   [2] KHMER VOWEL INHERENT AQ..KHMER VOWEL INHERENT AA
			0x17B7 <= code && code <= 0x17BD || // Mn   [7] KHMER VOWEL SIGN I..KHMER VOWEL SIGN UA
			0x17C6 == code || // Mn       KHMER SIGN NIKAHIT
			0x17C9 <= code && code <= 0x17D3 || // Mn  [11] KHMER SIGN MUUSIKATOAN..KHMER SIGN BATHAMASAT
			0x17DD == code || // Mn       KHMER SIGN ATTHACAN
			0x180B <= code && code <= 0x180D || // Mn   [3] MONGOLIAN FREE VARIATION SELECTOR ONE..MONGOLIAN FREE VARIATION SELECTOR THREE
			0x1885 <= code && code <= 0x1886 || // Mn   [2] MONGOLIAN LETTER ALI GALI BALUDA..MONGOLIAN LETTER ALI GALI THREE BALUDA
			0x18A9 == code || // Mn       MONGOLIAN LETTER ALI GALI DAGALGA
			0x1920 <= code && code <= 0x1922 || // Mn   [3] LIMBU VOWEL SIGN A..LIMBU VOWEL SIGN U
			0x1927 <= code && code <= 0x1928 || // Mn   [2] LIMBU VOWEL SIGN E..LIMBU VOWEL SIGN O
			0x1932 == code || // Mn       LIMBU SMALL LETTER ANUSVARA
			0x1939 <= code && code <= 0x193B || // Mn   [3] LIMBU SIGN MUKPHRENG..LIMBU SIGN SA-I
			0x1A17 <= code && code <= 0x1A18 || // Mn   [2] BUGINESE VOWEL SIGN I..BUGINESE VOWEL SIGN U
			0x1A1B == code || // Mn       BUGINESE VOWEL SIGN AE
			0x1A56 == code || // Mn       TAI THAM CONSONANT SIGN MEDIAL LA
			0x1A58 <= code && code <= 0x1A5E || // Mn   [7] TAI THAM SIGN MAI KANG LAI..TAI THAM CONSONANT SIGN SA
			0x1A60 == code || // Mn       TAI THAM SIGN SAKOT
			0x1A62 == code || // Mn       TAI THAM VOWEL SIGN MAI SAT
			0x1A65 <= code && code <= 0x1A6C || // Mn   [8] TAI THAM VOWEL SIGN I..TAI THAM VOWEL SIGN OA BELOW
			0x1A73 <= code && code <= 0x1A7C || // Mn  [10] TAI THAM VOWEL SIGN OA ABOVE..TAI THAM SIGN KHUEN-LUE KARAN
			0x1A7F == code || // Mn       TAI THAM COMBINING CRYPTOGRAMMIC DOT
			0x1AB0 <= code && code <= 0x1ABD || // Mn  [14] COMBINING DOUBLED CIRCUMFLEX ACCENT..COMBINING PARENTHESES BELOW
			0x1ABE == code || // Me       COMBINING PARENTHESES OVERLAY
			0x1B00 <= code && code <= 0x1B03 || // Mn   [4] BALINESE SIGN ULU RICEM..BALINESE SIGN SURANG
			0x1B34 == code || // Mn       BALINESE SIGN REREKAN
			0x1B36 <= code && code <= 0x1B3A || // Mn   [5] BALINESE VOWEL SIGN ULU..BALINESE VOWEL SIGN RA REPA
			0x1B3C == code || // Mn       BALINESE VOWEL SIGN LA LENGA
			0x1B42 == code || // Mn       BALINESE VOWEL SIGN PEPET
			0x1B6B <= code && code <= 0x1B73 || // Mn   [9] BALINESE MUSICAL SYMBOL COMBINING TEGEH..BALINESE MUSICAL SYMBOL COMBINING GONG
			0x1B80 <= code && code <= 0x1B81 || // Mn   [2] SUNDANESE SIGN PANYECEK..SUNDANESE SIGN PANGLAYAR
			0x1BA2 <= code && code <= 0x1BA5 || // Mn   [4] SUNDANESE CONSONANT SIGN PANYAKRA..SUNDANESE VOWEL SIGN PANYUKU
			0x1BA8 <= code && code <= 0x1BA9 || // Mn   [2] SUNDANESE VOWEL SIGN PAMEPET..SUNDANESE VOWEL SIGN PANEULEUNG
			0x1BAB <= code && code <= 0x1BAD || // Mn   [3] SUNDANESE SIGN VIRAMA..SUNDANESE CONSONANT SIGN PASANGAN WA
			0x1BE6 == code || // Mn       BATAK SIGN TOMPI
			0x1BE8 <= code && code <= 0x1BE9 || // Mn   [2] BATAK VOWEL SIGN PAKPAK E..BATAK VOWEL SIGN EE
			0x1BED == code || // Mn       BATAK VOWEL SIGN KARO O
			0x1BEF <= code && code <= 0x1BF1 || // Mn   [3] BATAK VOWEL SIGN U FOR SIMALUNGUN SA..BATAK CONSONANT SIGN H
			0x1C2C <= code && code <= 0x1C33 || // Mn   [8] LEPCHA VOWEL SIGN E..LEPCHA CONSONANT SIGN T
			0x1C36 <= code && code <= 0x1C37 || // Mn   [2] LEPCHA SIGN RAN..LEPCHA SIGN NUKTA
			0x1CD0 <= code && code <= 0x1CD2 || // Mn   [3] VEDIC TONE KARSHANA..VEDIC TONE PRENKHA
			0x1CD4 <= code && code <= 0x1CE0 || // Mn  [13] VEDIC SIGN YAJURVEDIC MIDLINE SVARITA..VEDIC TONE RIGVEDIC KASHMIRI INDEPENDENT SVARITA
			0x1CE2 <= code && code <= 0x1CE8 || // Mn   [7] VEDIC SIGN VISARGA SVARITA..VEDIC SIGN VISARGA ANUDATTA WITH TAIL
			0x1CED == code || // Mn       VEDIC SIGN TIRYAK
			0x1CF4 == code || // Mn       VEDIC TONE CANDRA ABOVE
			0x1CF8 <= code && code <= 0x1CF9 || // Mn   [2] VEDIC TONE RING ABOVE..VEDIC TONE DOUBLE RING ABOVE
			0x1DC0 <= code && code <= 0x1DF9 || // Mn  [58] COMBINING DOTTED GRAVE ACCENT..COMBINING WIDE INVERTED BRIDGE BELOW
			0x1DFB <= code && code <= 0x1DFF || // Mn   [5] COMBINING DELETION MARK..COMBINING RIGHT ARROWHEAD AND DOWN ARROWHEAD BELOW
			0x200C == code || // Cf       ZERO WIDTH NON-JOINER
			0x20D0 <= code && code <= 0x20DC || // Mn  [13] COMBINING LEFT HARPOON ABOVE..COMBINING FOUR DOTS ABOVE
			0x20DD <= code && code <= 0x20E0 || // Me   [4] COMBINING ENCLOSING CIRCLE..COMBINING ENCLOSING CIRCLE BACKSLASH
			0x20E1 == code || // Mn       COMBINING LEFT RIGHT ARROW ABOVE
			0x20E2 <= code && code <= 0x20E4 || // Me   [3] COMBINING ENCLOSING SCREEN..COMBINING ENCLOSING UPWARD POINTING TRIANGLE
			0x20E5 <= code && code <= 0x20F0 || // Mn  [12] COMBINING REVERSE SOLIDUS OVERLAY..COMBINING ASTERISK ABOVE
			0x2CEF <= code && code <= 0x2CF1 || // Mn   [3] COPTIC COMBINING NI ABOVE..COPTIC COMBINING SPIRITUS LENIS
			0x2D7F == code || // Mn       TIFINAGH CONSONANT JOINER
			0x2DE0 <= code && code <= 0x2DFF || // Mn  [32] COMBINING CYRILLIC LETTER BE..COMBINING CYRILLIC LETTER IOTIFIED BIG YUS
			0x302A <= code && code <= 0x302D || // Mn   [4] IDEOGRAPHIC LEVEL TONE MARK..IDEOGRAPHIC ENTERING TONE MARK
			0x302E <= code && code <= 0x302F || // Mc   [2] HANGUL SINGLE DOT TONE MARK..HANGUL DOUBLE DOT TONE MARK
			0x3099 <= code && code <= 0x309A || // Mn   [2] COMBINING KATAKANA-HIRAGANA VOICED SOUND MARK..COMBINING KATAKANA-HIRAGANA SEMI-VOICED SOUND MARK
			0xA66F == code || // Mn       COMBINING CYRILLIC VZMET
			0xA670 <= code && code <= 0xA672 || // Me   [3] COMBINING CYRILLIC TEN MILLIONS SIGN..COMBINING CYRILLIC THOUSAND MILLIONS SIGN
			0xA674 <= code && code <= 0xA67D || // Mn  [10] COMBINING CYRILLIC LETTER UKRAINIAN IE..COMBINING CYRILLIC PAYEROK
			0xA69E <= code && code <= 0xA69F || // Mn   [2] COMBINING CYRILLIC LETTER EF..COMBINING CYRILLIC LETTER IOTIFIED E
			0xA6F0 <= code && code <= 0xA6F1 || // Mn   [2] BAMUM COMBINING MARK KOQNDON..BAMUM COMBINING MARK TUKWENTIS
			0xA802 == code || // Mn       SYLOTI NAGRI SIGN DVISVARA
			0xA806 == code || // Mn       SYLOTI NAGRI SIGN HASANTA
			0xA80B == code || // Mn       SYLOTI NAGRI SIGN ANUSVARA
			0xA825 <= code && code <= 0xA826 || // Mn   [2] SYLOTI NAGRI VOWEL SIGN U..SYLOTI NAGRI VOWEL SIGN E
			0xA8C4 <= code && code <= 0xA8C5 || // Mn   [2] SAURASHTRA SIGN VIRAMA..SAURASHTRA SIGN CANDRABINDU
			0xA8E0 <= code && code <= 0xA8F1 || // Mn  [18] COMBINING DEVANAGARI DIGIT ZERO..COMBINING DEVANAGARI SIGN AVAGRAHA
			0xA926 <= code && code <= 0xA92D || // Mn   [8] KAYAH LI VOWEL UE..KAYAH LI TONE CALYA PLOPHU
			0xA947 <= code && code <= 0xA951 || // Mn  [11] REJANG VOWEL SIGN I..REJANG CONSONANT SIGN R
			0xA980 <= code && code <= 0xA982 || // Mn   [3] JAVANESE SIGN PANYANGGA..JAVANESE SIGN LAYAR
			0xA9B3 == code || // Mn       JAVANESE SIGN CECAK TELU
			0xA9B6 <= code && code <= 0xA9B9 || // Mn   [4] JAVANESE VOWEL SIGN WULU..JAVANESE VOWEL SIGN SUKU MENDUT
			0xA9BC == code || // Mn       JAVANESE VOWEL SIGN PEPET
			0xA9E5 == code || // Mn       MYANMAR SIGN SHAN SAW
			0xAA29 <= code && code <= 0xAA2E || // Mn   [6] CHAM VOWEL SIGN AA..CHAM VOWEL SIGN OE
			0xAA31 <= code && code <= 0xAA32 || // Mn   [2] CHAM VOWEL SIGN AU..CHAM VOWEL SIGN UE
			0xAA35 <= code && code <= 0xAA36 || // Mn   [2] CHAM CONSONANT SIGN LA..CHAM CONSONANT SIGN WA
			0xAA43 == code || // Mn       CHAM CONSONANT SIGN FINAL NG
			0xAA4C == code || // Mn       CHAM CONSONANT SIGN FINAL M
			0xAA7C == code || // Mn       MYANMAR SIGN TAI LAING TONE-2
			0xAAB0 == code || // Mn       TAI VIET MAI KANG
			0xAAB2 <= code && code <= 0xAAB4 || // Mn   [3] TAI VIET VOWEL I..TAI VIET VOWEL U
			0xAAB7 <= code && code <= 0xAAB8 || // Mn   [2] TAI VIET MAI KHIT..TAI VIET VOWEL IA
			0xAABE <= code && code <= 0xAABF || // Mn   [2] TAI VIET VOWEL AM..TAI VIET TONE MAI EK
			0xAAC1 == code || // Mn       TAI VIET TONE MAI THO
			0xAAEC <= code && code <= 0xAAED || // Mn   [2] MEETEI MAYEK VOWEL SIGN UU..MEETEI MAYEK VOWEL SIGN AAI
			0xAAF6 == code || // Mn       MEETEI MAYEK VIRAMA
			0xABE5 == code || // Mn       MEETEI MAYEK VOWEL SIGN ANAP
			0xABE8 == code || // Mn       MEETEI MAYEK VOWEL SIGN UNAP
			0xABED == code || // Mn       MEETEI MAYEK APUN IYEK
			0xFB1E == code || // Mn       HEBREW POINT JUDEO-SPANISH VARIKA
			0xFE00 <= code && code <= 0xFE0F || // Mn  [16] VARIATION SELECTOR-1..VARIATION SELECTOR-16
			0xFE20 <= code && code <= 0xFE2F || // Mn  [16] COMBINING LIGATURE LEFT HALF..COMBINING CYRILLIC TITLO RIGHT HALF
			0xFF9E <= code && code <= 0xFF9F || // Lm   [2] HALFWIDTH KATAKANA VOICED SOUND MARK..HALFWIDTH KATAKANA SEMI-VOICED SOUND MARK
			0x101FD == code || // Mn       PHAISTOS DISC SIGN COMBINING OBLIQUE STROKE
			0x102E0 == code || // Mn       COPTIC EPACT THOUSANDS MARK
			0x10376 <= code && code <= 0x1037A || // Mn   [5] COMBINING OLD PERMIC LETTER AN..COMBINING OLD PERMIC LETTER SII
			0x10A01 <= code && code <= 0x10A03 || // Mn   [3] KHAROSHTHI VOWEL SIGN I..KHAROSHTHI VOWEL SIGN VOCALIC R
			0x10A05 <= code && code <= 0x10A06 || // Mn   [2] KHAROSHTHI VOWEL SIGN E..KHAROSHTHI VOWEL SIGN O
			0x10A0C <= code && code <= 0x10A0F || // Mn   [4] KHAROSHTHI VOWEL LENGTH MARK..KHAROSHTHI SIGN VISARGA
			0x10A38 <= code && code <= 0x10A3A || // Mn   [3] KHAROSHTHI SIGN BAR ABOVE..KHAROSHTHI SIGN DOT BELOW
			0x10A3F == code || // Mn       KHAROSHTHI VIRAMA
			0x10AE5 <= code && code <= 0x10AE6 || // Mn   [2] MANICHAEAN ABBREVIATION MARK ABOVE..MANICHAEAN ABBREVIATION MARK BELOW
			0x11001 == code || // Mn       BRAHMI SIGN ANUSVARA
			0x11038 <= code && code <= 0x11046 || // Mn  [15] BRAHMI VOWEL SIGN AA..BRAHMI VIRAMA
			0x1107F <= code && code <= 0x11081 || // Mn   [3] BRAHMI NUMBER JOINER..KAITHI SIGN ANUSVARA
			0x110B3 <= code && code <= 0x110B6 || // Mn   [4] KAITHI VOWEL SIGN U..KAITHI VOWEL SIGN AI
			0x110B9 <= code && code <= 0x110BA || // Mn   [2] KAITHI SIGN VIRAMA..KAITHI SIGN NUKTA
			0x11100 <= code && code <= 0x11102 || // Mn   [3] CHAKMA SIGN CANDRABINDU..CHAKMA SIGN VISARGA
			0x11127 <= code && code <= 0x1112B || // Mn   [5] CHAKMA VOWEL SIGN A..CHAKMA VOWEL SIGN UU
			0x1112D <= code && code <= 0x11134 || // Mn   [8] CHAKMA VOWEL SIGN AI..CHAKMA MAAYYAA
			0x11173 == code || // Mn       MAHAJANI SIGN NUKTA
			0x11180 <= code && code <= 0x11181 || // Mn   [2] SHARADA SIGN CANDRABINDU..SHARADA SIGN ANUSVARA
			0x111B6 <= code && code <= 0x111BE || // Mn   [9] SHARADA VOWEL SIGN U..SHARADA VOWEL SIGN O
			0x111CA <= code && code <= 0x111CC || // Mn   [3] SHARADA SIGN NUKTA..SHARADA EXTRA SHORT VOWEL MARK
			0x1122F <= code && code <= 0x11231 || // Mn   [3] KHOJKI VOWEL SIGN U..KHOJKI VOWEL SIGN AI
			0x11234 == code || // Mn       KHOJKI SIGN ANUSVARA
			0x11236 <= code && code <= 0x11237 || // Mn   [2] KHOJKI SIGN NUKTA..KHOJKI SIGN SHADDA
			0x1123E == code || // Mn       KHOJKI SIGN SUKUN
			0x112DF == code || // Mn       KHUDAWADI SIGN ANUSVARA
			0x112E3 <= code && code <= 0x112EA || // Mn   [8] KHUDAWADI VOWEL SIGN U..KHUDAWADI SIGN VIRAMA
			0x11300 <= code && code <= 0x11301 || // Mn   [2] GRANTHA SIGN COMBINING ANUSVARA ABOVE..GRANTHA SIGN CANDRABINDU
			0x1133C == code || // Mn       GRANTHA SIGN NUKTA
			0x1133E == code || // Mc       GRANTHA VOWEL SIGN AA
			0x11340 == code || // Mn       GRANTHA VOWEL SIGN II
			0x11357 == code || // Mc       GRANTHA AU LENGTH MARK
			0x11366 <= code && code <= 0x1136C || // Mn   [7] COMBINING GRANTHA DIGIT ZERO..COMBINING GRANTHA DIGIT SIX
			0x11370 <= code && code <= 0x11374 || // Mn   [5] COMBINING GRANTHA LETTER A..COMBINING GRANTHA LETTER PA
			0x11438 <= code && code <= 0x1143F || // Mn   [8] NEWA VOWEL SIGN U..NEWA VOWEL SIGN AI
			0x11442 <= code && code <= 0x11444 || // Mn   [3] NEWA SIGN VIRAMA..NEWA SIGN ANUSVARA
			0x11446 == code || // Mn       NEWA SIGN NUKTA
			0x114B0 == code || // Mc       TIRHUTA VOWEL SIGN AA
			0x114B3 <= code && code <= 0x114B8 || // Mn   [6] TIRHUTA VOWEL SIGN U..TIRHUTA VOWEL SIGN VOCALIC LL
			0x114BA == code || // Mn       TIRHUTA VOWEL SIGN SHORT E
			0x114BD == code || // Mc       TIRHUTA VOWEL SIGN SHORT O
			0x114BF <= code && code <= 0x114C0 || // Mn   [2] TIRHUTA SIGN CANDRABINDU..TIRHUTA SIGN ANUSVARA
			0x114C2 <= code && code <= 0x114C3 || // Mn   [2] TIRHUTA SIGN VIRAMA..TIRHUTA SIGN NUKTA
			0x115AF == code || // Mc       SIDDHAM VOWEL SIGN AA
			0x115B2 <= code && code <= 0x115B5 || // Mn   [4] SIDDHAM VOWEL SIGN U..SIDDHAM VOWEL SIGN VOCALIC RR
			0x115BC <= code && code <= 0x115BD || // Mn   [2] SIDDHAM SIGN CANDRABINDU..SIDDHAM SIGN ANUSVARA
			0x115BF <= code && code <= 0x115C0 || // Mn   [2] SIDDHAM SIGN VIRAMA..SIDDHAM SIGN NUKTA
			0x115DC <= code && code <= 0x115DD || // Mn   [2] SIDDHAM VOWEL SIGN ALTERNATE U..SIDDHAM VOWEL SIGN ALTERNATE UU
			0x11633 <= code && code <= 0x1163A || // Mn   [8] MODI VOWEL SIGN U..MODI VOWEL SIGN AI
			0x1163D == code || // Mn       MODI SIGN ANUSVARA
			0x1163F <= code && code <= 0x11640 || // Mn   [2] MODI SIGN VIRAMA..MODI SIGN ARDHACANDRA
			0x116AB == code || // Mn       TAKRI SIGN ANUSVARA
			0x116AD == code || // Mn       TAKRI VOWEL SIGN AA
			0x116B0 <= code && code <= 0x116B5 || // Mn   [6] TAKRI VOWEL SIGN U..TAKRI VOWEL SIGN AU
			0x116B7 == code || // Mn       TAKRI SIGN NUKTA
			0x1171D <= code && code <= 0x1171F || // Mn   [3] AHOM CONSONANT SIGN MEDIAL LA..AHOM CONSONANT SIGN MEDIAL LIGATING RA
			0x11722 <= code && code <= 0x11725 || // Mn   [4] AHOM VOWEL SIGN I..AHOM VOWEL SIGN UU
			0x11727 <= code && code <= 0x1172B || // Mn   [5] AHOM VOWEL SIGN AW..AHOM SIGN KILLER
			0x11A01 <= code && code <= 0x11A06 || // Mn   [6] ZANABAZAR SQUARE VOWEL SIGN I..ZANABAZAR SQUARE VOWEL SIGN O
			0x11A09 <= code && code <= 0x11A0A || // Mn   [2] ZANABAZAR SQUARE VOWEL SIGN REVERSED I..ZANABAZAR SQUARE VOWEL LENGTH MARK
			0x11A33 <= code && code <= 0x11A38 || // Mn   [6] ZANABAZAR SQUARE FINAL CONSONANT MARK..ZANABAZAR SQUARE SIGN ANUSVARA
			0x11A3B <= code && code <= 0x11A3E || // Mn   [4] ZANABAZAR SQUARE CLUSTER-FINAL LETTER YA..ZANABAZAR SQUARE CLUSTER-FINAL LETTER VA
			0x11A47 == code || // Mn       ZANABAZAR SQUARE SUBJOINER
			0x11A51 <= code && code <= 0x11A56 || // Mn   [6] SOYOMBO VOWEL SIGN I..SOYOMBO VOWEL SIGN OE
			0x11A59 <= code && code <= 0x11A5B || // Mn   [3] SOYOMBO VOWEL SIGN VOCALIC R..SOYOMBO VOWEL LENGTH MARK
			0x11A8A <= code && code <= 0x11A96 || // Mn  [13] SOYOMBO FINAL CONSONANT SIGN G..SOYOMBO SIGN ANUSVARA
			0x11A98 <= code && code <= 0x11A99 || // Mn   [2] SOYOMBO GEMINATION MARK..SOYOMBO SUBJOINER
			0x11C30 <= code && code <= 0x11C36 || // Mn   [7] BHAIKSUKI VOWEL SIGN I..BHAIKSUKI VOWEL SIGN VOCALIC L
			0x11C38 <= code && code <= 0x11C3D || // Mn   [6] BHAIKSUKI VOWEL SIGN E..BHAIKSUKI SIGN ANUSVARA
			0x11C3F == code || // Mn       BHAIKSUKI SIGN VIRAMA
			0x11C92 <= code && code <= 0x11CA7 || // Mn  [22] MARCHEN SUBJOINED LETTER KA..MARCHEN SUBJOINED LETTER ZA
			0x11CAA <= code && code <= 0x11CB0 || // Mn   [7] MARCHEN SUBJOINED LETTER RA..MARCHEN VOWEL SIGN AA
			0x11CB2 <= code && code <= 0x11CB3 || // Mn   [2] MARCHEN VOWEL SIGN U..MARCHEN VOWEL SIGN E
			0x11CB5 <= code && code <= 0x11CB6 || // Mn   [2] MARCHEN SIGN ANUSVARA..MARCHEN SIGN CANDRABINDU
			0x11D31 <= code && code <= 0x11D36 || // Mn   [6] MASARAM GONDI VOWEL SIGN AA..MASARAM GONDI VOWEL SIGN VOCALIC R
			0x11D3A == code || // Mn       MASARAM GONDI VOWEL SIGN E
			0x11D3C <= code && code <= 0x11D3D || // Mn   [2] MASARAM GONDI VOWEL SIGN AI..MASARAM GONDI VOWEL SIGN O
			0x11D3F <= code && code <= 0x11D45 || // Mn   [7] MASARAM GONDI VOWEL SIGN AU..MASARAM GONDI VIRAMA
			0x11D47 == code || // Mn       MASARAM GONDI RA-KARA
			0x16AF0 <= code && code <= 0x16AF4 || // Mn   [5] BASSA VAH COMBINING HIGH TONE..BASSA VAH COMBINING HIGH-LOW TONE
			0x16B30 <= code && code <= 0x16B36 || // Mn   [7] PAHAWH HMONG MARK CIM TUB..PAHAWH HMONG MARK CIM TAUM
			0x16F8F <= code && code <= 0x16F92 || // Mn   [4] MIAO TONE RIGHT..MIAO TONE BELOW
			0x1BC9D <= code && code <= 0x1BC9E || // Mn   [2] DUPLOYAN THICK LETTER SELECTOR..DUPLOYAN DOUBLE MARK
			0x1D165 == code || // Mc       MUSICAL SYMBOL COMBINING STEM
			0x1D167 <= code && code <= 0x1D169 || // Mn   [3] MUSICAL SYMBOL COMBINING TREMOLO-1..MUSICAL SYMBOL COMBINING TREMOLO-3
			0x1D16E <= code && code <= 0x1D172 || // Mc   [5] MUSICAL SYMBOL COMBINING FLAG-1..MUSICAL SYMBOL COMBINING FLAG-5
			0x1D17B <= code && code <= 0x1D182 || // Mn   [8] MUSICAL SYMBOL COMBINING ACCENT..MUSICAL SYMBOL COMBINING LOURE
			0x1D185 <= code && code <= 0x1D18B || // Mn   [7] MUSICAL SYMBOL COMBINING DOIT..MUSICAL SYMBOL COMBINING TRIPLE TONGUE
			0x1D1AA <= code && code <= 0x1D1AD || // Mn   [4] MUSICAL SYMBOL COMBINING DOWN BOW..MUSICAL SYMBOL COMBINING SNAP PIZZICATO
			0x1D242 <= code && code <= 0x1D244 || // Mn   [3] COMBINING GREEK MUSICAL TRISEME..COMBINING GREEK MUSICAL PENTASEME
			0x1DA00 <= code && code <= 0x1DA36 || // Mn  [55] SIGNWRITING HEAD RIM..SIGNWRITING AIR SUCKING IN
			0x1DA3B <= code && code <= 0x1DA6C || // Mn  [50] SIGNWRITING MOUTH CLOSED NEUTRAL..SIGNWRITING EXCITEMENT
			0x1DA75 == code || // Mn       SIGNWRITING UPPER BODY TILTING FROM HIP JOINTS
			0x1DA84 == code || // Mn       SIGNWRITING LOCATION HEAD NECK
			0x1DA9B <= code && code <= 0x1DA9F || // Mn   [5] SIGNWRITING FILL MODIFIER-2..SIGNWRITING FILL MODIFIER-6
			0x1DAA1 <= code && code <= 0x1DAAF || // Mn  [15] SIGNWRITING ROTATION MODIFIER-2..SIGNWRITING ROTATION MODIFIER-16
			0x1E000 <= code && code <= 0x1E006 || // Mn   [7] COMBINING GLAGOLITIC LETTER AZU..COMBINING GLAGOLITIC LETTER ZHIVETE
			0x1E008 <= code && code <= 0x1E018 || // Mn  [17] COMBINING GLAGOLITIC LETTER ZEMLJA..COMBINING GLAGOLITIC LETTER HERU
			0x1E01B <= code && code <= 0x1E021 || // Mn   [7] COMBINING GLAGOLITIC LETTER SHTA..COMBINING GLAGOLITIC LETTER YATI
			0x1E023 <= code && code <= 0x1E024 || // Mn   [2] COMBINING GLAGOLITIC LETTER YU..COMBINING GLAGOLITIC LETTER SMALL YUS
			0x1E026 <= code && code <= 0x1E02A || // Mn   [5] COMBINING GLAGOLITIC LETTER YO..COMBINING GLAGOLITIC LETTER FITA
			0x1E8D0 <= code && code <= 0x1E8D6 || // Mn   [7] MENDE KIKAKUI COMBINING NUMBER TEENS..MENDE KIKAKUI COMBINING NUMBER MILLIONS
			0x1E944 <= code && code <= 0x1E94A || // Mn   [7] ADLAM ALIF LENGTHENER..ADLAM NUKTA
			0xE0020 <= code && code <= 0xE007F || // Cf  [96] TAG SPACE..CANCEL TAG
			0xE0100 <= code && code <= 0xE01EF // Mn [240] VARIATION SELECTOR-17..VARIATION SELECTOR-256
			) {
					return Extend;
				}

			if (0x1F1E6 <= code && code <= 0x1F1FF) // So  [26] REGIONAL INDICATOR SYMBOL LETTER A..REGIONAL INDICATOR SYMBOL LETTER Z
				{
					return Regional_Indicator;
				}

			if (0x0903 == code || // Mc       DEVANAGARI SIGN VISARGA
			0x093B == code || // Mc       DEVANAGARI VOWEL SIGN OOE
			0x093E <= code && code <= 0x0940 || // Mc   [3] DEVANAGARI VOWEL SIGN AA..DEVANAGARI VOWEL SIGN II
			0x0949 <= code && code <= 0x094C || // Mc   [4] DEVANAGARI VOWEL SIGN CANDRA O..DEVANAGARI VOWEL SIGN AU
			0x094E <= code && code <= 0x094F || // Mc   [2] DEVANAGARI VOWEL SIGN PRISHTHAMATRA E..DEVANAGARI VOWEL SIGN AW
			0x0982 <= code && code <= 0x0983 || // Mc   [2] BENGALI SIGN ANUSVARA..BENGALI SIGN VISARGA
			0x09BF <= code && code <= 0x09C0 || // Mc   [2] BENGALI VOWEL SIGN I..BENGALI VOWEL SIGN II
			0x09C7 <= code && code <= 0x09C8 || // Mc   [2] BENGALI VOWEL SIGN E..BENGALI VOWEL SIGN AI
			0x09CB <= code && code <= 0x09CC || // Mc   [2] BENGALI VOWEL SIGN O..BENGALI VOWEL SIGN AU
			0x0A03 == code || // Mc       GURMUKHI SIGN VISARGA
			0x0A3E <= code && code <= 0x0A40 || // Mc   [3] GURMUKHI VOWEL SIGN AA..GURMUKHI VOWEL SIGN II
			0x0A83 == code || // Mc       GUJARATI SIGN VISARGA
			0x0ABE <= code && code <= 0x0AC0 || // Mc   [3] GUJARATI VOWEL SIGN AA..GUJARATI VOWEL SIGN II
			0x0AC9 == code || // Mc       GUJARATI VOWEL SIGN CANDRA O
			0x0ACB <= code && code <= 0x0ACC || // Mc   [2] GUJARATI VOWEL SIGN O..GUJARATI VOWEL SIGN AU
			0x0B02 <= code && code <= 0x0B03 || // Mc   [2] ORIYA SIGN ANUSVARA..ORIYA SIGN VISARGA
			0x0B40 == code || // Mc       ORIYA VOWEL SIGN II
			0x0B47 <= code && code <= 0x0B48 || // Mc   [2] ORIYA VOWEL SIGN E..ORIYA VOWEL SIGN AI
			0x0B4B <= code && code <= 0x0B4C || // Mc   [2] ORIYA VOWEL SIGN O..ORIYA VOWEL SIGN AU
			0x0BBF == code || // Mc       TAMIL VOWEL SIGN I
			0x0BC1 <= code && code <= 0x0BC2 || // Mc   [2] TAMIL VOWEL SIGN U..TAMIL VOWEL SIGN UU
			0x0BC6 <= code && code <= 0x0BC8 || // Mc   [3] TAMIL VOWEL SIGN E..TAMIL VOWEL SIGN AI
			0x0BCA <= code && code <= 0x0BCC || // Mc   [3] TAMIL VOWEL SIGN O..TAMIL VOWEL SIGN AU
			0x0C01 <= code && code <= 0x0C03 || // Mc   [3] TELUGU SIGN CANDRABINDU..TELUGU SIGN VISARGA
			0x0C41 <= code && code <= 0x0C44 || // Mc   [4] TELUGU VOWEL SIGN U..TELUGU VOWEL SIGN VOCALIC RR
			0x0C82 <= code && code <= 0x0C83 || // Mc   [2] KANNADA SIGN ANUSVARA..KANNADA SIGN VISARGA
			0x0CBE == code || // Mc       KANNADA VOWEL SIGN AA
			0x0CC0 <= code && code <= 0x0CC1 || // Mc   [2] KANNADA VOWEL SIGN II..KANNADA VOWEL SIGN U
			0x0CC3 <= code && code <= 0x0CC4 || // Mc   [2] KANNADA VOWEL SIGN VOCALIC R..KANNADA VOWEL SIGN VOCALIC RR
			0x0CC7 <= code && code <= 0x0CC8 || // Mc   [2] KANNADA VOWEL SIGN EE..KANNADA VOWEL SIGN AI
			0x0CCA <= code && code <= 0x0CCB || // Mc   [2] KANNADA VOWEL SIGN O..KANNADA VOWEL SIGN OO
			0x0D02 <= code && code <= 0x0D03 || // Mc   [2] MALAYALAM SIGN ANUSVARA..MALAYALAM SIGN VISARGA
			0x0D3F <= code && code <= 0x0D40 || // Mc   [2] MALAYALAM VOWEL SIGN I..MALAYALAM VOWEL SIGN II
			0x0D46 <= code && code <= 0x0D48 || // Mc   [3] MALAYALAM VOWEL SIGN E..MALAYALAM VOWEL SIGN AI
			0x0D4A <= code && code <= 0x0D4C || // Mc   [3] MALAYALAM VOWEL SIGN O..MALAYALAM VOWEL SIGN AU
			0x0D82 <= code && code <= 0x0D83 || // Mc   [2] SINHALA SIGN ANUSVARAYA..SINHALA SIGN VISARGAYA
			0x0DD0 <= code && code <= 0x0DD1 || // Mc   [2] SINHALA VOWEL SIGN KETTI AEDA-PILLA..SINHALA VOWEL SIGN DIGA AEDA-PILLA
			0x0DD8 <= code && code <= 0x0DDE || // Mc   [7] SINHALA VOWEL SIGN GAETTA-PILLA..SINHALA VOWEL SIGN KOMBUVA HAA GAYANUKITTA
			0x0DF2 <= code && code <= 0x0DF3 || // Mc   [2] SINHALA VOWEL SIGN DIGA GAETTA-PILLA..SINHALA VOWEL SIGN DIGA GAYANUKITTA
			0x0E33 == code || // Lo       THAI CHARACTER SARA AM
			0x0EB3 == code || // Lo       LAO VOWEL SIGN AM
			0x0F3E <= code && code <= 0x0F3F || // Mc   [2] TIBETAN SIGN YAR TSHES..TIBETAN SIGN MAR TSHES
			0x0F7F == code || // Mc       TIBETAN SIGN RNAM BCAD
			0x1031 == code || // Mc       MYANMAR VOWEL SIGN E
			0x103B <= code && code <= 0x103C || // Mc   [2] MYANMAR CONSONANT SIGN MEDIAL YA..MYANMAR CONSONANT SIGN MEDIAL RA
			0x1056 <= code && code <= 0x1057 || // Mc   [2] MYANMAR VOWEL SIGN VOCALIC R..MYANMAR VOWEL SIGN VOCALIC RR
			0x1084 == code || // Mc       MYANMAR VOWEL SIGN SHAN E
			0x17B6 == code || // Mc       KHMER VOWEL SIGN AA
			0x17BE <= code && code <= 0x17C5 || // Mc   [8] KHMER VOWEL SIGN OE..KHMER VOWEL SIGN AU
			0x17C7 <= code && code <= 0x17C8 || // Mc   [2] KHMER SIGN REAHMUK..KHMER SIGN YUUKALEAPINTU
			0x1923 <= code && code <= 0x1926 || // Mc   [4] LIMBU VOWEL SIGN EE..LIMBU VOWEL SIGN AU
			0x1929 <= code && code <= 0x192B || // Mc   [3] LIMBU SUBJOINED LETTER YA..LIMBU SUBJOINED LETTER WA
			0x1930 <= code && code <= 0x1931 || // Mc   [2] LIMBU SMALL LETTER KA..LIMBU SMALL LETTER NGA
			0x1933 <= code && code <= 0x1938 || // Mc   [6] LIMBU SMALL LETTER TA..LIMBU SMALL LETTER LA
			0x1A19 <= code && code <= 0x1A1A || // Mc   [2] BUGINESE VOWEL SIGN E..BUGINESE VOWEL SIGN O
			0x1A55 == code || // Mc       TAI THAM CONSONANT SIGN MEDIAL RA
			0x1A57 == code || // Mc       TAI THAM CONSONANT SIGN LA TANG LAI
			0x1A6D <= code && code <= 0x1A72 || // Mc   [6] TAI THAM VOWEL SIGN OY..TAI THAM VOWEL SIGN THAM AI
			0x1B04 == code || // Mc       BALINESE SIGN BISAH
			0x1B35 == code || // Mc       BALINESE VOWEL SIGN TEDUNG
			0x1B3B == code || // Mc       BALINESE VOWEL SIGN RA REPA TEDUNG
			0x1B3D <= code && code <= 0x1B41 || // Mc   [5] BALINESE VOWEL SIGN LA LENGA TEDUNG..BALINESE VOWEL SIGN TALING REPA TEDUNG
			0x1B43 <= code && code <= 0x1B44 || // Mc   [2] BALINESE VOWEL SIGN PEPET TEDUNG..BALINESE ADEG ADEG
			0x1B82 == code || // Mc       SUNDANESE SIGN PANGWISAD
			0x1BA1 == code || // Mc       SUNDANESE CONSONANT SIGN PAMINGKAL
			0x1BA6 <= code && code <= 0x1BA7 || // Mc   [2] SUNDANESE VOWEL SIGN PANAELAENG..SUNDANESE VOWEL SIGN PANOLONG
			0x1BAA == code || // Mc       SUNDANESE SIGN PAMAAEH
			0x1BE7 == code || // Mc       BATAK VOWEL SIGN E
			0x1BEA <= code && code <= 0x1BEC || // Mc   [3] BATAK VOWEL SIGN I..BATAK VOWEL SIGN O
			0x1BEE == code || // Mc       BATAK VOWEL SIGN U
			0x1BF2 <= code && code <= 0x1BF3 || // Mc   [2] BATAK PANGOLAT..BATAK PANONGONAN
			0x1C24 <= code && code <= 0x1C2B || // Mc   [8] LEPCHA SUBJOINED LETTER YA..LEPCHA VOWEL SIGN UU
			0x1C34 <= code && code <= 0x1C35 || // Mc   [2] LEPCHA CONSONANT SIGN NYIN-DO..LEPCHA CONSONANT SIGN KANG
			0x1CE1 == code || // Mc       VEDIC TONE ATHARVAVEDIC INDEPENDENT SVARITA
			0x1CF2 <= code && code <= 0x1CF3 || // Mc   [2] VEDIC SIGN ARDHAVISARGA..VEDIC SIGN ROTATED ARDHAVISARGA
			0x1CF7 == code || // Mc       VEDIC SIGN ATIKRAMA
			0xA823 <= code && code <= 0xA824 || // Mc   [2] SYLOTI NAGRI VOWEL SIGN A..SYLOTI NAGRI VOWEL SIGN I
			0xA827 == code || // Mc       SYLOTI NAGRI VOWEL SIGN OO
			0xA880 <= code && code <= 0xA881 || // Mc   [2] SAURASHTRA SIGN ANUSVARA..SAURASHTRA SIGN VISARGA
			0xA8B4 <= code && code <= 0xA8C3 || // Mc  [16] SAURASHTRA CONSONANT SIGN HAARU..SAURASHTRA VOWEL SIGN AU
			0xA952 <= code && code <= 0xA953 || // Mc   [2] REJANG CONSONANT SIGN H..REJANG VIRAMA
			0xA983 == code || // Mc       JAVANESE SIGN WIGNYAN
			0xA9B4 <= code && code <= 0xA9B5 || // Mc   [2] JAVANESE VOWEL SIGN TARUNG..JAVANESE VOWEL SIGN TOLONG
			0xA9BA <= code && code <= 0xA9BB || // Mc   [2] JAVANESE VOWEL SIGN TALING..JAVANESE VOWEL SIGN DIRGA MURE
			0xA9BD <= code && code <= 0xA9C0 || // Mc   [4] JAVANESE CONSONANT SIGN KERET..JAVANESE PANGKON
			0xAA2F <= code && code <= 0xAA30 || // Mc   [2] CHAM VOWEL SIGN O..CHAM VOWEL SIGN AI
			0xAA33 <= code && code <= 0xAA34 || // Mc   [2] CHAM CONSONANT SIGN YA..CHAM CONSONANT SIGN RA
			0xAA4D == code || // Mc       CHAM CONSONANT SIGN FINAL H
			0xAAEB == code || // Mc       MEETEI MAYEK VOWEL SIGN II
			0xAAEE <= code && code <= 0xAAEF || // Mc   [2] MEETEI MAYEK VOWEL SIGN AU..MEETEI MAYEK VOWEL SIGN AAU
			0xAAF5 == code || // Mc       MEETEI MAYEK VOWEL SIGN VISARGA
			0xABE3 <= code && code <= 0xABE4 || // Mc   [2] MEETEI MAYEK VOWEL SIGN ONAP..MEETEI MAYEK VOWEL SIGN INAP
			0xABE6 <= code && code <= 0xABE7 || // Mc   [2] MEETEI MAYEK VOWEL SIGN YENAP..MEETEI MAYEK VOWEL SIGN SOUNAP
			0xABE9 <= code && code <= 0xABEA || // Mc   [2] MEETEI MAYEK VOWEL SIGN CHEINAP..MEETEI MAYEK VOWEL SIGN NUNG
			0xABEC == code || // Mc       MEETEI MAYEK LUM IYEK
			0x11000 == code || // Mc       BRAHMI SIGN CANDRABINDU
			0x11002 == code || // Mc       BRAHMI SIGN VISARGA
			0x11082 == code || // Mc       KAITHI SIGN VISARGA
			0x110B0 <= code && code <= 0x110B2 || // Mc   [3] KAITHI VOWEL SIGN AA..KAITHI VOWEL SIGN II
			0x110B7 <= code && code <= 0x110B8 || // Mc   [2] KAITHI VOWEL SIGN O..KAITHI VOWEL SIGN AU
			0x1112C == code || // Mc       CHAKMA VOWEL SIGN E
			0x11182 == code || // Mc       SHARADA SIGN VISARGA
			0x111B3 <= code && code <= 0x111B5 || // Mc   [3] SHARADA VOWEL SIGN AA..SHARADA VOWEL SIGN II
			0x111BF <= code && code <= 0x111C0 || // Mc   [2] SHARADA VOWEL SIGN AU..SHARADA SIGN VIRAMA
			0x1122C <= code && code <= 0x1122E || // Mc   [3] KHOJKI VOWEL SIGN AA..KHOJKI VOWEL SIGN II
			0x11232 <= code && code <= 0x11233 || // Mc   [2] KHOJKI VOWEL SIGN O..KHOJKI VOWEL SIGN AU
			0x11235 == code || // Mc       KHOJKI SIGN VIRAMA
			0x112E0 <= code && code <= 0x112E2 || // Mc   [3] KHUDAWADI VOWEL SIGN AA..KHUDAWADI VOWEL SIGN II
			0x11302 <= code && code <= 0x11303 || // Mc   [2] GRANTHA SIGN ANUSVARA..GRANTHA SIGN VISARGA
			0x1133F == code || // Mc       GRANTHA VOWEL SIGN I
			0x11341 <= code && code <= 0x11344 || // Mc   [4] GRANTHA VOWEL SIGN U..GRANTHA VOWEL SIGN VOCALIC RR
			0x11347 <= code && code <= 0x11348 || // Mc   [2] GRANTHA VOWEL SIGN EE..GRANTHA VOWEL SIGN AI
			0x1134B <= code && code <= 0x1134D || // Mc   [3] GRANTHA VOWEL SIGN OO..GRANTHA SIGN VIRAMA
			0x11362 <= code && code <= 0x11363 || // Mc   [2] GRANTHA VOWEL SIGN VOCALIC L..GRANTHA VOWEL SIGN VOCALIC LL
			0x11435 <= code && code <= 0x11437 || // Mc   [3] NEWA VOWEL SIGN AA..NEWA VOWEL SIGN II
			0x11440 <= code && code <= 0x11441 || // Mc   [2] NEWA VOWEL SIGN O..NEWA VOWEL SIGN AU
			0x11445 == code || // Mc       NEWA SIGN VISARGA
			0x114B1 <= code && code <= 0x114B2 || // Mc   [2] TIRHUTA VOWEL SIGN I..TIRHUTA VOWEL SIGN II
			0x114B9 == code || // Mc       TIRHUTA VOWEL SIGN E
			0x114BB <= code && code <= 0x114BC || // Mc   [2] TIRHUTA VOWEL SIGN AI..TIRHUTA VOWEL SIGN O
			0x114BE == code || // Mc       TIRHUTA VOWEL SIGN AU
			0x114C1 == code || // Mc       TIRHUTA SIGN VISARGA
			0x115B0 <= code && code <= 0x115B1 || // Mc   [2] SIDDHAM VOWEL SIGN I..SIDDHAM VOWEL SIGN II
			0x115B8 <= code && code <= 0x115BB || // Mc   [4] SIDDHAM VOWEL SIGN E..SIDDHAM VOWEL SIGN AU
			0x115BE == code || // Mc       SIDDHAM SIGN VISARGA
			0x11630 <= code && code <= 0x11632 || // Mc   [3] MODI VOWEL SIGN AA..MODI VOWEL SIGN II
			0x1163B <= code && code <= 0x1163C || // Mc   [2] MODI VOWEL SIGN O..MODI VOWEL SIGN AU
			0x1163E == code || // Mc       MODI SIGN VISARGA
			0x116AC == code || // Mc       TAKRI SIGN VISARGA
			0x116AE <= code && code <= 0x116AF || // Mc   [2] TAKRI VOWEL SIGN I..TAKRI VOWEL SIGN II
			0x116B6 == code || // Mc       TAKRI SIGN VIRAMA
			0x11720 <= code && code <= 0x11721 || // Mc   [2] AHOM VOWEL SIGN A..AHOM VOWEL SIGN AA
			0x11726 == code || // Mc       AHOM VOWEL SIGN E
			0x11A07 <= code && code <= 0x11A08 || // Mc   [2] ZANABAZAR SQUARE VOWEL SIGN AI..ZANABAZAR SQUARE VOWEL SIGN AU
			0x11A39 == code || // Mc       ZANABAZAR SQUARE SIGN VISARGA
			0x11A57 <= code && code <= 0x11A58 || // Mc   [2] SOYOMBO VOWEL SIGN AI..SOYOMBO VOWEL SIGN AU
			0x11A97 == code || // Mc       SOYOMBO SIGN VISARGA
			0x11C2F == code || // Mc       BHAIKSUKI VOWEL SIGN AA
			0x11C3E == code || // Mc       BHAIKSUKI SIGN VISARGA
			0x11CA9 == code || // Mc       MARCHEN SUBJOINED LETTER YA
			0x11CB1 == code || // Mc       MARCHEN VOWEL SIGN I
			0x11CB4 == code || // Mc       MARCHEN VOWEL SIGN O
			0x16F51 <= code && code <= 0x16F7E || // Mc  [46] MIAO SIGN ASPIRATION..MIAO VOWEL SIGN NG
			0x1D166 == code || // Mc       MUSICAL SYMBOL COMBINING SPRECHGESANG STEM
			0x1D16D == code // Mc       MUSICAL SYMBOL COMBINING AUGMENTATION DOT
			) {
					return SpacingMark;
				}

			if (0x1100 <= code && code <= 0x115F || // Lo  [96] HANGUL CHOSEONG KIYEOK..HANGUL CHOSEONG FILLER
			0xA960 <= code && code <= 0xA97C // Lo  [29] HANGUL CHOSEONG TIKEUT-MIEUM..HANGUL CHOSEONG SSANGYEORINHIEUH
			) {
					return L;
				}

			if (0x1160 <= code && code <= 0x11A7 || // Lo  [72] HANGUL JUNGSEONG FILLER..HANGUL JUNGSEONG O-YAE
			0xD7B0 <= code && code <= 0xD7C6 // Lo  [23] HANGUL JUNGSEONG O-YEO..HANGUL JUNGSEONG ARAEA-E
			) {
					return V;
				}

			if (0x11A8 <= code && code <= 0x11FF || // Lo  [88] HANGUL JONGSEONG KIYEOK..HANGUL JONGSEONG SSANGNIEUN
			0xD7CB <= code && code <= 0xD7FB // Lo  [49] HANGUL JONGSEONG NIEUN-RIEUL..HANGUL JONGSEONG PHIEUPH-THIEUTH
			) {
					return T;
				}

			if (0xAC00 == code || // Lo       HANGUL SYLLABLE GA
			0xAC1C == code || // Lo       HANGUL SYLLABLE GAE
			0xAC38 == code || // Lo       HANGUL SYLLABLE GYA
			0xAC54 == code || // Lo       HANGUL SYLLABLE GYAE
			0xAC70 == code || // Lo       HANGUL SYLLABLE GEO
			0xAC8C == code || // Lo       HANGUL SYLLABLE GE
			0xACA8 == code || // Lo       HANGUL SYLLABLE GYEO
			0xACC4 == code || // Lo       HANGUL SYLLABLE GYE
			0xACE0 == code || // Lo       HANGUL SYLLABLE GO
			0xACFC == code || // Lo       HANGUL SYLLABLE GWA
			0xAD18 == code || // Lo       HANGUL SYLLABLE GWAE
			0xAD34 == code || // Lo       HANGUL SYLLABLE GOE
			0xAD50 == code || // Lo       HANGUL SYLLABLE GYO
			0xAD6C == code || // Lo       HANGUL SYLLABLE GU
			0xAD88 == code || // Lo       HANGUL SYLLABLE GWEO
			0xADA4 == code || // Lo       HANGUL SYLLABLE GWE
			0xADC0 == code || // Lo       HANGUL SYLLABLE GWI
			0xADDC == code || // Lo       HANGUL SYLLABLE GYU
			0xADF8 == code || // Lo       HANGUL SYLLABLE GEU
			0xAE14 == code || // Lo       HANGUL SYLLABLE GYI
			0xAE30 == code || // Lo       HANGUL SYLLABLE GI
			0xAE4C == code || // Lo       HANGUL SYLLABLE GGA
			0xAE68 == code || // Lo       HANGUL SYLLABLE GGAE
			0xAE84 == code || // Lo       HANGUL SYLLABLE GGYA
			0xAEA0 == code || // Lo       HANGUL SYLLABLE GGYAE
			0xAEBC == code || // Lo       HANGUL SYLLABLE GGEO
			0xAED8 == code || // Lo       HANGUL SYLLABLE GGE
			0xAEF4 == code || // Lo       HANGUL SYLLABLE GGYEO
			0xAF10 == code || // Lo       HANGUL SYLLABLE GGYE
			0xAF2C == code || // Lo       HANGUL SYLLABLE GGO
			0xAF48 == code || // Lo       HANGUL SYLLABLE GGWA
			0xAF64 == code || // Lo       HANGUL SYLLABLE GGWAE
			0xAF80 == code || // Lo       HANGUL SYLLABLE GGOE
			0xAF9C == code || // Lo       HANGUL SYLLABLE GGYO
			0xAFB8 == code || // Lo       HANGUL SYLLABLE GGU
			0xAFD4 == code || // Lo       HANGUL SYLLABLE GGWEO
			0xAFF0 == code || // Lo       HANGUL SYLLABLE GGWE
			0xB00C == code || // Lo       HANGUL SYLLABLE GGWI
			0xB028 == code || // Lo       HANGUL SYLLABLE GGYU
			0xB044 == code || // Lo       HANGUL SYLLABLE GGEU
			0xB060 == code || // Lo       HANGUL SYLLABLE GGYI
			0xB07C == code || // Lo       HANGUL SYLLABLE GGI
			0xB098 == code || // Lo       HANGUL SYLLABLE NA
			0xB0B4 == code || // Lo       HANGUL SYLLABLE NAE
			0xB0D0 == code || // Lo       HANGUL SYLLABLE NYA
			0xB0EC == code || // Lo       HANGUL SYLLABLE NYAE
			0xB108 == code || // Lo       HANGUL SYLLABLE NEO
			0xB124 == code || // Lo       HANGUL SYLLABLE NE
			0xB140 == code || // Lo       HANGUL SYLLABLE NYEO
			0xB15C == code || // Lo       HANGUL SYLLABLE NYE
			0xB178 == code || // Lo       HANGUL SYLLABLE NO
			0xB194 == code || // Lo       HANGUL SYLLABLE NWA
			0xB1B0 == code || // Lo       HANGUL SYLLABLE NWAE
			0xB1CC == code || // Lo       HANGUL SYLLABLE NOE
			0xB1E8 == code || // Lo       HANGUL SYLLABLE NYO
			0xB204 == code || // Lo       HANGUL SYLLABLE NU
			0xB220 == code || // Lo       HANGUL SYLLABLE NWEO
			0xB23C == code || // Lo       HANGUL SYLLABLE NWE
			0xB258 == code || // Lo       HANGUL SYLLABLE NWI
			0xB274 == code || // Lo       HANGUL SYLLABLE NYU
			0xB290 == code || // Lo       HANGUL SYLLABLE NEU
			0xB2AC == code || // Lo       HANGUL SYLLABLE NYI
			0xB2C8 == code || // Lo       HANGUL SYLLABLE NI
			0xB2E4 == code || // Lo       HANGUL SYLLABLE DA
			0xB300 == code || // Lo       HANGUL SYLLABLE DAE
			0xB31C == code || // Lo       HANGUL SYLLABLE DYA
			0xB338 == code || // Lo       HANGUL SYLLABLE DYAE
			0xB354 == code || // Lo       HANGUL SYLLABLE DEO
			0xB370 == code || // Lo       HANGUL SYLLABLE DE
			0xB38C == code || // Lo       HANGUL SYLLABLE DYEO
			0xB3A8 == code || // Lo       HANGUL SYLLABLE DYE
			0xB3C4 == code || // Lo       HANGUL SYLLABLE DO
			0xB3E0 == code || // Lo       HANGUL SYLLABLE DWA
			0xB3FC == code || // Lo       HANGUL SYLLABLE DWAE
			0xB418 == code || // Lo       HANGUL SYLLABLE DOE
			0xB434 == code || // Lo       HANGUL SYLLABLE DYO
			0xB450 == code || // Lo       HANGUL SYLLABLE DU
			0xB46C == code || // Lo       HANGUL SYLLABLE DWEO
			0xB488 == code || // Lo       HANGUL SYLLABLE DWE
			0xB4A4 == code || // Lo       HANGUL SYLLABLE DWI
			0xB4C0 == code || // Lo       HANGUL SYLLABLE DYU
			0xB4DC == code || // Lo       HANGUL SYLLABLE DEU
			0xB4F8 == code || // Lo       HANGUL SYLLABLE DYI
			0xB514 == code || // Lo       HANGUL SYLLABLE DI
			0xB530 == code || // Lo       HANGUL SYLLABLE DDA
			0xB54C == code || // Lo       HANGUL SYLLABLE DDAE
			0xB568 == code || // Lo       HANGUL SYLLABLE DDYA
			0xB584 == code || // Lo       HANGUL SYLLABLE DDYAE
			0xB5A0 == code || // Lo       HANGUL SYLLABLE DDEO
			0xB5BC == code || // Lo       HANGUL SYLLABLE DDE
			0xB5D8 == code || // Lo       HANGUL SYLLABLE DDYEO
			0xB5F4 == code || // Lo       HANGUL SYLLABLE DDYE
			0xB610 == code || // Lo       HANGUL SYLLABLE DDO
			0xB62C == code || // Lo       HANGUL SYLLABLE DDWA
			0xB648 == code || // Lo       HANGUL SYLLABLE DDWAE
			0xB664 == code || // Lo       HANGUL SYLLABLE DDOE
			0xB680 == code || // Lo       HANGUL SYLLABLE DDYO
			0xB69C == code || // Lo       HANGUL SYLLABLE DDU
			0xB6B8 == code || // Lo       HANGUL SYLLABLE DDWEO
			0xB6D4 == code || // Lo       HANGUL SYLLABLE DDWE
			0xB6F0 == code || // Lo       HANGUL SYLLABLE DDWI
			0xB70C == code || // Lo       HANGUL SYLLABLE DDYU
			0xB728 == code || // Lo       HANGUL SYLLABLE DDEU
			0xB744 == code || // Lo       HANGUL SYLLABLE DDYI
			0xB760 == code || // Lo       HANGUL SYLLABLE DDI
			0xB77C == code || // Lo       HANGUL SYLLABLE RA
			0xB798 == code || // Lo       HANGUL SYLLABLE RAE
			0xB7B4 == code || // Lo       HANGUL SYLLABLE RYA
			0xB7D0 == code || // Lo       HANGUL SYLLABLE RYAE
			0xB7EC == code || // Lo       HANGUL SYLLABLE REO
			0xB808 == code || // Lo       HANGUL SYLLABLE RE
			0xB824 == code || // Lo       HANGUL SYLLABLE RYEO
			0xB840 == code || // Lo       HANGUL SYLLABLE RYE
			0xB85C == code || // Lo       HANGUL SYLLABLE RO
			0xB878 == code || // Lo       HANGUL SYLLABLE RWA
			0xB894 == code || // Lo       HANGUL SYLLABLE RWAE
			0xB8B0 == code || // Lo       HANGUL SYLLABLE ROE
			0xB8CC == code || // Lo       HANGUL SYLLABLE RYO
			0xB8E8 == code || // Lo       HANGUL SYLLABLE RU
			0xB904 == code || // Lo       HANGUL SYLLABLE RWEO
			0xB920 == code || // Lo       HANGUL SYLLABLE RWE
			0xB93C == code || // Lo       HANGUL SYLLABLE RWI
			0xB958 == code || // Lo       HANGUL SYLLABLE RYU
			0xB974 == code || // Lo       HANGUL SYLLABLE REU
			0xB990 == code || // Lo       HANGUL SYLLABLE RYI
			0xB9AC == code || // Lo       HANGUL SYLLABLE RI
			0xB9C8 == code || // Lo       HANGUL SYLLABLE MA
			0xB9E4 == code || // Lo       HANGUL SYLLABLE MAE
			0xBA00 == code || // Lo       HANGUL SYLLABLE MYA
			0xBA1C == code || // Lo       HANGUL SYLLABLE MYAE
			0xBA38 == code || // Lo       HANGUL SYLLABLE MEO
			0xBA54 == code || // Lo       HANGUL SYLLABLE ME
			0xBA70 == code || // Lo       HANGUL SYLLABLE MYEO
			0xBA8C == code || // Lo       HANGUL SYLLABLE MYE
			0xBAA8 == code || // Lo       HANGUL SYLLABLE MO
			0xBAC4 == code || // Lo       HANGUL SYLLABLE MWA
			0xBAE0 == code || // Lo       HANGUL SYLLABLE MWAE
			0xBAFC == code || // Lo       HANGUL SYLLABLE MOE
			0xBB18 == code || // Lo       HANGUL SYLLABLE MYO
			0xBB34 == code || // Lo       HANGUL SYLLABLE MU
			0xBB50 == code || // Lo       HANGUL SYLLABLE MWEO
			0xBB6C == code || // Lo       HANGUL SYLLABLE MWE
			0xBB88 == code || // Lo       HANGUL SYLLABLE MWI
			0xBBA4 == code || // Lo       HANGUL SYLLABLE MYU
			0xBBC0 == code || // Lo       HANGUL SYLLABLE MEU
			0xBBDC == code || // Lo       HANGUL SYLLABLE MYI
			0xBBF8 == code || // Lo       HANGUL SYLLABLE MI
			0xBC14 == code || // Lo       HANGUL SYLLABLE BA
			0xBC30 == code || // Lo       HANGUL SYLLABLE BAE
			0xBC4C == code || // Lo       HANGUL SYLLABLE BYA
			0xBC68 == code || // Lo       HANGUL SYLLABLE BYAE
			0xBC84 == code || // Lo       HANGUL SYLLABLE BEO
			0xBCA0 == code || // Lo       HANGUL SYLLABLE BE
			0xBCBC == code || // Lo       HANGUL SYLLABLE BYEO
			0xBCD8 == code || // Lo       HANGUL SYLLABLE BYE
			0xBCF4 == code || // Lo       HANGUL SYLLABLE BO
			0xBD10 == code || // Lo       HANGUL SYLLABLE BWA
			0xBD2C == code || // Lo       HANGUL SYLLABLE BWAE
			0xBD48 == code || // Lo       HANGUL SYLLABLE BOE
			0xBD64 == code || // Lo       HANGUL SYLLABLE BYO
			0xBD80 == code || // Lo       HANGUL SYLLABLE BU
			0xBD9C == code || // Lo       HANGUL SYLLABLE BWEO
			0xBDB8 == code || // Lo       HANGUL SYLLABLE BWE
			0xBDD4 == code || // Lo       HANGUL SYLLABLE BWI
			0xBDF0 == code || // Lo       HANGUL SYLLABLE BYU
			0xBE0C == code || // Lo       HANGUL SYLLABLE BEU
			0xBE28 == code || // Lo       HANGUL SYLLABLE BYI
			0xBE44 == code || // Lo       HANGUL SYLLABLE BI
			0xBE60 == code || // Lo       HANGUL SYLLABLE BBA
			0xBE7C == code || // Lo       HANGUL SYLLABLE BBAE
			0xBE98 == code || // Lo       HANGUL SYLLABLE BBYA
			0xBEB4 == code || // Lo       HANGUL SYLLABLE BBYAE
			0xBED0 == code || // Lo       HANGUL SYLLABLE BBEO
			0xBEEC == code || // Lo       HANGUL SYLLABLE BBE
			0xBF08 == code || // Lo       HANGUL SYLLABLE BBYEO
			0xBF24 == code || // Lo       HANGUL SYLLABLE BBYE
			0xBF40 == code || // Lo       HANGUL SYLLABLE BBO
			0xBF5C == code || // Lo       HANGUL SYLLABLE BBWA
			0xBF78 == code || // Lo       HANGUL SYLLABLE BBWAE
			0xBF94 == code || // Lo       HANGUL SYLLABLE BBOE
			0xBFB0 == code || // Lo       HANGUL SYLLABLE BBYO
			0xBFCC == code || // Lo       HANGUL SYLLABLE BBU
			0xBFE8 == code || // Lo       HANGUL SYLLABLE BBWEO
			0xC004 == code || // Lo       HANGUL SYLLABLE BBWE
			0xC020 == code || // Lo       HANGUL SYLLABLE BBWI
			0xC03C == code || // Lo       HANGUL SYLLABLE BBYU
			0xC058 == code || // Lo       HANGUL SYLLABLE BBEU
			0xC074 == code || // Lo       HANGUL SYLLABLE BBYI
			0xC090 == code || // Lo       HANGUL SYLLABLE BBI
			0xC0AC == code || // Lo       HANGUL SYLLABLE SA
			0xC0C8 == code || // Lo       HANGUL SYLLABLE SAE
			0xC0E4 == code || // Lo       HANGUL SYLLABLE SYA
			0xC100 == code || // Lo       HANGUL SYLLABLE SYAE
			0xC11C == code || // Lo       HANGUL SYLLABLE SEO
			0xC138 == code || // Lo       HANGUL SYLLABLE SE
			0xC154 == code || // Lo       HANGUL SYLLABLE SYEO
			0xC170 == code || // Lo       HANGUL SYLLABLE SYE
			0xC18C == code || // Lo       HANGUL SYLLABLE SO
			0xC1A8 == code || // Lo       HANGUL SYLLABLE SWA
			0xC1C4 == code || // Lo       HANGUL SYLLABLE SWAE
			0xC1E0 == code || // Lo       HANGUL SYLLABLE SOE
			0xC1FC == code || // Lo       HANGUL SYLLABLE SYO
			0xC218 == code || // Lo       HANGUL SYLLABLE SU
			0xC234 == code || // Lo       HANGUL SYLLABLE SWEO
			0xC250 == code || // Lo       HANGUL SYLLABLE SWE
			0xC26C == code || // Lo       HANGUL SYLLABLE SWI
			0xC288 == code || // Lo       HANGUL SYLLABLE SYU
			0xC2A4 == code || // Lo       HANGUL SYLLABLE SEU
			0xC2C0 == code || // Lo       HANGUL SYLLABLE SYI
			0xC2DC == code || // Lo       HANGUL SYLLABLE SI
			0xC2F8 == code || // Lo       HANGUL SYLLABLE SSA
			0xC314 == code || // Lo       HANGUL SYLLABLE SSAE
			0xC330 == code || // Lo       HANGUL SYLLABLE SSYA
			0xC34C == code || // Lo       HANGUL SYLLABLE SSYAE
			0xC368 == code || // Lo       HANGUL SYLLABLE SSEO
			0xC384 == code || // Lo       HANGUL SYLLABLE SSE
			0xC3A0 == code || // Lo       HANGUL SYLLABLE SSYEO
			0xC3BC == code || // Lo       HANGUL SYLLABLE SSYE
			0xC3D8 == code || // Lo       HANGUL SYLLABLE SSO
			0xC3F4 == code || // Lo       HANGUL SYLLABLE SSWA
			0xC410 == code || // Lo       HANGUL SYLLABLE SSWAE
			0xC42C == code || // Lo       HANGUL SYLLABLE SSOE
			0xC448 == code || // Lo       HANGUL SYLLABLE SSYO
			0xC464 == code || // Lo       HANGUL SYLLABLE SSU
			0xC480 == code || // Lo       HANGUL SYLLABLE SSWEO
			0xC49C == code || // Lo       HANGUL SYLLABLE SSWE
			0xC4B8 == code || // Lo       HANGUL SYLLABLE SSWI
			0xC4D4 == code || // Lo       HANGUL SYLLABLE SSYU
			0xC4F0 == code || // Lo       HANGUL SYLLABLE SSEU
			0xC50C == code || // Lo       HANGUL SYLLABLE SSYI
			0xC528 == code || // Lo       HANGUL SYLLABLE SSI
			0xC544 == code || // Lo       HANGUL SYLLABLE A
			0xC560 == code || // Lo       HANGUL SYLLABLE AE
			0xC57C == code || // Lo       HANGUL SYLLABLE YA
			0xC598 == code || // Lo       HANGUL SYLLABLE YAE
			0xC5B4 == code || // Lo       HANGUL SYLLABLE EO
			0xC5D0 == code || // Lo       HANGUL SYLLABLE E
			0xC5EC == code || // Lo       HANGUL SYLLABLE YEO
			0xC608 == code || // Lo       HANGUL SYLLABLE YE
			0xC624 == code || // Lo       HANGUL SYLLABLE O
			0xC640 == code || // Lo       HANGUL SYLLABLE WA
			0xC65C == code || // Lo       HANGUL SYLLABLE WAE
			0xC678 == code || // Lo       HANGUL SYLLABLE OE
			0xC694 == code || // Lo       HANGUL SYLLABLE YO
			0xC6B0 == code || // Lo       HANGUL SYLLABLE U
			0xC6CC == code || // Lo       HANGUL SYLLABLE WEO
			0xC6E8 == code || // Lo       HANGUL SYLLABLE WE
			0xC704 == code || // Lo       HANGUL SYLLABLE WI
			0xC720 == code || // Lo       HANGUL SYLLABLE YU
			0xC73C == code || // Lo       HANGUL SYLLABLE EU
			0xC758 == code || // Lo       HANGUL SYLLABLE YI
			0xC774 == code || // Lo       HANGUL SYLLABLE I
			0xC790 == code || // Lo       HANGUL SYLLABLE JA
			0xC7AC == code || // Lo       HANGUL SYLLABLE JAE
			0xC7C8 == code || // Lo       HANGUL SYLLABLE JYA
			0xC7E4 == code || // Lo       HANGUL SYLLABLE JYAE
			0xC800 == code || // Lo       HANGUL SYLLABLE JEO
			0xC81C == code || // Lo       HANGUL SYLLABLE JE
			0xC838 == code || // Lo       HANGUL SYLLABLE JYEO
			0xC854 == code || // Lo       HANGUL SYLLABLE JYE
			0xC870 == code || // Lo       HANGUL SYLLABLE JO
			0xC88C == code || // Lo       HANGUL SYLLABLE JWA
			0xC8A8 == code || // Lo       HANGUL SYLLABLE JWAE
			0xC8C4 == code || // Lo       HANGUL SYLLABLE JOE
			0xC8E0 == code || // Lo       HANGUL SYLLABLE JYO
			0xC8FC == code || // Lo       HANGUL SYLLABLE JU
			0xC918 == code || // Lo       HANGUL SYLLABLE JWEO
			0xC934 == code || // Lo       HANGUL SYLLABLE JWE
			0xC950 == code || // Lo       HANGUL SYLLABLE JWI
			0xC96C == code || // Lo       HANGUL SYLLABLE JYU
			0xC988 == code || // Lo       HANGUL SYLLABLE JEU
			0xC9A4 == code || // Lo       HANGUL SYLLABLE JYI
			0xC9C0 == code || // Lo       HANGUL SYLLABLE JI
			0xC9DC == code || // Lo       HANGUL SYLLABLE JJA
			0xC9F8 == code || // Lo       HANGUL SYLLABLE JJAE
			0xCA14 == code || // Lo       HANGUL SYLLABLE JJYA
			0xCA30 == code || // Lo       HANGUL SYLLABLE JJYAE
			0xCA4C == code || // Lo       HANGUL SYLLABLE JJEO
			0xCA68 == code || // Lo       HANGUL SYLLABLE JJE
			0xCA84 == code || // Lo       HANGUL SYLLABLE JJYEO
			0xCAA0 == code || // Lo       HANGUL SYLLABLE JJYE
			0xCABC == code || // Lo       HANGUL SYLLABLE JJO
			0xCAD8 == code || // Lo       HANGUL SYLLABLE JJWA
			0xCAF4 == code || // Lo       HANGUL SYLLABLE JJWAE
			0xCB10 == code || // Lo       HANGUL SYLLABLE JJOE
			0xCB2C == code || // Lo       HANGUL SYLLABLE JJYO
			0xCB48 == code || // Lo       HANGUL SYLLABLE JJU
			0xCB64 == code || // Lo       HANGUL SYLLABLE JJWEO
			0xCB80 == code || // Lo       HANGUL SYLLABLE JJWE
			0xCB9C == code || // Lo       HANGUL SYLLABLE JJWI
			0xCBB8 == code || // Lo       HANGUL SYLLABLE JJYU
			0xCBD4 == code || // Lo       HANGUL SYLLABLE JJEU
			0xCBF0 == code || // Lo       HANGUL SYLLABLE JJYI
			0xCC0C == code || // Lo       HANGUL SYLLABLE JJI
			0xCC28 == code || // Lo       HANGUL SYLLABLE CA
			0xCC44 == code || // Lo       HANGUL SYLLABLE CAE
			0xCC60 == code || // Lo       HANGUL SYLLABLE CYA
			0xCC7C == code || // Lo       HANGUL SYLLABLE CYAE
			0xCC98 == code || // Lo       HANGUL SYLLABLE CEO
			0xCCB4 == code || // Lo       HANGUL SYLLABLE CE
			0xCCD0 == code || // Lo       HANGUL SYLLABLE CYEO
			0xCCEC == code || // Lo       HANGUL SYLLABLE CYE
			0xCD08 == code || // Lo       HANGUL SYLLABLE CO
			0xCD24 == code || // Lo       HANGUL SYLLABLE CWA
			0xCD40 == code || // Lo       HANGUL SYLLABLE CWAE
			0xCD5C == code || // Lo       HANGUL SYLLABLE COE
			0xCD78 == code || // Lo       HANGUL SYLLABLE CYO
			0xCD94 == code || // Lo       HANGUL SYLLABLE CU
			0xCDB0 == code || // Lo       HANGUL SYLLABLE CWEO
			0xCDCC == code || // Lo       HANGUL SYLLABLE CWE
			0xCDE8 == code || // Lo       HANGUL SYLLABLE CWI
			0xCE04 == code || // Lo       HANGUL SYLLABLE CYU
			0xCE20 == code || // Lo       HANGUL SYLLABLE CEU
			0xCE3C == code || // Lo       HANGUL SYLLABLE CYI
			0xCE58 == code || // Lo       HANGUL SYLLABLE CI
			0xCE74 == code || // Lo       HANGUL SYLLABLE KA
			0xCE90 == code || // Lo       HANGUL SYLLABLE KAE
			0xCEAC == code || // Lo       HANGUL SYLLABLE KYA
			0xCEC8 == code || // Lo       HANGUL SYLLABLE KYAE
			0xCEE4 == code || // Lo       HANGUL SYLLABLE KEO
			0xCF00 == code || // Lo       HANGUL SYLLABLE KE
			0xCF1C == code || // Lo       HANGUL SYLLABLE KYEO
			0xCF38 == code || // Lo       HANGUL SYLLABLE KYE
			0xCF54 == code || // Lo       HANGUL SYLLABLE KO
			0xCF70 == code || // Lo       HANGUL SYLLABLE KWA
			0xCF8C == code || // Lo       HANGUL SYLLABLE KWAE
			0xCFA8 == code || // Lo       HANGUL SYLLABLE KOE
			0xCFC4 == code || // Lo       HANGUL SYLLABLE KYO
			0xCFE0 == code || // Lo       HANGUL SYLLABLE KU
			0xCFFC == code || // Lo       HANGUL SYLLABLE KWEO
			0xD018 == code || // Lo       HANGUL SYLLABLE KWE
			0xD034 == code || // Lo       HANGUL SYLLABLE KWI
			0xD050 == code || // Lo       HANGUL SYLLABLE KYU
			0xD06C == code || // Lo       HANGUL SYLLABLE KEU
			0xD088 == code || // Lo       HANGUL SYLLABLE KYI
			0xD0A4 == code || // Lo       HANGUL SYLLABLE KI
			0xD0C0 == code || // Lo       HANGUL SYLLABLE TA
			0xD0DC == code || // Lo       HANGUL SYLLABLE TAE
			0xD0F8 == code || // Lo       HANGUL SYLLABLE TYA
			0xD114 == code || // Lo       HANGUL SYLLABLE TYAE
			0xD130 == code || // Lo       HANGUL SYLLABLE TEO
			0xD14C == code || // Lo       HANGUL SYLLABLE TE
			0xD168 == code || // Lo       HANGUL SYLLABLE TYEO
			0xD184 == code || // Lo       HANGUL SYLLABLE TYE
			0xD1A0 == code || // Lo       HANGUL SYLLABLE TO
			0xD1BC == code || // Lo       HANGUL SYLLABLE TWA
			0xD1D8 == code || // Lo       HANGUL SYLLABLE TWAE
			0xD1F4 == code || // Lo       HANGUL SYLLABLE TOE
			0xD210 == code || // Lo       HANGUL SYLLABLE TYO
			0xD22C == code || // Lo       HANGUL SYLLABLE TU
			0xD248 == code || // Lo       HANGUL SYLLABLE TWEO
			0xD264 == code || // Lo       HANGUL SYLLABLE TWE
			0xD280 == code || // Lo       HANGUL SYLLABLE TWI
			0xD29C == code || // Lo       HANGUL SYLLABLE TYU
			0xD2B8 == code || // Lo       HANGUL SYLLABLE TEU
			0xD2D4 == code || // Lo       HANGUL SYLLABLE TYI
			0xD2F0 == code || // Lo       HANGUL SYLLABLE TI
			0xD30C == code || // Lo       HANGUL SYLLABLE PA
			0xD328 == code || // Lo       HANGUL SYLLABLE PAE
			0xD344 == code || // Lo       HANGUL SYLLABLE PYA
			0xD360 == code || // Lo       HANGUL SYLLABLE PYAE
			0xD37C == code || // Lo       HANGUL SYLLABLE PEO
			0xD398 == code || // Lo       HANGUL SYLLABLE PE
			0xD3B4 == code || // Lo       HANGUL SYLLABLE PYEO
			0xD3D0 == code || // Lo       HANGUL SYLLABLE PYE
			0xD3EC == code || // Lo       HANGUL SYLLABLE PO
			0xD408 == code || // Lo       HANGUL SYLLABLE PWA
			0xD424 == code || // Lo       HANGUL SYLLABLE PWAE
			0xD440 == code || // Lo       HANGUL SYLLABLE POE
			0xD45C == code || // Lo       HANGUL SYLLABLE PYO
			0xD478 == code || // Lo       HANGUL SYLLABLE PU
			0xD494 == code || // Lo       HANGUL SYLLABLE PWEO
			0xD4B0 == code || // Lo       HANGUL SYLLABLE PWE
			0xD4CC == code || // Lo       HANGUL SYLLABLE PWI
			0xD4E8 == code || // Lo       HANGUL SYLLABLE PYU
			0xD504 == code || // Lo       HANGUL SYLLABLE PEU
			0xD520 == code || // Lo       HANGUL SYLLABLE PYI
			0xD53C == code || // Lo       HANGUL SYLLABLE PI
			0xD558 == code || // Lo       HANGUL SYLLABLE HA
			0xD574 == code || // Lo       HANGUL SYLLABLE HAE
			0xD590 == code || // Lo       HANGUL SYLLABLE HYA
			0xD5AC == code || // Lo       HANGUL SYLLABLE HYAE
			0xD5C8 == code || // Lo       HANGUL SYLLABLE HEO
			0xD5E4 == code || // Lo       HANGUL SYLLABLE HE
			0xD600 == code || // Lo       HANGUL SYLLABLE HYEO
			0xD61C == code || // Lo       HANGUL SYLLABLE HYE
			0xD638 == code || // Lo       HANGUL SYLLABLE HO
			0xD654 == code || // Lo       HANGUL SYLLABLE HWA
			0xD670 == code || // Lo       HANGUL SYLLABLE HWAE
			0xD68C == code || // Lo       HANGUL SYLLABLE HOE
			0xD6A8 == code || // Lo       HANGUL SYLLABLE HYO
			0xD6C4 == code || // Lo       HANGUL SYLLABLE HU
			0xD6E0 == code || // Lo       HANGUL SYLLABLE HWEO
			0xD6FC == code || // Lo       HANGUL SYLLABLE HWE
			0xD718 == code || // Lo       HANGUL SYLLABLE HWI
			0xD734 == code || // Lo       HANGUL SYLLABLE HYU
			0xD750 == code || // Lo       HANGUL SYLLABLE HEU
			0xD76C == code || // Lo       HANGUL SYLLABLE HYI
			0xD788 == code // Lo       HANGUL SYLLABLE HI
			) {
					return LV;
				}

			if (0xAC01 <= code && code <= 0xAC1B || // Lo  [27] HANGUL SYLLABLE GAG..HANGUL SYLLABLE GAH
			0xAC1D <= code && code <= 0xAC37 || // Lo  [27] HANGUL SYLLABLE GAEG..HANGUL SYLLABLE GAEH
			0xAC39 <= code && code <= 0xAC53 || // Lo  [27] HANGUL SYLLABLE GYAG..HANGUL SYLLABLE GYAH
			0xAC55 <= code && code <= 0xAC6F || // Lo  [27] HANGUL SYLLABLE GYAEG..HANGUL SYLLABLE GYAEH
			0xAC71 <= code && code <= 0xAC8B || // Lo  [27] HANGUL SYLLABLE GEOG..HANGUL SYLLABLE GEOH
			0xAC8D <= code && code <= 0xACA7 || // Lo  [27] HANGUL SYLLABLE GEG..HANGUL SYLLABLE GEH
			0xACA9 <= code && code <= 0xACC3 || // Lo  [27] HANGUL SYLLABLE GYEOG..HANGUL SYLLABLE GYEOH
			0xACC5 <= code && code <= 0xACDF || // Lo  [27] HANGUL SYLLABLE GYEG..HANGUL SYLLABLE GYEH
			0xACE1 <= code && code <= 0xACFB || // Lo  [27] HANGUL SYLLABLE GOG..HANGUL SYLLABLE GOH
			0xACFD <= code && code <= 0xAD17 || // Lo  [27] HANGUL SYLLABLE GWAG..HANGUL SYLLABLE GWAH
			0xAD19 <= code && code <= 0xAD33 || // Lo  [27] HANGUL SYLLABLE GWAEG..HANGUL SYLLABLE GWAEH
			0xAD35 <= code && code <= 0xAD4F || // Lo  [27] HANGUL SYLLABLE GOEG..HANGUL SYLLABLE GOEH
			0xAD51 <= code && code <= 0xAD6B || // Lo  [27] HANGUL SYLLABLE GYOG..HANGUL SYLLABLE GYOH
			0xAD6D <= code && code <= 0xAD87 || // Lo  [27] HANGUL SYLLABLE GUG..HANGUL SYLLABLE GUH
			0xAD89 <= code && code <= 0xADA3 || // Lo  [27] HANGUL SYLLABLE GWEOG..HANGUL SYLLABLE GWEOH
			0xADA5 <= code && code <= 0xADBF || // Lo  [27] HANGUL SYLLABLE GWEG..HANGUL SYLLABLE GWEH
			0xADC1 <= code && code <= 0xADDB || // Lo  [27] HANGUL SYLLABLE GWIG..HANGUL SYLLABLE GWIH
			0xADDD <= code && code <= 0xADF7 || // Lo  [27] HANGUL SYLLABLE GYUG..HANGUL SYLLABLE GYUH
			0xADF9 <= code && code <= 0xAE13 || // Lo  [27] HANGUL SYLLABLE GEUG..HANGUL SYLLABLE GEUH
			0xAE15 <= code && code <= 0xAE2F || // Lo  [27] HANGUL SYLLABLE GYIG..HANGUL SYLLABLE GYIH
			0xAE31 <= code && code <= 0xAE4B || // Lo  [27] HANGUL SYLLABLE GIG..HANGUL SYLLABLE GIH
			0xAE4D <= code && code <= 0xAE67 || // Lo  [27] HANGUL SYLLABLE GGAG..HANGUL SYLLABLE GGAH
			0xAE69 <= code && code <= 0xAE83 || // Lo  [27] HANGUL SYLLABLE GGAEG..HANGUL SYLLABLE GGAEH
			0xAE85 <= code && code <= 0xAE9F || // Lo  [27] HANGUL SYLLABLE GGYAG..HANGUL SYLLABLE GGYAH
			0xAEA1 <= code && code <= 0xAEBB || // Lo  [27] HANGUL SYLLABLE GGYAEG..HANGUL SYLLABLE GGYAEH
			0xAEBD <= code && code <= 0xAED7 || // Lo  [27] HANGUL SYLLABLE GGEOG..HANGUL SYLLABLE GGEOH
			0xAED9 <= code && code <= 0xAEF3 || // Lo  [27] HANGUL SYLLABLE GGEG..HANGUL SYLLABLE GGEH
			0xAEF5 <= code && code <= 0xAF0F || // Lo  [27] HANGUL SYLLABLE GGYEOG..HANGUL SYLLABLE GGYEOH
			0xAF11 <= code && code <= 0xAF2B || // Lo  [27] HANGUL SYLLABLE GGYEG..HANGUL SYLLABLE GGYEH
			0xAF2D <= code && code <= 0xAF47 || // Lo  [27] HANGUL SYLLABLE GGOG..HANGUL SYLLABLE GGOH
			0xAF49 <= code && code <= 0xAF63 || // Lo  [27] HANGUL SYLLABLE GGWAG..HANGUL SYLLABLE GGWAH
			0xAF65 <= code && code <= 0xAF7F || // Lo  [27] HANGUL SYLLABLE GGWAEG..HANGUL SYLLABLE GGWAEH
			0xAF81 <= code && code <= 0xAF9B || // Lo  [27] HANGUL SYLLABLE GGOEG..HANGUL SYLLABLE GGOEH
			0xAF9D <= code && code <= 0xAFB7 || // Lo  [27] HANGUL SYLLABLE GGYOG..HANGUL SYLLABLE GGYOH
			0xAFB9 <= code && code <= 0xAFD3 || // Lo  [27] HANGUL SYLLABLE GGUG..HANGUL SYLLABLE GGUH
			0xAFD5 <= code && code <= 0xAFEF || // Lo  [27] HANGUL SYLLABLE GGWEOG..HANGUL SYLLABLE GGWEOH
			0xAFF1 <= code && code <= 0xB00B || // Lo  [27] HANGUL SYLLABLE GGWEG..HANGUL SYLLABLE GGWEH
			0xB00D <= code && code <= 0xB027 || // Lo  [27] HANGUL SYLLABLE GGWIG..HANGUL SYLLABLE GGWIH
			0xB029 <= code && code <= 0xB043 || // Lo  [27] HANGUL SYLLABLE GGYUG..HANGUL SYLLABLE GGYUH
			0xB045 <= code && code <= 0xB05F || // Lo  [27] HANGUL SYLLABLE GGEUG..HANGUL SYLLABLE GGEUH
			0xB061 <= code && code <= 0xB07B || // Lo  [27] HANGUL SYLLABLE GGYIG..HANGUL SYLLABLE GGYIH
			0xB07D <= code && code <= 0xB097 || // Lo  [27] HANGUL SYLLABLE GGIG..HANGUL SYLLABLE GGIH
			0xB099 <= code && code <= 0xB0B3 || // Lo  [27] HANGUL SYLLABLE NAG..HANGUL SYLLABLE NAH
			0xB0B5 <= code && code <= 0xB0CF || // Lo  [27] HANGUL SYLLABLE NAEG..HANGUL SYLLABLE NAEH
			0xB0D1 <= code && code <= 0xB0EB || // Lo  [27] HANGUL SYLLABLE NYAG..HANGUL SYLLABLE NYAH
			0xB0ED <= code && code <= 0xB107 || // Lo  [27] HANGUL SYLLABLE NYAEG..HANGUL SYLLABLE NYAEH
			0xB109 <= code && code <= 0xB123 || // Lo  [27] HANGUL SYLLABLE NEOG..HANGUL SYLLABLE NEOH
			0xB125 <= code && code <= 0xB13F || // Lo  [27] HANGUL SYLLABLE NEG..HANGUL SYLLABLE NEH
			0xB141 <= code && code <= 0xB15B || // Lo  [27] HANGUL SYLLABLE NYEOG..HANGUL SYLLABLE NYEOH
			0xB15D <= code && code <= 0xB177 || // Lo  [27] HANGUL SYLLABLE NYEG..HANGUL SYLLABLE NYEH
			0xB179 <= code && code <= 0xB193 || // Lo  [27] HANGUL SYLLABLE NOG..HANGUL SYLLABLE NOH
			0xB195 <= code && code <= 0xB1AF || // Lo  [27] HANGUL SYLLABLE NWAG..HANGUL SYLLABLE NWAH
			0xB1B1 <= code && code <= 0xB1CB || // Lo  [27] HANGUL SYLLABLE NWAEG..HANGUL SYLLABLE NWAEH
			0xB1CD <= code && code <= 0xB1E7 || // Lo  [27] HANGUL SYLLABLE NOEG..HANGUL SYLLABLE NOEH
			0xB1E9 <= code && code <= 0xB203 || // Lo  [27] HANGUL SYLLABLE NYOG..HANGUL SYLLABLE NYOH
			0xB205 <= code && code <= 0xB21F || // Lo  [27] HANGUL SYLLABLE NUG..HANGUL SYLLABLE NUH
			0xB221 <= code && code <= 0xB23B || // Lo  [27] HANGUL SYLLABLE NWEOG..HANGUL SYLLABLE NWEOH
			0xB23D <= code && code <= 0xB257 || // Lo  [27] HANGUL SYLLABLE NWEG..HANGUL SYLLABLE NWEH
			0xB259 <= code && code <= 0xB273 || // Lo  [27] HANGUL SYLLABLE NWIG..HANGUL SYLLABLE NWIH
			0xB275 <= code && code <= 0xB28F || // Lo  [27] HANGUL SYLLABLE NYUG..HANGUL SYLLABLE NYUH
			0xB291 <= code && code <= 0xB2AB || // Lo  [27] HANGUL SYLLABLE NEUG..HANGUL SYLLABLE NEUH
			0xB2AD <= code && code <= 0xB2C7 || // Lo  [27] HANGUL SYLLABLE NYIG..HANGUL SYLLABLE NYIH
			0xB2C9 <= code && code <= 0xB2E3 || // Lo  [27] HANGUL SYLLABLE NIG..HANGUL SYLLABLE NIH
			0xB2E5 <= code && code <= 0xB2FF || // Lo  [27] HANGUL SYLLABLE DAG..HANGUL SYLLABLE DAH
			0xB301 <= code && code <= 0xB31B || // Lo  [27] HANGUL SYLLABLE DAEG..HANGUL SYLLABLE DAEH
			0xB31D <= code && code <= 0xB337 || // Lo  [27] HANGUL SYLLABLE DYAG..HANGUL SYLLABLE DYAH
			0xB339 <= code && code <= 0xB353 || // Lo  [27] HANGUL SYLLABLE DYAEG..HANGUL SYLLABLE DYAEH
			0xB355 <= code && code <= 0xB36F || // Lo  [27] HANGUL SYLLABLE DEOG..HANGUL SYLLABLE DEOH
			0xB371 <= code && code <= 0xB38B || // Lo  [27] HANGUL SYLLABLE DEG..HANGUL SYLLABLE DEH
			0xB38D <= code && code <= 0xB3A7 || // Lo  [27] HANGUL SYLLABLE DYEOG..HANGUL SYLLABLE DYEOH
			0xB3A9 <= code && code <= 0xB3C3 || // Lo  [27] HANGUL SYLLABLE DYEG..HANGUL SYLLABLE DYEH
			0xB3C5 <= code && code <= 0xB3DF || // Lo  [27] HANGUL SYLLABLE DOG..HANGUL SYLLABLE DOH
			0xB3E1 <= code && code <= 0xB3FB || // Lo  [27] HANGUL SYLLABLE DWAG..HANGUL SYLLABLE DWAH
			0xB3FD <= code && code <= 0xB417 || // Lo  [27] HANGUL SYLLABLE DWAEG..HANGUL SYLLABLE DWAEH
			0xB419 <= code && code <= 0xB433 || // Lo  [27] HANGUL SYLLABLE DOEG..HANGUL SYLLABLE DOEH
			0xB435 <= code && code <= 0xB44F || // Lo  [27] HANGUL SYLLABLE DYOG..HANGUL SYLLABLE DYOH
			0xB451 <= code && code <= 0xB46B || // Lo  [27] HANGUL SYLLABLE DUG..HANGUL SYLLABLE DUH
			0xB46D <= code && code <= 0xB487 || // Lo  [27] HANGUL SYLLABLE DWEOG..HANGUL SYLLABLE DWEOH
			0xB489 <= code && code <= 0xB4A3 || // Lo  [27] HANGUL SYLLABLE DWEG..HANGUL SYLLABLE DWEH
			0xB4A5 <= code && code <= 0xB4BF || // Lo  [27] HANGUL SYLLABLE DWIG..HANGUL SYLLABLE DWIH
			0xB4C1 <= code && code <= 0xB4DB || // Lo  [27] HANGUL SYLLABLE DYUG..HANGUL SYLLABLE DYUH
			0xB4DD <= code && code <= 0xB4F7 || // Lo  [27] HANGUL SYLLABLE DEUG..HANGUL SYLLABLE DEUH
			0xB4F9 <= code && code <= 0xB513 || // Lo  [27] HANGUL SYLLABLE DYIG..HANGUL SYLLABLE DYIH
			0xB515 <= code && code <= 0xB52F || // Lo  [27] HANGUL SYLLABLE DIG..HANGUL SYLLABLE DIH
			0xB531 <= code && code <= 0xB54B || // Lo  [27] HANGUL SYLLABLE DDAG..HANGUL SYLLABLE DDAH
			0xB54D <= code && code <= 0xB567 || // Lo  [27] HANGUL SYLLABLE DDAEG..HANGUL SYLLABLE DDAEH
			0xB569 <= code && code <= 0xB583 || // Lo  [27] HANGUL SYLLABLE DDYAG..HANGUL SYLLABLE DDYAH
			0xB585 <= code && code <= 0xB59F || // Lo  [27] HANGUL SYLLABLE DDYAEG..HANGUL SYLLABLE DDYAEH
			0xB5A1 <= code && code <= 0xB5BB || // Lo  [27] HANGUL SYLLABLE DDEOG..HANGUL SYLLABLE DDEOH
			0xB5BD <= code && code <= 0xB5D7 || // Lo  [27] HANGUL SYLLABLE DDEG..HANGUL SYLLABLE DDEH
			0xB5D9 <= code && code <= 0xB5F3 || // Lo  [27] HANGUL SYLLABLE DDYEOG..HANGUL SYLLABLE DDYEOH
			0xB5F5 <= code && code <= 0xB60F || // Lo  [27] HANGUL SYLLABLE DDYEG..HANGUL SYLLABLE DDYEH
			0xB611 <= code && code <= 0xB62B || // Lo  [27] HANGUL SYLLABLE DDOG..HANGUL SYLLABLE DDOH
			0xB62D <= code && code <= 0xB647 || // Lo  [27] HANGUL SYLLABLE DDWAG..HANGUL SYLLABLE DDWAH
			0xB649 <= code && code <= 0xB663 || // Lo  [27] HANGUL SYLLABLE DDWAEG..HANGUL SYLLABLE DDWAEH
			0xB665 <= code && code <= 0xB67F || // Lo  [27] HANGUL SYLLABLE DDOEG..HANGUL SYLLABLE DDOEH
			0xB681 <= code && code <= 0xB69B || // Lo  [27] HANGUL SYLLABLE DDYOG..HANGUL SYLLABLE DDYOH
			0xB69D <= code && code <= 0xB6B7 || // Lo  [27] HANGUL SYLLABLE DDUG..HANGUL SYLLABLE DDUH
			0xB6B9 <= code && code <= 0xB6D3 || // Lo  [27] HANGUL SYLLABLE DDWEOG..HANGUL SYLLABLE DDWEOH
			0xB6D5 <= code && code <= 0xB6EF || // Lo  [27] HANGUL SYLLABLE DDWEG..HANGUL SYLLABLE DDWEH
			0xB6F1 <= code && code <= 0xB70B || // Lo  [27] HANGUL SYLLABLE DDWIG..HANGUL SYLLABLE DDWIH
			0xB70D <= code && code <= 0xB727 || // Lo  [27] HANGUL SYLLABLE DDYUG..HANGUL SYLLABLE DDYUH
			0xB729 <= code && code <= 0xB743 || // Lo  [27] HANGUL SYLLABLE DDEUG..HANGUL SYLLABLE DDEUH
			0xB745 <= code && code <= 0xB75F || // Lo  [27] HANGUL SYLLABLE DDYIG..HANGUL SYLLABLE DDYIH
			0xB761 <= code && code <= 0xB77B || // Lo  [27] HANGUL SYLLABLE DDIG..HANGUL SYLLABLE DDIH
			0xB77D <= code && code <= 0xB797 || // Lo  [27] HANGUL SYLLABLE RAG..HANGUL SYLLABLE RAH
			0xB799 <= code && code <= 0xB7B3 || // Lo  [27] HANGUL SYLLABLE RAEG..HANGUL SYLLABLE RAEH
			0xB7B5 <= code && code <= 0xB7CF || // Lo  [27] HANGUL SYLLABLE RYAG..HANGUL SYLLABLE RYAH
			0xB7D1 <= code && code <= 0xB7EB || // Lo  [27] HANGUL SYLLABLE RYAEG..HANGUL SYLLABLE RYAEH
			0xB7ED <= code && code <= 0xB807 || // Lo  [27] HANGUL SYLLABLE REOG..HANGUL SYLLABLE REOH
			0xB809 <= code && code <= 0xB823 || // Lo  [27] HANGUL SYLLABLE REG..HANGUL SYLLABLE REH
			0xB825 <= code && code <= 0xB83F || // Lo  [27] HANGUL SYLLABLE RYEOG..HANGUL SYLLABLE RYEOH
			0xB841 <= code && code <= 0xB85B || // Lo  [27] HANGUL SYLLABLE RYEG..HANGUL SYLLABLE RYEH
			0xB85D <= code && code <= 0xB877 || // Lo  [27] HANGUL SYLLABLE ROG..HANGUL SYLLABLE ROH
			0xB879 <= code && code <= 0xB893 || // Lo  [27] HANGUL SYLLABLE RWAG..HANGUL SYLLABLE RWAH
			0xB895 <= code && code <= 0xB8AF || // Lo  [27] HANGUL SYLLABLE RWAEG..HANGUL SYLLABLE RWAEH
			0xB8B1 <= code && code <= 0xB8CB || // Lo  [27] HANGUL SYLLABLE ROEG..HANGUL SYLLABLE ROEH
			0xB8CD <= code && code <= 0xB8E7 || // Lo  [27] HANGUL SYLLABLE RYOG..HANGUL SYLLABLE RYOH
			0xB8E9 <= code && code <= 0xB903 || // Lo  [27] HANGUL SYLLABLE RUG..HANGUL SYLLABLE RUH
			0xB905 <= code && code <= 0xB91F || // Lo  [27] HANGUL SYLLABLE RWEOG..HANGUL SYLLABLE RWEOH
			0xB921 <= code && code <= 0xB93B || // Lo  [27] HANGUL SYLLABLE RWEG..HANGUL SYLLABLE RWEH
			0xB93D <= code && code <= 0xB957 || // Lo  [27] HANGUL SYLLABLE RWIG..HANGUL SYLLABLE RWIH
			0xB959 <= code && code <= 0xB973 || // Lo  [27] HANGUL SYLLABLE RYUG..HANGUL SYLLABLE RYUH
			0xB975 <= code && code <= 0xB98F || // Lo  [27] HANGUL SYLLABLE REUG..HANGUL SYLLABLE REUH
			0xB991 <= code && code <= 0xB9AB || // Lo  [27] HANGUL SYLLABLE RYIG..HANGUL SYLLABLE RYIH
			0xB9AD <= code && code <= 0xB9C7 || // Lo  [27] HANGUL SYLLABLE RIG..HANGUL SYLLABLE RIH
			0xB9C9 <= code && code <= 0xB9E3 || // Lo  [27] HANGUL SYLLABLE MAG..HANGUL SYLLABLE MAH
			0xB9E5 <= code && code <= 0xB9FF || // Lo  [27] HANGUL SYLLABLE MAEG..HANGUL SYLLABLE MAEH
			0xBA01 <= code && code <= 0xBA1B || // Lo  [27] HANGUL SYLLABLE MYAG..HANGUL SYLLABLE MYAH
			0xBA1D <= code && code <= 0xBA37 || // Lo  [27] HANGUL SYLLABLE MYAEG..HANGUL SYLLABLE MYAEH
			0xBA39 <= code && code <= 0xBA53 || // Lo  [27] HANGUL SYLLABLE MEOG..HANGUL SYLLABLE MEOH
			0xBA55 <= code && code <= 0xBA6F || // Lo  [27] HANGUL SYLLABLE MEG..HANGUL SYLLABLE MEH
			0xBA71 <= code && code <= 0xBA8B || // Lo  [27] HANGUL SYLLABLE MYEOG..HANGUL SYLLABLE MYEOH
			0xBA8D <= code && code <= 0xBAA7 || // Lo  [27] HANGUL SYLLABLE MYEG..HANGUL SYLLABLE MYEH
			0xBAA9 <= code && code <= 0xBAC3 || // Lo  [27] HANGUL SYLLABLE MOG..HANGUL SYLLABLE MOH
			0xBAC5 <= code && code <= 0xBADF || // Lo  [27] HANGUL SYLLABLE MWAG..HANGUL SYLLABLE MWAH
			0xBAE1 <= code && code <= 0xBAFB || // Lo  [27] HANGUL SYLLABLE MWAEG..HANGUL SYLLABLE MWAEH
			0xBAFD <= code && code <= 0xBB17 || // Lo  [27] HANGUL SYLLABLE MOEG..HANGUL SYLLABLE MOEH
			0xBB19 <= code && code <= 0xBB33 || // Lo  [27] HANGUL SYLLABLE MYOG..HANGUL SYLLABLE MYOH
			0xBB35 <= code && code <= 0xBB4F || // Lo  [27] HANGUL SYLLABLE MUG..HANGUL SYLLABLE MUH
			0xBB51 <= code && code <= 0xBB6B || // Lo  [27] HANGUL SYLLABLE MWEOG..HANGUL SYLLABLE MWEOH
			0xBB6D <= code && code <= 0xBB87 || // Lo  [27] HANGUL SYLLABLE MWEG..HANGUL SYLLABLE MWEH
			0xBB89 <= code && code <= 0xBBA3 || // Lo  [27] HANGUL SYLLABLE MWIG..HANGUL SYLLABLE MWIH
			0xBBA5 <= code && code <= 0xBBBF || // Lo  [27] HANGUL SYLLABLE MYUG..HANGUL SYLLABLE MYUH
			0xBBC1 <= code && code <= 0xBBDB || // Lo  [27] HANGUL SYLLABLE MEUG..HANGUL SYLLABLE MEUH
			0xBBDD <= code && code <= 0xBBF7 || // Lo  [27] HANGUL SYLLABLE MYIG..HANGUL SYLLABLE MYIH
			0xBBF9 <= code && code <= 0xBC13 || // Lo  [27] HANGUL SYLLABLE MIG..HANGUL SYLLABLE MIH
			0xBC15 <= code && code <= 0xBC2F || // Lo  [27] HANGUL SYLLABLE BAG..HANGUL SYLLABLE BAH
			0xBC31 <= code && code <= 0xBC4B || // Lo  [27] HANGUL SYLLABLE BAEG..HANGUL SYLLABLE BAEH
			0xBC4D <= code && code <= 0xBC67 || // Lo  [27] HANGUL SYLLABLE BYAG..HANGUL SYLLABLE BYAH
			0xBC69 <= code && code <= 0xBC83 || // Lo  [27] HANGUL SYLLABLE BYAEG..HANGUL SYLLABLE BYAEH
			0xBC85 <= code && code <= 0xBC9F || // Lo  [27] HANGUL SYLLABLE BEOG..HANGUL SYLLABLE BEOH
			0xBCA1 <= code && code <= 0xBCBB || // Lo  [27] HANGUL SYLLABLE BEG..HANGUL SYLLABLE BEH
			0xBCBD <= code && code <= 0xBCD7 || // Lo  [27] HANGUL SYLLABLE BYEOG..HANGUL SYLLABLE BYEOH
			0xBCD9 <= code && code <= 0xBCF3 || // Lo  [27] HANGUL SYLLABLE BYEG..HANGUL SYLLABLE BYEH
			0xBCF5 <= code && code <= 0xBD0F || // Lo  [27] HANGUL SYLLABLE BOG..HANGUL SYLLABLE BOH
			0xBD11 <= code && code <= 0xBD2B || // Lo  [27] HANGUL SYLLABLE BWAG..HANGUL SYLLABLE BWAH
			0xBD2D <= code && code <= 0xBD47 || // Lo  [27] HANGUL SYLLABLE BWAEG..HANGUL SYLLABLE BWAEH
			0xBD49 <= code && code <= 0xBD63 || // Lo  [27] HANGUL SYLLABLE BOEG..HANGUL SYLLABLE BOEH
			0xBD65 <= code && code <= 0xBD7F || // Lo  [27] HANGUL SYLLABLE BYOG..HANGUL SYLLABLE BYOH
			0xBD81 <= code && code <= 0xBD9B || // Lo  [27] HANGUL SYLLABLE BUG..HANGUL SYLLABLE BUH
			0xBD9D <= code && code <= 0xBDB7 || // Lo  [27] HANGUL SYLLABLE BWEOG..HANGUL SYLLABLE BWEOH
			0xBDB9 <= code && code <= 0xBDD3 || // Lo  [27] HANGUL SYLLABLE BWEG..HANGUL SYLLABLE BWEH
			0xBDD5 <= code && code <= 0xBDEF || // Lo  [27] HANGUL SYLLABLE BWIG..HANGUL SYLLABLE BWIH
			0xBDF1 <= code && code <= 0xBE0B || // Lo  [27] HANGUL SYLLABLE BYUG..HANGUL SYLLABLE BYUH
			0xBE0D <= code && code <= 0xBE27 || // Lo  [27] HANGUL SYLLABLE BEUG..HANGUL SYLLABLE BEUH
			0xBE29 <= code && code <= 0xBE43 || // Lo  [27] HANGUL SYLLABLE BYIG..HANGUL SYLLABLE BYIH
			0xBE45 <= code && code <= 0xBE5F || // Lo  [27] HANGUL SYLLABLE BIG..HANGUL SYLLABLE BIH
			0xBE61 <= code && code <= 0xBE7B || // Lo  [27] HANGUL SYLLABLE BBAG..HANGUL SYLLABLE BBAH
			0xBE7D <= code && code <= 0xBE97 || // Lo  [27] HANGUL SYLLABLE BBAEG..HANGUL SYLLABLE BBAEH
			0xBE99 <= code && code <= 0xBEB3 || // Lo  [27] HANGUL SYLLABLE BBYAG..HANGUL SYLLABLE BBYAH
			0xBEB5 <= code && code <= 0xBECF || // Lo  [27] HANGUL SYLLABLE BBYAEG..HANGUL SYLLABLE BBYAEH
			0xBED1 <= code && code <= 0xBEEB || // Lo  [27] HANGUL SYLLABLE BBEOG..HANGUL SYLLABLE BBEOH
			0xBEED <= code && code <= 0xBF07 || // Lo  [27] HANGUL SYLLABLE BBEG..HANGUL SYLLABLE BBEH
			0xBF09 <= code && code <= 0xBF23 || // Lo  [27] HANGUL SYLLABLE BBYEOG..HANGUL SYLLABLE BBYEOH
			0xBF25 <= code && code <= 0xBF3F || // Lo  [27] HANGUL SYLLABLE BBYEG..HANGUL SYLLABLE BBYEH
			0xBF41 <= code && code <= 0xBF5B || // Lo  [27] HANGUL SYLLABLE BBOG..HANGUL SYLLABLE BBOH
			0xBF5D <= code && code <= 0xBF77 || // Lo  [27] HANGUL SYLLABLE BBWAG..HANGUL SYLLABLE BBWAH
			0xBF79 <= code && code <= 0xBF93 || // Lo  [27] HANGUL SYLLABLE BBWAEG..HANGUL SYLLABLE BBWAEH
			0xBF95 <= code && code <= 0xBFAF || // Lo  [27] HANGUL SYLLABLE BBOEG..HANGUL SYLLABLE BBOEH
			0xBFB1 <= code && code <= 0xBFCB || // Lo  [27] HANGUL SYLLABLE BBYOG..HANGUL SYLLABLE BBYOH
			0xBFCD <= code && code <= 0xBFE7 || // Lo  [27] HANGUL SYLLABLE BBUG..HANGUL SYLLABLE BBUH
			0xBFE9 <= code && code <= 0xC003 || // Lo  [27] HANGUL SYLLABLE BBWEOG..HANGUL SYLLABLE BBWEOH
			0xC005 <= code && code <= 0xC01F || // Lo  [27] HANGUL SYLLABLE BBWEG..HANGUL SYLLABLE BBWEH
			0xC021 <= code && code <= 0xC03B || // Lo  [27] HANGUL SYLLABLE BBWIG..HANGUL SYLLABLE BBWIH
			0xC03D <= code && code <= 0xC057 || // Lo  [27] HANGUL SYLLABLE BBYUG..HANGUL SYLLABLE BBYUH
			0xC059 <= code && code <= 0xC073 || // Lo  [27] HANGUL SYLLABLE BBEUG..HANGUL SYLLABLE BBEUH
			0xC075 <= code && code <= 0xC08F || // Lo  [27] HANGUL SYLLABLE BBYIG..HANGUL SYLLABLE BBYIH
			0xC091 <= code && code <= 0xC0AB || // Lo  [27] HANGUL SYLLABLE BBIG..HANGUL SYLLABLE BBIH
			0xC0AD <= code && code <= 0xC0C7 || // Lo  [27] HANGUL SYLLABLE SAG..HANGUL SYLLABLE SAH
			0xC0C9 <= code && code <= 0xC0E3 || // Lo  [27] HANGUL SYLLABLE SAEG..HANGUL SYLLABLE SAEH
			0xC0E5 <= code && code <= 0xC0FF || // Lo  [27] HANGUL SYLLABLE SYAG..HANGUL SYLLABLE SYAH
			0xC101 <= code && code <= 0xC11B || // Lo  [27] HANGUL SYLLABLE SYAEG..HANGUL SYLLABLE SYAEH
			0xC11D <= code && code <= 0xC137 || // Lo  [27] HANGUL SYLLABLE SEOG..HANGUL SYLLABLE SEOH
			0xC139 <= code && code <= 0xC153 || // Lo  [27] HANGUL SYLLABLE SEG..HANGUL SYLLABLE SEH
			0xC155 <= code && code <= 0xC16F || // Lo  [27] HANGUL SYLLABLE SYEOG..HANGUL SYLLABLE SYEOH
			0xC171 <= code && code <= 0xC18B || // Lo  [27] HANGUL SYLLABLE SYEG..HANGUL SYLLABLE SYEH
			0xC18D <= code && code <= 0xC1A7 || // Lo  [27] HANGUL SYLLABLE SOG..HANGUL SYLLABLE SOH
			0xC1A9 <= code && code <= 0xC1C3 || // Lo  [27] HANGUL SYLLABLE SWAG..HANGUL SYLLABLE SWAH
			0xC1C5 <= code && code <= 0xC1DF || // Lo  [27] HANGUL SYLLABLE SWAEG..HANGUL SYLLABLE SWAEH
			0xC1E1 <= code && code <= 0xC1FB || // Lo  [27] HANGUL SYLLABLE SOEG..HANGUL SYLLABLE SOEH
			0xC1FD <= code && code <= 0xC217 || // Lo  [27] HANGUL SYLLABLE SYOG..HANGUL SYLLABLE SYOH
			0xC219 <= code && code <= 0xC233 || // Lo  [27] HANGUL SYLLABLE SUG..HANGUL SYLLABLE SUH
			0xC235 <= code && code <= 0xC24F || // Lo  [27] HANGUL SYLLABLE SWEOG..HANGUL SYLLABLE SWEOH
			0xC251 <= code && code <= 0xC26B || // Lo  [27] HANGUL SYLLABLE SWEG..HANGUL SYLLABLE SWEH
			0xC26D <= code && code <= 0xC287 || // Lo  [27] HANGUL SYLLABLE SWIG..HANGUL SYLLABLE SWIH
			0xC289 <= code && code <= 0xC2A3 || // Lo  [27] HANGUL SYLLABLE SYUG..HANGUL SYLLABLE SYUH
			0xC2A5 <= code && code <= 0xC2BF || // Lo  [27] HANGUL SYLLABLE SEUG..HANGUL SYLLABLE SEUH
			0xC2C1 <= code && code <= 0xC2DB || // Lo  [27] HANGUL SYLLABLE SYIG..HANGUL SYLLABLE SYIH
			0xC2DD <= code && code <= 0xC2F7 || // Lo  [27] HANGUL SYLLABLE SIG..HANGUL SYLLABLE SIH
			0xC2F9 <= code && code <= 0xC313 || // Lo  [27] HANGUL SYLLABLE SSAG..HANGUL SYLLABLE SSAH
			0xC315 <= code && code <= 0xC32F || // Lo  [27] HANGUL SYLLABLE SSAEG..HANGUL SYLLABLE SSAEH
			0xC331 <= code && code <= 0xC34B || // Lo  [27] HANGUL SYLLABLE SSYAG..HANGUL SYLLABLE SSYAH
			0xC34D <= code && code <= 0xC367 || // Lo  [27] HANGUL SYLLABLE SSYAEG..HANGUL SYLLABLE SSYAEH
			0xC369 <= code && code <= 0xC383 || // Lo  [27] HANGUL SYLLABLE SSEOG..HANGUL SYLLABLE SSEOH
			0xC385 <= code && code <= 0xC39F || // Lo  [27] HANGUL SYLLABLE SSEG..HANGUL SYLLABLE SSEH
			0xC3A1 <= code && code <= 0xC3BB || // Lo  [27] HANGUL SYLLABLE SSYEOG..HANGUL SYLLABLE SSYEOH
			0xC3BD <= code && code <= 0xC3D7 || // Lo  [27] HANGUL SYLLABLE SSYEG..HANGUL SYLLABLE SSYEH
			0xC3D9 <= code && code <= 0xC3F3 || // Lo  [27] HANGUL SYLLABLE SSOG..HANGUL SYLLABLE SSOH
			0xC3F5 <= code && code <= 0xC40F || // Lo  [27] HANGUL SYLLABLE SSWAG..HANGUL SYLLABLE SSWAH
			0xC411 <= code && code <= 0xC42B || // Lo  [27] HANGUL SYLLABLE SSWAEG..HANGUL SYLLABLE SSWAEH
			0xC42D <= code && code <= 0xC447 || // Lo  [27] HANGUL SYLLABLE SSOEG..HANGUL SYLLABLE SSOEH
			0xC449 <= code && code <= 0xC463 || // Lo  [27] HANGUL SYLLABLE SSYOG..HANGUL SYLLABLE SSYOH
			0xC465 <= code && code <= 0xC47F || // Lo  [27] HANGUL SYLLABLE SSUG..HANGUL SYLLABLE SSUH
			0xC481 <= code && code <= 0xC49B || // Lo  [27] HANGUL SYLLABLE SSWEOG..HANGUL SYLLABLE SSWEOH
			0xC49D <= code && code <= 0xC4B7 || // Lo  [27] HANGUL SYLLABLE SSWEG..HANGUL SYLLABLE SSWEH
			0xC4B9 <= code && code <= 0xC4D3 || // Lo  [27] HANGUL SYLLABLE SSWIG..HANGUL SYLLABLE SSWIH
			0xC4D5 <= code && code <= 0xC4EF || // Lo  [27] HANGUL SYLLABLE SSYUG..HANGUL SYLLABLE SSYUH
			0xC4F1 <= code && code <= 0xC50B || // Lo  [27] HANGUL SYLLABLE SSEUG..HANGUL SYLLABLE SSEUH
			0xC50D <= code && code <= 0xC527 || // Lo  [27] HANGUL SYLLABLE SSYIG..HANGUL SYLLABLE SSYIH
			0xC529 <= code && code <= 0xC543 || // Lo  [27] HANGUL SYLLABLE SSIG..HANGUL SYLLABLE SSIH
			0xC545 <= code && code <= 0xC55F || // Lo  [27] HANGUL SYLLABLE AG..HANGUL SYLLABLE AH
			0xC561 <= code && code <= 0xC57B || // Lo  [27] HANGUL SYLLABLE AEG..HANGUL SYLLABLE AEH
			0xC57D <= code && code <= 0xC597 || // Lo  [27] HANGUL SYLLABLE YAG..HANGUL SYLLABLE YAH
			0xC599 <= code && code <= 0xC5B3 || // Lo  [27] HANGUL SYLLABLE YAEG..HANGUL SYLLABLE YAEH
			0xC5B5 <= code && code <= 0xC5CF || // Lo  [27] HANGUL SYLLABLE EOG..HANGUL SYLLABLE EOH
			0xC5D1 <= code && code <= 0xC5EB || // Lo  [27] HANGUL SYLLABLE EG..HANGUL SYLLABLE EH
			0xC5ED <= code && code <= 0xC607 || // Lo  [27] HANGUL SYLLABLE YEOG..HANGUL SYLLABLE YEOH
			0xC609 <= code && code <= 0xC623 || // Lo  [27] HANGUL SYLLABLE YEG..HANGUL SYLLABLE YEH
			0xC625 <= code && code <= 0xC63F || // Lo  [27] HANGUL SYLLABLE OG..HANGUL SYLLABLE OH
			0xC641 <= code && code <= 0xC65B || // Lo  [27] HANGUL SYLLABLE WAG..HANGUL SYLLABLE WAH
			0xC65D <= code && code <= 0xC677 || // Lo  [27] HANGUL SYLLABLE WAEG..HANGUL SYLLABLE WAEH
			0xC679 <= code && code <= 0xC693 || // Lo  [27] HANGUL SYLLABLE OEG..HANGUL SYLLABLE OEH
			0xC695 <= code && code <= 0xC6AF || // Lo  [27] HANGUL SYLLABLE YOG..HANGUL SYLLABLE YOH
			0xC6B1 <= code && code <= 0xC6CB || // Lo  [27] HANGUL SYLLABLE UG..HANGUL SYLLABLE UH
			0xC6CD <= code && code <= 0xC6E7 || // Lo  [27] HANGUL SYLLABLE WEOG..HANGUL SYLLABLE WEOH
			0xC6E9 <= code && code <= 0xC703 || // Lo  [27] HANGUL SYLLABLE WEG..HANGUL SYLLABLE WEH
			0xC705 <= code && code <= 0xC71F || // Lo  [27] HANGUL SYLLABLE WIG..HANGUL SYLLABLE WIH
			0xC721 <= code && code <= 0xC73B || // Lo  [27] HANGUL SYLLABLE YUG..HANGUL SYLLABLE YUH
			0xC73D <= code && code <= 0xC757 || // Lo  [27] HANGUL SYLLABLE EUG..HANGUL SYLLABLE EUH
			0xC759 <= code && code <= 0xC773 || // Lo  [27] HANGUL SYLLABLE YIG..HANGUL SYLLABLE YIH
			0xC775 <= code && code <= 0xC78F || // Lo  [27] HANGUL SYLLABLE IG..HANGUL SYLLABLE IH
			0xC791 <= code && code <= 0xC7AB || // Lo  [27] HANGUL SYLLABLE JAG..HANGUL SYLLABLE JAH
			0xC7AD <= code && code <= 0xC7C7 || // Lo  [27] HANGUL SYLLABLE JAEG..HANGUL SYLLABLE JAEH
			0xC7C9 <= code && code <= 0xC7E3 || // Lo  [27] HANGUL SYLLABLE JYAG..HANGUL SYLLABLE JYAH
			0xC7E5 <= code && code <= 0xC7FF || // Lo  [27] HANGUL SYLLABLE JYAEG..HANGUL SYLLABLE JYAEH
			0xC801 <= code && code <= 0xC81B || // Lo  [27] HANGUL SYLLABLE JEOG..HANGUL SYLLABLE JEOH
			0xC81D <= code && code <= 0xC837 || // Lo  [27] HANGUL SYLLABLE JEG..HANGUL SYLLABLE JEH
			0xC839 <= code && code <= 0xC853 || // Lo  [27] HANGUL SYLLABLE JYEOG..HANGUL SYLLABLE JYEOH
			0xC855 <= code && code <= 0xC86F || // Lo  [27] HANGUL SYLLABLE JYEG..HANGUL SYLLABLE JYEH
			0xC871 <= code && code <= 0xC88B || // Lo  [27] HANGUL SYLLABLE JOG..HANGUL SYLLABLE JOH
			0xC88D <= code && code <= 0xC8A7 || // Lo  [27] HANGUL SYLLABLE JWAG..HANGUL SYLLABLE JWAH
			0xC8A9 <= code && code <= 0xC8C3 || // Lo  [27] HANGUL SYLLABLE JWAEG..HANGUL SYLLABLE JWAEH
			0xC8C5 <= code && code <= 0xC8DF || // Lo  [27] HANGUL SYLLABLE JOEG..HANGUL SYLLABLE JOEH
			0xC8E1 <= code && code <= 0xC8FB || // Lo  [27] HANGUL SYLLABLE JYOG..HANGUL SYLLABLE JYOH
			0xC8FD <= code && code <= 0xC917 || // Lo  [27] HANGUL SYLLABLE JUG..HANGUL SYLLABLE JUH
			0xC919 <= code && code <= 0xC933 || // Lo  [27] HANGUL SYLLABLE JWEOG..HANGUL SYLLABLE JWEOH
			0xC935 <= code && code <= 0xC94F || // Lo  [27] HANGUL SYLLABLE JWEG..HANGUL SYLLABLE JWEH
			0xC951 <= code && code <= 0xC96B || // Lo  [27] HANGUL SYLLABLE JWIG..HANGUL SYLLABLE JWIH
			0xC96D <= code && code <= 0xC987 || // Lo  [27] HANGUL SYLLABLE JYUG..HANGUL SYLLABLE JYUH
			0xC989 <= code && code <= 0xC9A3 || // Lo  [27] HANGUL SYLLABLE JEUG..HANGUL SYLLABLE JEUH
			0xC9A5 <= code && code <= 0xC9BF || // Lo  [27] HANGUL SYLLABLE JYIG..HANGUL SYLLABLE JYIH
			0xC9C1 <= code && code <= 0xC9DB || // Lo  [27] HANGUL SYLLABLE JIG..HANGUL SYLLABLE JIH
			0xC9DD <= code && code <= 0xC9F7 || // Lo  [27] HANGUL SYLLABLE JJAG..HANGUL SYLLABLE JJAH
			0xC9F9 <= code && code <= 0xCA13 || // Lo  [27] HANGUL SYLLABLE JJAEG..HANGUL SYLLABLE JJAEH
			0xCA15 <= code && code <= 0xCA2F || // Lo  [27] HANGUL SYLLABLE JJYAG..HANGUL SYLLABLE JJYAH
			0xCA31 <= code && code <= 0xCA4B || // Lo  [27] HANGUL SYLLABLE JJYAEG..HANGUL SYLLABLE JJYAEH
			0xCA4D <= code && code <= 0xCA67 || // Lo  [27] HANGUL SYLLABLE JJEOG..HANGUL SYLLABLE JJEOH
			0xCA69 <= code && code <= 0xCA83 || // Lo  [27] HANGUL SYLLABLE JJEG..HANGUL SYLLABLE JJEH
			0xCA85 <= code && code <= 0xCA9F || // Lo  [27] HANGUL SYLLABLE JJYEOG..HANGUL SYLLABLE JJYEOH
			0xCAA1 <= code && code <= 0xCABB || // Lo  [27] HANGUL SYLLABLE JJYEG..HANGUL SYLLABLE JJYEH
			0xCABD <= code && code <= 0xCAD7 || // Lo  [27] HANGUL SYLLABLE JJOG..HANGUL SYLLABLE JJOH
			0xCAD9 <= code && code <= 0xCAF3 || // Lo  [27] HANGUL SYLLABLE JJWAG..HANGUL SYLLABLE JJWAH
			0xCAF5 <= code && code <= 0xCB0F || // Lo  [27] HANGUL SYLLABLE JJWAEG..HANGUL SYLLABLE JJWAEH
			0xCB11 <= code && code <= 0xCB2B || // Lo  [27] HANGUL SYLLABLE JJOEG..HANGUL SYLLABLE JJOEH
			0xCB2D <= code && code <= 0xCB47 || // Lo  [27] HANGUL SYLLABLE JJYOG..HANGUL SYLLABLE JJYOH
			0xCB49 <= code && code <= 0xCB63 || // Lo  [27] HANGUL SYLLABLE JJUG..HANGUL SYLLABLE JJUH
			0xCB65 <= code && code <= 0xCB7F || // Lo  [27] HANGUL SYLLABLE JJWEOG..HANGUL SYLLABLE JJWEOH
			0xCB81 <= code && code <= 0xCB9B || // Lo  [27] HANGUL SYLLABLE JJWEG..HANGUL SYLLABLE JJWEH
			0xCB9D <= code && code <= 0xCBB7 || // Lo  [27] HANGUL SYLLABLE JJWIG..HANGUL SYLLABLE JJWIH
			0xCBB9 <= code && code <= 0xCBD3 || // Lo  [27] HANGUL SYLLABLE JJYUG..HANGUL SYLLABLE JJYUH
			0xCBD5 <= code && code <= 0xCBEF || // Lo  [27] HANGUL SYLLABLE JJEUG..HANGUL SYLLABLE JJEUH
			0xCBF1 <= code && code <= 0xCC0B || // Lo  [27] HANGUL SYLLABLE JJYIG..HANGUL SYLLABLE JJYIH
			0xCC0D <= code && code <= 0xCC27 || // Lo  [27] HANGUL SYLLABLE JJIG..HANGUL SYLLABLE JJIH
			0xCC29 <= code && code <= 0xCC43 || // Lo  [27] HANGUL SYLLABLE CAG..HANGUL SYLLABLE CAH
			0xCC45 <= code && code <= 0xCC5F || // Lo  [27] HANGUL SYLLABLE CAEG..HANGUL SYLLABLE CAEH
			0xCC61 <= code && code <= 0xCC7B || // Lo  [27] HANGUL SYLLABLE CYAG..HANGUL SYLLABLE CYAH
			0xCC7D <= code && code <= 0xCC97 || // Lo  [27] HANGUL SYLLABLE CYAEG..HANGUL SYLLABLE CYAEH
			0xCC99 <= code && code <= 0xCCB3 || // Lo  [27] HANGUL SYLLABLE CEOG..HANGUL SYLLABLE CEOH
			0xCCB5 <= code && code <= 0xCCCF || // Lo  [27] HANGUL SYLLABLE CEG..HANGUL SYLLABLE CEH
			0xCCD1 <= code && code <= 0xCCEB || // Lo  [27] HANGUL SYLLABLE CYEOG..HANGUL SYLLABLE CYEOH
			0xCCED <= code && code <= 0xCD07 || // Lo  [27] HANGUL SYLLABLE CYEG..HANGUL SYLLABLE CYEH
			0xCD09 <= code && code <= 0xCD23 || // Lo  [27] HANGUL SYLLABLE COG..HANGUL SYLLABLE COH
			0xCD25 <= code && code <= 0xCD3F || // Lo  [27] HANGUL SYLLABLE CWAG..HANGUL SYLLABLE CWAH
			0xCD41 <= code && code <= 0xCD5B || // Lo  [27] HANGUL SYLLABLE CWAEG..HANGUL SYLLABLE CWAEH
			0xCD5D <= code && code <= 0xCD77 || // Lo  [27] HANGUL SYLLABLE COEG..HANGUL SYLLABLE COEH
			0xCD79 <= code && code <= 0xCD93 || // Lo  [27] HANGUL SYLLABLE CYOG..HANGUL SYLLABLE CYOH
			0xCD95 <= code && code <= 0xCDAF || // Lo  [27] HANGUL SYLLABLE CUG..HANGUL SYLLABLE CUH
			0xCDB1 <= code && code <= 0xCDCB || // Lo  [27] HANGUL SYLLABLE CWEOG..HANGUL SYLLABLE CWEOH
			0xCDCD <= code && code <= 0xCDE7 || // Lo  [27] HANGUL SYLLABLE CWEG..HANGUL SYLLABLE CWEH
			0xCDE9 <= code && code <= 0xCE03 || // Lo  [27] HANGUL SYLLABLE CWIG..HANGUL SYLLABLE CWIH
			0xCE05 <= code && code <= 0xCE1F || // Lo  [27] HANGUL SYLLABLE CYUG..HANGUL SYLLABLE CYUH
			0xCE21 <= code && code <= 0xCE3B || // Lo  [27] HANGUL SYLLABLE CEUG..HANGUL SYLLABLE CEUH
			0xCE3D <= code && code <= 0xCE57 || // Lo  [27] HANGUL SYLLABLE CYIG..HANGUL SYLLABLE CYIH
			0xCE59 <= code && code <= 0xCE73 || // Lo  [27] HANGUL SYLLABLE CIG..HANGUL SYLLABLE CIH
			0xCE75 <= code && code <= 0xCE8F || // Lo  [27] HANGUL SYLLABLE KAG..HANGUL SYLLABLE KAH
			0xCE91 <= code && code <= 0xCEAB || // Lo  [27] HANGUL SYLLABLE KAEG..HANGUL SYLLABLE KAEH
			0xCEAD <= code && code <= 0xCEC7 || // Lo  [27] HANGUL SYLLABLE KYAG..HANGUL SYLLABLE KYAH
			0xCEC9 <= code && code <= 0xCEE3 || // Lo  [27] HANGUL SYLLABLE KYAEG..HANGUL SYLLABLE KYAEH
			0xCEE5 <= code && code <= 0xCEFF || // Lo  [27] HANGUL SYLLABLE KEOG..HANGUL SYLLABLE KEOH
			0xCF01 <= code && code <= 0xCF1B || // Lo  [27] HANGUL SYLLABLE KEG..HANGUL SYLLABLE KEH
			0xCF1D <= code && code <= 0xCF37 || // Lo  [27] HANGUL SYLLABLE KYEOG..HANGUL SYLLABLE KYEOH
			0xCF39 <= code && code <= 0xCF53 || // Lo  [27] HANGUL SYLLABLE KYEG..HANGUL SYLLABLE KYEH
			0xCF55 <= code && code <= 0xCF6F || // Lo  [27] HANGUL SYLLABLE KOG..HANGUL SYLLABLE KOH
			0xCF71 <= code && code <= 0xCF8B || // Lo  [27] HANGUL SYLLABLE KWAG..HANGUL SYLLABLE KWAH
			0xCF8D <= code && code <= 0xCFA7 || // Lo  [27] HANGUL SYLLABLE KWAEG..HANGUL SYLLABLE KWAEH
			0xCFA9 <= code && code <= 0xCFC3 || // Lo  [27] HANGUL SYLLABLE KOEG..HANGUL SYLLABLE KOEH
			0xCFC5 <= code && code <= 0xCFDF || // Lo  [27] HANGUL SYLLABLE KYOG..HANGUL SYLLABLE KYOH
			0xCFE1 <= code && code <= 0xCFFB || // Lo  [27] HANGUL SYLLABLE KUG..HANGUL SYLLABLE KUH
			0xCFFD <= code && code <= 0xD017 || // Lo  [27] HANGUL SYLLABLE KWEOG..HANGUL SYLLABLE KWEOH
			0xD019 <= code && code <= 0xD033 || // Lo  [27] HANGUL SYLLABLE KWEG..HANGUL SYLLABLE KWEH
			0xD035 <= code && code <= 0xD04F || // Lo  [27] HANGUL SYLLABLE KWIG..HANGUL SYLLABLE KWIH
			0xD051 <= code && code <= 0xD06B || // Lo  [27] HANGUL SYLLABLE KYUG..HANGUL SYLLABLE KYUH
			0xD06D <= code && code <= 0xD087 || // Lo  [27] HANGUL SYLLABLE KEUG..HANGUL SYLLABLE KEUH
			0xD089 <= code && code <= 0xD0A3 || // Lo  [27] HANGUL SYLLABLE KYIG..HANGUL SYLLABLE KYIH
			0xD0A5 <= code && code <= 0xD0BF || // Lo  [27] HANGUL SYLLABLE KIG..HANGUL SYLLABLE KIH
			0xD0C1 <= code && code <= 0xD0DB || // Lo  [27] HANGUL SYLLABLE TAG..HANGUL SYLLABLE TAH
			0xD0DD <= code && code <= 0xD0F7 || // Lo  [27] HANGUL SYLLABLE TAEG..HANGUL SYLLABLE TAEH
			0xD0F9 <= code && code <= 0xD113 || // Lo  [27] HANGUL SYLLABLE TYAG..HANGUL SYLLABLE TYAH
			0xD115 <= code && code <= 0xD12F || // Lo  [27] HANGUL SYLLABLE TYAEG..HANGUL SYLLABLE TYAEH
			0xD131 <= code && code <= 0xD14B || // Lo  [27] HANGUL SYLLABLE TEOG..HANGUL SYLLABLE TEOH
			0xD14D <= code && code <= 0xD167 || // Lo  [27] HANGUL SYLLABLE TEG..HANGUL SYLLABLE TEH
			0xD169 <= code && code <= 0xD183 || // Lo  [27] HANGUL SYLLABLE TYEOG..HANGUL SYLLABLE TYEOH
			0xD185 <= code && code <= 0xD19F || // Lo  [27] HANGUL SYLLABLE TYEG..HANGUL SYLLABLE TYEH
			0xD1A1 <= code && code <= 0xD1BB || // Lo  [27] HANGUL SYLLABLE TOG..HANGUL SYLLABLE TOH
			0xD1BD <= code && code <= 0xD1D7 || // Lo  [27] HANGUL SYLLABLE TWAG..HANGUL SYLLABLE TWAH
			0xD1D9 <= code && code <= 0xD1F3 || // Lo  [27] HANGUL SYLLABLE TWAEG..HANGUL SYLLABLE TWAEH
			0xD1F5 <= code && code <= 0xD20F || // Lo  [27] HANGUL SYLLABLE TOEG..HANGUL SYLLABLE TOEH
			0xD211 <= code && code <= 0xD22B || // Lo  [27] HANGUL SYLLABLE TYOG..HANGUL SYLLABLE TYOH
			0xD22D <= code && code <= 0xD247 || // Lo  [27] HANGUL SYLLABLE TUG..HANGUL SYLLABLE TUH
			0xD249 <= code && code <= 0xD263 || // Lo  [27] HANGUL SYLLABLE TWEOG..HANGUL SYLLABLE TWEOH
			0xD265 <= code && code <= 0xD27F || // Lo  [27] HANGUL SYLLABLE TWEG..HANGUL SYLLABLE TWEH
			0xD281 <= code && code <= 0xD29B || // Lo  [27] HANGUL SYLLABLE TWIG..HANGUL SYLLABLE TWIH
			0xD29D <= code && code <= 0xD2B7 || // Lo  [27] HANGUL SYLLABLE TYUG..HANGUL SYLLABLE TYUH
			0xD2B9 <= code && code <= 0xD2D3 || // Lo  [27] HANGUL SYLLABLE TEUG..HANGUL SYLLABLE TEUH
			0xD2D5 <= code && code <= 0xD2EF || // Lo  [27] HANGUL SYLLABLE TYIG..HANGUL SYLLABLE TYIH
			0xD2F1 <= code && code <= 0xD30B || // Lo  [27] HANGUL SYLLABLE TIG..HANGUL SYLLABLE TIH
			0xD30D <= code && code <= 0xD327 || // Lo  [27] HANGUL SYLLABLE PAG..HANGUL SYLLABLE PAH
			0xD329 <= code && code <= 0xD343 || // Lo  [27] HANGUL SYLLABLE PAEG..HANGUL SYLLABLE PAEH
			0xD345 <= code && code <= 0xD35F || // Lo  [27] HANGUL SYLLABLE PYAG..HANGUL SYLLABLE PYAH
			0xD361 <= code && code <= 0xD37B || // Lo  [27] HANGUL SYLLABLE PYAEG..HANGUL SYLLABLE PYAEH
			0xD37D <= code && code <= 0xD397 || // Lo  [27] HANGUL SYLLABLE PEOG..HANGUL SYLLABLE PEOH
			0xD399 <= code && code <= 0xD3B3 || // Lo  [27] HANGUL SYLLABLE PEG..HANGUL SYLLABLE PEH
			0xD3B5 <= code && code <= 0xD3CF || // Lo  [27] HANGUL SYLLABLE PYEOG..HANGUL SYLLABLE PYEOH
			0xD3D1 <= code && code <= 0xD3EB || // Lo  [27] HANGUL SYLLABLE PYEG..HANGUL SYLLABLE PYEH
			0xD3ED <= code && code <= 0xD407 || // Lo  [27] HANGUL SYLLABLE POG..HANGUL SYLLABLE POH
			0xD409 <= code && code <= 0xD423 || // Lo  [27] HANGUL SYLLABLE PWAG..HANGUL SYLLABLE PWAH
			0xD425 <= code && code <= 0xD43F || // Lo  [27] HANGUL SYLLABLE PWAEG..HANGUL SYLLABLE PWAEH
			0xD441 <= code && code <= 0xD45B || // Lo  [27] HANGUL SYLLABLE POEG..HANGUL SYLLABLE POEH
			0xD45D <= code && code <= 0xD477 || // Lo  [27] HANGUL SYLLABLE PYOG..HANGUL SYLLABLE PYOH
			0xD479 <= code && code <= 0xD493 || // Lo  [27] HANGUL SYLLABLE PUG..HANGUL SYLLABLE PUH
			0xD495 <= code && code <= 0xD4AF || // Lo  [27] HANGUL SYLLABLE PWEOG..HANGUL SYLLABLE PWEOH
			0xD4B1 <= code && code <= 0xD4CB || // Lo  [27] HANGUL SYLLABLE PWEG..HANGUL SYLLABLE PWEH
			0xD4CD <= code && code <= 0xD4E7 || // Lo  [27] HANGUL SYLLABLE PWIG..HANGUL SYLLABLE PWIH
			0xD4E9 <= code && code <= 0xD503 || // Lo  [27] HANGUL SYLLABLE PYUG..HANGUL SYLLABLE PYUH
			0xD505 <= code && code <= 0xD51F || // Lo  [27] HANGUL SYLLABLE PEUG..HANGUL SYLLABLE PEUH
			0xD521 <= code && code <= 0xD53B || // Lo  [27] HANGUL SYLLABLE PYIG..HANGUL SYLLABLE PYIH
			0xD53D <= code && code <= 0xD557 || // Lo  [27] HANGUL SYLLABLE PIG..HANGUL SYLLABLE PIH
			0xD559 <= code && code <= 0xD573 || // Lo  [27] HANGUL SYLLABLE HAG..HANGUL SYLLABLE HAH
			0xD575 <= code && code <= 0xD58F || // Lo  [27] HANGUL SYLLABLE HAEG..HANGUL SYLLABLE HAEH
			0xD591 <= code && code <= 0xD5AB || // Lo  [27] HANGUL SYLLABLE HYAG..HANGUL SYLLABLE HYAH
			0xD5AD <= code && code <= 0xD5C7 || // Lo  [27] HANGUL SYLLABLE HYAEG..HANGUL SYLLABLE HYAEH
			0xD5C9 <= code && code <= 0xD5E3 || // Lo  [27] HANGUL SYLLABLE HEOG..HANGUL SYLLABLE HEOH
			0xD5E5 <= code && code <= 0xD5FF || // Lo  [27] HANGUL SYLLABLE HEG..HANGUL SYLLABLE HEH
			0xD601 <= code && code <= 0xD61B || // Lo  [27] HANGUL SYLLABLE HYEOG..HANGUL SYLLABLE HYEOH
			0xD61D <= code && code <= 0xD637 || // Lo  [27] HANGUL SYLLABLE HYEG..HANGUL SYLLABLE HYEH
			0xD639 <= code && code <= 0xD653 || // Lo  [27] HANGUL SYLLABLE HOG..HANGUL SYLLABLE HOH
			0xD655 <= code && code <= 0xD66F || // Lo  [27] HANGUL SYLLABLE HWAG..HANGUL SYLLABLE HWAH
			0xD671 <= code && code <= 0xD68B || // Lo  [27] HANGUL SYLLABLE HWAEG..HANGUL SYLLABLE HWAEH
			0xD68D <= code && code <= 0xD6A7 || // Lo  [27] HANGUL SYLLABLE HOEG..HANGUL SYLLABLE HOEH
			0xD6A9 <= code && code <= 0xD6C3 || // Lo  [27] HANGUL SYLLABLE HYOG..HANGUL SYLLABLE HYOH
			0xD6C5 <= code && code <= 0xD6DF || // Lo  [27] HANGUL SYLLABLE HUG..HANGUL SYLLABLE HUH
			0xD6E1 <= code && code <= 0xD6FB || // Lo  [27] HANGUL SYLLABLE HWEOG..HANGUL SYLLABLE HWEOH
			0xD6FD <= code && code <= 0xD717 || // Lo  [27] HANGUL SYLLABLE HWEG..HANGUL SYLLABLE HWEH
			0xD719 <= code && code <= 0xD733 || // Lo  [27] HANGUL SYLLABLE HWIG..HANGUL SYLLABLE HWIH
			0xD735 <= code && code <= 0xD74F || // Lo  [27] HANGUL SYLLABLE HYUG..HANGUL SYLLABLE HYUH
			0xD751 <= code && code <= 0xD76B || // Lo  [27] HANGUL SYLLABLE HEUG..HANGUL SYLLABLE HEUH
			0xD76D <= code && code <= 0xD787 || // Lo  [27] HANGUL SYLLABLE HYIG..HANGUL SYLLABLE HYIH
			0xD789 <= code && code <= 0xD7A3 // Lo  [27] HANGUL SYLLABLE HIG..HANGUL SYLLABLE HIH
			) {
					return LVT;
				}

			if (0x261D == code || // So       WHITE UP POINTING INDEX
			0x26F9 == code || // So       PERSON WITH BALL
			0x270A <= code && code <= 0x270D || // So   [4] RAISED FIST..WRITING HAND
			0x1F385 == code || // So       FATHER CHRISTMAS
			0x1F3C2 <= code && code <= 0x1F3C4 || // So   [3] SNOWBOARDER..SURFER
			0x1F3C7 == code || // So       HORSE RACING
			0x1F3CA <= code && code <= 0x1F3CC || // So   [3] SWIMMER..GOLFER
			0x1F442 <= code && code <= 0x1F443 || // So   [2] EAR..NOSE
			0x1F446 <= code && code <= 0x1F450 || // So  [11] WHITE UP POINTING BACKHAND INDEX..OPEN HANDS SIGN
			0x1F46E == code || // So       POLICE OFFICER
			0x1F470 <= code && code <= 0x1F478 || // So   [9] BRIDE WITH VEIL..PRINCESS
			0x1F47C == code || // So       BABY ANGEL
			0x1F481 <= code && code <= 0x1F483 || // So   [3] INFORMATION DESK PERSON..DANCER
			0x1F485 <= code && code <= 0x1F487 || // So   [3] NAIL POLISH..HAIRCUT
			0x1F4AA == code || // So       FLEXED BICEPS
			0x1F574 <= code && code <= 0x1F575 || // So   [2] MAN IN BUSINESS SUIT LEVITATING..SLEUTH OR SPY
			0x1F57A == code || // So       MAN DANCING
			0x1F590 == code || // So       RAISED HAND WITH FINGERS SPLAYED
			0x1F595 <= code && code <= 0x1F596 || // So   [2] REVERSED HAND WITH MIDDLE FINGER EXTENDED..RAISED HAND WITH PART BETWEEN MIDDLE AND RING FINGERS
			0x1F645 <= code && code <= 0x1F647 || // So   [3] FACE WITH NO GOOD GESTURE..PERSON BOWING DEEPLY
			0x1F64B <= code && code <= 0x1F64F || // So   [5] HAPPY PERSON RAISING ONE HAND..PERSON WITH FOLDED HANDS
			0x1F6A3 == code || // So       ROWBOAT
			0x1F6B4 <= code && code <= 0x1F6B6 || // So   [3] BICYCLIST..PEDESTRIAN
			0x1F6C0 == code || // So       BATH
			0x1F6CC == code || // So       SLEEPING ACCOMMODATION
			0x1F918 <= code && code <= 0x1F91C || // So   [5] SIGN OF THE HORNS..RIGHT-FACING FIST
			0x1F91E <= code && code <= 0x1F91F || // So   [2] HAND WITH INDEX AND MIDDLE FINGERS CROSSED..I LOVE YOU HAND SIGN
			0x1F926 == code || // So       FACE PALM
			0x1F930 <= code && code <= 0x1F939 || // So  [10] PREGNANT WOMAN..JUGGLING
			0x1F93D <= code && code <= 0x1F93E || // So   [2] WATER POLO..HANDBALL
			0x1F9D1 <= code && code <= 0x1F9DD // So  [13] ADULT..ELF
			) {
					return E_Base;
				}

			if (0x1F3FB <= code && code <= 0x1F3FF) // Sk   [5] EMOJI MODIFIER FITZPATRICK TYPE-1-2..EMOJI MODIFIER FITZPATRICK TYPE-6
				{
					return E_Modifier;
				}

			if (0x200D == code // Cf       ZERO WIDTH JOINER
			) {
					return ZWJ;
				}

			if (0x2640 == code || // So       FEMALE SIGN
			0x2642 == code || // So       MALE SIGN
			0x2695 <= code && code <= 0x2696 || // So   [2] STAFF OF AESCULAPIUS..SCALES
			0x2708 == code || // So       AIRPLANE
			0x2764 == code || // So       HEAVY BLACK HEART
			0x1F308 == code || // So       RAINBOW
			0x1F33E == code || // So       EAR OF RICE
			0x1F373 == code || // So       COOKING
			0x1F393 == code || // So       GRADUATION CAP
			0x1F3A4 == code || // So       MICROPHONE
			0x1F3A8 == code || // So       ARTIST PALETTE
			0x1F3EB == code || // So       SCHOOL
			0x1F3ED == code || // So       FACTORY
			0x1F48B == code || // So       KISS MARK
			0x1F4BB <= code && code <= 0x1F4BC || // So   [2] PERSONAL COMPUTER..BRIEFCASE
			0x1F527 == code || // So       WRENCH
			0x1F52C == code || // So       MICROSCOPE
			0x1F5E8 == code || // So       LEFT SPEECH BUBBLE
			0x1F680 == code || // So       ROCKET
			0x1F692 == code // So       FIRE ENGINE
			) {
					return Glue_After_Zwj;
				}

			if (0x1F466 <= code && code <= 0x1F469) // So   [4] BOY..WOMAN
				{
					return E_Base_GAZ;
				}

			//all unlisted characters have a grapheme break property of "Other"
			return Other;
		}
		return this;
	}

	if ( true && module.exports) {
		module.exports = GraphemeSplitter;
	}
});

var splitter = new graphemeSplitter();

var substring = function substring(str, start, end) {
	var iterator = splitter.iterateGraphemes(str.substring(start));

	var value = '';

	for (var pos = 0; pos < end - start; pos++) {
		var next = iterator.next();

		value += next.value;

		if (next.done) {
			break;
		}
	}

	return value;
};

var location = (function (startLine, startColumn, startOffset, endLine, endColumn, endOffset, source) {
	return {
		start: {
			line: startLine,
			column: startColumn,
			offset: startOffset
		},
		end: {
			line: endLine,
			column: endColumn,
			offset: endOffset
		},
		source: source || null
	};
});

var build = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
    module.exports = factory();
  })(commonjsGlobal, function () {
    'use strict';

    /*!
     * repeat-string <https://github.com/jonschlinkert/repeat-string>
     *
     * Copyright (c) 2014-2015, Jon Schlinkert.
     * Licensed under the MIT License.
     */

    'use strict';

    /**
     * Results cache
     */

    var res = '';
    var cache;

    /**
     * Expose `repeat`
     */

    var repeatString = repeat;

    /**
     * Repeat the given `string` the specified `number`
     * of times.
     *
     * **Example:**
     *
     * ```js
     * var repeat = require('repeat-string');
     * repeat('A', 5);
     * //=> AAAAA
     * ```
     *
     * @param {String} `string` The string to repeat
     * @param {Number} `number` The number of times to repeat the string
     * @return {String} Repeated string
     * @api public
     */

    function repeat(str, num) {
      if (typeof str !== 'string') {
        throw new TypeError('expected a string');
      }

      // cover common, quick use cases
      if (num === 1) return str;
      if (num === 2) return str + str;

      var max = str.length * num;
      if (cache !== str || typeof cache === 'undefined') {
        cache = str;
        res = '';
      } else if (res.length >= max) {
        return res.substr(0, max);
      }

      while (max > res.length && num > 1) {
        if (num & 1) {
          res += str;
        }

        num >>= 1;
        str += str;
      }

      res += str;
      res = res.substr(0, max);
      return res;
    }

    'use strict';

    var padStart = function padStart(string, maxLength, fillString) {

      if (string == null || maxLength == null) {
        return string;
      }

      var result = String(string);
      var targetLen = typeof maxLength === 'number' ? maxLength : parseInt(maxLength, 10);

      if (isNaN(targetLen) || !isFinite(targetLen)) {
        return result;
      }

      var length = result.length;
      if (length >= targetLen) {
        return result;
      }

      var fill = fillString == null ? '' : String(fillString);
      if (fill === '') {
        fill = ' ';
      }

      var fillLen = targetLen - length;

      while (fill.length < fillLen) {
        fill += fill;
      }

      var truncated = fill.length > fillLen ? fill.substr(0, fillLen) : fill;

      return truncated + result;
    };

    var _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    function printLine(line, position, maxNumLength, settings) {
      var num = String(position);
      var formattedNum = padStart(num, maxNumLength, ' ');
      var tabReplacement = repeatString(' ', settings.tabSize);

      return formattedNum + ' | ' + line.replace(/\t/g, tabReplacement);
    }

    function printLines(lines, start, end, maxNumLength, settings) {
      return lines.slice(start, end).map(function (line, i) {
        return printLine(line, start + i + 1, maxNumLength, settings);
      }).join('\n');
    }

    var defaultSettings = {
      extraLines: 2,
      tabSize: 4
    };

    var index = function index(input, linePos, columnPos, settings) {
      settings = _extends({}, defaultSettings, settings);

      var lines = input.split(/\r\n?|\n|\f/);
      var startLinePos = Math.max(1, linePos - settings.extraLines) - 1;
      var endLinePos = Math.min(linePos + settings.extraLines, lines.length);
      var maxNumLength = String(endLinePos).length;
      var prevLines = printLines(lines, startLinePos, linePos, maxNumLength, settings);
      var targetLineBeforeCursor = printLine(lines[linePos - 1].substring(0, columnPos - 1), linePos, maxNumLength, settings);
      var cursorLine = repeatString(' ', targetLineBeforeCursor.length) + '^';
      var nextLines = printLines(lines, linePos, endLinePos, maxNumLength, settings);

      return [prevLines, cursorLine, nextLines].filter(Boolean).join('\n');
    };

    return index;
  });
});

var errorStack = new Error().stack;

var createError = (function (props) {
	// use Object.create(), because some VMs prevent setting line/column otherwise
	// (iOS Safari 10 even throws an exception)
	var error = Object.create(SyntaxError.prototype);

	Object.assign(error, props, {
		name: 'SyntaxError'
	});

	Object.defineProperty(error, 'stack', {
		get: function get() {
			return errorStack ? errorStack.replace(/^(.+\n){1,3}/, String(error) + '\n') : '';
		}
	});

	return error;
});

var error = (function (message, input, source, line, column) {
	throw createError({
		message: line ? message + '\n' + build(input, line, column) : message,
		rawMessage: message,
		source: source,
		line: line,
		column: column
	});
});

var parseErrorTypes = {
	unexpectedEnd: function unexpectedEnd() {
		return 'Unexpected end of input';
	},
	unexpectedToken: function unexpectedToken(token) {
		for (var _len = arguments.length, position = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			position[_key - 1] = arguments[_key];
		}

		return 'Unexpected token <' + token + '> at ' + position.filter(Boolean).join(':');
	}
};

var tokenizeErrorTypes = {
	unexpectedSymbol: function unexpectedSymbol(symbol) {
		for (var _len = arguments.length, position = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			position[_key - 1] = arguments[_key];
		}

		return 'Unexpected symbol <' + symbol + '> at ' + position.filter(Boolean).join(':');
	}
};

var tokenTypes = {
	LEFT_BRACE: 0, // {
	RIGHT_BRACE: 1, // }
	LEFT_BRACKET: 2, // [
	RIGHT_BRACKET: 3, // ]
	COLON: 4, // :
	COMMA: 5, // ,
	STRING: 6, //
	NUMBER: 7, //
	TRUE: 8, // true
	FALSE: 9, // false
	NULL: 10 // null
};

var punctuatorTokensMap = { // Lexeme: Token
	'{': tokenTypes.LEFT_BRACE,
	'}': tokenTypes.RIGHT_BRACE,
	'[': tokenTypes.LEFT_BRACKET,
	']': tokenTypes.RIGHT_BRACKET,
	':': tokenTypes.COLON,
	',': tokenTypes.COMMA
};

var keywordTokensMap = { // Lexeme: Token
	'true': tokenTypes.TRUE,
	'false': tokenTypes.FALSE,
	'null': tokenTypes.NULL
};

var stringStates = {
	_START_: 0,
	START_QUOTE_OR_CHAR: 1,
	ESCAPE: 2
};

var escapes$1 = {
	'"': 0, // Quotation mask
	'\\': 1, // Reverse solidus
	'/': 2, // Solidus
	'b': 3, // Backspace
	'f': 4, // Form feed
	'n': 5, // New line
	'r': 6, // Carriage return
	't': 7, // Horizontal tab
	'u': 8 // 4 hexadecimal digits
};

var numberStates = {
	_START_: 0,
	MINUS: 1,
	ZERO: 2,
	DIGIT: 3,
	POINT: 4,
	DIGIT_FRACTION: 5,
	EXP: 6,
	EXP_DIGIT_OR_SIGN: 7
};

// HELPERS

function isDigit1to9(char) {
	return char >= '1' && char <= '9';
}

function isDigit(char) {
	return char >= '0' && char <= '9';
}

function isHex(char) {
	return isDigit(char) || char >= 'a' && char <= 'f' || char >= 'A' && char <= 'F';
}

function isExp(char) {
	return char === 'e' || char === 'E';
}

// PARSERS

function parseWhitespace(input, index, line, column) {
	var char = input.charAt(index);

	if (char === '\r') {
		// CR (Unix)
		index++;
		line++;
		column = 1;
		if (input.charAt(index) === '\n') {
			// CRLF (Windows)
			index++;
		}
	} else if (char === '\n') {
		// LF (MacOS)
		index++;
		line++;
		column = 1;
	} else if (char === '\t' || char === ' ') {
		index++;
		column++;
	} else {
		return null;
	}

	return {
		index: index,
		line: line,
		column: column
	};
}

function parseChar(input, index, line, column) {
	var char = input.charAt(index);

	if (char in punctuatorTokensMap) {
		return {
			type: punctuatorTokensMap[char],
			line: line,
			column: column + 1,
			index: index + 1,
			value: null
		};
	}

	return null;
}

function parseKeyword(input, index, line, column) {
	for (var name in keywordTokensMap) {
		if (keywordTokensMap.hasOwnProperty(name) && input.substr(index, name.length) === name) {
			return {
				type: keywordTokensMap[name],
				line: line,
				column: column + name.length,
				index: index + name.length,
				value: name
			};
		}
	}

	return null;
}

function parseString$1(input, index, line, column) {
	var startIndex = index;
	var state = stringStates._START_;

	while (index < input.length) {
		var char = input.charAt(index);

		switch (state) {
			case stringStates._START_:
				{
					if (char === '"') {
						index++;
						state = stringStates.START_QUOTE_OR_CHAR;
					} else {
						return null;
					}
					break;
				}

			case stringStates.START_QUOTE_OR_CHAR:
				{
					if (char === '\\') {
						index++;
						state = stringStates.ESCAPE;
					} else if (char === '"') {
						index++;
						return {
							type: tokenTypes.STRING,
							line: line,
							column: column + index - startIndex,
							index: index,
							value: input.slice(startIndex, index)
						};
					} else {
						index++;
					}
					break;
				}

			case stringStates.ESCAPE:
				{
					if (char in escapes$1) {
						index++;
						if (char === 'u') {
							for (var i = 0; i < 4; i++) {
								var curChar = input.charAt(index);
								if (curChar && isHex(curChar)) {
									index++;
								} else {
									return null;
								}
							}
						}
						state = stringStates.START_QUOTE_OR_CHAR;
					} else {
						return null;
					}
					break;
				}
		}
	}
}

function parseNumber(input, index, line, column) {
	var startIndex = index;
	var passedValueIndex = index;
	var state = numberStates._START_;

	iterator: while (index < input.length) {
		var char = input.charAt(index);

		switch (state) {
			case numberStates._START_:
				{
					if (char === '-') {
						state = numberStates.MINUS;
					} else if (char === '0') {
						passedValueIndex = index + 1;
						state = numberStates.ZERO;
					} else if (isDigit1to9(char)) {
						passedValueIndex = index + 1;
						state = numberStates.DIGIT;
					} else {
						return null;
					}
					break;
				}

			case numberStates.MINUS:
				{
					if (char === '0') {
						passedValueIndex = index + 1;
						state = numberStates.ZERO;
					} else if (isDigit1to9(char)) {
						passedValueIndex = index + 1;
						state = numberStates.DIGIT;
					} else {
						return null;
					}
					break;
				}

			case numberStates.ZERO:
				{
					if (char === '.') {
						state = numberStates.POINT;
					} else if (isExp(char)) {
						state = numberStates.EXP;
					} else {
						break iterator;
					}
					break;
				}

			case numberStates.DIGIT:
				{
					if (isDigit(char)) {
						passedValueIndex = index + 1;
					} else if (char === '.') {
						state = numberStates.POINT;
					} else if (isExp(char)) {
						state = numberStates.EXP;
					} else {
						break iterator;
					}
					break;
				}

			case numberStates.POINT:
				{
					if (isDigit(char)) {
						passedValueIndex = index + 1;
						state = numberStates.DIGIT_FRACTION;
					} else {
						break iterator;
					}
					break;
				}

			case numberStates.DIGIT_FRACTION:
				{
					if (isDigit(char)) {
						passedValueIndex = index + 1;
					} else if (isExp(char)) {
						state = numberStates.EXP;
					} else {
						break iterator;
					}
					break;
				}

			case numberStates.EXP:
				{
					if (char === '+' || char === '-') {
						state = numberStates.EXP_DIGIT_OR_SIGN;
					} else if (isDigit(char)) {
						passedValueIndex = index + 1;
						state = numberStates.EXP_DIGIT_OR_SIGN;
					} else {
						break iterator;
					}
					break;
				}

			case numberStates.EXP_DIGIT_OR_SIGN:
				{
					if (isDigit(char)) {
						passedValueIndex = index + 1;
					} else {
						break iterator;
					}
					break;
				}
		}

		index++;
	}

	if (passedValueIndex > 0) {
		return {
			type: tokenTypes.NUMBER,
			line: line,
			column: column + passedValueIndex - startIndex,
			index: passedValueIndex,
			value: input.slice(startIndex, passedValueIndex)
		};
	}

	return null;
}

var tokenize = function tokenize(input, settings) {
	var line = 1;
	var column = 1;
	var index = 0;
	var tokens = [];

	while (index < input.length) {
		var args = [input, index, line, column];
		var whitespace = parseWhitespace.apply(undefined, args);

		if (whitespace) {
			index = whitespace.index;
			line = whitespace.line;
			column = whitespace.column;
			continue;
		}

		var matched = parseChar.apply(undefined, args) || parseKeyword.apply(undefined, args) || parseString$1.apply(undefined, args) || parseNumber.apply(undefined, args);

		if (matched) {
			var token = {
				type: matched.type,
				value: matched.value,
				loc: location(line, column, index, matched.line, matched.column, matched.index, settings.source)
			};

			tokens.push(token);
			index = matched.index;
			line = matched.line;
			column = matched.column;
		} else {
			error(tokenizeErrorTypes.unexpectedSymbol(substring(input, index, index + 1), settings.source, line, column), input, settings.source, line, column);
		}
	}

	return tokens;
};

var objectStates = {
	_START_: 0,
	OPEN_OBJECT: 1,
	PROPERTY: 2,
	COMMA: 3
};

var propertyStates = {
	_START_: 0,
	KEY: 1,
	COLON: 2
};

var arrayStates = {
	_START_: 0,
	OPEN_ARRAY: 1,
	VALUE: 2,
	COMMA: 3
};

var defaultSettings = {
	loc: true,
	source: null
};

function errorEof(input, tokenList, settings) {
	var loc = tokenList.length > 0 ? tokenList[tokenList.length - 1].loc.end : { line: 1, column: 1 };

	error(parseErrorTypes.unexpectedEnd(), input, settings.source, loc.line, loc.column);
}

/** @param hexCode {string} hexCode without '\u' prefix */
function parseHexEscape(hexCode) {
	var charCode = 0;

	for (var i = 0; i < 4; i++) {
		charCode = charCode * 16 + parseInt(hexCode[i], 16);
	}

	return String.fromCharCode(charCode);
}

var escapes = {
	'b': '\b', // Backspace
	'f': '\f', // Form feed
	'n': '\n', // New line
	'r': '\r', // Carriage return
	't': '\t' // Horizontal tab
};

var passEscapes = ['"', '\\', '/'];

function parseString( /** string */string) {
	var result = '';

	for (var i = 0; i < string.length; i++) {
		var char = string.charAt(i);

		if (char === '\\') {
			i++;
			var nextChar = string.charAt(i);
			if (nextChar === 'u') {
				result += parseHexEscape(string.substr(i + 1, 4));
				i += 4;
			} else if (passEscapes.indexOf(nextChar) !== -1) {
				result += nextChar;
			} else if (nextChar in escapes) {
				result += escapes[nextChar];
			} else {
				break;
			}
		} else {
			result += char;
		}
	}

	return result;
}

function parseObject(input, tokenList, index, settings) {
	// object: LEFT_BRACE (property (COMMA property)*)? RIGHT_BRACE
	var startToken = void 0;
	var object = {
		type: 'Object',
		children: []
	};
	var state = objectStates._START_;

	while (index < tokenList.length) {
		var token = tokenList[index];

		switch (state) {
			case objectStates._START_:
				{
					if (token.type === tokenTypes.LEFT_BRACE) {
						startToken = token;
						state = objectStates.OPEN_OBJECT;
						index++;
					} else {
						return null;
					}
					break;
				}

			case objectStates.OPEN_OBJECT:
				{
					if (token.type === tokenTypes.RIGHT_BRACE) {
						if (settings.loc) {
							object.loc = location(startToken.loc.start.line, startToken.loc.start.column, startToken.loc.start.offset, token.loc.end.line, token.loc.end.column, token.loc.end.offset, settings.source);
						}
						return {
							value: object,
							index: index + 1
						};
					} else {
						var property = parseProperty(input, tokenList, index, settings);
						object.children.push(property.value);
						state = objectStates.PROPERTY;
						index = property.index;
					}
					break;
				}

			case objectStates.PROPERTY:
				{
					if (token.type === tokenTypes.RIGHT_BRACE) {
						if (settings.loc) {
							object.loc = location(startToken.loc.start.line, startToken.loc.start.column, startToken.loc.start.offset, token.loc.end.line, token.loc.end.column, token.loc.end.offset, settings.source);
						}
						return {
							value: object,
							index: index + 1
						};
					} else if (token.type === tokenTypes.COMMA) {
						state = objectStates.COMMA;
						index++;
					} else {
						error(parseErrorTypes.unexpectedToken(substring(input, token.loc.start.offset, token.loc.end.offset), settings.source, token.loc.start.line, token.loc.start.column), input, settings.source, token.loc.start.line, token.loc.start.column);
					}
					break;
				}

			case objectStates.COMMA:
				{
					var _property = parseProperty(input, tokenList, index, settings);
					if (_property) {
						index = _property.index;
						object.children.push(_property.value);
						state = objectStates.PROPERTY;
					} else {
						error(parseErrorTypes.unexpectedToken(substring(input, token.loc.start.offset, token.loc.end.offset), settings.source, token.loc.start.line, token.loc.start.column), input, settings.source, token.loc.start.line, token.loc.start.column);
					}
					break;
				}
		}
	}

	errorEof(input, tokenList, settings);
}

function parseProperty(input, tokenList, index, settings) {
	// property: STRING COLON value
	var startToken = void 0;
	var property = {
		type: 'Property',
		key: null,
		value: null
	};
	var state = propertyStates._START_;

	while (index < tokenList.length) {
		var token = tokenList[index];

		switch (state) {
			case propertyStates._START_:
				{
					if (token.type === tokenTypes.STRING) {
						var key = {
							type: 'Identifier',
							value: parseString(input.slice(token.loc.start.offset + 1, token.loc.end.offset - 1)),
							raw: token.value
						};
						if (settings.loc) {
							key.loc = token.loc;
						}
						startToken = token;
						property.key = key;
						state = propertyStates.KEY;
						index++;
					} else {
						return null;
					}
					break;
				}

			case propertyStates.KEY:
				{
					if (token.type === tokenTypes.COLON) {
						state = propertyStates.COLON;
						index++;
					} else {
						error(parseErrorTypes.unexpectedToken(substring(input, token.loc.start.offset, token.loc.end.offset), settings.source, token.loc.start.line, token.loc.start.column), input, settings.source, token.loc.start.line, token.loc.start.column);
					}
					break;
				}

			case propertyStates.COLON:
				{
					var value = parseValue(input, tokenList, index, settings);
					property.value = value.value;
					if (settings.loc) {
						property.loc = location(startToken.loc.start.line, startToken.loc.start.column, startToken.loc.start.offset, value.value.loc.end.line, value.value.loc.end.column, value.value.loc.end.offset, settings.source);
					}
					return {
						value: property,
						index: value.index
					};
				}

		}
	}
}

function parseArray(input, tokenList, index, settings) {
	// array: LEFT_BRACKET (value (COMMA value)*)? RIGHT_BRACKET
	var startToken = void 0;
	var array = {
		type: 'Array',
		children: []
	};
	var state = arrayStates._START_;
	var token = void 0;

	while (index < tokenList.length) {
		token = tokenList[index];

		switch (state) {
			case arrayStates._START_:
				{
					if (token.type === tokenTypes.LEFT_BRACKET) {
						startToken = token;
						state = arrayStates.OPEN_ARRAY;
						index++;
					} else {
						return null;
					}
					break;
				}

			case arrayStates.OPEN_ARRAY:
				{
					if (token.type === tokenTypes.RIGHT_BRACKET) {
						if (settings.loc) {
							array.loc = location(startToken.loc.start.line, startToken.loc.start.column, startToken.loc.start.offset, token.loc.end.line, token.loc.end.column, token.loc.end.offset, settings.source);
						}
						return {
							value: array,
							index: index + 1
						};
					} else {
						var value = parseValue(input, tokenList, index, settings);
						index = value.index;
						array.children.push(value.value);
						state = arrayStates.VALUE;
					}
					break;
				}

			case arrayStates.VALUE:
				{
					if (token.type === tokenTypes.RIGHT_BRACKET) {
						if (settings.loc) {
							array.loc = location(startToken.loc.start.line, startToken.loc.start.column, startToken.loc.start.offset, token.loc.end.line, token.loc.end.column, token.loc.end.offset, settings.source);
						}
						return {
							value: array,
							index: index + 1
						};
					} else if (token.type === tokenTypes.COMMA) {
						state = arrayStates.COMMA;
						index++;
					} else {
						error(parseErrorTypes.unexpectedToken(substring(input, token.loc.start.offset, token.loc.end.offset), settings.source, token.loc.start.line, token.loc.start.column), input, settings.source, token.loc.start.line, token.loc.start.column);
					}
					break;
				}

			case arrayStates.COMMA:
				{
					var _value = parseValue(input, tokenList, index, settings);
					index = _value.index;
					array.children.push(_value.value);
					state = arrayStates.VALUE;
					break;
				}
		}
	}

	errorEof(input, tokenList, settings);
}

function parseLiteral(input, tokenList, index, settings) {
	// literal: STRING | NUMBER | TRUE | FALSE | NULL
	var token = tokenList[index];
	var value = null;

	switch (token.type) {
		case tokenTypes.STRING:
			{
				value = parseString(input.slice(token.loc.start.offset + 1, token.loc.end.offset - 1));
				break;
			}
		case tokenTypes.NUMBER:
			{
				value = Number(token.value);
				break;
			}
		case tokenTypes.TRUE:
			{
				value = true;
				break;
			}
		case tokenTypes.FALSE:
			{
				value = false;
				break;
			}
		case tokenTypes.NULL:
			{
				value = null;
				break;
			}
		default:
			{
				return null;
			}
	}

	var literal = {
		type: 'Literal',
		value: value,
		raw: token.value
	};
	if (settings.loc) {
		literal.loc = token.loc;
	}
	return {
		value: literal,
		index: index + 1
	};
}

function parseValue(input, tokenList, index, settings) {
	// value: literal | object | array
	var token = tokenList[index];

	var value = parseLiteral.apply(undefined, arguments) || parseObject.apply(undefined, arguments) || parseArray.apply(undefined, arguments);

	if (value) {
		return value;
	} else {
		error(parseErrorTypes.unexpectedToken(substring(input, token.loc.start.offset, token.loc.end.offset), settings.source, token.loc.start.line, token.loc.start.column), input, settings.source, token.loc.start.line, token.loc.start.column);
	}
}

var parse$1 = (function (input, settings) {
	settings = Object.assign({}, defaultSettings, settings);

	var tokenList = tokenize(input, settings);

	if (tokenList.length === 0) {
		errorEof(input, tokenList, settings);
	}

	var value = parseValue(input, tokenList, 0, settings);

	if (value.index === tokenList.length) {
		return value.value;
	}

	var token = tokenList[value.index];

	error(parseErrorTypes.unexpectedToken(substring(input, token.loc.start.offset, token.loc.end.offset), settings.source, token.loc.start.line, token.loc.start.column), input, settings.source, token.loc.start.line, token.loc.start.column);
});

return parse$1;

})));


/***/ }),

/***/ 7571:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;
var hasExcape = /~/
var escapeMatcher = /~[01]/g
function escapeReplacer (m) {
  switch (m) {
    case '~1': return '/'
    case '~0': return '~'
  }
  throw new Error('Invalid tilde escape: ' + m)
}

function untilde (str) {
  if (!hasExcape.test(str)) return str
  return str.replace(escapeMatcher, escapeReplacer)
}

function setter (obj, pointer, value) {
  var part
  var hasNextPart

  for (var p = 1, len = pointer.length; p < len;) {
    if (pointer[p] === 'constructor' || pointer[p] === 'prototype' || pointer[p] === '__proto__') return obj

    part = untilde(pointer[p++])
    hasNextPart = len > p

    if (typeof obj[part] === 'undefined') {
      // support setting of /-
      if (Array.isArray(obj) && part === '-') {
        part = obj.length
      }

      // support nested objects/array when setting values
      if (hasNextPart) {
        if ((pointer[p] !== '' && pointer[p] < Infinity) || pointer[p] === '-') obj[part] = []
        else obj[part] = {}
      }
    }

    if (!hasNextPart) break
    obj = obj[part]
  }

  var oldValue = obj[part]
  if (value === undefined) delete obj[part]
  else obj[part] = value
  return oldValue
}

function compilePointer (pointer) {
  if (typeof pointer === 'string') {
    pointer = pointer.split('/')
    if (pointer[0] === '') return pointer
    throw new Error('Invalid JSON pointer.')
  } else if (Array.isArray(pointer)) {
    for (const part of pointer) {
      if (typeof part !== 'string' && typeof part !== 'number') {
        throw new Error('Invalid JSON pointer. Must be of type string or number.')
      }
    }
    return pointer
  }

  throw new Error('Invalid JSON pointer.')
}

function get (obj, pointer) {
  if (typeof obj !== 'object') throw new Error('Invalid input object.')
  pointer = compilePointer(pointer)
  var len = pointer.length
  if (len === 1) return obj

  for (var p = 1; p < len;) {
    obj = obj[untilde(pointer[p++])]
    if (len === p) return obj
    if (typeof obj !== 'object') return undefined
  }
}

function set (obj, pointer, value) {
  if (typeof obj !== 'object') throw new Error('Invalid input object.')
  pointer = compilePointer(pointer)
  if (pointer.length === 0) throw new Error('Invalid JSON pointer for set.')
  return setter(obj, pointer, value)
}

function compile (pointer) {
  var compiled = compilePointer(pointer)
  return {
    get: function (object) {
      return get(object, compiled)
    },
    set: function (object, value) {
      return set(object, compiled, value)
    }
  }
}

exports.U2 = get
__webpack_unused_export__ = set
__webpack_unused_export__ = compile


/***/ }),

/***/ 9318:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const os = __nccwpck_require__(2037);
const tty = __nccwpck_require__(6224);
const hasFlag = __nccwpck_require__(1621);

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ 8824:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const supportsColor = __nccwpck_require__(9318);
const hasFlag = __nccwpck_require__(1621);

function parseVersion(versionString) {
	if (/^\d{3,4}$/.test(versionString)) {
		// Env var doesn't always use dots. example: 4601 => 46.1.0
		const m = /(\d{1,2})(\d{2})/.exec(versionString);
		return {
			major: 0,
			minor: parseInt(m[1], 10),
			patch: parseInt(m[2], 10)
		};
	}

	const versions = (versionString || '').split('.').map(n => parseInt(n, 10));
	return {
		major: versions[0],
		minor: versions[1],
		patch: versions[2]
	};
}

function supportsHyperlink(stream) {
	const {env} = process;

	if ('FORCE_HYPERLINK' in env) {
		return !(env.FORCE_HYPERLINK.length > 0 && parseInt(env.FORCE_HYPERLINK, 10) === 0);
	}

	if (hasFlag('no-hyperlink') || hasFlag('no-hyperlinks') || hasFlag('hyperlink=false') || hasFlag('hyperlink=never')) {
		return false;
	}

	if (hasFlag('hyperlink=true') || hasFlag('hyperlink=always')) {
		return true;
	}

	// If they specify no colors, they probably don't want hyperlinks.
	if (!supportsColor.supportsColor(stream)) {
		return false;
	}

	if (stream && !stream.isTTY) {
		return false;
	}

	if (process.platform === 'win32') {
		return false;
	}

	if ('NETLIFY' in env) {
		return true;
	}

	if ('CI' in env) {
		return false;
	}

	if ('TEAMCITY_VERSION' in env) {
		return false;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseVersion(env.TERM_PROGRAM_VERSION);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				if (version.major === 3) {
					return version.minor >= 1;
				}

				return version.major > 3;
			// No default
		}
	}

	if ('VTE_VERSION' in env) {
		// 0.50.0 was supposed to support hyperlinks, but throws a segfault
		if (env.VTE_VERSION === '0.50.0') {
			return false;
		}

		const version = parseVersion(env.VTE_VERSION);
		return version.major > 0 || version.minor >= 50;
	}

	return false;
}

module.exports = {
	supportsHyperlink,
	stdout: supportsHyperlink(process.stdout),
	stderr: supportsHyperlink(process.stderr)
};


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 20:
/***/ (function(__unused_webpack_module, exports) {

/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
(function (global, factory) {
	 true ? factory(exports) :
	0;
}(this, (function (exports) { 'use strict';

function merge() {
    for (var _len = arguments.length, sets = Array(_len), _key = 0; _key < _len; _key++) {
        sets[_key] = arguments[_key];
    }

    if (sets.length > 1) {
        sets[0] = sets[0].slice(0, -1);
        var xl = sets.length - 1;
        for (var x = 1; x < xl; ++x) {
            sets[x] = sets[x].slice(1, -1);
        }
        sets[xl] = sets[xl].slice(1);
        return sets.join('');
    } else {
        return sets[0];
    }
}
function subexp(str) {
    return "(?:" + str + ")";
}
function typeOf(o) {
    return o === undefined ? "undefined" : o === null ? "null" : Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase();
}
function toUpperCase(str) {
    return str.toUpperCase();
}
function toArray(obj) {
    return obj !== undefined && obj !== null ? obj instanceof Array ? obj : typeof obj.length !== "number" || obj.split || obj.setInterval || obj.call ? [obj] : Array.prototype.slice.call(obj) : [];
}
function assign(target, source) {
    var obj = target;
    if (source) {
        for (var key in source) {
            obj[key] = source[key];
        }
    }
    return obj;
}

function buildExps(isIRI) {
    var ALPHA$$ = "[A-Za-z]",
        CR$ = "[\\x0D]",
        DIGIT$$ = "[0-9]",
        DQUOTE$$ = "[\\x22]",
        HEXDIG$$ = merge(DIGIT$$, "[A-Fa-f]"),
        //case-insensitive
    LF$$ = "[\\x0A]",
        SP$$ = "[\\x20]",
        PCT_ENCODED$ = subexp(subexp("%[EFef]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%[89A-Fa-f]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%" + HEXDIG$$ + HEXDIG$$)),
        //expanded
    GEN_DELIMS$$ = "[\\:\\/\\?\\#\\[\\]\\@]",
        SUB_DELIMS$$ = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]",
        RESERVED$$ = merge(GEN_DELIMS$$, SUB_DELIMS$$),
        UCSCHAR$$ = isIRI ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]",
        //subset, excludes bidi control characters
    IPRIVATE$$ = isIRI ? "[\\uE000-\\uF8FF]" : "[]",
        //subset
    UNRESERVED$$ = merge(ALPHA$$, DIGIT$$, "[\\-\\.\\_\\~]", UCSCHAR$$),
        SCHEME$ = subexp(ALPHA$$ + merge(ALPHA$$, DIGIT$$, "[\\+\\-\\.]") + "*"),
        USERINFO$ = subexp(subexp(PCT_ENCODED$ + "|" + merge(UNRESERVED$$, SUB_DELIMS$$, "[\\:]")) + "*"),
        DEC_OCTET$ = subexp(subexp("25[0-5]") + "|" + subexp("2[0-4]" + DIGIT$$) + "|" + subexp("1" + DIGIT$$ + DIGIT$$) + "|" + subexp("[1-9]" + DIGIT$$) + "|" + DIGIT$$),
        DEC_OCTET_RELAXED$ = subexp(subexp("25[0-5]") + "|" + subexp("2[0-4]" + DIGIT$$) + "|" + subexp("1" + DIGIT$$ + DIGIT$$) + "|" + subexp("0?[1-9]" + DIGIT$$) + "|0?0?" + DIGIT$$),
        //relaxed parsing rules
    IPV4ADDRESS$ = subexp(DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$),
        H16$ = subexp(HEXDIG$$ + "{1,4}"),
        LS32$ = subexp(subexp(H16$ + "\\:" + H16$) + "|" + IPV4ADDRESS$),
        IPV6ADDRESS1$ = subexp(subexp(H16$ + "\\:") + "{6}" + LS32$),
        //                           6( h16 ":" ) ls32
    IPV6ADDRESS2$ = subexp("\\:\\:" + subexp(H16$ + "\\:") + "{5}" + LS32$),
        //                      "::" 5( h16 ":" ) ls32
    IPV6ADDRESS3$ = subexp(subexp(H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{4}" + LS32$),
        //[               h16 ] "::" 4( h16 ":" ) ls32
    IPV6ADDRESS4$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,1}" + H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{3}" + LS32$),
        //[ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
    IPV6ADDRESS5$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,2}" + H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{2}" + LS32$),
        //[ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
    IPV6ADDRESS6$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,3}" + H16$) + "?\\:\\:" + H16$ + "\\:" + LS32$),
        //[ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
    IPV6ADDRESS7$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,4}" + H16$) + "?\\:\\:" + LS32$),
        //[ *4( h16 ":" ) h16 ] "::"              ls32
    IPV6ADDRESS8$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,5}" + H16$) + "?\\:\\:" + H16$),
        //[ *5( h16 ":" ) h16 ] "::"              h16
    IPV6ADDRESS9$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,6}" + H16$) + "?\\:\\:"),
        //[ *6( h16 ":" ) h16 ] "::"
    IPV6ADDRESS$ = subexp([IPV6ADDRESS1$, IPV6ADDRESS2$, IPV6ADDRESS3$, IPV6ADDRESS4$, IPV6ADDRESS5$, IPV6ADDRESS6$, IPV6ADDRESS7$, IPV6ADDRESS8$, IPV6ADDRESS9$].join("|")),
        ZONEID$ = subexp(subexp(UNRESERVED$$ + "|" + PCT_ENCODED$) + "+"),
        //RFC 6874
    IPV6ADDRZ$ = subexp(IPV6ADDRESS$ + "\\%25" + ZONEID$),
        //RFC 6874
    IPV6ADDRZ_RELAXED$ = subexp(IPV6ADDRESS$ + subexp("\\%25|\\%(?!" + HEXDIG$$ + "{2})") + ZONEID$),
        //RFC 6874, with relaxed parsing rules
    IPVFUTURE$ = subexp("[vV]" + HEXDIG$$ + "+\\." + merge(UNRESERVED$$, SUB_DELIMS$$, "[\\:]") + "+"),
        IP_LITERAL$ = subexp("\\[" + subexp(IPV6ADDRZ_RELAXED$ + "|" + IPV6ADDRESS$ + "|" + IPVFUTURE$) + "\\]"),
        //RFC 6874
    REG_NAME$ = subexp(subexp(PCT_ENCODED$ + "|" + merge(UNRESERVED$$, SUB_DELIMS$$)) + "*"),
        HOST$ = subexp(IP_LITERAL$ + "|" + IPV4ADDRESS$ + "(?!" + REG_NAME$ + ")" + "|" + REG_NAME$),
        PORT$ = subexp(DIGIT$$ + "*"),
        AUTHORITY$ = subexp(subexp(USERINFO$ + "@") + "?" + HOST$ + subexp("\\:" + PORT$) + "?"),
        PCHAR$ = subexp(PCT_ENCODED$ + "|" + merge(UNRESERVED$$, SUB_DELIMS$$, "[\\:\\@]")),
        SEGMENT$ = subexp(PCHAR$ + "*"),
        SEGMENT_NZ$ = subexp(PCHAR$ + "+"),
        SEGMENT_NZ_NC$ = subexp(subexp(PCT_ENCODED$ + "|" + merge(UNRESERVED$$, SUB_DELIMS$$, "[\\@]")) + "+"),
        PATH_ABEMPTY$ = subexp(subexp("\\/" + SEGMENT$) + "*"),
        PATH_ABSOLUTE$ = subexp("\\/" + subexp(SEGMENT_NZ$ + PATH_ABEMPTY$) + "?"),
        //simplified
    PATH_NOSCHEME$ = subexp(SEGMENT_NZ_NC$ + PATH_ABEMPTY$),
        //simplified
    PATH_ROOTLESS$ = subexp(SEGMENT_NZ$ + PATH_ABEMPTY$),
        //simplified
    PATH_EMPTY$ = "(?!" + PCHAR$ + ")",
        PATH$ = subexp(PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$),
        QUERY$ = subexp(subexp(PCHAR$ + "|" + merge("[\\/\\?]", IPRIVATE$$)) + "*"),
        FRAGMENT$ = subexp(subexp(PCHAR$ + "|[\\/\\?]") + "*"),
        HIER_PART$ = subexp(subexp("\\/\\/" + AUTHORITY$ + PATH_ABEMPTY$) + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$),
        URI$ = subexp(SCHEME$ + "\\:" + HIER_PART$ + subexp("\\?" + QUERY$) + "?" + subexp("\\#" + FRAGMENT$) + "?"),
        RELATIVE_PART$ = subexp(subexp("\\/\\/" + AUTHORITY$ + PATH_ABEMPTY$) + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_EMPTY$),
        RELATIVE$ = subexp(RELATIVE_PART$ + subexp("\\?" + QUERY$) + "?" + subexp("\\#" + FRAGMENT$) + "?"),
        URI_REFERENCE$ = subexp(URI$ + "|" + RELATIVE$),
        ABSOLUTE_URI$ = subexp(SCHEME$ + "\\:" + HIER_PART$ + subexp("\\?" + QUERY$) + "?"),
        GENERIC_REF$ = "^(" + SCHEME$ + ")\\:" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?" + subexp("\\#(" + FRAGMENT$ + ")") + "?$",
        RELATIVE_REF$ = "^(){0}" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?" + subexp("\\#(" + FRAGMENT$ + ")") + "?$",
        ABSOLUTE_REF$ = "^(" + SCHEME$ + ")\\:" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?$",
        SAMEDOC_REF$ = "^" + subexp("\\#(" + FRAGMENT$ + ")") + "?$",
        AUTHORITY_REF$ = "^" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?$";
    return {
        NOT_SCHEME: new RegExp(merge("[^]", ALPHA$$, DIGIT$$, "[\\+\\-\\.]"), "g"),
        NOT_USERINFO: new RegExp(merge("[^\\%\\:]", UNRESERVED$$, SUB_DELIMS$$), "g"),
        NOT_HOST: new RegExp(merge("[^\\%\\[\\]\\:]", UNRESERVED$$, SUB_DELIMS$$), "g"),
        NOT_PATH: new RegExp(merge("[^\\%\\/\\:\\@]", UNRESERVED$$, SUB_DELIMS$$), "g"),
        NOT_PATH_NOSCHEME: new RegExp(merge("[^\\%\\/\\@]", UNRESERVED$$, SUB_DELIMS$$), "g"),
        NOT_QUERY: new RegExp(merge("[^\\%]", UNRESERVED$$, SUB_DELIMS$$, "[\\:\\@\\/\\?]", IPRIVATE$$), "g"),
        NOT_FRAGMENT: new RegExp(merge("[^\\%]", UNRESERVED$$, SUB_DELIMS$$, "[\\:\\@\\/\\?]"), "g"),
        ESCAPE: new RegExp(merge("[^]", UNRESERVED$$, SUB_DELIMS$$), "g"),
        UNRESERVED: new RegExp(UNRESERVED$$, "g"),
        OTHER_CHARS: new RegExp(merge("[^\\%]", UNRESERVED$$, RESERVED$$), "g"),
        PCT_ENCODED: new RegExp(PCT_ENCODED$, "g"),
        IPV4ADDRESS: new RegExp("^(" + IPV4ADDRESS$ + ")$"),
        IPV6ADDRESS: new RegExp("^\\[?(" + IPV6ADDRESS$ + ")" + subexp(subexp("\\%25|\\%(?!" + HEXDIG$$ + "{2})") + "(" + ZONEID$ + ")") + "?\\]?$") //RFC 6874, with relaxed parsing rules
    };
}
var URI_PROTOCOL = buildExps(false);

var IRI_PROTOCOL = buildExps(true);

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/** Highest positive signed 32-bit float value */

var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'

/** Regular expressions */
var regexPunycode = /^xn--/;
var regexNonASCII = /[^\0-\x7E]/; // non-ASCII chars
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */
var errors = {
	'overflow': 'Overflow: input needs wider integers to process',
	'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
	'invalid-input': 'Invalid input'
};

/** Convenience shortcuts */
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error$1(type) {
	throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function map(array, fn) {
	var result = [];
	var length = array.length;
	while (length--) {
		result[length] = fn(array[length]);
	}
	return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {Array} A new string of characters returned by the callback
 * function.
 */
function mapDomain(string, fn) {
	var parts = string.split('@');
	var result = '';
	if (parts.length > 1) {
		// In email addresses, only the domain name should be punycoded. Leave
		// the local part (i.e. everything up to `@`) intact.
		result = parts[0] + '@';
		string = parts[1];
	}
	// Avoid `split(regex)` for IE8 compatibility. See #17.
	string = string.replace(regexSeparators, '\x2E');
	var labels = string.split('.');
	var encoded = map(labels, fn).join('.');
	return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
	var output = [];
	var counter = 0;
	var length = string.length;
	while (counter < length) {
		var value = string.charCodeAt(counter++);
		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
			// It's a high surrogate, and there is a next character.
			var extra = string.charCodeAt(counter++);
			if ((extra & 0xFC00) == 0xDC00) {
				// Low surrogate.
				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
			} else {
				// It's an unmatched surrogate; only append this code unit, in case the
				// next code unit is the high surrogate of a surrogate pair.
				output.push(value);
				counter--;
			}
		} else {
			output.push(value);
		}
	}
	return output;
}

/**
 * Creates a string based on an array of numeric code points.
 * @see `punycode.ucs2.decode`
 * @memberOf punycode.ucs2
 * @name encode
 * @param {Array} codePoints The array of numeric code points.
 * @returns {String} The new Unicode string (UCS-2).
 */
var ucs2encode = function ucs2encode(array) {
	return String.fromCodePoint.apply(String, toConsumableArray(array));
};

/**
 * Converts a basic code point into a digit/integer.
 * @see `digitToBasic()`
 * @private
 * @param {Number} codePoint The basic numeric code point value.
 * @returns {Number} The numeric value of a basic code point (for use in
 * representing integers) in the range `0` to `base - 1`, or `base` if
 * the code point does not represent a value.
 */
var basicToDigit = function basicToDigit(codePoint) {
	if (codePoint - 0x30 < 0x0A) {
		return codePoint - 0x16;
	}
	if (codePoint - 0x41 < 0x1A) {
		return codePoint - 0x41;
	}
	if (codePoint - 0x61 < 0x1A) {
		return codePoint - 0x61;
	}
	return base;
};

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
var digitToBasic = function digitToBasic(digit, flag) {
	//  0..25 map to ASCII a..z or A..Z
	// 26..35 map to ASCII 0..9
	return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
var adapt = function adapt(delta, numPoints, firstTime) {
	var k = 0;
	delta = firstTime ? floor(delta / damp) : delta >> 1;
	delta += floor(delta / numPoints);
	for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
		delta = floor(delta / baseMinusTMin);
	}
	return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
 * symbols.
 * @memberOf punycode
 * @param {String} input The Punycode string of ASCII-only symbols.
 * @returns {String} The resulting string of Unicode symbols.
 */
var decode = function decode(input) {
	// Don't use UCS-2.
	var output = [];
	var inputLength = input.length;
	var i = 0;
	var n = initialN;
	var bias = initialBias;

	// Handle the basic code points: let `basic` be the number of input code
	// points before the last delimiter, or `0` if there is none, then copy
	// the first basic code points to the output.

	var basic = input.lastIndexOf(delimiter);
	if (basic < 0) {
		basic = 0;
	}

	for (var j = 0; j < basic; ++j) {
		// if it's not a basic code point
		if (input.charCodeAt(j) >= 0x80) {
			error$1('not-basic');
		}
		output.push(input.charCodeAt(j));
	}

	// Main decoding loop: start just after the last delimiter if any basic code
	// points were copied; start at the beginning otherwise.

	for (var index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{

		// `index` is the index of the next character to be consumed.
		// Decode a generalized variable-length integer into `delta`,
		// which gets added to `i`. The overflow checking is easier
		// if we increase `i` as we go, then subtract off its starting
		// value at the end to obtain `delta`.
		var oldi = i;
		for (var w = 1, k = base;; /* no condition */k += base) {

			if (index >= inputLength) {
				error$1('invalid-input');
			}

			var digit = basicToDigit(input.charCodeAt(index++));

			if (digit >= base || digit > floor((maxInt - i) / w)) {
				error$1('overflow');
			}

			i += digit * w;
			var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

			if (digit < t) {
				break;
			}

			var baseMinusT = base - t;
			if (w > floor(maxInt / baseMinusT)) {
				error$1('overflow');
			}

			w *= baseMinusT;
		}

		var out = output.length + 1;
		bias = adapt(i - oldi, out, oldi == 0);

		// `i` was supposed to wrap around from `out` to `0`,
		// incrementing `n` each time, so we'll fix that now:
		if (floor(i / out) > maxInt - n) {
			error$1('overflow');
		}

		n += floor(i / out);
		i %= out;

		// Insert `n` at position `i` of the output.
		output.splice(i++, 0, n);
	}

	return String.fromCodePoint.apply(String, output);
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
var encode = function encode(input) {
	var output = [];

	// Convert the input in UCS-2 to an array of Unicode code points.
	input = ucs2decode(input);

	// Cache the length.
	var inputLength = input.length;

	// Initialize the state.
	var n = initialN;
	var delta = 0;
	var bias = initialBias;

	// Handle the basic code points.
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _currentValue2 = _step.value;

			if (_currentValue2 < 0x80) {
				output.push(stringFromCharCode(_currentValue2));
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	var basicLength = output.length;
	var handledCPCount = basicLength;

	// `handledCPCount` is the number of code points that have been handled;
	// `basicLength` is the number of basic code points.

	// Finish the basic string with a delimiter unless it's empty.
	if (basicLength) {
		output.push(delimiter);
	}

	// Main encoding loop:
	while (handledCPCount < inputLength) {

		// All non-basic code points < n have been handled already. Find the next
		// larger one:
		var m = maxInt;
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = input[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var currentValue = _step2.value;

				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow.
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		var handledCPCountPlusOne = handledCPCount + 1;
		if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
			error$1('overflow');
		}

		delta += (m - n) * handledCPCountPlusOne;
		n = m;

		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = input[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var _currentValue = _step3.value;

				if (_currentValue < n && ++delta > maxInt) {
					error$1('overflow');
				}
				if (_currentValue == n) {
					// Represent delta as a generalized variable-length integer.
					var q = delta;
					for (var k = base;; /* no condition */k += base) {
						var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
						if (q < t) {
							break;
						}
						var qMinusT = q - t;
						var baseMinusT = base - t;
						output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}

		++delta;
		++n;
	}
	return output.join('');
};

/**
 * Converts a Punycode string representing a domain name or an email address
 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
 * it doesn't matter if you call it on a string that has already been
 * converted to Unicode.
 * @memberOf punycode
 * @param {String} input The Punycoded domain name or email address to
 * convert to Unicode.
 * @returns {String} The Unicode representation of the given Punycode
 * string.
 */
var toUnicode = function toUnicode(input) {
	return mapDomain(input, function (string) {
		return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
	});
};

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
var toASCII = function toASCII(input) {
	return mapDomain(input, function (string) {
		return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
	});
};

/*--------------------------------------------------------------------------*/

/** Define the public API */
var punycode = {
	/**
  * A string representing the current Punycode.js version number.
  * @memberOf punycode
  * @type String
  */
	'version': '2.1.0',
	/**
  * An object of methods to convert from JavaScript's internal character
  * representation (UCS-2) to Unicode code points, and back.
  * @see <https://mathiasbynens.be/notes/javascript-encoding>
  * @memberOf punycode
  * @type Object
  */
	'ucs2': {
		'decode': ucs2decode,
		'encode': ucs2encode
	},
	'decode': decode,
	'encode': encode,
	'toASCII': toASCII,
	'toUnicode': toUnicode
};

/**
 * URI.js
 *
 * @fileoverview An RFC 3986 compliant, scheme extendable URI parsing/validating/resolving library for JavaScript.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/uri-js
 */
/**
 * Copyright 2011 Gary Court. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Gary Court.
 */
var SCHEMES = {};
function pctEncChar(chr) {
    var c = chr.charCodeAt(0);
    var e = void 0;
    if (c < 16) e = "%0" + c.toString(16).toUpperCase();else if (c < 128) e = "%" + c.toString(16).toUpperCase();else if (c < 2048) e = "%" + (c >> 6 | 192).toString(16).toUpperCase() + "%" + (c & 63 | 128).toString(16).toUpperCase();else e = "%" + (c >> 12 | 224).toString(16).toUpperCase() + "%" + (c >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (c & 63 | 128).toString(16).toUpperCase();
    return e;
}
function pctDecChars(str) {
    var newStr = "";
    var i = 0;
    var il = str.length;
    while (i < il) {
        var c = parseInt(str.substr(i + 1, 2), 16);
        if (c < 128) {
            newStr += String.fromCharCode(c);
            i += 3;
        } else if (c >= 194 && c < 224) {
            if (il - i >= 6) {
                var c2 = parseInt(str.substr(i + 4, 2), 16);
                newStr += String.fromCharCode((c & 31) << 6 | c2 & 63);
            } else {
                newStr += str.substr(i, 6);
            }
            i += 6;
        } else if (c >= 224) {
            if (il - i >= 9) {
                var _c = parseInt(str.substr(i + 4, 2), 16);
                var c3 = parseInt(str.substr(i + 7, 2), 16);
                newStr += String.fromCharCode((c & 15) << 12 | (_c & 63) << 6 | c3 & 63);
            } else {
                newStr += str.substr(i, 9);
            }
            i += 9;
        } else {
            newStr += str.substr(i, 3);
            i += 3;
        }
    }
    return newStr;
}
function _normalizeComponentEncoding(components, protocol) {
    function decodeUnreserved(str) {
        var decStr = pctDecChars(str);
        return !decStr.match(protocol.UNRESERVED) ? str : decStr;
    }
    if (components.scheme) components.scheme = String(components.scheme).replace(protocol.PCT_ENCODED, decodeUnreserved).toLowerCase().replace(protocol.NOT_SCHEME, "");
    if (components.userinfo !== undefined) components.userinfo = String(components.userinfo).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_USERINFO, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
    if (components.host !== undefined) components.host = String(components.host).replace(protocol.PCT_ENCODED, decodeUnreserved).toLowerCase().replace(protocol.NOT_HOST, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
    if (components.path !== undefined) components.path = String(components.path).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(components.scheme ? protocol.NOT_PATH : protocol.NOT_PATH_NOSCHEME, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
    if (components.query !== undefined) components.query = String(components.query).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_QUERY, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
    if (components.fragment !== undefined) components.fragment = String(components.fragment).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_FRAGMENT, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
    return components;
}

function _stripLeadingZeros(str) {
    return str.replace(/^0*(.*)/, "$1") || "0";
}
function _normalizeIPv4(host, protocol) {
    var matches = host.match(protocol.IPV4ADDRESS) || [];

    var _matches = slicedToArray(matches, 2),
        address = _matches[1];

    if (address) {
        return address.split(".").map(_stripLeadingZeros).join(".");
    } else {
        return host;
    }
}
function _normalizeIPv6(host, protocol) {
    var matches = host.match(protocol.IPV6ADDRESS) || [];

    var _matches2 = slicedToArray(matches, 3),
        address = _matches2[1],
        zone = _matches2[2];

    if (address) {
        var _address$toLowerCase$ = address.toLowerCase().split('::').reverse(),
            _address$toLowerCase$2 = slicedToArray(_address$toLowerCase$, 2),
            last = _address$toLowerCase$2[0],
            first = _address$toLowerCase$2[1];

        var firstFields = first ? first.split(":").map(_stripLeadingZeros) : [];
        var lastFields = last.split(":").map(_stripLeadingZeros);
        var isLastFieldIPv4Address = protocol.IPV4ADDRESS.test(lastFields[lastFields.length - 1]);
        var fieldCount = isLastFieldIPv4Address ? 7 : 8;
        var lastFieldsStart = lastFields.length - fieldCount;
        var fields = Array(fieldCount);
        for (var x = 0; x < fieldCount; ++x) {
            fields[x] = firstFields[x] || lastFields[lastFieldsStart + x] || '';
        }
        if (isLastFieldIPv4Address) {
            fields[fieldCount - 1] = _normalizeIPv4(fields[fieldCount - 1], protocol);
        }
        var allZeroFields = fields.reduce(function (acc, field, index) {
            if (!field || field === "0") {
                var lastLongest = acc[acc.length - 1];
                if (lastLongest && lastLongest.index + lastLongest.length === index) {
                    lastLongest.length++;
                } else {
                    acc.push({ index: index, length: 1 });
                }
            }
            return acc;
        }, []);
        var longestZeroFields = allZeroFields.sort(function (a, b) {
            return b.length - a.length;
        })[0];
        var newHost = void 0;
        if (longestZeroFields && longestZeroFields.length > 1) {
            var newFirst = fields.slice(0, longestZeroFields.index);
            var newLast = fields.slice(longestZeroFields.index + longestZeroFields.length);
            newHost = newFirst.join(":") + "::" + newLast.join(":");
        } else {
            newHost = fields.join(":");
        }
        if (zone) {
            newHost += "%" + zone;
        }
        return newHost;
    } else {
        return host;
    }
}
var URI_PARSE = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i;
var NO_MATCH_IS_UNDEFINED = "".match(/(){0}/)[1] === undefined;
function parse(uriString) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var components = {};
    var protocol = options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL;
    if (options.reference === "suffix") uriString = (options.scheme ? options.scheme + ":" : "") + "//" + uriString;
    var matches = uriString.match(URI_PARSE);
    if (matches) {
        if (NO_MATCH_IS_UNDEFINED) {
            //store each component
            components.scheme = matches[1];
            components.userinfo = matches[3];
            components.host = matches[4];
            components.port = parseInt(matches[5], 10);
            components.path = matches[6] || "";
            components.query = matches[7];
            components.fragment = matches[8];
            //fix port number
            if (isNaN(components.port)) {
                components.port = matches[5];
            }
        } else {
            //IE FIX for improper RegExp matching
            //store each component
            components.scheme = matches[1] || undefined;
            components.userinfo = uriString.indexOf("@") !== -1 ? matches[3] : undefined;
            components.host = uriString.indexOf("//") !== -1 ? matches[4] : undefined;
            components.port = parseInt(matches[5], 10);
            components.path = matches[6] || "";
            components.query = uriString.indexOf("?") !== -1 ? matches[7] : undefined;
            components.fragment = uriString.indexOf("#") !== -1 ? matches[8] : undefined;
            //fix port number
            if (isNaN(components.port)) {
                components.port = uriString.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? matches[4] : undefined;
            }
        }
        if (components.host) {
            //normalize IP hosts
            components.host = _normalizeIPv6(_normalizeIPv4(components.host, protocol), protocol);
        }
        //determine reference type
        if (components.scheme === undefined && components.userinfo === undefined && components.host === undefined && components.port === undefined && !components.path && components.query === undefined) {
            components.reference = "same-document";
        } else if (components.scheme === undefined) {
            components.reference = "relative";
        } else if (components.fragment === undefined) {
            components.reference = "absolute";
        } else {
            components.reference = "uri";
        }
        //check for reference errors
        if (options.reference && options.reference !== "suffix" && options.reference !== components.reference) {
            components.error = components.error || "URI is not a " + options.reference + " reference.";
        }
        //find scheme handler
        var schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
        //check if scheme can't handle IRIs
        if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
            //if host component is a domain name
            if (components.host && (options.domainHost || schemeHandler && schemeHandler.domainHost)) {
                //convert Unicode IDN -> ASCII IDN
                try {
                    components.host = punycode.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase());
                } catch (e) {
                    components.error = components.error || "Host's domain name can not be converted to ASCII via punycode: " + e;
                }
            }
            //convert IRI -> URI
            _normalizeComponentEncoding(components, URI_PROTOCOL);
        } else {
            //normalize encodings
            _normalizeComponentEncoding(components, protocol);
        }
        //perform scheme specific parsing
        if (schemeHandler && schemeHandler.parse) {
            schemeHandler.parse(components, options);
        }
    } else {
        components.error = components.error || "URI can not be parsed.";
    }
    return components;
}

function _recomposeAuthority(components, options) {
    var protocol = options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL;
    var uriTokens = [];
    if (components.userinfo !== undefined) {
        uriTokens.push(components.userinfo);
        uriTokens.push("@");
    }
    if (components.host !== undefined) {
        //normalize IP hosts, add brackets and escape zone separator for IPv6
        uriTokens.push(_normalizeIPv6(_normalizeIPv4(String(components.host), protocol), protocol).replace(protocol.IPV6ADDRESS, function (_, $1, $2) {
            return "[" + $1 + ($2 ? "%25" + $2 : "") + "]";
        }));
    }
    if (typeof components.port === "number" || typeof components.port === "string") {
        uriTokens.push(":");
        uriTokens.push(String(components.port));
    }
    return uriTokens.length ? uriTokens.join("") : undefined;
}

var RDS1 = /^\.\.?\//;
var RDS2 = /^\/\.(\/|$)/;
var RDS3 = /^\/\.\.(\/|$)/;
var RDS5 = /^\/?(?:.|\n)*?(?=\/|$)/;
function removeDotSegments(input) {
    var output = [];
    while (input.length) {
        if (input.match(RDS1)) {
            input = input.replace(RDS1, "");
        } else if (input.match(RDS2)) {
            input = input.replace(RDS2, "/");
        } else if (input.match(RDS3)) {
            input = input.replace(RDS3, "/");
            output.pop();
        } else if (input === "." || input === "..") {
            input = "";
        } else {
            var im = input.match(RDS5);
            if (im) {
                var s = im[0];
                input = input.slice(s.length);
                output.push(s);
            } else {
                throw new Error("Unexpected dot segment condition");
            }
        }
    }
    return output.join("");
}

function serialize(components) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var protocol = options.iri ? IRI_PROTOCOL : URI_PROTOCOL;
    var uriTokens = [];
    //find scheme handler
    var schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
    //perform scheme specific serialization
    if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(components, options);
    if (components.host) {
        //if host component is an IPv6 address
        if (protocol.IPV6ADDRESS.test(components.host)) {}
        //TODO: normalize IPv6 address as per RFC 5952

        //if host component is a domain name
        else if (options.domainHost || schemeHandler && schemeHandler.domainHost) {
                //convert IDN via punycode
                try {
                    components.host = !options.iri ? punycode.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase()) : punycode.toUnicode(components.host);
                } catch (e) {
                    components.error = components.error || "Host's domain name can not be converted to " + (!options.iri ? "ASCII" : "Unicode") + " via punycode: " + e;
                }
            }
    }
    //normalize encoding
    _normalizeComponentEncoding(components, protocol);
    if (options.reference !== "suffix" && components.scheme) {
        uriTokens.push(components.scheme);
        uriTokens.push(":");
    }
    var authority = _recomposeAuthority(components, options);
    if (authority !== undefined) {
        if (options.reference !== "suffix") {
            uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (components.path && components.path.charAt(0) !== "/") {
            uriTokens.push("/");
        }
    }
    if (components.path !== undefined) {
        var s = components.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
            s = removeDotSegments(s);
        }
        if (authority === undefined) {
            s = s.replace(/^\/\//, "/%2F"); //don't allow the path to start with "//"
        }
        uriTokens.push(s);
    }
    if (components.query !== undefined) {
        uriTokens.push("?");
        uriTokens.push(components.query);
    }
    if (components.fragment !== undefined) {
        uriTokens.push("#");
        uriTokens.push(components.fragment);
    }
    return uriTokens.join(""); //merge tokens into a string
}

function resolveComponents(base, relative) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var skipNormalization = arguments[3];

    var target = {};
    if (!skipNormalization) {
        base = parse(serialize(base, options), options); //normalize base components
        relative = parse(serialize(relative, options), options); //normalize relative components
    }
    options = options || {};
    if (!options.tolerant && relative.scheme) {
        target.scheme = relative.scheme;
        //target.authority = relative.authority;
        target.userinfo = relative.userinfo;
        target.host = relative.host;
        target.port = relative.port;
        target.path = removeDotSegments(relative.path || "");
        target.query = relative.query;
    } else {
        if (relative.userinfo !== undefined || relative.host !== undefined || relative.port !== undefined) {
            //target.authority = relative.authority;
            target.userinfo = relative.userinfo;
            target.host = relative.host;
            target.port = relative.port;
            target.path = removeDotSegments(relative.path || "");
            target.query = relative.query;
        } else {
            if (!relative.path) {
                target.path = base.path;
                if (relative.query !== undefined) {
                    target.query = relative.query;
                } else {
                    target.query = base.query;
                }
            } else {
                if (relative.path.charAt(0) === "/") {
                    target.path = removeDotSegments(relative.path);
                } else {
                    if ((base.userinfo !== undefined || base.host !== undefined || base.port !== undefined) && !base.path) {
                        target.path = "/" + relative.path;
                    } else if (!base.path) {
                        target.path = relative.path;
                    } else {
                        target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
                    }
                    target.path = removeDotSegments(target.path);
                }
                target.query = relative.query;
            }
            //target.authority = base.authority;
            target.userinfo = base.userinfo;
            target.host = base.host;
            target.port = base.port;
        }
        target.scheme = base.scheme;
    }
    target.fragment = relative.fragment;
    return target;
}

function resolve(baseURI, relativeURI, options) {
    var schemelessOptions = assign({ scheme: 'null' }, options);
    return serialize(resolveComponents(parse(baseURI, schemelessOptions), parse(relativeURI, schemelessOptions), schemelessOptions, true), schemelessOptions);
}

function normalize(uri, options) {
    if (typeof uri === "string") {
        uri = serialize(parse(uri, options), options);
    } else if (typeOf(uri) === "object") {
        uri = parse(serialize(uri, options), options);
    }
    return uri;
}

function equal(uriA, uriB, options) {
    if (typeof uriA === "string") {
        uriA = serialize(parse(uriA, options), options);
    } else if (typeOf(uriA) === "object") {
        uriA = serialize(uriA, options);
    }
    if (typeof uriB === "string") {
        uriB = serialize(parse(uriB, options), options);
    } else if (typeOf(uriB) === "object") {
        uriB = serialize(uriB, options);
    }
    return uriA === uriB;
}

function escapeComponent(str, options) {
    return str && str.toString().replace(!options || !options.iri ? URI_PROTOCOL.ESCAPE : IRI_PROTOCOL.ESCAPE, pctEncChar);
}

function unescapeComponent(str, options) {
    return str && str.toString().replace(!options || !options.iri ? URI_PROTOCOL.PCT_ENCODED : IRI_PROTOCOL.PCT_ENCODED, pctDecChars);
}

var handler = {
    scheme: "http",
    domainHost: true,
    parse: function parse(components, options) {
        //report missing host
        if (!components.host) {
            components.error = components.error || "HTTP URIs must have a host.";
        }
        return components;
    },
    serialize: function serialize(components, options) {
        var secure = String(components.scheme).toLowerCase() === "https";
        //normalize the default port
        if (components.port === (secure ? 443 : 80) || components.port === "") {
            components.port = undefined;
        }
        //normalize the empty path
        if (!components.path) {
            components.path = "/";
        }
        //NOTE: We do not parse query strings for HTTP URIs
        //as WWW Form Url Encoded query strings are part of the HTML4+ spec,
        //and not the HTTP spec.
        return components;
    }
};

var handler$1 = {
    scheme: "https",
    domainHost: handler.domainHost,
    parse: handler.parse,
    serialize: handler.serialize
};

function isSecure(wsComponents) {
    return typeof wsComponents.secure === 'boolean' ? wsComponents.secure : String(wsComponents.scheme).toLowerCase() === "wss";
}
//RFC 6455
var handler$2 = {
    scheme: "ws",
    domainHost: true,
    parse: function parse(components, options) {
        var wsComponents = components;
        //indicate if the secure flag is set
        wsComponents.secure = isSecure(wsComponents);
        //construct resouce name
        wsComponents.resourceName = (wsComponents.path || '/') + (wsComponents.query ? '?' + wsComponents.query : '');
        wsComponents.path = undefined;
        wsComponents.query = undefined;
        return wsComponents;
    },
    serialize: function serialize(wsComponents, options) {
        //normalize the default port
        if (wsComponents.port === (isSecure(wsComponents) ? 443 : 80) || wsComponents.port === "") {
            wsComponents.port = undefined;
        }
        //ensure scheme matches secure flag
        if (typeof wsComponents.secure === 'boolean') {
            wsComponents.scheme = wsComponents.secure ? 'wss' : 'ws';
            wsComponents.secure = undefined;
        }
        //reconstruct path from resource name
        if (wsComponents.resourceName) {
            var _wsComponents$resourc = wsComponents.resourceName.split('?'),
                _wsComponents$resourc2 = slicedToArray(_wsComponents$resourc, 2),
                path = _wsComponents$resourc2[0],
                query = _wsComponents$resourc2[1];

            wsComponents.path = path && path !== '/' ? path : undefined;
            wsComponents.query = query;
            wsComponents.resourceName = undefined;
        }
        //forbid fragment component
        wsComponents.fragment = undefined;
        return wsComponents;
    }
};

var handler$3 = {
    scheme: "wss",
    domainHost: handler$2.domainHost,
    parse: handler$2.parse,
    serialize: handler$2.serialize
};

var O = {};
var isIRI = true;
//RFC 3986
var UNRESERVED$$ = "[A-Za-z0-9\\-\\.\\_\\~" + (isIRI ? "\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF" : "") + "]";
var HEXDIG$$ = "[0-9A-Fa-f]"; //case-insensitive
var PCT_ENCODED$ = subexp(subexp("%[EFef]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%[89A-Fa-f]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%" + HEXDIG$$ + HEXDIG$$)); //expanded
//RFC 5322, except these symbols as per RFC 6068: @ : / ? # [ ] & ; =
//const ATEXT$$ = "[A-Za-z0-9\\!\\#\\$\\%\\&\\'\\*\\+\\-\\/\\=\\?\\^\\_\\`\\{\\|\\}\\~]";
//const WSP$$ = "[\\x20\\x09]";
//const OBS_QTEXT$$ = "[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]";  //(%d1-8 / %d11-12 / %d14-31 / %d127)
//const QTEXT$$ = merge("[\\x21\\x23-\\x5B\\x5D-\\x7E]", OBS_QTEXT$$);  //%d33 / %d35-91 / %d93-126 / obs-qtext
//const VCHAR$$ = "[\\x21-\\x7E]";
//const WSP$$ = "[\\x20\\x09]";
//const OBS_QP$ = subexp("\\\\" + merge("[\\x00\\x0D\\x0A]", OBS_QTEXT$$));  //%d0 / CR / LF / obs-qtext
//const FWS$ = subexp(subexp(WSP$$ + "*" + "\\x0D\\x0A") + "?" + WSP$$ + "+");
//const QUOTED_PAIR$ = subexp(subexp("\\\\" + subexp(VCHAR$$ + "|" + WSP$$)) + "|" + OBS_QP$);
//const QUOTED_STRING$ = subexp('\\"' + subexp(FWS$ + "?" + QCONTENT$) + "*" + FWS$ + "?" + '\\"');
var ATEXT$$ = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]";
var QTEXT$$ = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]";
var VCHAR$$ = merge(QTEXT$$, "[\\\"\\\\]");
var SOME_DELIMS$$ = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]";
var UNRESERVED = new RegExp(UNRESERVED$$, "g");
var PCT_ENCODED = new RegExp(PCT_ENCODED$, "g");
var NOT_LOCAL_PART = new RegExp(merge("[^]", ATEXT$$, "[\\.]", '[\\"]', VCHAR$$), "g");
var NOT_HFNAME = new RegExp(merge("[^]", UNRESERVED$$, SOME_DELIMS$$), "g");
var NOT_HFVALUE = NOT_HFNAME;
function decodeUnreserved(str) {
    var decStr = pctDecChars(str);
    return !decStr.match(UNRESERVED) ? str : decStr;
}
var handler$4 = {
    scheme: "mailto",
    parse: function parse$$1(components, options) {
        var mailtoComponents = components;
        var to = mailtoComponents.to = mailtoComponents.path ? mailtoComponents.path.split(",") : [];
        mailtoComponents.path = undefined;
        if (mailtoComponents.query) {
            var unknownHeaders = false;
            var headers = {};
            var hfields = mailtoComponents.query.split("&");
            for (var x = 0, xl = hfields.length; x < xl; ++x) {
                var hfield = hfields[x].split("=");
                switch (hfield[0]) {
                    case "to":
                        var toAddrs = hfield[1].split(",");
                        for (var _x = 0, _xl = toAddrs.length; _x < _xl; ++_x) {
                            to.push(toAddrs[_x]);
                        }
                        break;
                    case "subject":
                        mailtoComponents.subject = unescapeComponent(hfield[1], options);
                        break;
                    case "body":
                        mailtoComponents.body = unescapeComponent(hfield[1], options);
                        break;
                    default:
                        unknownHeaders = true;
                        headers[unescapeComponent(hfield[0], options)] = unescapeComponent(hfield[1], options);
                        break;
                }
            }
            if (unknownHeaders) mailtoComponents.headers = headers;
        }
        mailtoComponents.query = undefined;
        for (var _x2 = 0, _xl2 = to.length; _x2 < _xl2; ++_x2) {
            var addr = to[_x2].split("@");
            addr[0] = unescapeComponent(addr[0]);
            if (!options.unicodeSupport) {
                //convert Unicode IDN -> ASCII IDN
                try {
                    addr[1] = punycode.toASCII(unescapeComponent(addr[1], options).toLowerCase());
                } catch (e) {
                    mailtoComponents.error = mailtoComponents.error || "Email address's domain name can not be converted to ASCII via punycode: " + e;
                }
            } else {
                addr[1] = unescapeComponent(addr[1], options).toLowerCase();
            }
            to[_x2] = addr.join("@");
        }
        return mailtoComponents;
    },
    serialize: function serialize$$1(mailtoComponents, options) {
        var components = mailtoComponents;
        var to = toArray(mailtoComponents.to);
        if (to) {
            for (var x = 0, xl = to.length; x < xl; ++x) {
                var toAddr = String(to[x]);
                var atIdx = toAddr.lastIndexOf("@");
                var localPart = toAddr.slice(0, atIdx).replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_LOCAL_PART, pctEncChar);
                var domain = toAddr.slice(atIdx + 1);
                //convert IDN via punycode
                try {
                    domain = !options.iri ? punycode.toASCII(unescapeComponent(domain, options).toLowerCase()) : punycode.toUnicode(domain);
                } catch (e) {
                    components.error = components.error || "Email address's domain name can not be converted to " + (!options.iri ? "ASCII" : "Unicode") + " via punycode: " + e;
                }
                to[x] = localPart + "@" + domain;
            }
            components.path = to.join(",");
        }
        var headers = mailtoComponents.headers = mailtoComponents.headers || {};
        if (mailtoComponents.subject) headers["subject"] = mailtoComponents.subject;
        if (mailtoComponents.body) headers["body"] = mailtoComponents.body;
        var fields = [];
        for (var name in headers) {
            if (headers[name] !== O[name]) {
                fields.push(name.replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFNAME, pctEncChar) + "=" + headers[name].replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFVALUE, pctEncChar));
            }
        }
        if (fields.length) {
            components.query = fields.join("&");
        }
        return components;
    }
};

var URN_PARSE = /^([^\:]+)\:(.*)/;
//RFC 2141
var handler$5 = {
    scheme: "urn",
    parse: function parse$$1(components, options) {
        var matches = components.path && components.path.match(URN_PARSE);
        var urnComponents = components;
        if (matches) {
            var scheme = options.scheme || urnComponents.scheme || "urn";
            var nid = matches[1].toLowerCase();
            var nss = matches[2];
            var urnScheme = scheme + ":" + (options.nid || nid);
            var schemeHandler = SCHEMES[urnScheme];
            urnComponents.nid = nid;
            urnComponents.nss = nss;
            urnComponents.path = undefined;
            if (schemeHandler) {
                urnComponents = schemeHandler.parse(urnComponents, options);
            }
        } else {
            urnComponents.error = urnComponents.error || "URN can not be parsed.";
        }
        return urnComponents;
    },
    serialize: function serialize$$1(urnComponents, options) {
        var scheme = options.scheme || urnComponents.scheme || "urn";
        var nid = urnComponents.nid;
        var urnScheme = scheme + ":" + (options.nid || nid);
        var schemeHandler = SCHEMES[urnScheme];
        if (schemeHandler) {
            urnComponents = schemeHandler.serialize(urnComponents, options);
        }
        var uriComponents = urnComponents;
        var nss = urnComponents.nss;
        uriComponents.path = (nid || options.nid) + ":" + nss;
        return uriComponents;
    }
};

var UUID = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/;
//RFC 4122
var handler$6 = {
    scheme: "urn:uuid",
    parse: function parse(urnComponents, options) {
        var uuidComponents = urnComponents;
        uuidComponents.uuid = uuidComponents.nss;
        uuidComponents.nss = undefined;
        if (!options.tolerant && (!uuidComponents.uuid || !uuidComponents.uuid.match(UUID))) {
            uuidComponents.error = uuidComponents.error || "UUID is not valid.";
        }
        return uuidComponents;
    },
    serialize: function serialize(uuidComponents, options) {
        var urnComponents = uuidComponents;
        //normalize UUID
        urnComponents.nss = (uuidComponents.uuid || "").toLowerCase();
        return urnComponents;
    }
};

SCHEMES[handler.scheme] = handler;
SCHEMES[handler$1.scheme] = handler$1;
SCHEMES[handler$2.scheme] = handler$2;
SCHEMES[handler$3.scheme] = handler$3;
SCHEMES[handler$4.scheme] = handler$4;
SCHEMES[handler$5.scheme] = handler$5;
SCHEMES[handler$6.scheme] = handler$6;

exports.SCHEMES = SCHEMES;
exports.pctEncChar = pctEncChar;
exports.pctDecChars = pctDecChars;
exports.parse = parse;
exports.removeDotSegments = removeDotSegments;
exports.serialize = serialize;
exports.resolveComponents = resolveComponents;
exports.resolve = resolve;
exports.normalize = normalize;
exports.equal = equal;
exports.escapeComponent = escapeComponent;
exports.unescapeComponent = unescapeComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=uri.all.js.map


/***/ }),

/***/ 9491:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("assert");

/***/ }),

/***/ 2361:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");

/***/ }),

/***/ 4404:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("tls");

/***/ }),

/***/ 6224:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("tty");

/***/ }),

/***/ 3837:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("util");

/***/ }),

/***/ 4775:
/***/ ((module) => {

module.exports = JSON.parse('{"$id":"https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#","description":"Meta-schema for $data reference (JSON AnySchema extension proposal)","type":"object","required":["$data"],"properties":{"$data":{"type":"string","anyOf":[{"format":"relative-json-pointer"},{"format":"json-pointer"}]}},"additionalProperties":false}');

/***/ }),

/***/ 98:
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"http://json-schema.org/draft-07/schema#","$id":"http://json-schema.org/draft-07/schema#","title":"Core schema meta-schema","definitions":{"schemaArray":{"type":"array","minItems":1,"items":{"$ref":"#"}},"nonNegativeInteger":{"type":"integer","minimum":0},"nonNegativeIntegerDefault0":{"allOf":[{"$ref":"#/definitions/nonNegativeInteger"},{"default":0}]},"simpleTypes":{"enum":["array","boolean","integer","null","number","object","string"]},"stringArray":{"type":"array","items":{"type":"string"},"uniqueItems":true,"default":[]}},"type":["object","boolean"],"properties":{"$id":{"type":"string","format":"uri-reference"},"$schema":{"type":"string","format":"uri"},"$ref":{"type":"string","format":"uri-reference"},"$comment":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"},"default":true,"readOnly":{"type":"boolean","default":false},"examples":{"type":"array","items":true},"multipleOf":{"type":"number","exclusiveMinimum":0},"maximum":{"type":"number"},"exclusiveMaximum":{"type":"number"},"minimum":{"type":"number"},"exclusiveMinimum":{"type":"number"},"maxLength":{"$ref":"#/definitions/nonNegativeInteger"},"minLength":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"pattern":{"type":"string","format":"regex"},"additionalItems":{"$ref":"#"},"items":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/schemaArray"}],"default":true},"maxItems":{"$ref":"#/definitions/nonNegativeInteger"},"minItems":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"uniqueItems":{"type":"boolean","default":false},"contains":{"$ref":"#"},"maxProperties":{"$ref":"#/definitions/nonNegativeInteger"},"minProperties":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"required":{"$ref":"#/definitions/stringArray"},"additionalProperties":{"$ref":"#"},"definitions":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"properties":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"patternProperties":{"type":"object","additionalProperties":{"$ref":"#"},"propertyNames":{"format":"regex"},"default":{}},"dependencies":{"type":"object","additionalProperties":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/stringArray"}]}},"propertyNames":{"$ref":"#"},"const":true,"enum":{"type":"array","items":true,"minItems":1,"uniqueItems":true},"type":{"anyOf":[{"$ref":"#/definitions/simpleTypes"},{"type":"array","items":{"$ref":"#/definitions/simpleTypes"},"minItems":1,"uniqueItems":true}]},"format":{"type":"string"},"contentMediaType":{"type":"string"},"contentEncoding":{"type":"string"},"if":{"$ref":"#"},"then":{"$ref":"#"},"else":{"$ref":"#"},"allOf":{"$ref":"#/definitions/schemaArray"},"anyOf":{"$ref":"#/definitions/schemaArray"},"oneOf":{"$ref":"#/definitions/schemaArray"},"not":{"$ref":"#"}},"default":true}');

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		loaded: false,
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Flag the module as loaded
/******/ 	module.loaded = true;
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/node module decorator */
/******/ (() => {
/******/ 	__nccwpck_require__.nmd = (module) => {
/******/ 		module.paths = [];
/******/ 		if (!module.children) module.children = [];
/******/ 		return module;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __nccwpck_require__(2186);
// EXTERNAL MODULE: ./node_modules/ajv/dist/ajv.js
var ajv = __nccwpck_require__(2426);
;// CONCATENATED MODULE: ./node_modules/ansi-styles/index.js
const ANSI_BACKGROUND_OFFSET = 10;

const wrapAnsi16 = (offset = 0) => code => `\u001B[${code + offset}m`;

const wrapAnsi256 = (offset = 0) => code => `\u001B[${38 + offset};5;${code}m`;

const wrapAnsi16m = (offset = 0) => (red, green, blue) => `\u001B[${38 + offset};2;${red};${green};${blue}m`;

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			overline: [53, 55],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi = wrapAnsi16();
	styles.color.ansi256 = wrapAnsi256();
	styles.color.ansi16m = wrapAnsi16m();
	styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);

	// From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js
	Object.defineProperties(styles, {
		rgbToAnsi256: {
			value: (red, green, blue) => {
				// We use the extended greyscale palette here, with the exception of
				// black and white. normal palette only has 4 greyscale shades.
				if (red === green && green === blue) {
					if (red < 8) {
						return 16;
					}

					if (red > 248) {
						return 231;
					}

					return Math.round(((red - 8) / 247) * 24) + 232;
				}

				return 16 +
					(36 * Math.round(red / 255 * 5)) +
					(6 * Math.round(green / 255 * 5)) +
					Math.round(blue / 255 * 5);
			},
			enumerable: false
		},
		hexToRgb: {
			value: hex => {
				const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
				if (!matches) {
					return [0, 0, 0];
				}

				let {colorString} = matches.groups;

				if (colorString.length === 3) {
					colorString = colorString.split('').map(character => character + character).join('');
				}

				const integer = Number.parseInt(colorString, 16);

				return [
					(integer >> 16) & 0xFF,
					(integer >> 8) & 0xFF,
					integer & 0xFF
				];
			},
			enumerable: false
		},
		hexToAnsi256: {
			value: hex => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
			enumerable: false
		},
		ansi256ToAnsi: {
			value: code => {
				if (code < 8) {
					return 30 + code;
				}

				if (code < 16) {
					return 90 + (code - 8);
				}

				let red;
				let green;
				let blue;

				if (code >= 232) {
					red = (((code - 232) * 10) + 8) / 255;
					green = red;
					blue = red;
				} else {
					code -= 16;

					const remainder = code % 36;

					red = Math.floor(code / 36) / 5;
					green = Math.floor(remainder / 6) / 5;
					blue = (remainder % 6) / 5;
				}

				const value = Math.max(red, green, blue) * 2;

				if (value === 0) {
					return 30;
				}

				let result = 30 + ((Math.round(blue) << 2) | (Math.round(green) << 1) | Math.round(red));

				if (value === 2) {
					result += 60;
				}

				return result;
			},
			enumerable: false
		},
		rgbToAnsi: {
			value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
			enumerable: false
		},
		hexToAnsi: {
			value: hex => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
			enumerable: false
		}
	});

	return styles;
}

const ansiStyles = assembleStyles();

/* harmony default export */ const ansi_styles = (ansiStyles);

// EXTERNAL MODULE: ./node_modules/chalk/source/index.js
var source = __nccwpck_require__(8818);
;// CONCATENATED MODULE: ./node_modules/ansi-escapes/index.js
const ESC = '\u001B[';
const OSC = '\u001B]';
const BEL = '\u0007';
const SEP = ';';
const isTerminalApp = process.env.TERM_PROGRAM === 'Apple_Terminal';

const ansiEscapes = {};

ansiEscapes.cursorTo = (x, y) => {
	if (typeof x !== 'number') {
		throw new TypeError('The `x` argument is required');
	}

	if (typeof y !== 'number') {
		return ESC + (x + 1) + 'G';
	}

	return ESC + (y + 1) + ';' + (x + 1) + 'H';
};

ansiEscapes.cursorMove = (x, y) => {
	if (typeof x !== 'number') {
		throw new TypeError('The `x` argument is required');
	}

	let returnValue = '';

	if (x < 0) {
		returnValue += ESC + (-x) + 'D';
	} else if (x > 0) {
		returnValue += ESC + x + 'C';
	}

	if (y < 0) {
		returnValue += ESC + (-y) + 'A';
	} else if (y > 0) {
		returnValue += ESC + y + 'B';
	}

	return returnValue;
};

ansiEscapes.cursorUp = (count = 1) => ESC + count + 'A';
ansiEscapes.cursorDown = (count = 1) => ESC + count + 'B';
ansiEscapes.cursorForward = (count = 1) => ESC + count + 'C';
ansiEscapes.cursorBackward = (count = 1) => ESC + count + 'D';

ansiEscapes.cursorLeft = ESC + 'G';
ansiEscapes.cursorSavePosition = isTerminalApp ? '\u001B7' : ESC + 's';
ansiEscapes.cursorRestorePosition = isTerminalApp ? '\u001B8' : ESC + 'u';
ansiEscapes.cursorGetPosition = ESC + '6n';
ansiEscapes.cursorNextLine = ESC + 'E';
ansiEscapes.cursorPrevLine = ESC + 'F';
ansiEscapes.cursorHide = ESC + '?25l';
ansiEscapes.cursorShow = ESC + '?25h';

ansiEscapes.eraseLines = count => {
	let clear = '';

	for (let i = 0; i < count; i++) {
		clear += ansiEscapes.eraseLine + (i < count - 1 ? ansiEscapes.cursorUp() : '');
	}

	if (count) {
		clear += ansiEscapes.cursorLeft;
	}

	return clear;
};

ansiEscapes.eraseEndLine = ESC + 'K';
ansiEscapes.eraseStartLine = ESC + '1K';
ansiEscapes.eraseLine = ESC + '2K';
ansiEscapes.eraseDown = ESC + 'J';
ansiEscapes.eraseUp = ESC + '1J';
ansiEscapes.eraseScreen = ESC + '2J';
ansiEscapes.scrollUp = ESC + 'S';
ansiEscapes.scrollDown = ESC + 'T';

ansiEscapes.clearScreen = '\u001Bc';

ansiEscapes.clearTerminal = process.platform === 'win32' ?
	`${ansiEscapes.eraseScreen}${ESC}0f` :
	// 1. Erases the screen (Only done in case `2` is not supported)
	// 2. Erases the whole screen including scrollback buffer
	// 3. Moves cursor to the top-left position
	// More info: https://www.real-world-systems.com/docs/ANSIcode.html
	`${ansiEscapes.eraseScreen}${ESC}3J${ESC}H`;

ansiEscapes.beep = BEL;

ansiEscapes.link = (text, url) => {
	return [
		OSC,
		'8',
		SEP,
		SEP,
		url,
		BEL,
		text,
		OSC,
		'8',
		SEP,
		SEP,
		BEL
	].join('');
};

ansiEscapes.image = (buffer, options = {}) => {
	let returnValue = `${OSC}1337;File=inline=1`;

	if (options.width) {
		returnValue += `;width=${options.width}`;
	}

	if (options.height) {
		returnValue += `;height=${options.height}`;
	}

	if (options.preserveAspectRatio === false) {
		returnValue += ';preserveAspectRatio=0';
	}

	return returnValue + ':' + buffer.toString('base64') + BEL;
};

ansiEscapes.iTerm = {
	setCwd: (cwd = process.cwd()) => `${OSC}50;CurrentDir=${cwd}${BEL}`,

	annotation: (message, options = {}) => {
		let returnValue = `${OSC}1337;`;

		const hasX = typeof options.x !== 'undefined';
		const hasY = typeof options.y !== 'undefined';
		if ((hasX || hasY) && !(hasX && hasY && typeof options.length !== 'undefined')) {
			throw new Error('`x`, `y` and `length` must be defined when `x` or `y` is defined');
		}

		message = message.replace(/\|/g, '');

		returnValue += options.isHidden ? 'AddHiddenAnnotation=' : 'AddAnnotation=';

		if (options.length > 0) {
			returnValue +=
					(hasX ?
						[message, options.length, options.x, options.y] :
						[options.length, message]).join('|');
		} else {
			returnValue += message;
		}

		return returnValue + BEL;
	}
};

/* harmony default export */ const ansi_escapes = (ansiEscapes);

// EXTERNAL MODULE: ./node_modules/supports-hyperlinks/index.js
var supports_hyperlinks = __nccwpck_require__(8824);
;// CONCATENATED MODULE: ./node_modules/terminal-link/index.js



function terminalLink(text, url, {target = 'stdout', ...options} = {}) {
	if (!supports_hyperlinks[target]) {
		// If the fallback has been explicitly disabled, don't modify the text itself.
		if (options.fallback === false) {
			return text;
		}

		return typeof options.fallback === 'function' ? options.fallback(text, url) : `${text} (\u200B${url}\u200B)`;
	}

	return ansi_escapes.link(text, url);
}

terminalLink.isSupported = supports_hyperlinks.stdout;
terminalLink.stderr = (text, url, options = {}) => terminalLink(text, url, {target: 'stderr', ...options});
terminalLink.stderr.isSupported = supports_hyperlinks.stderr;

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/style/style-ansi.js


const { supportsColor, dim, red, blue, green, yellow, magenta, white, } = source;
const styles = {
    title: red.bold,
    pathDescription: blue.italic,
    expr: white.italic,
    type: blue.bold,
    string: green,
    number: magenta,
    primitive: yellow,
    dimmed: dim,
    good: green,
    operator: white,
    link: blue,
    regex: magenta.italic
};
const style = {};
for (const key of Object.keys(styles))
    style[key] =
        (text) => styles[key](text);
const support = Boolean(supportsColor && supportsColor.hasBasic);
const managerOptions = { support, terminalLink: terminalLink, style };

// EXTERNAL MODULE: ./node_modules/@babel/code-frame/lib/index.js
var lib = __nccwpck_require__(5211);
;// CONCATENATED MODULE: ./node_modules/jsonpos/dist/path.js
function parsePath(path) {
    const pathAsPath = path;
    const pathAsDotPath = path;
    const pathAsPointerPath = path;
    if (pathAsPath.path && Array.isArray(pathAsPath.path))
        return pathAsPath.path;
    else if (typeof pathAsDotPath.dotPath === 'string')
        return parseDotPath(pathAsDotPath.dotPath);
    else if (typeof pathAsPointerPath.pointerPath === 'string')
        return parseJsonPointerPath(pathAsPointerPath.pointerPath);
    throw new TypeError(`parsePath(): Missing path argument`);
}
function parseDotPath(path) {
    if (!path.startsWith('.') && !path.startsWith('['))
        throw new SyntaxError('parsePath(): Invalid dot-path, must begin with "." or "[": ' +
            `${path}`);
    const bail = () => {
        throw new Error(`parsePath(): Invalid dot-path: ${path}`);
    };
    const ret = [];
    const nearest = (a, b) => a === -1 && b === -1 ? -1
        : a === -1 ? b
            : b === -1 ? a
                : a < b ? a : b;
    let pos = 0;
    while (pos !== -1 && pos < path.length) {
        if (path.charAt(pos) === '.') {
            if (path.charAt(pos + 1) === "'") {
                const lastPos = path.indexOf("'", pos + 2);
                if (lastPos === -1)
                    bail();
                ret.push(path.slice(pos + 2, lastPos));
                pos = lastPos + 1;
            }
            else {
                const posOfDot = path.indexOf('.', pos + 1);
                const posOfBracket = path.indexOf('[', pos + 1);
                const lastPos = nearest(posOfDot, posOfBracket);
                ret.push(lastPos === -1
                    ? path.slice(pos + 1)
                    : path.slice(pos + 1, lastPos));
                pos = lastPos;
            }
        }
        else // ['segment name'] form
         {
            if (path.charAt(pos + 1) !== "'")
                bail();
            const lastPos = path.indexOf("']", pos + 2);
            if (lastPos === -1)
                bail();
            ret.push(path.slice(pos + 2, lastPos));
            pos = lastPos + 2;
        }
    }
    return ret;
}
function parseJsonPointerPath(path) {
    if (!path.startsWith('/'))
        throw new SyntaxError(`parsePath(): Invalid pointer-path, must begin with "/": ${path}`);
    return path
        .slice(1)
        .split('/')
        .map(segment => parseJsonPointerSegment(segment));
}
function parseJsonPointerSegment(segment) {
    return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}

;// CONCATENATED MODULE: ./node_modules/jsonpos/dist/location.js

function getLocation(parsedJson, options) {
    const { jsonAST } = parsedJson;
    const { markIdentifier = false } = options;
    const path = parsePath(options);
    const pathAsString = () => path.join('.');
    const getParentPath = (index) => '.' + path.slice(0, index).join('.');
    const explainWhere = (index) => `${getParentPath(index)} [query: ${pathAsString()}]`;
    const { loc } = path
        .reduce((node, pathItem, index) => node.type === 'Object'
        ? (() => {
            const child = node.children.find(child => child.key.value === pathItem);
            if (!child) {
                throw new Error(`No such property ${pathItem} in ` +
                    `${explainWhere(index)}`);
            }
            const { key, value } = child;
            return markIdentifier && index === path.length - 1
                ? key
                : value;
        })()
        // istanbul ignore next
        : node.type === 'Array'
            ? (() => {
                const itemIndex = Number(pathItem);
                if (isNaN(itemIndex)) {
                    throw new Error(`Invalid non-numeric array index "${pathItem}" ` +
                        `in array at ${explainWhere(index)}`);
                }
                else if (itemIndex < 0 || itemIndex >= node.children.length) {
                    throw new RangeError(`Index ${itemIndex} out-of-bounds in array of ` +
                        `size ${node.children.length} at ` +
                        `${explainWhere(index)}`);
                }
                node.children;
                return node.children[Number(pathItem)];
            })()
            : node, jsonAST);
    // istanbul ignore next
    return { start: loc === null || loc === void 0 ? void 0 : loc.start, end: loc === null || loc === void 0 ? void 0 : loc.end };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/code/impl-babel.js


const printCode = (message, parsedJson, { path, markIdentifier, linesAbove = 5, linesBelow = 3, colors, }) => {
    const { start, end } = getLocation(parsedJson, { path, markIdentifier });
    if (!start)
        return `{The path ${path} cannot be found in json}`;
    return (0,lib/* codeFrameColumns */.rf)(parsedJson.jsonString, { start, end }, {
        highlightCode: colors,
        message,
        linesAbove,
        linesBelow,
    });
};

// EXTERNAL MODULE: ./node_modules/json-to-ast/build.js
var build = __nccwpck_require__(6675);
;// CONCATENATED MODULE: ./node_modules/jsonpos/dist/parse.js

function getAstByString(jsonString, json) {
    const jsonAST = build(jsonString, { loc: true });
    return {
        json: json || JSON.parse(jsonString),
        jsonString,
        jsonAST,
    };
}
function getAstByObject(json, indent = 4) {
    const jsonString = JSON.stringify(json, null, indent);
    return getAstByString(jsonString);
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/util.js
function ensureArray(t) {
    return t == null ? [] : Array.isArray(t) ? [...t] : [t];
}
const enquote = (text) => `"${text}"`;
function uniq(values, keygen) {
    const cache = new Set();
    return values.filter(value => {
        const key = keygen(value);
        if (cache.has(key))
            return false;
        cache.add(key);
        return true;
    });
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/data-path.js

function parseDataPath(error) {
    // Ajv 6 and 7 differ. In 6 the dataPath separator is `.`, in 7 it's `/`.
    // The dot-form may also use brackets: ['foo'].bar for /foo/bar
    // Since Ajv 8, it's called "instancePath"
    var _a;
    if (!((_a = error.dataPath) !== null && _a !== void 0 ? _a : error.instancePath))
        return { path: [], simplePath: [] };
    const isDotPath = (path) => path.charAt(0) === '.' || path.charAt(0) === '[';
    const value = !!error.instancePath
        ? parsePath({ pointerPath: error.instancePath })
        : isDotPath(error.dataPath)
            ? parsePath({ dotPath: error.dataPath })
            : parsePath({ pointerPath: error.dataPath });
    const path = value
        .map((entry) => typeof entry === 'number'
        ? ({ key: `${entry}`, type: 'number' })
        : ({ key: entry, type: 'string' }))
        .filter(val => val.key !== '');
    const simplePath = path.map(({ key }) => key);
    return { path, simplePath };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/big-numbers/font.js
const font = {
    width: 8,
    height: 5,
    number: [
        ['  ,--.  ', ' /    \\ ', '|  ()  |', ' \\    / ', '  `--\'  '],
        ['   ,--. ', '  /   | ', '  `|  | ', '   |  | ', '   `--\' '],
        ['  ,---. ', ' \'.-.  \\', '  .-\' .\'', ' /   \'-.', ' \'-----\''],
        [' ,----. ', ' \'.-.  |', '   .\' < ', ' /\'-\'  |', ' `----\' '],
        ['   ,---.', '  /    |', ' /  \'  |', ' \'--|  |', '    `--\''],
        [' ,-----.', ' |  .--\'', ' \'--. `\\', ' .--\'  /', ' `----\' '],
        ['   ,--. ', '  /  .\' ', ' |  .-. ', ' \\   o |', '  `---\' '],
        [' ,-----.', ' \'--,  /', '  .\'  / ', ' /   /  ', ' `--\'   '],
        ['  ,---. ', ' |  o  |', ' .\'   \'.', ' |  o  |', '  `---\' '],
        ['  ,---. ', ' | o   \\', ' `..\'  |', '  .\'  / ', '  `--\'  ']
    ],
};

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/big-numbers/index.js

const getWidth = (num) => `${~~num}`.length;
const whiteSpacePerChar = ' '.repeat(font.width);
function prepareText(arg) {
    const numberWidth = arg == null
        ? -1
        : typeof arg.maxNumber === 'number'
            ? getWidth(arg.maxNumber)
            : arg.maxWidth;
    const charWidth = numberWidth * font.width;
    const emptyLine = ' '.repeat(charWidth);
    const prepareWhitespace = (width) => {
        if (width > numberWidth)
            throw new Error("Too wide text");
        return whiteSpacePerChar.repeat(numberWidth - width);
    };
    function print(num, fill = ' ') {
        num = num == null ? undefined : ~~num;
        const numAsString = num == null
            ? fill === 0
                ? numberWidth === -1
                    ? undefined
                    : Array(numberWidth).fill('0').join('')
                : `${num}`
            : fill === 0
                ? Array(numberWidth - getWidth(num)).fill('0').join('')
                    + num
                : `${num}`;
        const whitespace = numberWidth === -1
            ? ''
            : prepareWhitespace(numAsString == null
                ? 0
                : numAsString.length);
        if (numAsString == null)
            return Array(font.height).fill(whitespace);
        const charLines = numAsString
            .split('')
            .map(char => font.number[Number(char)]);
        // Transpose line-by-line number-by-number
        const lines = Array.from({ length: font.height }, (_, i) => i)
            .map((lineNo) => whitespace +
            charLines
                .map(char => char.filter((_, i) => i === lineNo))
                .join(''));
        return lines;
    }
    function printAsPrefix(num, mainLines, opts = {}) {
        const { fill, separator = '' } = opts;
        const col1 = print(num, fill);
        const maxHeight = Math.max(col1.length, mainLines.length);
        return Array.from({ length: maxHeight }).map((_, line) => {
            const prefix = col1.length <= line
                ? emptyLine
                : col1[line];
            const main = mainLines.length <= line
                ? ''
                : mainLines[line];
            return prefix + separator + main;
        });
    }
    return {
        numberWidth,
        charWidth,
        emptyLine,
        print,
        printAsPrefix,
    };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/types.js
function getError(context) {
    return context.error;
}
function getTypedContext(context) {
    return context;
}
const getValueType = (value) => value === null ? 'null' : typeof value;
const getTypedValue = (value) => value == null || typeof value !== 'object'
    ? { value, type: getValueType(value), isSimple: true }
    : Array.isArray(value)
        ? { value: '[...]', type: 'array', isSimple: false }
        : { value: '{...}', type: 'object', isSimple: false };
const getTypedValueKey = ({ type, value }) => type + "::" + value;
const isSimpleValue = (possible) => possible === null ||
    typeof possible === 'boolean' ||
    typeof possible === 'number' ||
    typeof possible === 'string';
function suggestAnotherType(value, toType) {
    const { isSimple, type: fromType } = getTypedValue(value);
    if (!isSimple)
        return;
    const convert = () => {
        if (fromType === 'null') {
            if (toType === 'string')
                return 'null';
            else if (toType === 'number')
                return 0;
            else if (toType === 'boolean')
                return false;
        }
        else if (fromType === 'boolean') {
            if (toType === 'string')
                return `${value}`;
            else if (toType === 'number')
                return value ? 1 : 0;
            else if (toType === 'null')
                return value ? undefined : null;
        }
        else if (fromType === 'number') {
            if (toType === 'string')
                return `${value}`;
            else if (toType === 'boolean')
                return value === 0 ? false : value === 1 ? true : undefined;
            else if (toType === 'null')
                return value === 0 ? null : undefined;
        }
        else if (fromType === 'string') {
            if (toType === 'number')
                return isNaN(Number(value)) ? undefined : Number(value);
            else if (toType === 'boolean')
                return value === "true"
                    ? true
                    : value === "false"
                        ? false
                        : undefined;
            else if (toType === 'null')
                return value === "null" ? null : undefined;
        }
        return;
    };
    const ret = convert();
    if (ret === undefined)
        return undefined;
    return getTypedValue(ret);
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/style/manager.js


function makeManager({ support, style, terminalLink }) {
    const link = (title, url) => {
        return terminalLink(style.link(title), url);
    };
    const ensureColorUsage = useColors => {
        return useColors == null ? support : useColors;
    };
    const formatDataPath = (dataPath) => {
        return dataPath.path
            .map(({ key, type }) => type === 'number'
            ?
                style.operator('[') +
                    style.number(key) +
                    style.operator(']')
            :
                style.operator('.') +
                    style.string(key))
            .join('');
    };
    const pathDescription = (context, pathType) => {
        const { dataPath } = context;
        if (dataPath.path.length === 0)
            return ['', style.expr("root object"), ''];
        const humanify = (dataPath) => dataPath.path.length === 1
            ? ['', formatDataPath(dataPath, context), ` ${pathType}`]
            : [`${pathType} at `, formatDataPath(dataPath, context), ''];
        return humanify(dataPath);
    };
    const printEnum = (lines, { indent = 0, bullet = true } = {}) => {
        const prefix = indent === 0 ? '' : ' '.repeat(indent);
        const bulletChar = bullet ? '∙ ' : '';
        return lines.map(line => `${prefix}    ${bulletChar}${line}`);
    };
    const printError = result => {
        return result.title + "\n\n" + result.codeFrame;
    };
    const formatTypedValue = (typedValue, { untyped = false, includeType = false } = {}) => {
        const type = typedValue.type;
        const value = `${typedValue.value}`;
        const styledValue = type === 'string'
            ? untyped
                ? style.pathDescription(value)
                : style.string(enquote(value))
            : type === 'number'
                ? style.number(value)
                : style.primitive(value);
        if (!includeType && typedValue.isSimple)
            return styledValue;
        return styledValue +
            style.title(' (as ') +
            style.pathDescription(type) +
            style.title(')');
    };
    const formatValue = (value, opts) => {
        return formatTypedValue(getTypedValue(value), opts);
    };
    return {
        support,
        style,
        link,
        ensureColorUsage,
        formatDataPath,
        pathDescription,
        printEnum,
        printError,
        formatTypedValue,
        formatValue,
    };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/style/style-plain.js
const style_plain_style = {
    title: text => text,
    pathDescription: text => text,
    expr: text => text,
    type: text => text,
    string: text => text,
    number: text => text,
    primitive: text => text,
    dimmed: text => text,
    good: text => text,
    operator: text => text,
    link: text => text,
    regex: text => text,
};
const style_plain_support = false;
const style_plain_terminalLink = (text, url) => `${text} (${url})`;
const style_plain_managerOptions = { support: style_plain_support, terminalLink: style_plain_terminalLink, style: style_plain_style };

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/code/types.js
function makePrintCode(enabled, colors, printCode) {
    return (message, parsedJson, options) => !enabled
        ? ''
        : printCode(message, parsedJson, { colors, ...options });
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/unknown-error/index.js
function prettify(context) {
    const { styleManager: { style, pathDescription }, printCode, dataPath, error: { message, keyword }, } = context;
    const [prePath, pathExpr, postPath] = pathDescription(context, 'property');
    const title = style.expr(`[${keyword}] `) +
        style.title(`The ${prePath}`) +
        pathExpr +
        style.title(`${postPath} ${message}`);
    const codeFrame = printCode(message, context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}

;// CONCATENATED MODULE: ./node_modules/leven/index.js
const array = [];
const characterCodeCache = [];

function leven(first, second) {
	if (first === second) {
		return 0;
	}

	const swap = first;

	// Swapping the strings if `a` is longer than `b` so we know which one is the
	// shortest & which one is the longest
	if (first.length > second.length) {
		first = second;
		second = swap;
	}

	let firstLength = first.length;
	let secondLength = second.length;

	// Performing suffix trimming:
	// We can linearly drop suffix common to both strings since they
	// don't increase distance at all
	// Note: `~-` is the bitwise way to perform a `- 1` operation
	while (firstLength > 0 && (first.charCodeAt(~-firstLength) === second.charCodeAt(~-secondLength))) {
		firstLength--;
		secondLength--;
	}

	// Performing prefix trimming
	// We can linearly drop prefix common to both strings since they
	// don't increase distance at all
	let start = 0;

	while (start < firstLength && (first.charCodeAt(start) === second.charCodeAt(start))) {
		start++;
	}

	firstLength -= start;
	secondLength -= start;

	if (firstLength === 0) {
		return secondLength;
	}

	let bCharacterCode;
	let result;
	let temporary;
	let temporary2;
	let index = 0;
	let index2 = 0;

	while (index < firstLength) {
		characterCodeCache[index] = first.charCodeAt(start + index);
		array[index] = ++index;
	}

	while (index2 < secondLength) {
		bCharacterCode = second.charCodeAt(start + index2);
		temporary = index2++;
		result = index2;

		for (index = 0; index < firstLength; index++) {
			temporary2 = bCharacterCode === characterCodeCache[index] ? temporary : temporary + 1;
			temporary = array[index];
			// eslint-disable-next-line no-multi-assign
			result = array[index] = temporary > result ? (temporary2 > result ? result + 1 : temporary2) : (temporary2 > temporary ? temporary + 1 : temporary2);
		}
	}

	return result;
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/suggest.js



const defaultLimit = (length) => length < 3 ? 1 : length < 5 ? 2 : 3;
function suggest(value, possibles, opts = {}) {
    if (!possibles)
        return undefined;
    value = `${value}`;
    const { length } = value;
    const { limit = defaultLimit, referenceValue } = opts;
    const distanceLimit = typeof limit === 'number' ? limit : limit(length);
    const suggestions = [];
    const rest = [];
    possibles
        .map(possible => getTypedValue(possible))
        .map(valueType => ({
        ...valueType,
        distance: valueType.isSimple
            ? leven(value, `${valueType.value}`)
            : Infinity,
    }))
        .sort((a, b) => a.distance === b.distance ? 0 : a.distance < b.distance ? -1 : 1)
        .forEach(({ distance, type, value, isSimple }) => {
        const suggest = distanceLimit === -1 || distance <= distanceLimit;
        if (suggest)
            suggestions.push({ type, value, isSimple });
        else
            rest.push({ type, value, isSimple });
    });
    // The rest should be alphabetically ordered, it's easier to grasp
    rest.sort((a, b) => `${a.value}`.localeCompare(`${b.value}`));
    const ret = {
        suggestions,
        rest,
        referenceValue,
        best: suggestions === null || suggestions === void 0 ? void 0 : suggestions[0],
    };
    return ret;
}
function formatSuggestions(list, context, opts = {}) {
    var _a, _b, _c;
    if (!list)
        return '';
    const { styleManager: { style, formatTypedValue, printEnum } } = context;
    const ifSuggestResult = Array.isArray((_a = list) === null || _a === void 0 ? void 0 : _a.rest)
        ? list
        : undefined;
    const rest = (_b = ifSuggestResult === null || ifSuggestResult === void 0 ? void 0 : ifSuggestResult.rest) !== null && _b !== void 0 ? _b : [];
    const suggestions = (_c = ifSuggestResult === null || ifSuggestResult === void 0 ? void 0 : ifSuggestResult.suggestions) !== null && _c !== void 0 ? _c : list;
    const { untyped: defaultUntyped, referenceValue = ifSuggestResult === null || ifSuggestResult === void 0 ? void 0 : ifSuggestResult.referenceValue, isSuggestion, isConst = false, } = opts;
    const referenceType = referenceValue === undefined
        ? undefined
        : getValueType(referenceValue);
    const useUntyped = () => defaultUntyped !== null && defaultUntyped !== void 0 ? defaultUntyped : false;
    const useType = (suggestion) => referenceValue === undefined
        ? false
        : referenceType !== suggestion.type;
    const formatUntyped = (suggestion) => formatTypedValue(suggestion, {
        untyped: useUntyped(),
        includeType: useType(suggestion),
    });
    const uniqSuggestions = uniq(suggestions, getTypedValueKey);
    const allSuggestions = [...uniqSuggestions, ...rest];
    const styledSuggestion = allSuggestions.length === 1
        ? formatUntyped(allSuggestions[0])
        : allSuggestions.length === 2
            ?
                formatUntyped(allSuggestions[0]) +
                    style.title(" or ") +
                    formatUntyped(allSuggestions[1])
            :
                style.title("any of:") + "\n" +
                    printEnum([
                        ...uniqSuggestions.map(suggestion => formatUntyped(suggestion)),
                        ...(rest.length === 0 ? [] : [
                            "other available values:",
                            ...printEnum(rest.map(suggestion => formatUntyped(suggestion)), { indent: 2, bullet: false })
                        ])
                    ])
                        .join("\n");
    const isQuestion = allSuggestions.length !== 1 && !isConst;
    return (!isSuggestion ? '' :
        style.title(`, ${isQuestion ? 'did you mean' : 'it must be'} `)) +
        styledSuggestion +
        (isQuestion && isSuggestion && uniqSuggestions.length < 3
            ? style.title('?')
            : '');
}
function formatBestSuggestion({ best, referenceValue }, context) {
    if (!best)
        return undefined;
    const includeType = referenceValue === undefined
        ? false
        : getValueType(referenceValue) !== best.type;
    return context.styleManager.formatTypedValue(best, { untyped: false, includeType });
}
function suggestTypedValue(value, types, context) {
    if (typeof value === 'string' && types.includes("number"))
        return {
            type: "number",
            value: context.styleManager.formatTypedValue({ value, type: 'number', isSimple: true }),
        };
    else if (typeof value === 'number' && types.includes("string"))
        return {
            type: "string",
            value: context.styleManager.formatTypedValue({ value: `${value}`, type: 'string', isSimple: true }),
        };
    else
        return undefined;
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/schema.js
function getPossibleProperties(schema, identifiedPath) {
    let cur = schema;
    for (const part of identifiedPath.path) {
        if (!cur.properties || (cur.type && cur.type !== 'object'))
            return undefined;
        if (part.type === 'number')
            cur = cur.items[Number(part.key)];
        else
            cur = cur.properties[part.key];
    }
    if (cur && typeof cur.properties === 'object')
        return Object.keys(cur.properties);
    return undefined;
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/additional-properties/index.js



function additional_properties_prettify(context) {
    const { styleManager: { style, pathDescription }, printCode, dataPath, error: { params: { additionalProperty } }, } = getTypedContext(context);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'object');
    const possibles = getPossibleProperties(context.schema, dataPath);
    const title = style.title(`The ${prePath}`) +
        pathExpr +
        style.title(`${postPath} should not have the property `) +
        style.pathDescription(additionalProperty) +
        formatSuggestions(suggest(additionalProperty, possibles), context, { untyped: true, isSuggestion: true });
    const codeFrame = printCode('remove or rename ' +
        style.pathDescription(`"${additionalProperty}"`), context.parsedJson, {
        path: [...dataPath.simplePath, additionalProperty],
        markIdentifier: true,
    });
    return { title, codeFrame };
}

// EXTERNAL MODULE: ./node_modules/jsonpointer/jsonpointer.js
var jsonpointer = __nccwpck_require__(7571);
;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/json.js

function getValueByPath(context, path = context.dataPath.simplePath) {
    if (context.data === null || typeof context.data !== 'object')
        return context.data;
    return jsonpointer/* get */.U2(context.data, encodeJsonPointerPath(path));
}
function encodeJsonPointerPath(path) {
    return '/' +
        path
            .map(segment => encodeJsonPointerSegment(segment))
            .join('/');
}
function encodeJsonPointerSegment(segment) {
    return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/any-of/index.js



function any_of_prettify(context) {
    const { styleManager: { style, pathDescription }, printCode, dataPath, error: { keyword, typeErrors = [] }, } = getTypedContext(context);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'value');
    const value = getValueByPath(context);
    const allowedTypes = typeErrors.map(typeError => typeError.params.type);
    const suggestion = suggestTypedValue(value, allowedTypes, context);
    const instead = typeErrors.length === 0
        ? 'unknown'
        : formatSuggestions(allowedTypes.map(value => ({
            value,
            type: 'string',
            isSimple: true,
        })), context, { untyped: true });
    const title = style.title(`The type of the ${prePath}`) +
        pathExpr +
        style.title(`${postPath} should `) +
        (keyword === 'not'
            ?
                style.title('NOT be ') +
                    style.pathDescription(getTypedValue(value).type)
            :
                style.title(`be `) + instead);
    const codeFrame = printCode(keyword === 'not'
        ? 'change this type'
        : `change this value` +
            (!suggestion ? '' :
                ' to ' + suggestion.value +
                    ' (as ' + style.pathDescription(suggestion.type) +
                    ') perhaps?'), context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/array-size/index.js


function array_size_prettify(context) {
    const { styleManager: { style, pathDescription }, printCode, dataPath, error: { keyword, params: { limit } }, } = getTypedContext(context);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'array');
    const value = getValueByPath(context);
    const plural = (text, num = Math.abs(value.length - limit)) => text + (num > 1 ? 's' : '');
    const limitOperation = keyword === 'maxItems'
        ? style.expr('should NOT have more than ')
        : style.expr('should have at least ');
    const validStatement = limitOperation +
        style.number(`${limit}`) +
        style.expr(plural(' item', limit));
    const title = style.title(`The ${prePath}`) +
        pathExpr +
        style.title(`${postPath} should be `) +
        validStatement;
    const shortMessage = keyword === 'maxItems'
        ?
            style.title('Remove ') +
                style.number(`${value.length - limit}`) +
                style.title(plural(' item'))
        :
            style.title('Ensure the array has ') +
                style.number(`${limit - value.length}`) +
                style.title(plural(' more item'));
    const codeFrame = printCode(shortMessage, context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/comparison/index.js

function comparison_prettify(context) {
    const { styleManager: { style, pathDescription }, printCode, dataPath, error: { params: { comparison, limit } }, } = getTypedContext(context);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'value');
    const compHuman = comparison === '<='
        ? style.expr("less than or equal to")
        : comparison === '<'
            ? style.expr("strictly less than")
            : comparison === '>='
                ? style.expr("greater than or equal to")
                : comparison === '>'
                    ? style.expr("strictly greater than")
                    : style.operator(`${comparison}`);
    const validStatement = compHuman +
        style.number(` ${limit}`);
    const title = style.title(`The ${prePath}`) +
        pathExpr +
        style.title(`${postPath} should be `) +
        validStatement;
    const codeFrame = printCode('Ensure this is ' + validStatement, context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/enum/index.js



function enum_prettify(context) {
    const { styleManager: { style, pathDescription, formatValue, formatTypedValue, }, printCode, dataPath, error: { params: { allowedValue, allowedValues } }, } = getTypedContext(context);
    const options = allowedValues !== null && allowedValues !== void 0 ? allowedValues : [allowedValue];
    const value = getValueByPath(context);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'value');
    const suggestionResult = suggest(value, options, { referenceValue: value });
    const isConst = options.length === 1 &&
        (options[0] === null || typeof options[0] !== 'object');
    const title = style.title(`The ${prePath}`) +
        pathExpr +
        style.title(`${postPath} cannot be `) +
        formatValue(value) +
        formatSuggestions(suggestionResult, context, { isSuggestion: true, isConst });
    const codeFrame = printCode('replace this with ' +
        (isConst
            ? formatTypedValue(getTypedValue(options[0]))
            : ('an allowed value' +
                (!suggestionResult.best ? '' :
                    ' e.g. ' + formatBestSuggestion(suggestionResult, context)))), context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/format/index.js

function format_prettify(context) {
    const { styleManager: { style, pathDescription, link }, printCode, dataPath, error: { params: { format } }, } = getTypedContext(context);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'value');
    const linkInfo = formatLinks[format];
    const linkDescriptions = !linkInfo
        ?
            style.title(`, check the `) +
                link('JSON Schema specification', formatUrl)
        :
            style.title(' according to ') +
                link(linkInfo.title, linkInfo.url) +
                " 📄";
    const title = style.title(`The ${prePath}`) +
        pathExpr +
        style.title(`${postPath} is not valid `) +
        style.pathDescription(format) +
        linkDescriptions;
    const codeFrame = printCode('ensure this is ' +
        (linkInfo
            ? 'valid ' + link(linkInfo.title, linkInfo.url)
            : 'a valid ' + style.pathDescription(format)), context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}
const formatUrl = 'https://json-schema.org/understanding-json-schema/reference/string.html#format';
const rfcLinks = {
    dateTime: {
        title: 'RFC3339 Section 5.6',
        url: 'https://tools.ietf.org/html/rfc3339#section-5.6',
    },
    email: {
        title: 'RFC5322 Section 3.4.1',
        url: 'https://tools.ietf.org/html/rfc5322#section-3.4.1',
    },
    idnEmail: {
        title: 'RFC6531',
        url: 'https://tools.ietf.org/html/rfc6531',
    },
    hostname: {
        title: 'RFC1034 Section 3.1',
        url: 'https://tools.ietf.org/html/rfc1034#section-3.1',
    },
    idnHostname: {
        title: 'RFC5890 Section 2.3.2.3',
        url: 'https://tools.ietf.org/html/rfc5890#section-2.3.2.3',
    },
    ipv4: {
        title: 'RFC2673 Section 3.2',
        url: 'https://tools.ietf.org/html/rfc2673#section-3.2',
    },
    ipv6: {
        title: 'RFC2373 Section 2.2',
        url: 'https://tools.ietf.org/html/rfc2373#section-2.2',
    },
    uri: {
        title: 'RFC3986',
        url: 'https://tools.ietf.org/html/rfc3986',
    },
    uriReference: {
        title: 'RFC3986 Section 4.1',
        url: 'https://tools.ietf.org/html/rfc3986#section-4.1',
    },
    iri: {
        title: 'RFC3987',
        url: 'https://tools.ietf.org/html/rfc3987',
    },
    uriTemplate: {
        title: 'RFC6570',
        url: 'https://tools.ietf.org/html/rfc6570',
    },
    jsonPointer: {
        title: 'RFC6901',
        url: 'https://tools.ietf.org/html/rfc6901',
    },
    relativeJsonPointer: {
        title: 'Relative JSON Pointers',
        url: 'https://tools.ietf.org/html/draft-handrews-relative-json-pointer-01',
    },
    regex: {
        title: 'ECMA 262',
        url: 'https://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf',
    },
};
const formatLinks = {
    'date-time': rfcLinks.dateTime,
    'time': rfcLinks.dateTime,
    'date': rfcLinks.dateTime,
    email: rfcLinks.email,
    'idn-email': rfcLinks.idnEmail,
    hostname: rfcLinks.hostname,
    'idn-hostname': rfcLinks.idnHostname,
    ipv4: rfcLinks.ipv4,
    ipv6: rfcLinks.ipv6,
    uri: rfcLinks.uri,
    'uri-reference': rfcLinks.uriReference,
    iri: rfcLinks.iri,
    'iri-reference': rfcLinks.iri,
    'uri-template': rfcLinks.uriTemplate,
    'json-pointer': rfcLinks.jsonPointer,
    'relative-json-pointer': rfcLinks.relativeJsonPointer,
    regex: rfcLinks.regex,
};

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/if-then-else/index.js

function if_then_else_prettify(context) {
    const { styleManager: { style, pathDescription }, printCode, dataPath, error: { params: { failingKeyword } }, } = getTypedContext(context);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'value');
    const title = style.title('The conditional ') +
        style.expr(`if/${failingKeyword}`) +
        style.title(` on ${prePath}`) +
        pathExpr +
        style.title(`${postPath} is not satisfied (showed in separate error)`) +
        "\n" +
        style.title('The ') +
        style.expr('if') +
        style.title(' clause references:');
    const codeFrame = printCode('Ensure the corresponding ' +
        style.expr(failingKeyword) +
        ' clause is satisfied', context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/multiple-of/index.js

function multiple_of_prettify(context) {
    const { styleManager: { style, pathDescription }, printCode, dataPath, error: { params: { multipleOf } }, } = getTypedContext(context);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'value');
    const validStatement = style.title(`multiple of `) +
        style.number(`${multipleOf}`);
    const title = style.title(`The ${prePath}`) +
        pathExpr +
        style.title(`${postPath} should be a `) +
        validStatement + ' ' +
        style.title('(e.g. ') +
        [0, 1, 2, 3]
            .map(mul => style.number(`${mul * multipleOf}`))
            .concat([style.title('etc')])
            .join(style.operator(', ')) +
        style.title(')');
    const codeFrame = printCode('Ensure this is a ' + validStatement, context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/pattern/index.js

function pattern_prettify(context) {
    const { styleManager: { style, pathDescription }, printCode, dataPath, error: { params: { pattern } }, } = getTypedContext(context);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'string');
    const title = style.title(`The ${prePath}`) +
        pathExpr +
        style.title(`${postPath} must match `) +
        style.regex(pattern);
    const codeFrame = printCode('Ensure this matches the regex pattern', context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/required/index.js

function required_prettify(context) {
    const { styleManager: { style, pathDescription }, printCode, dataPath, error: { params: { missingProperty } }, } = getTypedContext(context);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'value');
    const title = style.title(`The ${prePath}`) +
        pathExpr +
        style.title(`${postPath} is missing required property `) +
        style.pathDescription(missingProperty);
    const codeFrame = printCode('add missing property ' +
        style.pathDescription(missingProperty), context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/string-size/index.js

function string_size_prettify(context) {
    const { styleManager: { style, pathDescription }, printCode, dataPath, error: { keyword, params: { limit } }, } = getTypedContext(context);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'string');
    const limitOperation = keyword === 'maxLength'
        ? style.expr('at most')
        : keyword === 'minLength'
            ? style.expr('at least')
            : '{unknown}';
    const validStatement = `${limitOperation} ` +
        style.number(`${limit}`) +
        style.expr(' characters long');
    const title = style.title(`The ${prePath}`) +
        pathExpr +
        style.title(`${postPath} should be `) +
        validStatement;
    const codeFrame = printCode('Ensure this is ' + validStatement, context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/type/index.js


function type_prettify(context) {
    const { styleManager: { style, pathDescription, formatTypedValue }, printCode, dataPath, error: { params: { type } }, } = getTypedContext(context);
    const value = getValueByPath(context);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'value');
    const suggestionValue = suggestAnotherType(value, type);
    const suggestion = suggestionValue === undefined
        ? ''
        : formatTypedValue(suggestionValue, { includeType: true });
    const title = style.title(`The type of the ${prePath}`) +
        pathExpr +
        style.title(`${postPath} should be `) +
        style.pathDescription(type) +
        (suggestion ? style.title(', e.g. ') + suggestion : '');
    const codeFrame = printCode('Replace this' +
        (suggestion
            ? ' with e.g. ' + suggestion
            : ''), context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/unique/index.js


function unique_prettify(context) {
    const { styleManager: { style, pathDescription, formatValue }, printCode, dataPath, error: { params: { i, j } }, } = getTypedContext(context);
    const [a, b] = [i, j].sort();
    const valueA = getValueByPath(context, [...dataPath.simplePath, `${a}`]);
    const [prePath, pathExpr, postPath] = pathDescription(context, 'array');
    const title = style.title(`The ${prePath}`) +
        pathExpr +
        style.title(`${postPath} should have unique items, but element `) +
        style.number(`${a}`) +
        style.title(" and ") +
        style.number(`${b}`) +
        style.title(" are identical: ") +
        formatValue(valueA);
    const codeFrame = printCode('Remove element ' +
        style.number(`${a}`) +
        ' or ' +
        style.number(`${b}`), context.parsedJson, { path: dataPath.simplePath, markIdentifier: false });
    return { title, codeFrame };
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettifications/index.js














const allHandlers = {
    unknownError: prettify,
    additionalProperties: additional_properties_prettify,
    anyOf: any_of_prettify,
    not: any_of_prettify,
    maxItems: array_size_prettify,
    minItems: array_size_prettify,
    maximum: comparison_prettify,
    exclusiveMaximum: comparison_prettify,
    minimum: comparison_prettify,
    exclusiveMinimum: comparison_prettify,
    const: enum_prettify,
    enum: enum_prettify,
    format: format_prettify,
    if: if_then_else_prettify,
    multipleOf: multiple_of_prettify,
    pattern: pattern_prettify,
    required: required_prettify,
    maxLength: string_size_prettify,
    minLength: string_size_prettify,
    type: type_prettify,
    uniqueItems: unique_prettify,
};
const handlers = allHandlers;

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/prettification.js








function makePrettify(managerOptions, printCode, environment) {
    const styleManager = makeManager(managerOptions);
    const styleManagerPlain = makeManager(style_plain_managerOptions);
    const getManager = (colors) => styleManager.ensureColorUsage(colors)
        ? styleManager
        : styleManagerPlain;
    return function prettify(validate, opts) {
        var _a;
        if (typeof validate === 'function') {
            const styleManager = getManager(opts === null || opts === void 0 ? void 0 : opts.colors);
            return _prettify({
                errors: ensureArray(validate.errors),
                schema: validate.schema,
                data: opts === null || opts === void 0 ? void 0 : opts.data,
                styleManager,
                printCode,
                location: opts === null || opts === void 0 ? void 0 : opts.location,
                bigNumbers: opts === null || opts === void 0 ? void 0 : opts.bigNumbers,
                environment,
            });
        }
        else {
            const styleManager = getManager((_a = validate) === null || _a === void 0 ? void 0 : _a.colors);
            return _prettify({
                location: undefined,
                bigNumbers: undefined,
                ...validate,
                styleManager,
                printCode,
                environment,
            });
        }
    };
}
function initOptionsWithDefaults(options) {
    var _a, _b;
    const location = (_a = options.location) !== null && _a !== void 0 ? _a : (options.environment === 'node');
    const bigNumbers = location &&
        ((_b = options.bigNumbers) !== null && _b !== void 0 ? _b : (options.environment === 'node'));
    const printCode = makePrintCode(location, options.styleManager.support, options.printCode);
    return { ...options, location, bigNumbers, printCode };
}
function _prettify(_opts) {
    const opts = initOptionsWithDefaults(_opts);
    const { styleManager, printCode, bigNumbers } = opts;
    const errors = mergeTypeErrors(ensureArray(opts.errors));
    if (errors.length === 0)
        return styleManager.style.good("No errors");
    const parsedJson = getAstByObject(opts.data, 2);
    const preparedText = prepareText({ maxNumber: errors.length + 1 });
    return errors.map((error, index) => {
        const context = {
            errors: opts.errors,
            schema: opts.schema,
            data: opts.data,
            styleManager,
            printCode,
            error,
            dataPath: parseDataPath(error),
            parsedJson,
        };
        const errorLines = prettifyOne(context).split("\n");
        if (!bigNumbers || errors.length === 1)
            return errorLines.join("\n");
        return preparedText.printAsPrefix(index + 1, errorLines, { separator: '  ' })
            .join("\n");
    })
        .join("\n\n");
}
function getPrettyError(context) {
    const handler = handlers[context.error.keyword];
    return handler
        ? handler(context)
        : handlers.unknownError(context);
}
function prettifyOne(context) {
    return context.styleManager.printError(getPrettyError(context));
}
function mergeTypeErrors(errors) {
    const toRemove = new Set();
    errors.filter(error => error.keyword === 'anyOf').forEach(error => {
        error.typeErrors =
            errors
                .filter(typeError => typeError.dataPath === error.dataPath &&
                typeError.keyword === 'type');
        error.typeErrors.forEach(error => { toRemove.add(error); });
    });
    return errors.filter(error => !toRemove.has(error));
}

;// CONCATENATED MODULE: ./node_modules/awesome-ajv-errors/dist/index-node.js



const index_node_prettify = makePrettify(managerOptions, printCode, 'node');

// EXTERNAL MODULE: ./node_modules/error-ex/index.js
var error_ex = __nccwpck_require__(3505);
// EXTERNAL MODULE: ./node_modules/json-parse-even-better-errors/index.js
var json_parse_even_better_errors = __nccwpck_require__(9062);
;// CONCATENATED MODULE: ./node_modules/lines-and-columns/build/index.mjs
var LF = '\n';
var CR = '\r';
var LinesAndColumns = /** @class */ (function () {
    function LinesAndColumns(string) {
        this.length = string.length;
        var offsets = [0];
        for (var offset = 0; offset < string.length;) {
            switch (string[offset]) {
                case LF:
                    offset += LF.length;
                    offsets.push(offset);
                    break;
                case CR:
                    offset += CR.length;
                    if (string[offset] === LF) {
                        offset += LF.length;
                    }
                    offsets.push(offset);
                    break;
                default:
                    offset++;
                    break;
            }
        }
        this.offsets = offsets;
    }
    LinesAndColumns.prototype.locationForIndex = function (index) {
        if (index < 0 || index > this.length) {
            return null;
        }
        var line = 0;
        var offsets = this.offsets;
        while (offsets[line + 1] <= index) {
            line++;
        }
        var column = index - offsets[line];
        return { line: line, column: column };
    };
    LinesAndColumns.prototype.indexForLocation = function (location) {
        var line = location.line, column = location.column;
        if (line < 0 || line >= this.offsets.length) {
            return null;
        }
        if (column < 0 || column > this.lengthOfLine(line)) {
            return null;
        }
        return this.offsets[line] + column;
    };
    LinesAndColumns.prototype.lengthOfLine = function (line) {
        var offset = this.offsets[line];
        var nextOffset = line === this.offsets.length - 1
            ? this.length
            : this.offsets[line + 1];
        return nextOffset - offset;
    };
    return LinesAndColumns;
}());


;// CONCATENATED MODULE: ./node_modules/parse-json/index.js





const JSONError = error_ex('JSONError', {
	fileName: error_ex.append('in %s'),
	codeFrame: error_ex.append('\n\n%s\n'),
});

function parseJson(string, reviver, filename) {
	if (typeof reviver === 'string') {
		filename = reviver;
		reviver = null;
	}

	try {
		try {
			return JSON.parse(string, reviver);
		} catch (error) {
			json_parse_even_better_errors(string, reviver);
			throw error;
		}
	} catch (error) {
		error.message = error.message.replace(/\n/g, '');
		const indexMatch = error.message.match(/in JSON at position (\d+) while parsing/);

		const jsonError = new JSONError(error);
		if (filename) {
			jsonError.fileName = filename;
		}

		if (indexMatch && indexMatch.length > 0) {
			const lines = new LinesAndColumns(string);
			const index = Number(indexMatch[1]);
			const location = lines.locationForIndex(index);

			const codeFrame = (0,lib/* codeFrameColumns */.rf)(
				string,
				{start: {line: location.line + 1, column: location.column + 1}},
				{highlightCode: true},
			);

			jsonError.codeFrame = codeFrame;
		}

		throw jsonError;
	}
}

;// CONCATENATED MODULE: ./index.js
// Originally inspired by https://github.com/vanekj/validate-json-action

// @ts-check






const schemaStringInput = core.getInput("schema-string", { required: true });
const jsonStringInput = core.getInput("json-string", { required: true });

let schemaObject;
try {
  schemaObject = parseJson(schemaStringInput);
} catch (err) {
  core.setFailed(
    `${ansi_styles.red.open}✖︎ The given schema input does not contain valid JSON and so the object cannot be validated.
    
${err}

    ${ansi_styles.red.close}`
  );
  process.exit(1);
}

const index_ajv = new ajv({ allErrors: true });
const validateFn = index_ajv.compile(schemaObject);

let jsonObject;
try {
  jsonObject = parseJson(jsonStringInput);
} catch (err) {
  core.setFailed(
    `${ansi_styles.red.open}✖︎ The given input does not contain valid JSON and so the object cannot be validated.
    
${err}

    ${ansi_styles.red.close}`
  );
  process.exit(1);
}

const validationResult = validateFn(jsonObject);
if (!validationResult) {
  if (validateFn.errors) {
    core.startGroup("Raw validation details");
    core.info(JSON.stringify(validateFn.errors, null, 2));
    core.endGroup();
  }

  core.setFailed(
    `${ansi_styles.red.open}✖︎ The given input did not match the validation schema${ansi_styles.red.close}`
  );

  console.log("\n" + index_node_prettify(validateFn, { data: jsonObject }));

  process.exit(1);
}

core.info(
  `${ansi_styles.green.open}✔ The given input is valid JSON and matched the validation schema`
);

})();


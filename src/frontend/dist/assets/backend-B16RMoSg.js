var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a;
import { ai as ProtocolError, aj as TimeoutWaitingForResponseErrorCode, ak as utf8ToBytes, al as ExternalError, am as MissingRootKeyErrorCode, an as Certificate, ao as lookupResultToBuffer, ap as RequestStatusResponseStatus, aq as UnknownError, ar as RequestStatusDoneNoReplyErrorCode, as as RejectError, at as CertifiedRejectErrorCode, au as UNREACHABLE_ERROR, av as InputError, aw as InvalidReadStateRequestErrorCode, ax as ReadRequestType, ay as Principal, az as IDL, aA as MissingCanisterIdErrorCode, aB as HttpAgent, aC as encode, aD as QueryResponseStatus, aE as UncertifiedRejectErrorCode, aF as isV3ResponseBody, aG as isV2ResponseBody, aH as UncertifiedRejectUpdateErrorCode, aI as UnexpectedErrorCode, aJ as decode, ab as Subscribable, aK as pendingThenable, aL as resolveEnabled, ac as shallowEqualObjects, aM as resolveStaleTime, ag as noop, aN as environmentManager, aO as isValidTimeout, aP as timeUntilStale, aQ as timeoutManager, aR as focusManager, aS as fetchState, aT as replaceData, af as notifyManager, r as reactExports, ah as shouldThrowError, N as useQueryClient, aU as useInternetIdentity, aV as createActorWithConfig, aW as Record, aX as Vec, aY as Variant, aZ as Opt, a_ as Service, a$ as Func, b0 as Nat, b1 as Text, b2 as Float64, b3 as Null, b4 as Bool, b5 as Principal$1, b6 as Int } from "./index-Cccc_cne.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
const RestaurantId = Nat;
const ReservationId = Nat;
const UserId = Principal$1;
const UserProfilePublic = Record({
  "reservationIds": Vec(ReservationId),
  "userId": UserId,
  "favoriteRestaurantIds": Vec(RestaurantId)
});
const GalleryImageInput = Record({
  "url": Text,
  "order": Nat,
  "restaurantId": RestaurantId,
  "caption": Text
});
const GalleryImageId = Nat;
const GalleryImagePublic = Record({
  "id": GalleryImageId,
  "url": Text,
  "order": Nat,
  "restaurantId": RestaurantId,
  "caption": Text
});
const MenuCategory = Variant({
  "dessert": Null,
  "main": Null,
  "appetizer": Null,
  "drink": Null
});
const MenuItemInput = Record({
  "name": Text,
  "description": Text,
  "restaurantId": RestaurantId,
  "imageUrl": Opt(Text),
  "category": MenuCategory,
  "price": Float64
});
const MenuItemId = Nat;
const MenuItemPublic = Record({
  "id": MenuItemId,
  "name": Text,
  "description": Text,
  "restaurantId": RestaurantId,
  "imageUrl": Opt(Text),
  "category": MenuCategory,
  "price": Float64
});
const ReservationStatus = Variant({
  "cancelled": Null,
  "pending": Null,
  "confirmed": Null
});
const Timestamp = Int;
const ReservationPublic = Record({
  "id": ReservationId,
  "status": ReservationStatus,
  "bookingReference": Text,
  "date": Text,
  "guestCount": Nat,
  "specialRequests": Text,
  "createdAt": Timestamp,
  "guestName": Text,
  "guestEmail": Text,
  "restaurantId": RestaurantId,
  "guestPhone": Text,
  "timeSlot": Text
});
const AvailabilityResult = Record({
  "date": Text,
  "restaurantId": RestaurantId,
  "reservedSeats": Nat,
  "availableSeats": Nat,
  "timeSlot": Text,
  "totalCapacity": Nat
});
const ReservationInput = Record({
  "date": Text,
  "guestCount": Nat,
  "specialRequests": Text,
  "guestName": Text,
  "guestEmail": Text,
  "restaurantId": RestaurantId,
  "guestPhone": Text,
  "timeSlot": Text
});
const PriceRange = Variant({
  "one": Null,
  "two": Null,
  "three": Null,
  "four": Null
});
const DayOfWeek = Variant({
  "tuesday": Null,
  "wednesday": Null,
  "saturday": Null,
  "thursday": Null,
  "sunday": Null,
  "friday": Null,
  "monday": Null
});
const OpeningHours = Record({
  "day": DayOfWeek,
  "closed": Bool,
  "close": Text,
  "open": Text
});
const RestaurantInput = Record({
  "neighborhood": Text,
  "name": Text,
  "cuisineType": Text,
  "description": Text,
  "email": Text,
  "priceRange": PriceRange,
  "address": Text,
  "openingHours": Vec(OpeningHours),
  "phone": Text
});
const RestaurantPublic = Record({
  "id": RestaurantId,
  "neighborhood": Text,
  "name": Text,
  "cuisineType": Text,
  "description": Text,
  "email": Text,
  "priceRange": PriceRange,
  "averageRating": Float64,
  "address": Text,
  "openingHours": Vec(OpeningHours),
  "phone": Text
});
const AvailabilitySettingsPublic = Record({
  "bookingLeadTimeDays": Nat,
  "maxCoversPerService": Nat,
  "maxPartySize": Nat,
  "restaurantId": RestaurantId,
  "availableTimeSlots": Vec(Text)
});
const SortField = Variant({
  "name": Null,
  "rating": Null
});
const SearchFilter = Record({
  "sortBy": Opt(SortField),
  "neighborhood": Opt(Text),
  "nameQuery": Opt(Text),
  "cuisineType": Opt(Text),
  "priceRange": Opt(PriceRange)
});
const AvailabilitySettingsInput = Record({
  "bookingLeadTimeDays": Nat,
  "maxCoversPerService": Nat,
  "maxPartySize": Nat,
  "availableTimeSlots": Vec(Text)
});
Service({
  "addFavoriteRestaurant": Func([RestaurantId], [UserProfilePublic], []),
  "addGalleryImage": Func([GalleryImageInput], [GalleryImagePublic], []),
  "addMenuItem": Func([MenuItemInput], [MenuItemPublic], []),
  "cancelReservation": Func(
    [ReservationId],
    [Opt(ReservationPublic)],
    []
  ),
  "checkAvailability": Func(
    [RestaurantId, Text, Text],
    [AvailabilityResult],
    ["query"]
  ),
  "confirmReservation": Func(
    [ReservationId],
    [Opt(ReservationPublic)],
    []
  ),
  "createReservation": Func([ReservationInput], [ReservationPublic], []),
  "createRestaurant": Func([RestaurantInput], [RestaurantPublic], []),
  "deleteGalleryImage": Func([GalleryImageId], [Bool], []),
  "deleteMenuItem": Func([MenuItemId], [Bool], []),
  "getAvailabilitySettings": Func(
    [RestaurantId],
    [Opt(AvailabilitySettingsPublic)],
    ["query"]
  ),
  "getGalleryImages": Func(
    [RestaurantId],
    [Vec(GalleryImagePublic)],
    ["query"]
  ),
  "getMenuItems": Func(
    [RestaurantId],
    [Vec(MenuItemPublic)],
    ["query"]
  ),
  "getMyProfile": Func([], [UserProfilePublic], ["query"]),
  "getMyReservationHistory": Func(
    [],
    [Vec(ReservationPublic)],
    ["query"]
  ),
  "getMyReservations": Func([], [Vec(ReservationPublic)], ["query"]),
  "getMyRestaurant": Func([], [Opt(RestaurantId)], ["query"]),
  "getReservationByReference": Func(
    [Text],
    [Opt(ReservationPublic)],
    ["query"]
  ),
  "getReservationsByEmail": Func(
    [Text],
    [Vec(ReservationPublic)],
    ["query"]
  ),
  "getReservationsByRestaurant": Func(
    [RestaurantId],
    [Vec(ReservationPublic)],
    ["query"]
  ),
  "getRestaurant": Func(
    [RestaurantId],
    [Opt(RestaurantPublic)],
    ["query"]
  ),
  "linkAdminToRestaurant": Func([RestaurantId], [], []),
  "removeFavoriteRestaurant": Func(
    [RestaurantId],
    [UserProfilePublic],
    []
  ),
  "searchRestaurants": Func(
    [SearchFilter],
    [Vec(RestaurantPublic)],
    ["query"]
  ),
  "updateGalleryImage": Func(
    [GalleryImageId, GalleryImageInput],
    [Opt(GalleryImagePublic)],
    []
  ),
  "updateMenuItem": Func(
    [MenuItemId, MenuItemInput],
    [Opt(MenuItemPublic)],
    []
  ),
  "updateRestaurant": Func(
    [RestaurantId, RestaurantInput],
    [Opt(RestaurantPublic)],
    []
  ),
  "upsertAvailabilitySettings": Func(
    [RestaurantId, AvailabilitySettingsInput],
    [AvailabilitySettingsPublic],
    []
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const RestaurantId2 = IDL2.Nat;
  const ReservationId2 = IDL2.Nat;
  const UserId2 = IDL2.Principal;
  const UserProfilePublic2 = IDL2.Record({
    "reservationIds": IDL2.Vec(ReservationId2),
    "userId": UserId2,
    "favoriteRestaurantIds": IDL2.Vec(RestaurantId2)
  });
  const GalleryImageInput2 = IDL2.Record({
    "url": IDL2.Text,
    "order": IDL2.Nat,
    "restaurantId": RestaurantId2,
    "caption": IDL2.Text
  });
  const GalleryImageId2 = IDL2.Nat;
  const GalleryImagePublic2 = IDL2.Record({
    "id": GalleryImageId2,
    "url": IDL2.Text,
    "order": IDL2.Nat,
    "restaurantId": RestaurantId2,
    "caption": IDL2.Text
  });
  const MenuCategory2 = IDL2.Variant({
    "dessert": IDL2.Null,
    "main": IDL2.Null,
    "appetizer": IDL2.Null,
    "drink": IDL2.Null
  });
  const MenuItemInput2 = IDL2.Record({
    "name": IDL2.Text,
    "description": IDL2.Text,
    "restaurantId": RestaurantId2,
    "imageUrl": IDL2.Opt(IDL2.Text),
    "category": MenuCategory2,
    "price": IDL2.Float64
  });
  const MenuItemId2 = IDL2.Nat;
  const MenuItemPublic2 = IDL2.Record({
    "id": MenuItemId2,
    "name": IDL2.Text,
    "description": IDL2.Text,
    "restaurantId": RestaurantId2,
    "imageUrl": IDL2.Opt(IDL2.Text),
    "category": MenuCategory2,
    "price": IDL2.Float64
  });
  const ReservationStatus2 = IDL2.Variant({
    "cancelled": IDL2.Null,
    "pending": IDL2.Null,
    "confirmed": IDL2.Null
  });
  const Timestamp2 = IDL2.Int;
  const ReservationPublic2 = IDL2.Record({
    "id": ReservationId2,
    "status": ReservationStatus2,
    "bookingReference": IDL2.Text,
    "date": IDL2.Text,
    "guestCount": IDL2.Nat,
    "specialRequests": IDL2.Text,
    "createdAt": Timestamp2,
    "guestName": IDL2.Text,
    "guestEmail": IDL2.Text,
    "restaurantId": RestaurantId2,
    "guestPhone": IDL2.Text,
    "timeSlot": IDL2.Text
  });
  const AvailabilityResult2 = IDL2.Record({
    "date": IDL2.Text,
    "restaurantId": RestaurantId2,
    "reservedSeats": IDL2.Nat,
    "availableSeats": IDL2.Nat,
    "timeSlot": IDL2.Text,
    "totalCapacity": IDL2.Nat
  });
  const ReservationInput2 = IDL2.Record({
    "date": IDL2.Text,
    "guestCount": IDL2.Nat,
    "specialRequests": IDL2.Text,
    "guestName": IDL2.Text,
    "guestEmail": IDL2.Text,
    "restaurantId": RestaurantId2,
    "guestPhone": IDL2.Text,
    "timeSlot": IDL2.Text
  });
  const PriceRange2 = IDL2.Variant({
    "one": IDL2.Null,
    "two": IDL2.Null,
    "three": IDL2.Null,
    "four": IDL2.Null
  });
  const DayOfWeek2 = IDL2.Variant({
    "tuesday": IDL2.Null,
    "wednesday": IDL2.Null,
    "saturday": IDL2.Null,
    "thursday": IDL2.Null,
    "sunday": IDL2.Null,
    "friday": IDL2.Null,
    "monday": IDL2.Null
  });
  const OpeningHours2 = IDL2.Record({
    "day": DayOfWeek2,
    "closed": IDL2.Bool,
    "close": IDL2.Text,
    "open": IDL2.Text
  });
  const RestaurantInput2 = IDL2.Record({
    "neighborhood": IDL2.Text,
    "name": IDL2.Text,
    "cuisineType": IDL2.Text,
    "description": IDL2.Text,
    "email": IDL2.Text,
    "priceRange": PriceRange2,
    "address": IDL2.Text,
    "openingHours": IDL2.Vec(OpeningHours2),
    "phone": IDL2.Text
  });
  const RestaurantPublic2 = IDL2.Record({
    "id": RestaurantId2,
    "neighborhood": IDL2.Text,
    "name": IDL2.Text,
    "cuisineType": IDL2.Text,
    "description": IDL2.Text,
    "email": IDL2.Text,
    "priceRange": PriceRange2,
    "averageRating": IDL2.Float64,
    "address": IDL2.Text,
    "openingHours": IDL2.Vec(OpeningHours2),
    "phone": IDL2.Text
  });
  const AvailabilitySettingsPublic2 = IDL2.Record({
    "bookingLeadTimeDays": IDL2.Nat,
    "maxCoversPerService": IDL2.Nat,
    "maxPartySize": IDL2.Nat,
    "restaurantId": RestaurantId2,
    "availableTimeSlots": IDL2.Vec(IDL2.Text)
  });
  const SortField2 = IDL2.Variant({ "name": IDL2.Null, "rating": IDL2.Null });
  const SearchFilter2 = IDL2.Record({
    "sortBy": IDL2.Opt(SortField2),
    "neighborhood": IDL2.Opt(IDL2.Text),
    "nameQuery": IDL2.Opt(IDL2.Text),
    "cuisineType": IDL2.Opt(IDL2.Text),
    "priceRange": IDL2.Opt(PriceRange2)
  });
  const AvailabilitySettingsInput2 = IDL2.Record({
    "bookingLeadTimeDays": IDL2.Nat,
    "maxCoversPerService": IDL2.Nat,
    "maxPartySize": IDL2.Nat,
    "availableTimeSlots": IDL2.Vec(IDL2.Text)
  });
  return IDL2.Service({
    "addFavoriteRestaurant": IDL2.Func([RestaurantId2], [UserProfilePublic2], []),
    "addGalleryImage": IDL2.Func([GalleryImageInput2], [GalleryImagePublic2], []),
    "addMenuItem": IDL2.Func([MenuItemInput2], [MenuItemPublic2], []),
    "cancelReservation": IDL2.Func(
      [ReservationId2],
      [IDL2.Opt(ReservationPublic2)],
      []
    ),
    "checkAvailability": IDL2.Func(
      [RestaurantId2, IDL2.Text, IDL2.Text],
      [AvailabilityResult2],
      ["query"]
    ),
    "confirmReservation": IDL2.Func(
      [ReservationId2],
      [IDL2.Opt(ReservationPublic2)],
      []
    ),
    "createReservation": IDL2.Func([ReservationInput2], [ReservationPublic2], []),
    "createRestaurant": IDL2.Func([RestaurantInput2], [RestaurantPublic2], []),
    "deleteGalleryImage": IDL2.Func([GalleryImageId2], [IDL2.Bool], []),
    "deleteMenuItem": IDL2.Func([MenuItemId2], [IDL2.Bool], []),
    "getAvailabilitySettings": IDL2.Func(
      [RestaurantId2],
      [IDL2.Opt(AvailabilitySettingsPublic2)],
      ["query"]
    ),
    "getGalleryImages": IDL2.Func(
      [RestaurantId2],
      [IDL2.Vec(GalleryImagePublic2)],
      ["query"]
    ),
    "getMenuItems": IDL2.Func(
      [RestaurantId2],
      [IDL2.Vec(MenuItemPublic2)],
      ["query"]
    ),
    "getMyProfile": IDL2.Func([], [UserProfilePublic2], ["query"]),
    "getMyReservationHistory": IDL2.Func(
      [],
      [IDL2.Vec(ReservationPublic2)],
      ["query"]
    ),
    "getMyReservations": IDL2.Func([], [IDL2.Vec(ReservationPublic2)], ["query"]),
    "getMyRestaurant": IDL2.Func([], [IDL2.Opt(RestaurantId2)], ["query"]),
    "getReservationByReference": IDL2.Func(
      [IDL2.Text],
      [IDL2.Opt(ReservationPublic2)],
      ["query"]
    ),
    "getReservationsByEmail": IDL2.Func(
      [IDL2.Text],
      [IDL2.Vec(ReservationPublic2)],
      ["query"]
    ),
    "getReservationsByRestaurant": IDL2.Func(
      [RestaurantId2],
      [IDL2.Vec(ReservationPublic2)],
      ["query"]
    ),
    "getRestaurant": IDL2.Func(
      [RestaurantId2],
      [IDL2.Opt(RestaurantPublic2)],
      ["query"]
    ),
    "linkAdminToRestaurant": IDL2.Func([RestaurantId2], [], []),
    "removeFavoriteRestaurant": IDL2.Func(
      [RestaurantId2],
      [UserProfilePublic2],
      []
    ),
    "searchRestaurants": IDL2.Func(
      [SearchFilter2],
      [IDL2.Vec(RestaurantPublic2)],
      ["query"]
    ),
    "updateGalleryImage": IDL2.Func(
      [GalleryImageId2, GalleryImageInput2],
      [IDL2.Opt(GalleryImagePublic2)],
      []
    ),
    "updateMenuItem": IDL2.Func(
      [MenuItemId2, MenuItemInput2],
      [IDL2.Opt(MenuItemPublic2)],
      []
    ),
    "updateRestaurant": IDL2.Func(
      [RestaurantId2, RestaurantInput2],
      [IDL2.Opt(RestaurantPublic2)],
      []
    ),
    "upsertAvailabilitySettings": IDL2.Func(
      [RestaurantId2, AvailabilitySettingsInput2],
      [AvailabilitySettingsPublic2],
      []
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async addFavoriteRestaurant(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.addFavoriteRestaurant(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addFavoriteRestaurant(arg0);
      return result;
    }
  }
  async addGalleryImage(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.addGalleryImage(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addGalleryImage(arg0);
      return result;
    }
  }
  async addMenuItem(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.addMenuItem(to_candid_MenuItemInput_n1(this._uploadFile, this._downloadFile, arg0));
        return from_candid_MenuItemPublic_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addMenuItem(to_candid_MenuItemInput_n1(this._uploadFile, this._downloadFile, arg0));
      return from_candid_MenuItemPublic_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async cancelReservation(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.cancelReservation(arg0);
        return from_candid_opt_n10(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.cancelReservation(arg0);
      return from_candid_opt_n10(this._uploadFile, this._downloadFile, result);
    }
  }
  async checkAvailability(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.checkAvailability(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.checkAvailability(arg0, arg1, arg2);
      return result;
    }
  }
  async confirmReservation(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.confirmReservation(arg0);
        return from_candid_opt_n10(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.confirmReservation(arg0);
      return from_candid_opt_n10(this._uploadFile, this._downloadFile, result);
    }
  }
  async createReservation(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createReservation(arg0);
        return from_candid_ReservationPublic_n11(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createReservation(arg0);
      return from_candid_ReservationPublic_n11(this._uploadFile, this._downloadFile, result);
    }
  }
  async createRestaurant(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createRestaurant(to_candid_RestaurantInput_n15(this._uploadFile, this._downloadFile, arg0));
        return from_candid_RestaurantPublic_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createRestaurant(to_candid_RestaurantInput_n15(this._uploadFile, this._downloadFile, arg0));
      return from_candid_RestaurantPublic_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteGalleryImage(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteGalleryImage(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteGalleryImage(arg0);
      return result;
    }
  }
  async deleteMenuItem(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteMenuItem(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteMenuItem(arg0);
      return result;
    }
  }
  async getAvailabilitySettings(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAvailabilitySettings(arg0);
        return from_candid_opt_n33(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAvailabilitySettings(arg0);
      return from_candid_opt_n33(this._uploadFile, this._downloadFile, result);
    }
  }
  async getGalleryImages(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getGalleryImages(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getGalleryImages(arg0);
      return result;
    }
  }
  async getMenuItems(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getMenuItems(arg0);
        return from_candid_vec_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMenuItems(arg0);
      return from_candid_vec_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyProfile() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyProfile();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyProfile();
      return result;
    }
  }
  async getMyReservationHistory() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyReservationHistory();
        return from_candid_vec_n35(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyReservationHistory();
      return from_candid_vec_n35(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyReservations() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyReservations();
        return from_candid_vec_n35(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyReservations();
      return from_candid_vec_n35(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyRestaurant() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyRestaurant();
        return from_candid_opt_n36(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyRestaurant();
      return from_candid_opt_n36(this._uploadFile, this._downloadFile, result);
    }
  }
  async getReservationByReference(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getReservationByReference(arg0);
        return from_candid_opt_n10(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReservationByReference(arg0);
      return from_candid_opt_n10(this._uploadFile, this._downloadFile, result);
    }
  }
  async getReservationsByEmail(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getReservationsByEmail(arg0);
        return from_candid_vec_n35(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReservationsByEmail(arg0);
      return from_candid_vec_n35(this._uploadFile, this._downloadFile, result);
    }
  }
  async getReservationsByRestaurant(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getReservationsByRestaurant(arg0);
        return from_candid_vec_n35(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReservationsByRestaurant(arg0);
      return from_candid_vec_n35(this._uploadFile, this._downloadFile, result);
    }
  }
  async getRestaurant(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getRestaurant(arg0);
        return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getRestaurant(arg0);
      return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
    }
  }
  async linkAdminToRestaurant(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.linkAdminToRestaurant(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.linkAdminToRestaurant(arg0);
      return result;
    }
  }
  async removeFavoriteRestaurant(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removeFavoriteRestaurant(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeFavoriteRestaurant(arg0);
      return result;
    }
  }
  async searchRestaurants(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.searchRestaurants(to_candid_SearchFilter_n38(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n42(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchRestaurants(to_candid_SearchFilter_n38(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n42(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateGalleryImage(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateGalleryImage(arg0, arg1);
        return from_candid_opt_n43(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateGalleryImage(arg0, arg1);
      return from_candid_opt_n43(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateMenuItem(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateMenuItem(arg0, to_candid_MenuItemInput_n1(this._uploadFile, this._downloadFile, arg1));
        return from_candid_opt_n44(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateMenuItem(arg0, to_candid_MenuItemInput_n1(this._uploadFile, this._downloadFile, arg1));
      return from_candid_opt_n44(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateRestaurant(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateRestaurant(arg0, to_candid_RestaurantInput_n15(this._uploadFile, this._downloadFile, arg1));
        return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateRestaurant(arg0, to_candid_RestaurantInput_n15(this._uploadFile, this._downloadFile, arg1));
      return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
    }
  }
  async upsertAvailabilitySettings(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.upsertAvailabilitySettings(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.upsertAvailabilitySettings(arg0, arg1);
      return result;
    }
  }
}
function from_candid_DayOfWeek_n31(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n32(_uploadFile, _downloadFile, value);
}
function from_candid_MenuCategory_n8(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n9(_uploadFile, _downloadFile, value);
}
function from_candid_MenuItemPublic_n5(_uploadFile, _downloadFile, value) {
  return from_candid_record_n6(_uploadFile, _downloadFile, value);
}
function from_candid_OpeningHours_n29(_uploadFile, _downloadFile, value) {
  return from_candid_record_n30(_uploadFile, _downloadFile, value);
}
function from_candid_PriceRange_n26(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n27(_uploadFile, _downloadFile, value);
}
function from_candid_ReservationPublic_n11(_uploadFile, _downloadFile, value) {
  return from_candid_record_n12(_uploadFile, _downloadFile, value);
}
function from_candid_ReservationStatus_n13(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n14(_uploadFile, _downloadFile, value);
}
function from_candid_RestaurantPublic_n24(_uploadFile, _downloadFile, value) {
  return from_candid_record_n25(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n10(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_ReservationPublic_n11(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n33(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n36(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n37(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_RestaurantPublic_n24(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n43(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n44(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_MenuItemPublic_n5(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n12(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_ReservationStatus_n13(_uploadFile, _downloadFile, value.status),
    bookingReference: value.bookingReference,
    date: value.date,
    guestCount: value.guestCount,
    specialRequests: value.specialRequests,
    createdAt: value.createdAt,
    guestName: value.guestName,
    guestEmail: value.guestEmail,
    restaurantId: value.restaurantId,
    guestPhone: value.guestPhone,
    timeSlot: value.timeSlot
  };
}
function from_candid_record_n25(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    neighborhood: value.neighborhood,
    name: value.name,
    cuisineType: value.cuisineType,
    description: value.description,
    email: value.email,
    priceRange: from_candid_PriceRange_n26(_uploadFile, _downloadFile, value.priceRange),
    averageRating: value.averageRating,
    address: value.address,
    openingHours: from_candid_vec_n28(_uploadFile, _downloadFile, value.openingHours),
    phone: value.phone
  };
}
function from_candid_record_n30(_uploadFile, _downloadFile, value) {
  return {
    day: from_candid_DayOfWeek_n31(_uploadFile, _downloadFile, value.day),
    closed: value.closed,
    close: value.close,
    open: value.open
  };
}
function from_candid_record_n6(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    name: value.name,
    description: value.description,
    restaurantId: value.restaurantId,
    imageUrl: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.imageUrl)),
    category: from_candid_MenuCategory_n8(_uploadFile, _downloadFile, value.category),
    price: value.price
  };
}
function from_candid_variant_n14(_uploadFile, _downloadFile, value) {
  return "cancelled" in value ? "cancelled" : "pending" in value ? "pending" : "confirmed" in value ? "confirmed" : value;
}
function from_candid_variant_n27(_uploadFile, _downloadFile, value) {
  return "one" in value ? "one" : "two" in value ? "two" : "three" in value ? "three" : "four" in value ? "four" : value;
}
function from_candid_variant_n32(_uploadFile, _downloadFile, value) {
  return "tuesday" in value ? "tuesday" : "wednesday" in value ? "wednesday" : "saturday" in value ? "saturday" : "thursday" in value ? "thursday" : "sunday" in value ? "sunday" : "friday" in value ? "friday" : "monday" in value ? "monday" : value;
}
function from_candid_variant_n9(_uploadFile, _downloadFile, value) {
  return "dessert" in value ? "dessert" : "main" in value ? "main" : "appetizer" in value ? "appetizer" : "drink" in value ? "drink" : value;
}
function from_candid_vec_n28(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_OpeningHours_n29(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n34(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_MenuItemPublic_n5(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n35(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ReservationPublic_n11(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n42(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_RestaurantPublic_n24(_uploadFile, _downloadFile, x));
}
function to_candid_DayOfWeek_n22(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n23(_uploadFile, _downloadFile, value);
}
function to_candid_MenuCategory_n3(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n4(_uploadFile, _downloadFile, value);
}
function to_candid_MenuItemInput_n1(_uploadFile, _downloadFile, value) {
  return to_candid_record_n2(_uploadFile, _downloadFile, value);
}
function to_candid_OpeningHours_n20(_uploadFile, _downloadFile, value) {
  return to_candid_record_n21(_uploadFile, _downloadFile, value);
}
function to_candid_PriceRange_n17(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n18(_uploadFile, _downloadFile, value);
}
function to_candid_RestaurantInput_n15(_uploadFile, _downloadFile, value) {
  return to_candid_record_n16(_uploadFile, _downloadFile, value);
}
function to_candid_SearchFilter_n38(_uploadFile, _downloadFile, value) {
  return to_candid_record_n39(_uploadFile, _downloadFile, value);
}
function to_candid_SortField_n40(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n41(_uploadFile, _downloadFile, value);
}
function to_candid_record_n16(_uploadFile, _downloadFile, value) {
  return {
    neighborhood: value.neighborhood,
    name: value.name,
    cuisineType: value.cuisineType,
    description: value.description,
    email: value.email,
    priceRange: to_candid_PriceRange_n17(_uploadFile, _downloadFile, value.priceRange),
    address: value.address,
    openingHours: to_candid_vec_n19(_uploadFile, _downloadFile, value.openingHours),
    phone: value.phone
  };
}
function to_candid_record_n2(_uploadFile, _downloadFile, value) {
  return {
    name: value.name,
    description: value.description,
    restaurantId: value.restaurantId,
    imageUrl: value.imageUrl ? candid_some(value.imageUrl) : candid_none(),
    category: to_candid_MenuCategory_n3(_uploadFile, _downloadFile, value.category),
    price: value.price
  };
}
function to_candid_record_n21(_uploadFile, _downloadFile, value) {
  return {
    day: to_candid_DayOfWeek_n22(_uploadFile, _downloadFile, value.day),
    closed: value.closed,
    close: value.close,
    open: value.open
  };
}
function to_candid_record_n39(_uploadFile, _downloadFile, value) {
  return {
    sortBy: value.sortBy ? candid_some(to_candid_SortField_n40(_uploadFile, _downloadFile, value.sortBy)) : candid_none(),
    neighborhood: value.neighborhood ? candid_some(value.neighborhood) : candid_none(),
    nameQuery: value.nameQuery ? candid_some(value.nameQuery) : candid_none(),
    cuisineType: value.cuisineType ? candid_some(value.cuisineType) : candid_none(),
    priceRange: value.priceRange ? candid_some(to_candid_PriceRange_n17(_uploadFile, _downloadFile, value.priceRange)) : candid_none()
  };
}
function to_candid_variant_n18(_uploadFile, _downloadFile, value) {
  return value == "one" ? {
    one: null
  } : value == "two" ? {
    two: null
  } : value == "three" ? {
    three: null
  } : value == "four" ? {
    four: null
  } : value;
}
function to_candid_variant_n23(_uploadFile, _downloadFile, value) {
  return value == "tuesday" ? {
    tuesday: null
  } : value == "wednesday" ? {
    wednesday: null
  } : value == "saturday" ? {
    saturday: null
  } : value == "thursday" ? {
    thursday: null
  } : value == "sunday" ? {
    sunday: null
  } : value == "friday" ? {
    friday: null
  } : value == "monday" ? {
    monday: null
  } : value;
}
function to_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return value == "dessert" ? {
    dessert: null
  } : value == "main" ? {
    main: null
  } : value == "appetizer" ? {
    appetizer: null
  } : value == "drink" ? {
    drink: null
  } : value;
}
function to_candid_variant_n41(_uploadFile, _downloadFile, value) {
  return value == "name" ? {
    name: null
  } : value == "rating" ? {
    rating: null
  } : value;
}
function to_candid_vec_n19(_uploadFile, _downloadFile, value) {
  return value.map((x) => to_candid_OpeningHours_n20(_uploadFile, _downloadFile, x));
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
export {
  useQuery as a,
  createActor as c,
  useActor as u
};

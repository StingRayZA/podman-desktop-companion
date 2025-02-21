// vendors
const logger = require("electron-log");
// project
const {
  isSystemServiceRunning,
  resetSystem,
  startSystemService,
  getSystemEnvironment,
  getSystemInfo,
  getMachines,
  connectToContainer,
  createMachine,
  connectToMachine,
  restartMachine,
  stopMachine,
  removeMachine,
  getProgram,
  setProgramPath
} = require("@podman-desktop-companion/container-client").engine;

const servicesMap = {
  "/system/program/get": async function () {
    return await getProgram();
  },
  "/system/program/set": async function ({ path }) {
    await setProgramPath(path);
    return await getProgram();
  },
  "/system/running": async function () {
    return await isSystemServiceRunning();
  },
  "/system/connections": async function () {
    return await getSystemConnections();
  },
  "/system/info": async function () {
    return await getSystemInfo();
  },
  "/system/environment": async function () {
    return await getSystemEnvironment();
  },
  "/system/start": async function () {
    return await startSystemService();
  },
  "/system/reset": async function () {
    return await resetSystem();
  },
  "/container/connect": async function ({ Id }) {
    return await connectToContainer(Id);
  },
  "/machines/list": async function () {
    return await getMachines();
  },
  "/machine/restart": async function ({ Name }) {
    return await restartMachine(Name);
  },
  "/machine/stop": async function ({ Name }) {
    return await stopMachine(Name);
  },
  "/machine/connect": async function ({ Name }) {
    return await connectToMachine(Name);
  },
  "/machine/remove": async function ({ Name, force }) {
    return await removeMachine(Name, force);
  },
  "/machine/create": async function (opts) {
    return await createMachine(opts);
  }
};

module.exports = {
  invoker: {
    invoke: async (method, params) => {
      let result = {
        success: false,
        body: null,
        warnings: []
      };
      const service = servicesMap[method];
      logger.debug("Creating invocation", method, params);
      if (service) {
        try {
          logger.debug("Invoking", method, params);
          result.success = true;
          result.body = await service(params);
        } catch (error) {
          logger.error("Invoking error", error);
          result.success = false;
          result.body = error.message;
        }
      } else {
        logger.error("No such IPC method", { method, params });
        result.success = false;
        result.body = "No such IPC method";
      }
      return result;
    }
  }
};

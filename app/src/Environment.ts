import { Environments, Environment } from "./Types";

export const PROJECT_VERSION = process.env.REACT_APP_PROJECT_VERSION || "1.0.0";
export const PROJECT_NAME = "Podman Desktop";
export const CURRENT_ENVIRONMENT: Environments = (process.env.REACT_APP_ENV as any) || Environments.DEVELOPMENT;
export const CONTAINER_DOCS_URL = "https://docs.podman.io/en/latest/index.html";
export const CONTAINER_DOCS_EXAMPLE_CODE = "podman run -dt -p 8889:80/tcp docker.io/library/httpd:latest";
export const PROGRAM_PODMAN = {
  name: "podman",
  title: "Podman",
  homepage: "https://podman.io"
};
export const PROGRAM_DEFAULT = "podman";
export const POLL_RATE_DEFAULT = 1000;
export const API_BASE_URL_DEFAULT = "http://localhost:8085/v3.0.0/libpod";
export const ENV_DEFAULT: Pick<Environment, "settings" | "features"> = {
  settings: {
    api: {
      baseUrl: API_BASE_URL_DEFAULT
    },
    poll: {
      rate: POLL_RATE_DEFAULT
    }
  },
  features: {
    customizeMounts: {
      enabled: true
    },
    polling: {
      enabled: true
    },
    engineSwitcher: {
      enabled: true
    }
  }
};

export const EnvironmentsMap: { [key in Environments]: Environment } = {
  [Environments.DEVELOPMENT]: {
    name: Environments.DEVELOPMENT,
    ...ENV_DEFAULT,
    ...{
      features: {
        ...ENV_DEFAULT.features,
        customizeMounts: {
          enabled: false
        },
        polling: {
          enabled: false
        }
      }
    }
  },
  [Environments.PRODUCTION]: {
    name: Environments.PRODUCTION,
    ...ENV_DEFAULT,
    ...{
      features: {
        ...ENV_DEFAULT.features,
        customizeMounts: {
          enabled: false
        },
        engineSwitcher: {
          enabled: false
        }
      }
    }
  }
};

const CurrentEnvironment = EnvironmentsMap[CURRENT_ENVIRONMENT];

export const API = CurrentEnvironment.settings.api.baseUrl;

// console.debug(CurrentEnvironment);

export default CurrentEnvironment;

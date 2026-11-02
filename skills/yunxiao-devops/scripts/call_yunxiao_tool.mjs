#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_CONFIG = {
  mcpServer: {
    package: "alibabacloud-devops-mcp-server",
    version: "0.3.34",
    toolsets: ["organization-management", "project-management"],
  },
  mcpClient: {
    sdkPackage: "@modelcontextprotocol/sdk",
    sdkVersion: "1.29.0",
    cacheEnv: "YUNXIAO_MCP_CLIENT_CACHE",
  },
  environment: {
    accessTokenEnv: "YUNXIAO_ACCESS_TOKEN",
    apiBaseUrlEnv: "YUNXIAO_API_BASE_URL",
    defaultApiBaseUrl: "https://openapi-rdc.aliyuncs.com",
    toolsetsOverrideEnv: "DEVOPS_TOOLSETS",
    toolArgsJsonEnv: "YUNXIAO_TOOL_ARGS_JSON",
    debugEnv: "YUNXIAO_MCP_DEBUG",
  },
};

function mergeConfig(base, override) {
  return {
    ...base,
    ...override,
    mcpServer: { ...base.mcpServer, ...override?.mcpServer },
    mcpClient: { ...base.mcpClient, ...override?.mcpClient },
    environment: { ...base.environment, ...override?.environment },
  };
}

function loadConfig() {
  const configPath =
    process.env.YUNXIAO_DEVOPS_CONFIG ||
    path.join(SKILL_DIR, "config", "yunxiao-devops.config.json");
  if (!existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }
  return mergeConfig(DEFAULT_CONFIG, JSON.parse(readFileSync(configPath, "utf8")));
}

const CONFIG = loadConfig();
const SERVER_PACKAGE = `${CONFIG.mcpServer.package}@${CONFIG.mcpServer.version}`;
const SDK_PACKAGE = `${CONFIG.mcpClient.sdkPackage}@${CONFIG.mcpClient.sdkVersion}`;
let cachedUserAccessToken;

function usage() {
  console.error(
    [
      "用法：node call_yunxiao_tool.mjs <tool_name> [--args-json <json>] [--args-file <path>]",
      "Token 来源：环境变量，变量名来自 config.environment.accessTokenEnv。",
      "可选环境变量：YUNXIAO_API_BASE_URL、DEVOPS_TOOLSETS、YUNXIAO_TOOL_ARGS_JSON。",
    ].join("\n"),
  );
}

function stripBom(value) {
  return String(value || "").replace(/^\uFEFF/, "");
}

function readUserEnvironmentVariable(name) {
  if (process.platform !== "win32" || !name) return "";

  const safeName = String(name).replace(/'/g, "''");
  const result = spawnSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      `[Environment]::GetEnvironmentVariable('${safeName}','User')`,
    ],
    { encoding: "utf8", windowsHide: true },
  );
  if (result.status !== 0) return "";
  return stripBom(result.stdout).trim();
}

function getAccessToken() {
  const envName = CONFIG.environment.accessTokenEnv;
  if (process.env[envName]) return process.env[envName];
  if (cachedUserAccessToken === undefined) {
    cachedUserAccessToken = readUserEnvironmentVariable(envName);
  }
  return cachedUserAccessToken;
}

function redact(value) {
  const token = getAccessToken();
  let text = String(value);
  if (token) text = text.split(token).join("<redacted>");
  return text
    .replace(/https:\/\/aone-common-cloud[^\s"'<>]+/g, "<temporary-oss-url-redacted>")
    .replace(
      /https:\/\/[^\s"'<>]*(?:OSSAccessKeyId|Signature|Expires=)[^\s"'<>]*/g,
      "<temporary-oss-url-redacted>",
    );
}

function parseArgs(argv) {
  const parsed = { toolName: argv[2], argsJson: process.env[CONFIG.environment.toolArgsJsonEnv] };
  for (let index = 3; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--args-json") {
      parsed.argsJson = argv[++index];
    } else if (arg === "--args-file") {
      parsed.argsJson = stripBom(readFileSync(argv[++index], "utf8"));
    } else {
      parsed.argsJson = arg;
    }
  }
  return parsed;
}

function npmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function npxCommand() {
  return process.platform === "win32" ? "npx.cmd" : "npx";
}

function ensureSdk(cacheDir) {
  const sdkPackageJson = path.join(
    cacheDir,
    "node_modules",
    "@modelcontextprotocol",
    "sdk",
    "package.json",
  );
  if (existsSync(sdkPackageJson)) return;

  mkdirSync(cacheDir, { recursive: true });
  const result = spawnSync(
    npmCommand(),
    ["install", "--prefix", cacheDir, "--no-save", SDK_PACKAGE],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    throw new Error(`安装 ${SDK_PACKAGE} 失败`);
  }
}

async function importSdk(cacheDir) {
  const root = path.join(cacheDir, "node_modules", "@modelcontextprotocol", "sdk", "dist", "esm");
  const clientModule = await import(pathToFileURL(path.join(root, "client", "index.js")));
  const stdioModule = await import(pathToFileURL(path.join(root, "client", "stdio.js")));
  return {
    Client: clientModule.Client,
    StdioClientTransport: stdioModule.StdioClientTransport,
  };
}

async function main() {
  const { toolName, argsJson } = parseArgs(process.argv);
  const token = getAccessToken();
  if (!toolName || !token) {
    usage();
    process.exit(2);
  }

  const toolArgs = JSON.parse(stripBom(argsJson || "{}"));
  const cacheDir =
    process.env[CONFIG.mcpClient.cacheEnv] ||
    path.join(homedir(), ".codex", "tmp", "yunxiao-mcp-client");

  ensureSdk(cacheDir);
  const { Client, StdioClientTransport } = await importSdk(cacheDir);

  const client = new Client(
    { name: "yunxiao-devops-skill-client", version: "0.1.0" },
    { capabilities: {} },
  );

  const transport = new StdioClientTransport({
    command: npxCommand(),
    args: [
      "-y",
      SERVER_PACKAGE,
      `--toolsets=${
        process.env[CONFIG.environment.toolsetsOverrideEnv] ||
        CONFIG.mcpServer.toolsets.join(",")
      }`,
    ],
    env: {
      ...process.env,
      [CONFIG.environment.accessTokenEnv]: token,
      YUNXIAO_API_BASE_URL:
        process.env[CONFIG.environment.apiBaseUrlEnv] || CONFIG.environment.defaultApiBaseUrl,
    },
    stderr: "pipe",
  });

  const stderrLines = [];
  transport.stderr?.on("data", (chunk) => {
    const text = redact(chunk.toString());
    stderrLines.push(...text.split(/\r?\n/).filter(Boolean));
    if (process.env[CONFIG.environment.debugEnv] === "1") {
      console.error(text);
    }
  });

  try {
    await client.connect(transport);
    const result = await client.callTool({ name: toolName, arguments: toolArgs });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(redact(error?.stack || error?.message || error));
    if (stderrLines.length && process.env[CONFIG.environment.debugEnv] !== "1") {
      console.error("最近的 MCP stderr：");
      console.error(stderrLines.slice(-20).join("\n"));
    }
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

await main();

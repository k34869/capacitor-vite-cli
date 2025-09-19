const os = require("os");
const { spawn } = require("child_process");
const inquirer = require("inquirer");

function getIpv4() {
  const nets = os.networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value) {
        results.unshift({
          interface: name,
          address: net.address,
        });
      }
    }
  }

  return results;
}

function startVite(options = {}) {
  const { port = "5173" } = options;
  return new Promise((resolve) => {
    const viteExec = spawn(
      "npx",
      ["vite", "dev", "--host", "0.0.0.0", "--port", port, "--strictPort"],
      {
        env: { ...process.env, FORCE_COLOR: "1" },
        stdio: ["ignore", "pipe", "pipe"],
        shell: true,
      }
    );
    viteExec.stdout.on("data", (chunk) => {
      if (/VITE(.){1,}ready/.test(chunk)) {
        resolve(viteExec);
      }
      process.stdout.write(chunk);
    });

    viteExec.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
    });

    viteExec.on("close", (code) => {
      process.exit(code);
    });
  });
}

function selectServerUrl(options = {}) {
  const { port = 5173 } = options;
  return new Promise((resolve) => {
    const ipv4Address = getIpv4().map((e) => `http://${e.address}:${port}`);

    const questions = [
      {
        type: "list",
        name: "url",
        message: "Select dev server url? ",
        choices: ipv4Address,
      },
    ];
    inquirer.prompt(questions).then((answers) => {
      resolve(answers);
    });
  });
}

function devModeStart(options = {}) {
  const { host = "0.0.0.0", port = 5173, platform = "" } = options;
  return new Promise((resolve) => {
    if (host === "0.0.0.0") {
      selectServerUrl(options).then((answers) => {
        const { hostname } = new URL(answers.url);
        startVite({ port }).then((vite) => {
          spawn(
            "npx",
            [
              "cap",
              "run",
              platform,
              "--live-reload",
              "--host",
              hostname,
              "--port",
              port,
            ],
            {
              shell: true,
              stdio: "inherit",
            }
          );
        });
      });
    }
  });
}

module.exports = {
  devModeStart,
};

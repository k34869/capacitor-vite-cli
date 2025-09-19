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
  const { host = "0.0.0.0", port = 5173 } = options;
  return new Promise((resolve, reject) => {
    const viteExec = spawn(
      "npx",
      ["vite", "dev", "--host", host, "--port", port],
      {
        shell: true,
        stdio: "inherit",
      }
    );
    resolve("ok");
    viteExec.on("exit", (code) => {
      if (code === 1) {
        reject(code);
      }
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

function start(options = {}) {
  const { host = "0.0.0.0", port = 5173 } = options;
  return new Promise((resolve, reject) => {
    if (host === "0.0.0.0") {
      selectServerUrl(options).then((answers) => {
        const { hostname, port } = new URL(answers.url);
      });
    }
  });
}

module.exports = {
  start,
};

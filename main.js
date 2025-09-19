const { program } = require("commander");
const { devModeStart } = require("./lib/dev");
const package = require("./package.json");

program
  .name(package.binName)
  .version(package.version)
  .description(package.description)
  .action(() => {
    program.outputHelp();
  });

program
  .command("create [template] [appName] [appId]")
  .description(`Create a project`)
  .action(() => {
    console.log("create develop...");
  });

program
  .command("dev [platform]")
  .description(`Start vite dev server, then builds and deploys the native app`)
  .option("--host <host>", "Host used for live reload")
  .option("--port <port>", "Port used for live reload")
  .action((platform, opts) => {
    devModeStart({
      platform,
      host: opts.host,
      port: opts.port,
    });
  });

program
  .command("build <platform>")
  .description("builds the release version of the selected platform")
  .action(() => {
    console.log("build develop...");
  });

program.parse();

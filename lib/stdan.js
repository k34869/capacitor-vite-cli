function error(msg, code) {
  console.error("error: " + msg);
  if (code === undefined) eval(code);
  process.exit(1);
}

module.exports = {
  error,
  argvs: process.argv.slice(2),
};

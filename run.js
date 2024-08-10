console.log("*         \x1b[91m __  _______                                __\x1b[0m ");
console.log("*         \x1b[91m|  \\|       \\                              |  \\\x1b[0m");
console.log(
  "*     \x1b[91m____|\x1b[0m \x1b[31m$$\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$$$$$$\x1b[0m\x1b[91m\\\x1b[0m\x1b[91m ______   _______    ______  | \x1b[0m\x1b[31m$$\x1b[0m",
);
console.log(
  "*    \x1b[91m/      \x1b[31m$$\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m\x1b[91m__/\x1b[0m \x1b[31m$$\x1b[0m\x1b[91m|      \\ |       \\  /      \\ | \x1b[0m\x1b[31m$$\x1b[0m",
);
console.log(
  "*   \x1b[91m|  \x1b[31m$$$$$$$\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m    \x1b[31m$$\x1b[0m \x1b[91m\\\x1b[0m\x1b[31m$$$$$$\x1b[0m\x1b[91m\\|\x1b[0m \x1b[31m$$$$$$$\x1b[0m\x1b[91m\\|\x1b[0m  \x1b[31m$$$$$$\x1b[0m\x1b[91m\\|\x1b[0m \x1b[31m$$\x1b[0m",
);
console.log(
  "*   \x1b[91m| \x1b[31m$$\x1b[0m  \x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$$$$$$\x1b[0m \x1b[91m/\x1b[0m      \x1b[31m$$\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m  \x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m    \x1b[31m$$\x1b[0m\x1b[91m| \x1b[31m$$\x1b[0m",
);
console.log(
  "*   \x1b[91m| \x1b[31m$$\x1b[0m\x1b[91m__|\x1b[0m \x1b[31m$$\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m     \x1b[91m|\x1b[0m  \x1b[31m$$$$$$$\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m  \x1b[91m\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$$$$$$$\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m",
);
console.log(
  "*    \x1b[91m\\\x1b[0m\x1b[31m$$\x1b[0m    \x1b[31m$$\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m      \x1b[91m\\\x1b[0m\x1b[0m\x1b[31m$$\x1b[0m    \x1b[31m$$\x1b[0m\x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m  \x1b[91m|\x1b[0m \x1b[31m$$\x1b[0m \x1b[91m\\\x1b[31m$$\x1b[0m     \x1b[91m\\|\x1b[0m \x1b[31m$$\x1b[0m",
);
console.log(
  "*     \x1b[91m\\\x1b[0m\x1b[31m$$$$$$$\x1b[0m \x1b[91m\\\x1b[0m\x1b[31m$$\x1b[0m       \x1b[91m\\\x1b[0m\x1b[31m$$$$$$$\x1b[0m \x1b[91m\\\x1b[0m\x1b[31m$$\x1b[0m   \x1b[91m\\\x1b[0m\x1b[31m$$\x1b[0m  \x1b[91m\\\x1b[0m\x1b[31m$$$$$$$\x1b[0m \x1b[91m\\\x1b[0m\x1b[31m$$\x1b[0m",
);
console.log("*");
console.log(
  "*   \x1b[34mVersion beta 1.0.0                      dPanel © 2024\x1b[0m",
);
console.log("*               \x1b[36mdPanel has started launching:\x1b[0m");
console.log("*");
require("./app/index");
require("./database/mysql-promise");
require("./database/mysql");
require("./smtp");

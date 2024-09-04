function convertIPv6toIPv4(ip) {
  if (ip.startsWith("::ffff:")) {
    return ip.split("::ffff:")[1];
  } else if (ip === "::1") {
    return "127.0.0.1";
  } else {
    return ip;
  }
}

module.exports = convertIPv6toIPv4;

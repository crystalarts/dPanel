// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

module.exports.sendError = (
  res,
  { code = 400, message = "An unknown error occurred." }
) => res.status(400).json({ code, message });

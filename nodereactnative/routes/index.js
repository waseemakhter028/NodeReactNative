const { Router } = require("express");
const routesV1 = require("./v1");

const router = Router();

router.use("/", routesV1);

module.exports = router;

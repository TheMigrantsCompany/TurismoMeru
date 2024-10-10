const { Router } = require("express");
const bookingRouter = require("./bookingRouter");
const reviewRouter = require("./reviewRouter");
const serviceRouter = require("./serviceRouter");
const serviceOrderRouter = require("./serviceOrderRouter"); 
const userRouter = require("./userRouter");

const router = Router();

//Agregas las rutas de usuario a la ruta principal
router.use("/user", userRouter);
//Agregas las rutas de servicio (Excursiones) a la ruta principal
router.use("/service", serviceRouter);
//Agregas las rutas de orden de servicio a la ruta principal
router.use("/servicesOrder", serviceOrderRouter);
//Agregas las rutas de reservas a la ruta principal
router.use("/booking", bookingRouter);
//Agregas las rutas de reseñas a la ruta principal
router.use("/review", reviewRouter);



module.exports = router;
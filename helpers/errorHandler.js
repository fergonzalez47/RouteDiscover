const errorHandler = (err, req, res, next) => {
    // Verificar si el error tiene un código de error asignado
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
};

module.exports = errorHandler;

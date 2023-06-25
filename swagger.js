const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'My RouteDiscover API',
        description: 'API for getting, posting, updating and deleting trekking routes and descriptions about it.',
    },
    host: 'routediscover.onrender.com',
    schemes: ['https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

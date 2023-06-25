const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'My RouteDiscover API',
        description: 'API for getting, posting, updating and deleting trekking routes and descriptions about it.',
    },
    host: 'localhost:3000',
    schemes: ['https'],
};
//routediscover.onrender.com
const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

const Joi        = require('joi');
const createHash = require('./createhash');
const hashLen    = 8; /* 8 chars long */
const baseUrl    = 'http://localhost:3000';
const Redir = require('./schema');

/* EXPORTING THE ROUTES
======================================================*/

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler(request, reply) {
            reply.file('views/index.html');
        }
    },
    {
        method: 'GET',
        path: '/public/{file}',
        handler(request, reply) {
            reply.file(`public/${request.params.file}`);
        }
    },
    {
        method: 'POST',
        path: '/new',
        handler(request, reply) {
            const uniqueID = createHash(hashLen);
            const newRedir = new Redir({
                slug: `${uniqueID}`,
                shortUrl: `${baseUrl}/${uniqueID}`,
                url: request.payload.url,
                createdAt: new Date()
            });

            newRedir.save((err, redir) => {
                if (err) { reply(err); } else { reply(redir); }
            });
        },
        config: {
            validate: {
                payload: {
                    url: Joi.string()
                    .regex(/^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
                    .required()
                }
            }
        }
    },
    {
        method: 'GET',
        path:'/{hash}',
        handler(request, reply) {
            const query = {
                'shortUrl': `${baseUrl}/${request.params.hash}`
            };
            Redir.findOne(query, (err, redir) => {
                if (err) { return reply(err); }
                else if (redir) { reply().redirect(redir.url); }
                else { reply.file('views/404.html').code(404); }
            });
        }
    }
];

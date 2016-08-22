require('dotenv').config();
const Joi        = require('joi');
const shortid = require('shortid');
const baseUrl    = process.env.URL;
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
            const uniqueID = shortid.generate();
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
                    .regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)
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

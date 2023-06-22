const joi = require('joi');

const validateReg = joi.object({
  linkedInUrl: joi.string().required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: joi.string().min(8),
  confirm_password: joi.string().min(8),
  agreeToEmails:joi.boolean().required(),
});

const validateLogin = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: joi.string().min(8),
});

module.exports = { validateLogin, validateReg };

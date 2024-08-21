import Joi from 'joi';

const schema = {
  saveSubscriberData: Joi.object({
    email: Joi.string().trim().email().required().max(60),
  }),
};

export default schema;

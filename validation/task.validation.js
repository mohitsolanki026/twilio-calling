import joi from 'joi';

const taskCreateValidation = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    due_date: joi.date().required(),
});

const taskUpdateValidation = joi.object({
    due_date: joi.date().required(),
    status: joi.string().valid('TODO', 'IN_PROGRESS', 'DONE').required(),
});

export { taskCreateValidation, taskUpdateValidation };
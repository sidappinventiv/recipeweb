import Router from "koa-router";
import Joi, { valid } from "joi";

function validate(schema:Joi.Schema) {   
   return async (ctx: Router.RouterContext, next: () => Promise<any>) => 
    {     
       const { error } = schema.validate(ctx.request.body);   
        if (error) 
       {  
        ctx.status = 400;        
        ctx.body = { error: error.details[0].message };        
        return;      
      }      await next();    
    }; 
   }


   export const validateSendOTP = validate(Joi.object({
    email: Joi.string().email().required(),
  }));


  export const validateVerifyAndRegisterUser = validate(Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    password: Joi.string().required().min(8) .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\\s).*$')),
    name: Joi.string().required(),
  }));



  export const validateLogin = validate(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }));
  
  export const validateCreateReview = validate(Joi.object({
    rating: Joi.number().required().max(5),
    recipeId: Joi.string().required(),
    userId: Joi.string().required(),
    likes: Joi.number().valid(1).required(),
    comments: Joi.string().required(),
  }));

  export const validateResetPassword = validate(Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    newPassword: Joi.string()
      .required()
      .min(8)
      .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\\s).*$')),
    resetToken: Joi.string().required(), 
  }));

  
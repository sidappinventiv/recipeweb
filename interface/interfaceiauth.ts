import { Context } from 'koa'
interface IAuthController {
    sendOTP(ctx: Context): Promise<void>;
    verifyAndRegisterUser(ctx: Context): Promise<void>;
    googleLogin(ctx: Context): Promise<void>;
    googleLoginCallback(ctx: Context): Promise<void>;
    resetPassword(ctx: Context): Promise<void>;
    resetLink(ctx: Context): Promise<void> ;
    logout(ctx: Context): Promise<void>;
}
    
export default IAuthController;
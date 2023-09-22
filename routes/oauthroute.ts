import {google} from 'googleapis';
import fs from 'fs';
import Router from 'koa-router';
const router = new Router();
const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET ,
    process.env.GOOGLEOAUTHREDIRECTURL
  );
  
  try{
    const creds = fs.readFileSync("creds.json");
    const credsString = creds.toString(); 
    oAuth2Client.setCredentials(JSON.parse(credsString));
  }catch(err){
    console.log("no creds thre");
  }
  
  router.get('/auth/google', (ctx: any) => {
    const url = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',   
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/drive',
      ].join(' '),
      prompt: 'consent',
    });
    ctx.redirect(url);
  });

  router.get('/redirect/callback', async (ctx: any) => { 
    const { code } = ctx.query;
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      fs.writeFileSync('creds.json', JSON.stringify(tokens));
      ctx.body = 'success'; 
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      ctx.body = 'error ocuur'; 
    }
  });


router.get("/savetext/:sometext",async(ctx:any) =>{
const drive = google.drive({version:"v3",auth:oAuth2Client});
const sometext = ctx.params.sometext;

try {
    const fileMetadata = {
      name: "test.txt",
      mimeType: "text/plain",
    };

    const media = {
      mimeType: "text/plain",
      body: sometext, // Corrected property name to 'body'
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
    });

    console.log("File ID:", response.data.id);
    ctx.body = "File uploaded successfully.";
  } catch (error) {
    console.error("Error uploading file:", error);
    ctx.status = 500;
    ctx.body = "Error uploading file.";
  }
  return("suscess")
});

export default router;






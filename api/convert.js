import formidable from "formidable";
import fs from "fs";
import { exec } from "child_process";

export const config = { api:{bodyParser:false} };

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).send("Method not allowed");
  const form=new formidable.IncomingForm();
  form.parse(req,async(err,fields,files)=>{
    if(err) return res.status(500).json({error:"Form parse error"});
    const filePath=files.video.filepath;
    const outPath=`/tmp/output_${Date.now()}.mp4`;
    exec(`ffmpeg -y -i ${filePath} -c:v libx264 -preset fast -c:a aac ${outPath}`,(e)=>{
      if(e) return res.status(500).json({error:"FFmpeg error"});
      const data=fs.readFileSync(outPath);
      res.setHeader("Content-Type","video/mp4");
      res.setHeader("Content-Disposition","attachment; filename=vidcraft.mp4");
      res.send(data);
      fs.unlinkSync(filePath);
      fs.unlinkSync(outPath);
    });
  });
    }

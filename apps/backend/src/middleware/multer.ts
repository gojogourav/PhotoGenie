import multer from "multer";

const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fieldSize:5*1024*1024,
        files:20,
    },
    fileFilter: (req,file,cb)=>{
        if(file.mimetype.startsWith("image/")){
            cb(null,true);
        }else{
            cb(new Error("Only Images are allowed"))
        }
    }
})

export default upload;
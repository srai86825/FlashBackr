import jwt from "jsonwebtoken";
import expJwt from "express-jwt";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

//like process: click(like)=> middleware(verify, call next)=>likeController()...

const auth = async (req, res, next) => {
  // console.log("Token at middleware", req.headers.authorization);
  const token = req.headers?.authorization?.split(" ")[1];
  const isCustomAuth = token?.length < 500;
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });
  let decodedData;
  try {
    //user who logged in using email and pass
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedData?.id;
      //attaching current user's id to req of the current req call by the client.
      //this userId will be accessible to all upcoming subsequent middlewares.
      //so this can be used to confirm, ex: if a user wants to delete a post, we can
      //verify that the post has the same id of creator as the userId from whom the
      // request is being made
    } else if (token && !isCustomAuth) {
      //^ user who logged in using google Auth
      decodedData = jwt.decode(token);
      console.log("Created Post using Google: ", decodedData?.sub);
      if (!decodedData?.sub)
        return res.status(401).json({ message: "Not authorized, no googleID" });
      req.userId = decodedData?.sub;
    }
    next(); //passing the call to next middleware
  } catch (error) {
    console.log("error at middleware: ", error);
  }
};

export default auth;

import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../config/redis";
import {
  getAllUser,
  getUserById,
  updateUserRole,
} from "../services/user.services";

dotenv.config();

// Register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
export const registrationController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Error: Email already exists", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your accout",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }

      res.status(200).json({ activationToken });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Interface for the activation token
interface IActivationToken {
  token: string;
  activationCode: string;
}
// Create an activation token
export const createActivationToken = (
  user: IRegistrationBody
): IActivationToken => {
  const activationCode = (1000 + Math.floor(Math.random() * 9000)).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

//activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}
export const activateUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: {
        user: IUser;
        activationCode: string;
      } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as {
        user: IUser;
        activationCode: string;
      };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid Activation Code", 400));
      }

      const { name, email, password } = newUser.user;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user = await User.create({
        name,
        email,
        password,
      });
      res.status(201).json({
        success: true,
        message: "Account created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//login user
interface ILoginRequest {
  email: string;
  password: string;
}
export const loginUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid Credentials", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Credentials", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Social authentication
interface ISocialBody {
  email: string;
  name: string;
  avatar: string;
}

export const socialAuthController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialBody;
      const user = await User.findOne({ email });

      if (!user) {
        const newUser = await User.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//logout user
export const logoutUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      const userId = req.user?._id || "";
      redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Logout Successfull",
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      console.log("Received refresh token:", refresh_token);

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;
      console.log("Decoded token:", decoded);

      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }

      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(
          new ErrorHandler("Please login for access this resource", 400)
        );
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );
      console.log("Generated Access Token:", accessToken);
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );
      console.log("Generated Refresh Token:", refreshToken); // Log the generated refresh token

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);
      await redis.set(user._id, JSON.stringify(user), "EX", 684800);

      res.status(200).json({
        status: "success",
        accessToken,
      });
    } catch (error: any) {
      console.log("Error occurred:", error.message); // Log any errors that occurred
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Get user info by id
export const getUserInfoController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Get user info by id
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}
export const updateUserInfoController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;
      const user = await User.findById(userId);

      if (name && user) {
        user.name = name;
      }
      await user?.save();
      await redis.set(userId, JSON.stringify(user));
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Update user Password
interface IUpdateUserPassword {
  oldPassword: string;
  newPassword: string;
}
export const updateUserPasswordController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdateUserPassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }

      const user = await User.findById(req.user?._id).select("+password");
      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid User", 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;

      await user.save();
      await redis.set(req.user?._id, JSON.stringify(user));
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Get user info by id
interface IUpdateProfile {
  avatar: string;
}

export const updateProfilePictureController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;

    if (!avatar || !userId) {
      return res.status(400).json({ message: "Missing avatar or user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatar?.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
    });

    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await user.save();
    await redis.set(userId, JSON.stringify(user));

    res.status(200).json({
      success: true,
      user,
      message: "Profile picture updated successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// Get all user ---> only for admin
export const getAllUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUser(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Update user role ---> only for admin
export const updateUserRoleController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;
      updateUserRole(res, id, role);
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Delete user role ---> only for admin
export const deleteUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      await user.deleteOne({ id });
      await redis.del(id);

      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

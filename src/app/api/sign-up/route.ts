import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
  await dbConnect()

  try {
    const { username, email, password } = await request.json()

    const existingUserVerifiedByUserName = await UserModel.findOne({
      username,
      isVerified: true,
    })

    if (existingUserVerifiedByUserName) {
      return Response.json({
        success: false,
        message: "Username is already exist"
      }, { status: 400 })
    }

    const existingUserByEmail = await UserModel.findOne({ email })

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email',
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {

      const hashedPassword = await bcrypt.hash(password, 10)
      const expireDate = new Date()
      expireDate.setHours(expireDate.getHours() + 1)

      // creating new user with provide detils 

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expireDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: []

      })

      //  save new user
      await newUser.save()
    }

    // send verificatiopn email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    )

    if (!emailResponse.success) {
      return Response.json({
        success: false,
        message: emailResponse.message
      }, { status: 500 })
    }

    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vyrelabspravesh@gmail.com",
    pass: "lvvq fmoh xpzd gzcl",
  },
});

export const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: "your_email@gmail.com",
    to,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}. It will expire in 3 minutes.`,
  });
};
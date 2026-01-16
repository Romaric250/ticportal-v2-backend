// Check your auth service register function
// Find this in: src/modules/auth/service.ts

static async register(input: RegisterInput) {
  // ...existing code for creating user...

  try {
    // Generate OTP
    const code = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    console.log(`🔐 Generated OTP for ${user.email}: ${code}`);

    // Save OTP
    const otpRecord = await db.oTP.create({
      data: {
        userId: user.id,
        code,
        type: "EMAIL_VERIFICATION",
        expiresAt,
      },
    });

    console.log(`💾 OTP saved to database:`, otpRecord);

    // Send verification email
    console.log(`📧 Attempting to send verification email to ${user.email}`);
    
    const emailResult = await sendVerificationEmail(
      user.email, 
      user.firstName, 
      code
    );
    
    console.log(`✅ Email send result:`, emailResult);

    // Track registration activity
    await activityService.trackAuthActivity(user.id, "REGISTER");

    return {
      message: "Registration successful! Please check your email for verification code.",
      email: user.email,
    };
  } catch (emailError: any) {
    console.error('❌❌❌ Email sending failed during registration:', emailError);
    console.error('Error stack:', emailError.stack);
    
    // Still return success but note the email issue
    return {
      message: "Registration successful! Please check your email for verification code.",
      email: user.email,
      emailSent: false, // Add this flag
    };
  }
}

// IMPORTANT: Make sure this error is not being caught by a parent try-catch!
// Check if the register function itself is wrapped in try-catch in the controller


"use client";

import { useState, useRef, useEffect, type KeyboardEvent, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type UserCredential,
} from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Key, LogIn, UserPlus, Phone, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: any;
  }
}

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const [strength, setStrength] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const [strengthValue, setStrengthValue] = useState(0);

  useEffect(() => {
    const newStrength = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    setStrength(newStrength);
    setStrengthValue(Object.values(newStrength).filter(Boolean).length * 20);
  }, [password]);
  
  if (!password) return null;

  const strengthColor = () => {
    if (strengthValue < 40) return "bg-destructive";
    if (strengthValue < 80) return "bg-yellow-500";
    return "bg-green-500";
  }

  const CriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center text-sm ${met ? 'text-green-500' : 'text-muted-foreground'}`}>
      {met ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="space-y-2 mt-2">
      <Progress value={strengthValue} className={`h-2 [&>div]:${strengthColor()}`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
        <CriteriaItem met={strength.length} text="At least 8 characters" />
        <CriteriaItem met={strength.lowercase} text="A lowercase letter" />
        <CriteriaItem met={strength.uppercase} text="An uppercase letter" />
        <CriteriaItem met={strength.number} text="A number" />
        <CriteriaItem met={strength.special} text="A special character" />
      </div>
    </div>
  );
};

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [authView, setAuthView] = useState<"login" | "register" | "forgot" | "phone">("login");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const auth = getAuth(app);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';
  const { toast } = useToast();
  const ADMIN_UID = "jy39QM0BtDROwlkLPZvFFV4H8mk2";

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authView === 'phone' && !window.recaptchaVerifier && recaptchaContainerRef.current) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, [authView, auth]);

  const handleRedirect = (userCredential: UserCredential) => {
    if (userCredential.user.uid === ADMIN_UID) {
      router.push("/admin");
    } else {
      router.push(redirectUrl);
    }
  }

  const handlePasswordAuth = async () => {
    setLoading(true);
    try {
      if (authView === "register") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        toast({
          title: "Registration Successful",
          description: "A verification email has been sent. Please check your inbox.",
        });
        setAuthView("login");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential.user.uid !== ADMIN_UID && !userCredential.user.emailVerified) {
           toast({
            title: "Email Not Verified",
            description: "Please verify your email before logging in.",
            variant: "destructive",
          });
          await getAuth(app).signOut();
          setLoading(false);
          return;
        }
        toast({ title: "Login Successful" });
        handleRedirect(userCredential);
      }
    } catch (error: any) {
      toast({
        title: authView === "register" ? "Registration Failed" : "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handlePasswordAuth();
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      toast({ title: "Google Sign-In Successful" });
      handleRedirect(result);
    } catch (error: any) {
      toast({
        title: "Google Sign-In Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Password Reset Email Sent", description: "Check your inbox for instructions." });
      setAuthView("login");
    } catch (error: any) {
      toast({ title: "Password Reset Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const verifier = window.recaptchaVerifier!;
      const confirmationResult = await signInWithPhoneNumber(auth, `+${phoneNumber}`, verifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "Please enter the OTP you received." });
    } catch (error: any)
    {
      toast({ title: "Failed to send OTP", description: error.message, variant: "destructive" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      toast({ title: "Phone Sign-In Successful" });
      handleRedirect(result);
    } catch (error: any) {
      toast({ title: "Invalid OTP", description: "Please check the code and try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  const renderForm = () => {
    switch (authView) {
      case "register":
      case "login":
        return (
          <>
            <CardHeader className="text-center">
              <Image src="/img/logo.png" alt="Logo" width={180} height={74} className="mx-auto mb-4 h-20 w-auto" />
              <CardTitle className="text-3xl font-bold font-headline">
                {authView === 'login' ? "Welcome Back" : "Create an Account"}
              </CardTitle>
              <CardDescription>
                {authView === 'login' ? "Access your RoboBox account." : "Join the robotics revolution."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email"><Mail className="inline-block mr-2" />Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} onKeyDown={handleKeyDown}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password"><Key className="inline-block mr-2" />Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} onKeyDown={handleKeyDown} />
                {authView === 'register' && <PasswordStrengthIndicator password={password} />}
              </div>
              {authView === 'login' && (
                <div className="text-right">
                  <Button variant="link" size="sm" onClick={() => setAuthView('forgot')}>Forgot Password?</Button>
                </div>
              )}
               <Button onClick={handlePasswordAuth} className="w-full" disabled={loading} size="lg">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {authView === 'login' ? <><LogIn className="mr-2" /> Sign In</> : <><UserPlus className="mr-2" /> Create Account</>}
              </Button>
               <div className="my-4 flex items-center">
                  <Separator className="flex-1" />
                  <span className="px-4 text-xs uppercase text-muted-foreground">
                    Or
                  </span>
                  <Separator className="flex-1" />
                </div>
              <div className="flex flex-col gap-2">
                 <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                   <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-79.9 67.9C291.2 110.4 221.2 102.3 167 121c-52.2 18.1-84 69.4-76.8 122.9 8.5 60.5 59.9 104.9 121.2 102.3 54.4-2.3 93.3-33.5 105.8-64.4H248V261.8h232.2z"></path></svg>
                  Sign in with Google
                </Button>
                 <Button variant="outline" className="w-full" onClick={() => setAuthView('phone')} disabled={loading}>
                   <Phone className="mr-2" />
                  Sign in with Phone
                </Button>
              </div>
            </CardContent>
          </>
        );
      case "forgot":
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>Enter your email to receive a password reset link.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button onClick={handlePasswordReset} disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
              </Button>
              <Button variant="link" onClick={() => setAuthView('login')}>Back to Login</Button>
            </CardFooter>
          </>
        );
       case "phone":
        return (
          <>
             <div ref={recaptchaContainerRef}></div>
            <CardHeader className="text-center">
              <CardTitle>Sign in with Phone</CardTitle>
              <CardDescription>{otpSent ? "Enter the OTP sent to your phone." : "Enter your phone number to receive an OTP."}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!otpSent ? (
                <div className="space-y-2">
                  <Label htmlFor="phone"><Phone className="inline-block mr-2" />Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="1234567890" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={loading} />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="otp"><MessageSquare className="inline-block mr-2" />OTP</Label>
                  <Input id="otp" type="text" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={loading} />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
               {!otpSent ? (
                <Button onClick={handleSendOtp} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send OTP"}
                </Button>
              ) : (
                <Button onClick={handleVerifyOtp} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify OTP"}
                </Button>
              )}
              <Button variant="link" onClick={() => setAuthView('login')}>Back to Login</Button>
            </CardFooter>
          </>
        );
    }
  };

  return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-20">
            <Image 
            src="/img/humanoid-robot.png" 
            alt="Humanoid Robot"
            fill
            style={{objectFit: "cover"}}
            className="animate-[pulse_10s_ease-in-out_infinite]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background"></div>
        </div>
        
        <Card className="w-full max-w-md shadow-2xl z-10 bg-card/80 backdrop-blur-sm">
            
            {renderForm()}
            
            { (authView === 'login' || authView === 'register') && (
                <CardFooter>
                    <div className="flex items-center w-full">
                        <p className="text-sm text-muted-foreground mx-auto">
                            {authView === 'login' ? "Don't have an account?" : "Already have an account?"}
                            <Button
                            variant="link"
                            className="pl-2"
                            onClick={() => setAuthView(authView === 'login' ? 'register' : 'login')}
                            >
                            {authView === 'login' ? "Register" : "Login"}
                            </Button>
                        </p>
                    </div>
                </CardFooter>
            )}
        </Card>
        </div>
  );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPageContent />
        </Suspense>
    );
}


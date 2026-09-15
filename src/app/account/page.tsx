
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Mail, Phone, MapPin, ShoppingBag, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function AccountPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Image src="/img/logofavicon.ico" alt="Loading..." width={64} height={64} className="animate-spin" />
            </div>
        );
    }
    
    const getInitials = (name: string | null | undefined) => {
        if (!name) return user?.email?.substring(0, 2).toUpperCase() || 'U';
        const names = name.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return name.substring(0, 2).toUpperCase();
    }


    return (
        <div className="flex flex-col min-h-dvh bg-secondary/30">
            <Header />
            <main className="flex-1 py-12 md:py-24">
                <div className="container mx-auto">
                    <Card className="max-w-4xl mx-auto shadow-lg">
                        <CardHeader className="text-center bg-card p-8 rounded-t-lg">
                            <Avatar className="mx-auto h-24 w-24 mb-4 border-4 border-primary">
                                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'}/>
                                <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-3xl font-bold font-headline">
                                {user.displayName || 'Welcome!'}
                            </CardTitle>
                            <CardDescription>
                                Manage your profile, orders, and settings here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                           <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg flex items-center gap-2"><User /> Personal Information</h3>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-muted-foreground"/>
                                        <span>{user.email}</span>
                                        {user.emailVerified ? <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded-full">Verified</span> : <span className="text-xs text-yellow-500 bg-yellow-100 px-2 py-1 rounded-full">Not Verified</span> }
                                    </div>
                                     <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-muted-foreground"/>
                                        <span>{user.phoneNumber || "No phone number provided"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-muted-foreground"/>
                                        <span>No shipping address on file.</span>
                                    </div>
                                    <Button variant="outline">Edit Profile</Button>
                                </div>
                                <Separator orientation="vertical" className="hidden md:block" />
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg flex items-center gap-2"><ShoppingBag /> Order History</h3>
                                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                                    <Button asChild variant="secondary">
                                        <a href="/shop">Start Shopping</a>
                                    </Button>
                                </div>
                           </div>
                           <Separator className="my-8" />
                           <div className="flex flex-col md:flex-row gap-4 justify-between">
                                <Button variant="outline" className="w-full md:w-auto"><Settings className="mr-2"/> Account Settings</Button>
                                <Button variant="destructive" onClick={logout} className="w-full md:w-auto">
                                    <LogOut className="mr-2"/> Logout
                                </Button>
                           </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}

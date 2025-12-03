"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { SiteHeader } from "@/src/components/site-header";
import { Chrome, ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useRouter } from "next/navigation";

export default function Auth() {
	const [isLogin, setIsLogin] = useState(true);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
	const redirectTo = searchParams.get('redirect') || '/marketplace';

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		setIsLoading(true);

		try {
			const formData = new FormData(e.currentTarget);
			console.log("Form submitted:", Object.fromEntries(formData));

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirect after successful submission
			router.push(redirectTo);
		} catch {
			setErrors({ submit: "An error occurred. Please try again." });
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = () => {
		// Store redirect URL in sessionStorage for OAuth callback
		if (redirectTo) {
			sessionStorage.setItem('oauth_redirect', redirectTo);
		}
		window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
	};

	return (
		<div className="min-h-screen bg-background">
			<SiteHeader />
			<div className="container mx-auto px-4 pt-32 pb-20">
				<div className="max-w-md mx-auto">
					<Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
						<ArrowLeft className="h-4 w-4" />
						Back to home
					</Link>
					<Card className="p-8 space-y-6">
						<div className="text-center space-y-2">
							<h1 className="text-2xl font-bold">
								{isLogin ? "Welcome back" : "Create your account"}
							</h1>
							<p className="text-sm text-muted-foreground">
								{isLogin ? "Sign in to continue" : "Join the campus marketplace"}
							</p>
						</div>

						{errors.submit && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{errors.submit}</AlertDescription>
							</Alert>
						)}

						<Button
							variant="outline"
							className="w-full h-11"
							size="lg"
							type="button"
							disabled={isLoading}
							onClick={handleGoogleSignIn}
						>
							<Chrome className="h-5 w-5 mr-2" />
							Continue with Google
						</Button>
						<div className="relative">
							<Separator />
							<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
								or continue with email
							</span>
						</div>
						<form className="space-y-4" onSubmit={handleSubmit}>
							{!isLogin && (
								<div className="space-y-2">
									<Label htmlFor="name">Full Name</Label>
									<Input
										id="name"
										name="name"
										placeholder="John Doe"
										disabled={isLoading}
										aria-invalid={!!errors.name}
									/>
									{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
								</div>
							)}
							<div className="space-y-2">
								<Label htmlFor="email">College Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="you@college.edu"
									disabled={isLoading}
									aria-invalid={!!errors.email}
									required
								/>
								{errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="••••••••"
									disabled={isLoading}
									aria-invalid={!!errors.password}
									required
								/>
								{errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
							</div>
							{!isLogin && (
								<div className="space-y-2">
									<Label htmlFor="confirm-password">Confirm Password</Label>
									<Input
										id="confirm-password"
										name="confirmPassword"
										type="password"
										placeholder="••••••••"
										disabled={isLoading}
										aria-invalid={!!errors.confirmPassword}
										required
									/>
									{errors.confirmPassword && (
										<p className="text-sm text-destructive">{errors.confirmPassword}</p>
									)}
								</div>
							)}
							{isLogin && (
								<div className="text-right">
									<button
										type="button"
										className="text-xs text-muted-foreground hover:text-foreground transition-colors"
									>
										Forgot password?
									</button>
								</div>
							)}
							<Button
								type="submit"
								className="w-full h-11"
								size="lg"
								disabled={isLoading}
							>
								{isLoading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
							</Button>
						</form>
						<div className="text-center text-sm">
							<span className="text-muted-foreground">
								{isLogin ? "Don&apos;t have an account? " : "Already have an account? "}
							</span>
							<button
								type="button"
								onClick={() => {
									setIsLogin(!isLogin);
									setErrors({});
								}}
								className="font-medium hover:underline transition-colors"
							>
								{isLogin ? "Sign up" : "Sign in"}
							</button>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}

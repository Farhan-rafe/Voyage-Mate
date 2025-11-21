import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            {/* White background wrapper for the auth card */}
            <div className="w-full bg-white py-6">
                <div className="mx-auto max-w-md">
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-200 via-sky-100 to-indigo-200 p-8 shadow-lg backdrop-blur-sm">

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-6">

                                        {/* EMAIL */}
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="email"
                                                className="text-sm font-semibold text-slate-900"
                                            >
                                                Email address
                                            </Label>

                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="border-slate-300 text-slate-900 placeholder-slate-200 bg-white/90 focus-visible:ring-sky-900"
                                            />

                                            <InputError
                                                message={errors.email}
                                                className="text-slate-800"
                                            />
                                        </div>

                                        {/* PASSWORD */}
                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label
                                                    htmlFor="password"
                                                    className="text-sm font-semibold text-slate-900"
                                                >
                                                    Password
                                                </Label>

                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="ml-auto text-sm text-slate-800 hover:text-slate-900"
                                                        tabIndex={5}
                                                    >
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>

                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Enter your password"
                                                className="border-slate-300 text-slate-900 placeholder-slate-600 bg-white/90 focus-visible:ring-sky-500"
                                            />

                                            <InputError
                                                message={errors.password}
                                                className="text-slate-800"
                                            />
                                        </div>

                                        {/* REMEMBER ME */}
                                        <div className="flex items-center space-x-3">
                                            <Checkbox id="remember" name="remember" tabIndex={3} />
                                            <Label
                                                htmlFor="remember"
                                                className="text-sm text-slate-900"
                                            >
                                                Remember me
                                            </Label>
                                        </div>

                                        {/* LOGIN BUTTON */}
                                        <Button
                                            type="submit"
                                            className="mt-3 w-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold shadow-sm hover:opacity-90"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && <Spinner />}
                                            <span className="ml-1">Log in</span>
                                        </Button>
                                    </div>

                                    {/* REGISTER LINK */}
                                    {canRegister && (
                                        <div className="pt-2 text-center text-sm text-slate-800">
                                            Don&apos;t have an account?{' '}
                                            <TextLink
                                                href={register()}
                                                tabIndex={5}
                                                className="text-sky-700 hover:text-sky-900 font-semibold"
                                            >
                                                Sign up
                                            </TextLink>
                                        </div>
                                    )}
                                </>
                            )}
                        </Form>

                        {/* STATUS MESSAGE */}
                        {status && (
                            <div className="mt-4 text-center text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}

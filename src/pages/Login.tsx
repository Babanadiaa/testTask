import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Невірний email')
        .required('Email обов’язковий'),
    password: Yup.string()
        .min(6, 'Мінімум 6 символів')
        .required('Пароль обов’язковий')
})

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuthStore((s) => s)

    return (
        <section className="h-screen flex items-center justify-center bg-gray-100 text-black">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, { setSubmitting, setErrors }) => {
                        try {
                            await login(values.email, values.password)
                            navigate('/todo')
                        } catch (err: any) {
                            setErrors({ email: 'Невірний email або пароль' })
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4 flex flex-col">
                            <label className="block text-sm font-medium mb-1" htmlFor="email">
                                Email
                            </label>
                            <Field
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full border border-gray-300 p-2 rounded-xl"
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />

                            <label className="block text-sm font-medium mb-1" htmlFor="password">
                                Password
                            </label>
                            <Field
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                className="w-full border border-gray-300 p-2 rounded-xl"
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-black hover:bg-black/70 text-white font-bold py-2 px-4 rounded-xl"
                            >
                                {isSubmitting ? 'Вхід...' : 'Login'}
                            </button>

                            <p className="text-center text-black/50 font-bold hover:text-black">
                                <Link to="/register">Don't have an account? Register</Link>
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Leaf, Mail, Loader2, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@agri-scan/shared'
import { motion } from 'framer-motion'

export default function ForgotPasswordForm() {
  const [isSent, setIsSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Forgot password email:', data.email)
    setIsSent(true)
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
            <Leaf size={28} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Quên mật khẩu?</h2>
          <p className="mt-2 text-gray-600">
            {!isSent 
              ? "Nhập email của bạn để nhận liên kết đặt lại mật khẩu" 
              : "Đã gửi liên kết đặt lại mật khẩu"}
          </p>
        </div>

        {!isSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2" size={20} />
                  Đang gửi...
                </>
              ) : (
                <>
                  Gửi liên kết
                  <ArrowRight className="ml-2" size={20} />
                </>
              )}
            </button>

            <div className="text-center">
              <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 text-center space-y-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-xl flex flex-col items-center gap-2">
              <CheckCircle2 size={48} className="text-green-500" />
              <p className="font-medium">Kiểm tra email của bạn</p>
              <p className="text-sm text-green-600">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email bạn vừa nhập.
              </p>
            </div>
            
            <Link 
              href="/login"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
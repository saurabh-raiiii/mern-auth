import React, {useContext, useRef, useState} from 'react'
import {assets} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {AppContext} from "../context/AppContext.jsx";
import axios from "axios";

const ResetPassword = () => {

    const {backendUrl} = useContext(AppContext);
    axios.defaults.withCredentials = true;

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

    const inputRefs = useRef([])


    const handleInput = (e, index) => {
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
            inputRefs.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if(e.key === 'Backspace' && e.target.value === '' && index > 0){
            inputRefs.current[index - 1].focus();
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if(inputRefs.current[index]){
                inputRefs.current[index].value = char;
            }
        })
    }

    const onSubmitEmail = async (e) => {
        e.preventDefault();

        try {
            const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email});
            if(data.success){
                toast.success(data.message);
                setIsEmailSent(true);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const onSubmitOtp = async (e) => {
        e.preventDefault();
        const enteredOtp = inputRefs.current.map((e) => e.value).join('');
        setOtp(enteredOtp);
        setIsOtpSubmitted(true);
    }

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        if(password === reEnterPassword){
            try{
                const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword: password})
                if(data.success){
                    toast.success(data.message);
                    navigate('/')
                }
                else {

                    setIsOtpSubmitted(false);
                    setPassword('')
                    setReEnterPassword('')
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        else{
            toast.error("Password is not same");
        }
    }


    return (
        <div className='flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-100 to-purple-300 '>
            <img
                onClick={() => navigate('/')}
                src={assets.logo}
                alt='Logo'
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
            />
            {!isEmailSent &&
            <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
                <p className='text-center mb-6 text-indigo-300'>Enter the registered email id.</p>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
                    <img src={assets.mail_icon} alt='' />
                    <input
                        onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                        value={email}
                        className='bg-transparent outline-none text-white'
                        type='email'
                        placeholder='Email id'
                        required
                    />
                </div>
                <button
                    className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'
                >
                    Verify Email
                </button>
            </form>
            }
            {!isOtpSubmitted && isEmailSent &&
            <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
                <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
                <div className='flex justify-between mb-8' onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input
                            className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-full'
                            type='text'
                            maxLength='1'
                            key={index}
                            ref={(e) => inputRefs.current[index] = e}
                            onInput={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            required
                        />
                    ))}
                </div>
                <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
                    Verify email
                </button>
            </form>
            }
            {isOtpSubmitted && isEmailSent &&
            <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
                <p className='text-center mb-6 text-indigo-300'>Please enter your new password.</p>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
                    <img src={assets.lock_icon} alt='' />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='bg-transparent outline-none text-white'
                        type='password'
                        placeholder='New password'
                        required
                    />
                </div>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
                    <img src={assets.lock_icon} alt='' />
                    <input
                        onChange={(e) => setReEnterPassword(e.target.value)}
                        value={reEnterPassword}
                        className='bg-transparent outline-none text-white'
                        type='password'
                        placeholder='Re-enter new password'
                        required
                    />
                </div>
                <button
                    className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'
                >
                    Save New Password
                </button>
            </form>
            }
        </div>
    )
}
export default ResetPassword

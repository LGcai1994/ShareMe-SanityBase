import React from 'react'
import { useNavigate } from 'react-router-dom'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { GoogleLogin} from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode';
import { client } from '../client'

const Login = () => {
    const navigate = useNavigate()
    const createOrGetUser = async (response) => {
        const userinfo = jwtDecode(response.credential)
        localStorage.setItem('user', JSON.stringify(userinfo));
        const { name, sub, picture } = userinfo
        const user = { name, sub, picture }
        const doc = {
            _id: sub,
            _type: 'user',
            userName: name,
            image: picture
        }
        client.createIfNotExists(doc)
            .then(() => {
                navigate('/', { replace: true })
            })
    }

    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className='relative w-full h-full'>
                {/* bg video */}
                <video
                    src={shareVideo}
                    type='video/mp4'
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className='w-full h-full object-cover'
                />
                {/* content */}
                <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0'>
                    <div className='p-5'>
                        <img src={logo} width='130px' alt='logo' />
                    </div>
                    <div className='shadow-2xl flex justify-center p-3 rounded-lg cursor-pointer outline-none'>
                        <GoogleLogin
                            onSuccess={(response) => createOrGetUser(response)}
                            onError={() => console.log('Error')}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
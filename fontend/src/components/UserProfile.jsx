import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'
import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

const UserProfile = () => {

    const [user, setUser] = useState()
    const [pins, setPins] = useState()
    const [text, setText] = useState('Created')
    const [activeBtn, setActiveBtn] = useState('created')
    const navigate = useNavigate()
    const { userId } = useParams()

    const User = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear()

    const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none'
    const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none'

    useEffect(() => {
        const query = userQuery(userId)
        client
            .fetch(query)
            .then((data) => {
                setUser(data[0])
            })
    }, [userId])

    useEffect(() => {
        if (text === 'Created') {
            const createdPinsQuery = userCreatedPinsQuery(userId)
            client
                .fetch(createdPinsQuery)
                .then((data) => {
                    setPins(data)
                })
        } else {
            const savedPinsQuery = userSavedPinsQuery(userId)
            client
                .fetch(savedPinsQuery)
                .then((data) => {
                    setPins(data)
                })
        }
    }, [text, userId])

    const logout = () => {
        googleLogout()
        localStorage.clear()
        navigate('/login')
    }

    if (!user) {
        return <Spinner message='Loading profile'></Spinner>
    }

    return (
        <div className="relative pb-2 h-full justify-center items-center">
            <div className="flex flex-col pb-5">
                <div className="relative flex flex-col mb-7">

                    {/* showing user info */}
                    <div className="flex flex-col justify-center items-center">
                        {/* random background image */}
                        <img
                            className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
                            src="https://source.unsplash.com/1600x900/?nature,photography,technology"
                            alt="user-pic"
                        />
                        {/* user avatar */}
                        <img
                            className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
                            src={user.image}
                            alt="user-pic"
                        />
                        {/* user name */}
                        <h1 className="font-bold text-3xl text-center mt-3">
                            {user.userName}
                        </h1>
                        {/* logout button */}
                        <div className="absolute top-0 z-1 right-0 p-2">
                            {userId === User.sub && (
                                <button
                                    type='button'
                                    onClick={() => {
                                        logout()
                                    }}
                                    className=' border-2 p-2 rounded-full cursor-pointer outline-none shadow-md'>
                                    <AiOutlineLogout color='red' fontSize={21} />
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* showing pins */}
                    <div className="text-center mb-7">
                        {/* switch 'created' and 'saved' */}
                        <button
                            type="button"
                            onClick={(e) => {
                                setText(e.target.textContent)
                                setActiveBtn('created')
                            }}
                            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}>
                            Created
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                setText(e.target.textContent)
                                setActiveBtn('saved')
                            }}
                            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}>
                            Saved
                        </button>
                    </div>
                    {pins?.length ? (
                        <div className="px-2">
                            <MasonryLayout pins={pins} />
                        </div>
                    ) : (
                        <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
                            No Pins Found!
                        </div>
                    )
                    }
                </div>
            </div>
        </div>
    )
}
export default UserProfile
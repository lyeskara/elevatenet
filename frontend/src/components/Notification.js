import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';

function Notification() {
    const [Notifications, SetNotifications] = useState([]);
    const [unNotified, setUnNotified] = useState(false)
    const auth_id = auth.currentUser.uid;
    useEffect(() => {
        getDoc(doc(collection(db, 'Notifications'), auth_id)).then((promise) => {
            if (promise.data() === undefined) {
                setUnNotified(true);
            } else {
                const data = promise.data().notifications
                SetNotifications(data)
            }
        })
    }, [])
    console.log(Notifications)
    return (
        <>
            {Notifications ?
                (Notifications.slice(-5).map((Notification) => {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={Notification.profilePicUrl} alt="profilephoto-icon" className="create-post-profile-photo" />
                            <h1 style={{ marginRight: '10px' }}>{Notification.message}</h1>
                        </div>
                    );
                })) : (<h1>No notification recieved</h1>)
            }
        </>
    )
}

export default Notification

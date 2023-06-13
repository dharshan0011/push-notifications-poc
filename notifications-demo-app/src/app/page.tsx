'use client'
import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'

function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function Home() {
  const [isSubscribeDisabled, setIsSubscribeDisabled] = useState(false)
  const [isNotifyMeDisabled, setIsNotifyMeDisabled] = useState(false)
  const [isUnSubscribeDisabled, setIsUnSubscribeDisabled] = useState(false)
  const handleSubscribe = async () => {
    console.log('clicked')
    // Prevent the user from clicking the subscribe button multiple times.
    setIsSubscribeDisabled(true)
    const result = await Notification.requestPermission()
    if (result === 'denied') {
      console.error('The user explicitly denied the permission request.')
      return
    }
    if (result === 'granted') {
      console.info('The user accepted the permission request.')
    }
    const registration = await navigator.serviceWorker.getRegistration()
    if (!registration) {
      console.log("Couldn't find registrations")
      return
    }
    console.log(
      'process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    )
    const subscribed = await registration.pushManager.getSubscription()
    if (subscribed) {
      console.info('User is already subscribed:>> ', subscribed)
      setIsNotifyMeDisabled(false)
      setIsUnSubscribeDisabled(false)
      return
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
      ),
    })
    setIsNotifyMeDisabled(false)
    const keys = subscription.toJSON().keys
    try {
      axios.post('http://localhost:3001/subscriptions', {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: {
          create: keys,
        },
      })
    } catch (err) {
      console.log('err:>>>>', err)
    }
  }
  const handleUnSubscribe = async () => {
    const registration = await navigator.serviceWorker.getRegistration()
    if (!registration) {
      console.log("Couldn't find registration details")
      return
    }
    const subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      console.log('Already unsubscribed')
      return
    }
    try {
      axios.delete('http://localhost:3001/subscriptions', {
        data: {
          endpoint: subscription?.endpoint,
        },
      })

      const unsubscribed = await subscription.unsubscribe()
      if (unsubscribed) {
        console.info('Successfully unsubscribed from push notifications.')
        setIsUnSubscribeDisabled(true)
        setIsSubscribeDisabled(false)
        setIsNotifyMeDisabled(true)
      }
    } catch (err) {
      console.log('err:>>>>', err)
    }
  }

  const handleNotify = async () => {
    const registration = await navigator.serviceWorker.getRegistration()
    if (!registration) {
      console.error('No registrations found')
      return
    }
    const subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      console.error('No subscriptions found')
      return
    }

    axios.post('http://localhost:3001/notify-me', {
      endpoint: subscription.endpoint,
    })
  }
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((serviceWorkerRegistration) => {
          console.info('Service worker was registered.')
          console.info({ serviceWorkerRegistration })
        })
        .catch((error) => {
          console.error(
            'An error occurred while registering the service worker.'
          )
          console.error(error)
        })
    } else {
      console.error(
        'Browser does not support service workers or push messages.'
      )
    }
  }, [])

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <Image
          className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
          src='/next.svg'
          alt='Next.js Logo'
          width={180}
          height={37}
          priority
        />
      </div>

      <div className='flex gap-10'>
        <button
          className={`text-black bg-white p-2 rounded ${
            isSubscribeDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={(e) => {
            handleSubscribe()
          }}
          disabled={isSubscribeDisabled}
        >
          Subscribe
        </button>
        <button
          className='text-black bg-white p-2 rounded cursor-pointer'
          onClick={(e) => handleNotify()}
          disabled={isNotifyMeDisabled}
        >
          Notify me
        </button>
        <button
          className='text-black bg-white p-2 rounded cursor-pointer'
          onClick={(e) => handleUnSubscribe()}
          disabled={isUnSubscribeDisabled}
        >
          Unsubscribe
        </button>
      </div>
    </main>
  )
}

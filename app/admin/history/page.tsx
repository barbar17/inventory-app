'use client'
import { useAuth } from '@/app/components/AuthProvider'
import { useEffect } from 'react'
import { motion } from 'motion/react'

function LogHistory() {
  const { setLoading, isChecking } = useAuth()

  useEffect(() => {
    setLoading(false)
  }, [isChecking])
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      page
    </motion.div>
  )
}

export default LogHistory
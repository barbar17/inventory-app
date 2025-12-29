'use client'
import { useAuth } from '@/app/components/AuthProvider'
import Layout from '@/app/components/Layout'
import { useState, useEffect } from 'react'

function LogHistory() {
  const {setLoading, isChecking} = useAuth()

  useEffect(() => {
    setLoading(false)
  }, [isChecking])
  return (
    <Layout>
      <div>page</div>
    </Layout>
  )
}

export default LogHistory
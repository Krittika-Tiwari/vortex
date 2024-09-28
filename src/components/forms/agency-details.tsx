"use client"
import { Agency } from '@prisma/client'
import React from 'react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'

type Props = {
    data?:Partial<Agency>
}

const AgencyDetails = ({data}: Props) => {
    const {toast} = useToast()
    const router = useRouter()
    // const [deletingAgen]
  return (
    <div>AgencyDetails</div>
  )
}

export default AgencyDetails
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { generateContract } from '@/utils/api'

export default function ContractPage({ params }: { params: { id: string } }) {
  const [contract, setContract] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadContract()
  }, [params.id])

  const loadContract = async () => {
    try {
      const generatedContract = await generateContract(params.id)
      setContract(generatedContract.content)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleApprove = () => {
    // Here you would typically send the approved contract to your backend
    console.log('Contract approved:', contract)
    toast({
      title: "Contract Approved",
      description: "The contract has been approved and saved.",
    })
    router.push('/dashboard')
  }

  // ... (rest of the component remains the same)
}


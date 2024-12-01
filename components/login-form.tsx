'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import Cookies from 'js-cookie'
import axios from 'axios'

interface LoginResponse {
  token: string
  // Add other expected response properties here
}

interface JWTClaims {
  user_id: string
  role: string
  team: string
  user_first_name: string
  exp?: number
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const decodeJWT = (token: string): JWTClaims => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error decoding JWT:', error)
      throw new Error('Invalid token format')
    }
  }

  const setCookies = (token: string, claims: JWTClaims) => {
    const cookieOptions = {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const
    }

    Cookies.set('authToken', token, cookieOptions)
    Cookies.set('userID', claims.user_id, cookieOptions)
    Cookies.set('role', claims.role, cookieOptions)
    Cookies.set('team', claims.team, cookieOptions)
    Cookies.set('user_first_name', claims.user_first_name, cookieOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!username || !password) {
      setError('Por favor ingresa tu usuario y contraseña')
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post<LoginResponse>(
        'http://localhost:8080/login/native',
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      )

      const claims = decodeJWT(response.data.token)

      // Verify token expiration
      if (claims.exp && claims.exp * 1000 < Date.now()) {
        throw new Error('Token expired')
      }

      setCookies(response.data.token, claims)

      toast({
        title: '¡Bienvenido!',
        description: `Hola ${claims.user_first_name}, has iniciado sesión correctamente.`,
      })

      router.push('/dashboard')
    } catch (error) {
      // console.error('Login error:', error)
      console.log(error)
      let errorMessage = 'Error al iniciar sesión'

      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              errorMessage = 'Usuario o contraseña incorrectos'
              break
            case 429:
              errorMessage = 'Demasiados intentos. Por favor, espera unos minutos'
              break
            case 500:
              errorMessage = 'Error del servidor. Por favor, intenta más tarde'
              break
            default:
              errorMessage = error.response.data?.message || errorMessage
          }
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'Tiempo de espera agotado. Por favor, verifica tu conexión'
        } else if (!error.response) {
          errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet'
        }
      }

      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 shadow-md rounded-lg w-full max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="username">Usuario</Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa tu usuario"
          disabled={isLoading}
          className="w-full"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          disabled={isLoading}
          className="w-full"
          required
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Iniciando sesión...
          </div>
        ) : (
          'Iniciar sesión'
        )}
      </Button>
    </form>
  )
}
interface RocketProps {
  size: 'small' | 'medium' | 'large'
  logo?: string
}

export function Rocket({ size, logo }: RocketProps) {
  const dimensions = {
    small: { width: 100, height: 150 },
    medium: { width: 150, height: 225 },
    large: { width: 200, height: 300 },
  }

  const { width, height } = dimensions[size]

  return (
    <div className="relative" style={{ width, height }}>
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width, height }}>
        <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53Z" />
      </svg>
      {logo && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
          style={{ width: width / 3, height: width / 3 }}
        >
          <img src={logo} alt="Project logo" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}


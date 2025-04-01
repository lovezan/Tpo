// Default profile images
const DEFAULT_PROFILE_IMAGES = [
    "/images/profiles/profile-1.png",
    "/images/profiles/profile-2.png",
    "/images/profiles/profile-3.png",
    "/images/profiles/profile-4.png",
    "/images/profiles/profile-5.png",
  ]
  
  // Default company logos - mapping common company names to their logos
  const COMPANY_LOGOS: Record<string, string> = {
    Google: "/images/companies/google.png",
    Microsoft: "/images/companies/microsoft.png",
    Amazon: "/images/companies/amazon.png",
    Apple: "/images/companies/apple.png",
    Facebook: "/images/companies/facebook.png",
    Meta: "/images/companies/meta.png",
    Netflix: "/images/companies/netflix.png",
    Adobe: "/images/companies/adobe.png",
    IBM: "/images/companies/ibm.png",
    Intel: "/images/companies/intel.png",
    Oracle: "/images/companies/oracle.png",
    Samsung: "/images/companies/samsung.png",
    Twitter: "/images/companies/twitter.png",
    Uber: "/images/companies/uber.png",
    LinkedIn: "/images/companies/linkedin.png",
    Airbnb: "/images/companies/airbnb.png",
    Spotify: "/images/companies/spotify.png",
    Tesla: "/images/companies/tesla.png",
    Nvidia: "/images/companies/nvidia.png",
    PayPal: "/images/companies/paypal.png",
    TCS: "/images/companies/tcs.png",
    Infosys: "/images/companies/infosys.png",
    Wipro: "/images/companies/wipro.png",
    HCL: "/images/companies/hcl.png",
    "Tech Mahindra": "/images/companies/tech-mahindra.png",
    Cognizant: "/images/companies/cognizant.png",
    Accenture: "/images/companies/accenture.png",
    Capgemini: "/images/companies/capgemini.png",
    Deloitte: "/images/companies/deloitte.png",
  }
  
  // Get a random profile image from the default set
  export function getRandomProfileImage(): string {
    const randomIndex = Math.floor(Math.random() * DEFAULT_PROFILE_IMAGES.length)
    return DEFAULT_PROFILE_IMAGES[randomIndex]
  }
  
  // Get a company logo based on company name
  export function getCompanyLogo(companyName: string): string {
    if (!companyName) return "/images/companies/default.png"
  
    // Normalize company name
    const normalizedName = companyName.toLowerCase().trim()
  
    // Check for exact match (case insensitive)
    for (const [key, logo] of Object.entries(COMPANY_LOGOS)) {
      if (key.toLowerCase() === normalizedName) {
        return logo
      }
    }
  
    // Check for partial match
    for (const [key, logo] of Object.entries(COMPANY_LOGOS)) {
      if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
        return logo
      }
    }
  
    // For unknown companies, return a default logo with the first letter
    return `/images/companies/default.png`
  }
  
  // Generate a consistent color based on company name
  export function getCompanyColor(companyName: string): string {
    if (!companyName) return "#f3f4f6" // Default light gray
  
    // Simple hash function to generate a consistent number from a string
    const hash = Array.from(companyName).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
    // Generate a pastel color using HSL
    // Use the hash to determine the hue (0-360)
    const hue = hash % 360
    // Fixed saturation and lightness for pastel colors
    const saturation = 70
    const lightness = 85
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }
  
  
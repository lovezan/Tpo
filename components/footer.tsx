import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-transparent backdrop-blur-md nith-theme:bg-secondary/60 nith-theme:text-white">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left nith-theme:text-white/80">
            &copy; {new Date().getFullYear()} NIT Hamirpur Placement and Training Cell. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground nith-theme:text-white/80 nith-theme:hover:text-gold"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground nith-theme:text-white/80 nith-theme:hover:text-gold"
          >
            Contact
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground nith-theme:text-white/80 nith-theme:hover:text-gold"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}


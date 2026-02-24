import Link from 'next/link'

const Logo = ({...props}) => {
    return (
        <Link href="/" {...props} className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-black font-mono text-sm font-bold text-primary-foreground">
                {"</>"}
            </div>
            <span className="font-mono text-lg font-bold text-foreground hidden sm:block">
                Algo<span className="text-green-500">Craft</span>
            </span>
        </Link>
    )
}

export default Logo

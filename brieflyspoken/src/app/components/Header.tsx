import Link from "next/link"

const Header = () => {
    return (
        <header>header placeholder

            <nav>
                <Link href="/">Home</Link>
                <Link href="/history">History</Link>
            </nav>
        </header>
    )
}

export default Header
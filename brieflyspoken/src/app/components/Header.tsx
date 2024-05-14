import Link from "next/link"
import './Header.css'

const Header = () => {
    return (
        <header>
            <h1>BrieflySpoken - Examples</h1>
            <nav>
                <Link href="/">Home</Link>
            </nav>
        </header>
    )
}

export default Header
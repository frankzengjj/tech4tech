import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import NProgress from 'nprogress'

Router.onRouteChangeStart = url => NProgress.start()
Router.onRouteChangeComplete = url => NProgress.done()
Router.onRouteChangeError = url => NProgress.done()

const Layout = ({ children }) => {
    const head = () => (
        <React.Fragment>
            <link 
                rel = "stylesheet"
                href = "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                integrity = "sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                crossOrigin = "anonymous"
            />
            <link 
                rel = "stylesheet"
                href = "https://unpkg.com/nprogress@0.2.0/nprogress.css"
            />
            <link
                rel = "stylesheet"
                href = "/static/css/styles.css"
            />
        </React.Fragment>
    )

    const nav = () => (
        // <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
        //     <ul className="navbar-nav mr-auto">
        //         <li className="nav-item active">
        //             <a className="nav-link" href="#">Left</a>
        //         </li>
        //         <li className="nav-item">
        //             <a className="nav-link" href="//codeply.com">Codeply</a>
        //         </li>
        //         <li className="nav-item">
        //             <a className="nav-link" href="#">Link</a>
        //         </li>
        //         <li className="nav-item">
        //             <a className="nav-link" href="#">Link</a>
        //         </li>
        //         <li className="nav-item">
        //             <a className="nav-link" href="#">Link</a>
        //         </li>
        //     </ul>
        // </div>
        <nav className="navbar navbar-expand-md navbar-dark bg-secondary">
            <div className="mx-auto order-0">
                <Link href="/">
                    <a className="navbar-brand mx-auto">Tech4Tech</a>
                </Link>
            </div>
            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link">Login</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/register">
                            <a className="nav-link">Register</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )

    return (
        <React.Fragment>
            {head()} 
            {nav()} 
            <div className="container pt-5 pb-5">{children}</div>
        </React.Fragment>
    )
}

export default Layout

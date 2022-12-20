import React from 'react'

const AppFooter = () => {
  return (
    <footer>
      <div className="container">
        <a href="/" className="logo-font">conduit</a>
        <span className="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  )
}

export default React.memo(AppFooter)